window.addEventListener('load', loadUi);

function loadUi() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Quotation");
    refreshTable();
    refreshQForm();

}

// fonction for refresh table ( fill data into table)
const refreshTable = () => {

    quotations = new Array();
    quotations = getServiceRequest("/quotation/findall");

    let displayPropList = ['number', 'quatation_request_id.supplier_id.company_name', 'quatation_request_id.request_number', 'recieve_date', 'valid_period', 'quatation_status_id.name'];
    let disPPDTypeList = ['text', 'object', 'object', 'text', 'text', 'object'];

    fillDataIntoTable(tableQuotation, quotations, displayPropList, disPPDTypeList, formReFill, rowDelete, rowView, true, lggeduserprivilage);


    for (let index in quotations) {
        if (quotations[index].quatation_status_id.name == "Removed") {
            tableQuotation.children[1].children[index].style.backgroundColor = "#ad9393";

            tableQuotation.children[1].children[index].children[7].children[1].disabled = true;
            tableQuotation.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableQuotation.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    $('#tableQuotation').dataTable();

}

function getMaterilasName(ob) {
    // console.log(ob);
    let quotationHasMaterilaList = getServiceRequest("/material/listbyporder/" + ob.id);
    let orderMaterialName = "";
    for (let index in quotationHasMaterilaList) {
        if (quotationHasMaterilaList.length - 1 == index)
            orderMaterialName = orderMaterialName + quotationHasMaterilaList[index].name;
        else orderMaterialName = orderMaterialName + quotationHasMaterilaList[index].name + ", ";
    }
    return orderMaterialName;
}


// functon for refresh form
const refreshQForm = () => {

    //create new object with it's old object(duplicatie object)
    quotation = new Object();
    oldQuotation = null;

    quotation.quotationHasMaterialList = new Array();

    //create arrys for get data for fill select ellement
    suppliers = getServiceRequest("/supplier/list");
    quotationrequests = getServiceRequest("/quotationrequest/list");
    quotationstatuses = getServiceRequest("/quotationstatus/list");
    cmbSupplier.disabled = false;
    fillSelectFeild(cmbSupplier, "Select Supplier", suppliers, "company_name");
    fillSelectFeild(cmbQRequest, "Select Quotation Request", quotationrequests, "request_number");
    cmbQRequest.disabled = true;
    fillSelectFeild(cmbQStatus, "Select Status", quotationstatuses, "name", "Valid", true);
    quotation.quatation_status_id = JSON.parse(cmbQStatus.value);


    txtNote.value = "";
    dteReceivedDate.value = "";
    dteValidDate.value = "";

    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() - 4);
    dteReceivedDate.min = getCurrentDate2("date", currentDateForMin);

    let currentDateForMax = new Date();
    dteReceivedDate.max = getCurrentDate2("date", currentDateForMax);

    let currentDateForVDMin = new Date();
    dteValidDate.min = getCurrentDate2("date", currentDateForVDMin);

    let currentDateForVDMax = new Date();
    currentDateForVDMax.setDate(currentDateForVDMax.getDate() + 365);
    dteValidDate.max = getCurrentDate2("date", currentDateForVDMax);

    setStyle("1px solid #ced4da");
    cmbQStatus.style.borderBottom = "2px solid green";

    disabledButton(true, false);

    refreshInnerFormTable();
}

function setStyle(style) {
    cmbSupplier.style.borderBottom = style;
    cmbQRequest.style.borderBottom = style;
    cmbQStatus.style.borderBottom = style;
    txtNote.style.borderBottom = style;
    dteReceivedDate.style.borderBottom = style;
    dteValidDate.style.borderBottom = style;


}

function getRQ() {
    quotationRequestsBySup = getServiceRequest("/quotationrequest/listbysid/" + JSON.parse(cmbSupplier.value).id);
    fillSelectFeild(cmbQRequest, "Select Quotation Request", quotationRequestsBySup, "request_number");
    cmbQRequest.disabled = false;
}

function getMaterialByQR() {

    materialsByQR = getServiceRequest("/material/listbysupplier/" + JSON.parse(cmbSupplier.value).id);
    cmbMaterial.disabled = false;
    fillSelectFeild2(cmbMaterial, "Select Material", materialsByQR, "code", "name", "");

}
function getValidPurchasePrice() {

        let regpattern = new RegExp("^(([0-9]{1,9}[.]{1}[0-9]{2})|([0-9]{1,9}))$");

        if (regpattern.test(txtUnitPrice.value)) {
            if(oldQuotationHasIMatrial == null)
                buttonInnerAdd.disabled = false; else   buttonInnerUpdate.disabled = false;
        } else {
            buttonInnerAdd.disabled = true;    buttonInnerUpdate.disabled = true;
        }

}

const refreshInnerFormTable = () => {
    /* inner Form */
    quotationHasIMatrial = new Object();
    oldQuotationHasIMatrial = null;

    buttonInnerAdd.disabled = true;
    buttonInnerUpdate.disabled = true;

    materials = getServiceRequest("/material/list");
    if (cmbQRequest.value != "") {
        materialsByQR = getServiceRequest("/material/listbysupplier/" + JSON.parse(cmbSupplier.value).id);
        fillSelectFeild2(cmbMaterial, "Select Material", materialsByQR, "code", "name", "");
        cmbMaterial.disabled = false;
    } else {
        fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", "");
        cmbMaterial.disabled = true;
    }

    txtUnitPrice.value = "";

    cmbMaterial.style.borderBottom = "2px solid  #ced4da";
    txtUnitPrice.style.borderBottom = "2px solid  #ced4da";
    /* Inner Table */

    let displayPropList = ['material_id.name', 'purchase_price'];
    let disPPDTypeList = ['object', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableQMaterial, quotation.quotationHasMaterialList, displayPropList, disPPDTypeList, innreFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);


    for (let index in quotation.quotationHasMaterialList) {
        tableQMaterial.children[1].children[index].children[3].children[2].style.display = "none";
    }
}

const buttonInnerAddMC = () => {

    let materialext = false;

    for (let index in quotation.quotationHasMaterialList) {
        if (quotation.quotationHasMaterialList[index].material_id.id == quotationHasIMatrial.material_id.id) {
            materialext = true;
            break;
        }
    }


    if (!materialext) {
        let confirmMs = "Are you sure to add following Porder Material Details \n"
            + "\n Item Name : " + quotationHasIMatrial.material_id.name
            + "\n Unit Price : " + quotationHasIMatrial.purchase_price;
        let userResponce = window.confirm(confirmMs);

        if (userResponce) {
            quotation.quotationHasMaterialList.push(quotationHasIMatrial);
            alert("Save Succecfully...!");
            refreshInnerFormTable();

        }
    } else {
        alert("Material Allready ext...!")
    }


}

const innreFormReFill = (innerob, rowind) => {
    innerRowNo = rowind;
    quotationHasIMatrial = JSON.parse(JSON.stringify(innerob));
    oldQuotationHasIMatrial = JSON.parse(JSON.stringify(innerob));

    materials = getServiceRequest("/material/list");
    fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", quotationHasIMatrial.material_id.code);
    cmbMaterial.disabled = true;

    txtUnitPrice.value = quotationHasIMatrial.purchase_price;


    cmbMaterial.style.borderBottom = "2px solid  green";
    txtUnitPrice.style.borderBottom = "2px solid  green";

    buttonInnerUpdate.disabled = true;
    buttonInnerAdd.disabled = true;
}

function buttonInnerUpdateMC() {
    if (quotationHasIMatrial.purchase_price != oldQuotationHasIMatrial.purchase_price) {
        let updateInnerMsg = "Are you sure to update following Quotation Material..?" +
            "\n Material : " + quotationHasIMatrial.material_id.name +
            "\n Purchase Price : " + quotationHasIMatrial.purchase_price;

        let innerUpdateUserResponce = window.confirm(updateInnerMsg);

        if (innerUpdateUserResponce) {

            quotation.quotationHasMaterialList[innerRowNo] = quotationHasIMatrial;
            alert("Update Successfully...!");
            refreshInnerFormTable();

        }
    } else
        alert("Nothing Updated..!");
}

const innerRowDelete = (innerob, rowind) => {
    let deleteInnerMsg = "Are you sure to delete following Quotation Material..?" +
        "\n Material : " + innerob.material_id.name;

    let innserdeleteUserResponce = window.confirm(deleteInnerMsg);

    if (innserdeleteUserResponce) {

        quotation.quotationHasMaterialList.splice(rowind, 1)
        alert("Removed Successfully...!");
        refreshInnerFormTable();

    }
}

const innerRowView = () => {
}


// function for check form erros
const checkErrors = () => {
    let errors = "";

    if (cmbSupplier.value  == "") {
        errors = errors + "Supplier Not Selected \n";
    }
    if (quotation.quatation_request_id == null) {
        errors = errors + "Quotation Request Not Selected \n";
    }

    if (quotation.recieve_date == null) {
        errors = errors + "Recieve Date Not Selected \n";
    }

    if (quotation.valid_period == null) {
        errors = errors + "Valid Period Not Selected \n";
    }
    if (quotation.quotationHasMaterialList.length == 0) {
        errors = errors + "Material Not selected \n";
    }
    return errors;
}

//
function buttonSubmitMC() {

    // need to check form errors n required field
    let errors = checkErrors();

    if (errors == "") {
        // need to get user confirmation
        let confirmMs = "Are you sure to add following purchase order details \n"
            + "\n Supplier : " + quotation.supplier_id.company_name
            + "\n Quotation : " + quotation.quatation_request_id.request_number
            + "\n Received Date : " + quotation.recieve_date
            + "\n Valid Period: " + quotation.valid_period;
        let userResponce = window.confirm(confirmMs);
        if (userResponce) {
            let serverResponce = getHTTPServiceRequest("/quotation", "POST", quotation)
            if (serverResponce == "0") {
                alert("Save Succecfully...!");
                refreshTable();
                refreshQForm();
                // need to close modal
                $("#modalQuotationForm").modal("hide");
            } else {
                alert("Fail to add, You have following error... \n" + serverResponce);
            }
        }

    } else {
        alert("You have following error in your form... \n" + errors);
    }

}

function buttonClearMC() {
    refreshQForm();
}

//
const rowView = (ob, rowno) => {

}

//
const rowDelete = (ob, rowno) => {

    let deleteMsg = "Are you sure to delete following Quotation..?" +
        "\n Quotation no : " + ob.number +
        "\n Supplier : " + ob.quatation_request_id.supplier_id.company_name +
        +"\n Quotation Request No : " + ob.quatation_request_id.request_number
        + "\n Recieve Date : " + ob.recieve_date
        + "\n Valid Period : " + ob.valid_period;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let serverResponce = getHTTPServiceRequest("/quotation", "DELETE", ob);

        if (serverResponce == "0") {
            alert("Delete Successfully...!");
            refreshTable();
        } else {
            alert("Fail to Delete, You have following error... \n" + serverResponce);
        }
    }

}


//
const formReFill = (ob, rowno) => {

    quotation = getServiceRequest("/quotation/getbyid/" + ob.id);
    oldQuotation = getServiceRequest("/quotation/getbyid/" + ob.id);
    // set value into feilds

    if (quotation.note != null)
        txtNote.value = quotation.note; else txtNote.value = "";


    dteReceivedDate.value = quotation.recieve_date
    dteValidDate.value = quotation.valid_period

    suppliers = getServiceRequest("/supplier/list");
    quotationrequests = getServiceRequest("/quotationrequest/list");
    quotationstatuses = getServiceRequest("/quotationstatus/list");

    fillSelectFeild(cmbSupplier, "Select Supplier", suppliers, "company_name",quotation.quatation_request_id.supplier_id.company_name);
    cmbSupplier.disabled = true;
    fillSelectFeild(cmbQRequest, "Select Quotation Request", quotationrequests, "request_number",quotation.quatation_request_id.request_number);
    cmbQRequest.disabled = true;
    fillSelectFeild(cmbQStatus, "Select Status", quotationstatuses, "name", quotation.quatation_status_id.name, true);
    cmbQStatus.disabled = false;

    let currentDateForMin = new Date(quotation.added_date);
    currentDateForMin.setDate(currentDateForMin.getDate() - 4);
    dteReceivedDate.min = getCurrentDate2("date", currentDateForMin);

    let currentDateForMax = new Date(quotation.added_date);
    dteReceivedDate.max = getCurrentDate2("date", currentDateForMax);

    let currentDateForVDMin = new Date(quotation.added_date);
    dteValidDate.min = getCurrentDate2("date", currentDateForVDMin);

    let currentDateForVDMax = new Date(quotation.added_date);
    currentDateForVDMax.setDate(currentDateForVDMax.getDate() + 365);
    dteValidDate.max = getCurrentDate2("date", currentDateForVDMax);


    setStyle("2px solid green");

    if (quotation.note == null)
        txtNote.style.borderBottom = "2px solid rgb(118, 118, 118)";

    disabledButton(false, true);
    $("#modalQuotationForm").modal("show");

    refreshInnerFormTable();
}

const checkUpdates = () => {
    let updates = "";

    if (quotation != null && oldQuotation != null) {

        if (JSON.parse(cmbSupplier.value).company_name != oldQuotation.quatation_request_id.supplier_id.company_name) {
            updates = updates + "Supplier is Changed " + oldQuotation.quatation_request_id.supplier_id.company_name + " into " + JSON.parse(cmbSupplier.value).company_name + "\n";
        }

        if (quotation.quatation_request_id.request_number != oldQuotation.quatation_request_id.request_number) {
            updates = updates + "Quotation Request is Changed " + oldQuotation.quatation_request_id.request_number + " into " + quotation.quatation_request_id.request_number + "\n";
        }

        if (quotation.recieve_date != oldQuotation.recieve_date) {
            updates = updates + "Received Date is Changed " + quotation.recieve_date + " into " + oldQuotation.recieve_date + "\n";
        }

        if (quotation.quatation_status_id.name != oldQuotation.quatation_status_id.name) {
            updates = updates + "Quotation Status is Changed " + oldQuotation.quatation_status_id.name + " into " + quotation.quatation_status_id.name + "\n";
        }

        if (quotation.valid_period != oldQuotation.valid_period) {
            updates = updates + "Valid period is Changed " + oldQuotation.valid_period + " into " + oldQuotation.valid_period + "\n";
        }

        if (quotation.note != oldQuotation.note) {
            updates = updates + "Quotation Note is Changed " + oldQuotation.note + " into " + quotation.note + "\n";
        }
        if (quotation.quotationHasMaterialList.length != oldQuotation.quotationHasMaterialList.length) {
            updates = updates + "Quotation Material is changed " + "\n";
        } else {

            let extMat = 0;

            for (i = 0; i < quotation.quotationHasMaterialList.length; i++) {
                for (let l = 0; l < oldQuotation.quotationHasMaterialList.length; l++) {

                    if (quotation.quotationHasMaterialList[i].purchase_price == oldQuotation.quotationHasMaterialList[l].purchase_price) {
                        extMat = parseInt(extMat) + 1;
                    }
                }
            }
            if (extMat != quotation.quotationHasMaterialList.length) {
                updates = updates + "Quotation Material is changed " + "\n";
            }
        }


    }

    return updates;
}

//
function buttonUpdateMC() {
    // check errs
    let errors = checkErrors();
    if (errors == "") {
        //check updates
        let updates = checkUpdates();
        if (updates != "") {
            // get confirmation
            let userConfirm = window.confirm("Are yoy sure to update following Quotation chnagers..\n " + updates);
            if (userConfirm) {
                //server responce
                let updateServerResponce = getHTTPServiceRequest("/quotation", "PUT", quotation);
                if (updateServerResponce == "0") {
                    alert("Update Successfully....!")
                    refreshTable();
                    refreshQForm();
                    $("#modalQuotationForm").modal("hide");
                } else {
                    alert("Update Not Compete : " + updateServerResponce);
                }
            }

        } else {
            alert("Nothing any changer in your form");
        }


    } else {
        alert("You have following error in your form... \n" + errors);
    }

}

function buttonModalCloseMC(){
    buttonCloseModal("#modalQuotationForm",refreshQForm);
}
