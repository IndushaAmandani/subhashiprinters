window.addEventListener('load', loadUi);

function loadUi() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=PurchaseOrder");
    refreshTable();
    refreshPOForm();

}

// fonction for refresh table ( fill data into table)
const refreshTable = () => {

    porders = new Array();
    porders = getServiceRequest("/purchaseorder/findall");

    let displayPropList = ['order_no', 'quatation_id.quatation_request_id.supplier_id.company_name', 'quatation_id.number', 'required_date', 'materials', 'total_amount', 'purchase_order_status_id.name'];
    let disPPDTypeList = ['text', 'object', 'object', 'text', getMaterilasName, 'text', 'object'];

    fillDataIntoTable(tablePurchaseOrder, porders, displayPropList, disPPDTypeList, formReFill, rowDelete, rowView, true, lggeduserprivilage);


    for (let index in porders) {
        tablePurchaseOrder.children[1].children[index].children[8].children[2].style.display = "none";
        if ((porders[index].purchase_order_status_id.name == "Removed") || (porders[index].purchase_order_status_id.name == "Cancelled" )) {
            tablePurchaseOrder.children[1].children[index].style.backgroundColor = "#a99e9e";
            tablePurchaseOrder.children[1].children[index].children[8].children[1].disabled = true;
            tablePurchaseOrder.children[1].children[index].children[8].children[1].style.pointerEvents = "all";
            tablePurchaseOrder.children[1].children[index].children[8].children[1].style.cursor = "not-allowed";

        }
    }

    $('#tablePurchaseOrder').dataTable();

}

function getMaterilasName(ob) {
    // console.log(ob);
    let purchaseOrderHasMaterilaList = getServiceRequest("/material/listbyporder/" + ob.id);
    let orderMaterialName = "";
    for (let index in purchaseOrderHasMaterilaList) {
        if (purchaseOrderHasMaterilaList.length - 1 == index)
            orderMaterialName = orderMaterialName + purchaseOrderHasMaterilaList[index].name;
        else orderMaterialName = orderMaterialName + purchaseOrderHasMaterilaList[index].name + ", ";
    }
    return orderMaterialName;
}


// functon for refresh form
const refreshPOForm = () => {

    //create new object with it's old object(duplicatie object)
    purchaseorder = new Object();
    oldpurchaseorder = null;

    purchaseorder.purchaseOrderHasMaterialList = new Array();

    //create arrys for get data for fill select ellement
    supplierslist = getServiceRequest("/supplier/list");
    quotationslist = getServiceRequest("/quotation/listall");
    porderstatuses = getServiceRequest("/porderstatus/list");
    cmbSupplier.disabled = false;
    fillSelectFeild(cmbSupplier, "Select Supplier", supplierslist, "company_name");
    fillSelectFeild(cmbQuotation, "Select Quotation", quotationslist, "number");
    cmbQuotation.disabled = true;
    fillSelectFeild(cmbPOStatus, "Select Status", porderstatuses, "name", "Ordered", true);
    purchaseorder.purchase_order_status_id = JSON.parse(cmbPOStatus.value);


    // txtPONo.value = "Purchase Order No is auto generated";
    txtTotalAmount.value = "";
    txtTotalAmount.disabled = true;
    txtNote.value = "";
    dteRequiredDate.value = "";


    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() - 2);
    dteRequiredDate.min = getCurrentDate2("date", currentDateForMin);

    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() + 12);
    dteRequiredDate.max = getCurrentDate2("date", currentDateForMax);

    let porderArray = [cmbSupplier,cmbQuotation,cmbPOStatus,txtTotalAmount,dteRequiredDate,txtNote]
    setIDStyle(porderArray,"1px solid #ced4da");


    disabledButton(true, false);

    refreshInnerFormTable();

}





function getValidQuotaion() {
    quotationsBySupRequdate = getServiceRequest("/quotation/listvalid/" + JSON.parse(cmbSupplier.value).id + "/" + dteRequiredDate.value);
    fillSelectFeild(cmbQuotation, "Select Quotation", quotationsBySupRequdate, "number");
    cmbQuotation.disabled = false;
}

function getMaterialByQuotation() {

    materialsByQuotation = getServiceRequest("/material/listbyquotation/" + JSON.parse(cmbQuotation.value).id);
    cmbMaterial.disabled = false;
    fillSelectFeild2(cmbMaterial, "Select Material", materialsByQuotation, "code", "name", "");

}

function getUnitPrice() {
    let quotationMaterial = getServiceRequest("/quotationmaterial/byqm/" + JSON.parse(cmbQuotation.value).id + "/" + JSON.parse(cmbMaterial.value).id)
    //toFixed() converts a number to a string, rounded to a specified number of decimals:
    //parseFloat() parses a string and returns the first number:
    txtUnitPrice.value = parseFloat(quotationMaterial.purchase_price).toFixed(2);
    txtUnitPrice.style.borderBottom = "2px solid  green";
    purchaseOrderHasIMatrial.purchase_price = txtUnitPrice.value;
}

function getLineTotal() {

    if (txtQuantity.value != 0) {

        let regpattern = new RegExp("^[0-9]{1,4}$");

        if (regpattern.test(txtQuantity.value)) {
            txtLinePricet.value = (parseFloat(txtQuantity.value) * parseFloat(txtUnitPrice.value)).toFixed(2);
            txtLinePricet.style.borderBottom = "2px solid  green";
            purchaseOrderHasIMatrial.line_total = txtLinePricet.value;
            if(oldPurchaseOrderHasIMatrial == null)
                    buttonInnerAdd.disabled = false; else   buttonInnerUpdate.disabled = false;
        } else {
            txtQuantity.style.borderBottom = "2px solid red";
            purchaseOrderHasIMatrial.quantity = null;
            buttonInnerAdd.disabled = true;    buttonInnerUpdate.disabled = true;
        }


    } else {
        txtQuantity.style.borderBottom = "2px solid red";
        purchaseOrderHasIMatrial.quantity = null;
        buttonInnerAdd.disabled = true;    buttonInnerUpdate.disabled = true;
    }
}

const refreshInnerFormTable = () => {
    /* inner Form */
    purchaseOrderHasIMatrial = new Object();
    oldPurchaseOrderHasIMatrial = null;

    buttonInnerAdd.disabled = true;
    buttonInnerUpdate.disabled = true;

    materials = getServiceRequest("/material/list");
    if (cmbQuotation.value != "") {
        materialsByQuotation = getServiceRequest("/material/listbyquotation/" + JSON.parse(cmbQuotation.value).id);
        fillSelectFeild2(cmbMaterial, "Select Material", materialsByQuotation, "code", "name", "");
        cmbMaterial.disabled = false;
    } else {
        fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", "");
        cmbMaterial.disabled = true;
    }

    txtUnitPrice.value = "";
    txtUnitPrice.disabled = true;
    txtQuantity.value = "";
    txtLinePricet.value = "";
    txtLinePricet.disabled = true;

    cmbMaterial.style.borderBottom = "2px solid  #ced4da";
    txtUnitPrice.style.borderBottom = "2px solid  #ced4da";
    txtQuantity.style.borderBottom = "2px solid  #ced4da";
    txtLinePricet.style.borderBottom = "2px solid  #ced4da";

    /* Inner Table */

    let totalAmount = 0.00;
    let displayPropList = ['material_id.name', 'purchase_price', 'quantity', 'line_total'];
    let disPPDTypeList = ['object', 'text', 'text', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tablePOMaterial, purchaseorder.purchaseOrderHasMaterialList, displayPropList, disPPDTypeList, innreFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);


    for (let index in purchaseorder.purchaseOrderHasMaterialList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(purchaseorder.purchaseOrderHasMaterialList[index].line_total);
        tablePOMaterial.children[1].children[index].children[5].children[2].style.display = "none";
    }


    if (totalAmount != 0.00) {
        txtTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        purchaseorder.total_amount = txtTotalAmount.value;

        if (oldpurchaseorder != null && purchaseorder.total_amount != oldpurchaseorder.total_amount) {
            txtTotalAmount.style.borderBottom = "2px solid orange";
        } else {
            txtTotalAmount.style.borderBottom = "2px solid green";
        }
    }

}

const buttonInnerAddMC = () => {

    let materialext = false;

    for (let index in purchaseorder.purchaseOrderHasMaterialList) {
        if (purchaseorder.purchaseOrderHasMaterialList[index].material_id.id == purchaseOrderHasIMatrial.material_id.id) {
            materialext = true;
            break;
        }
    }

    if (!materialext) {

        let confirmMs = "Are you sure to add following Porder Material Details \n"
            + "\n Item Name : " + purchaseOrderHasIMatrial.material_id.name
            + "\n Unit Price : " + purchaseOrderHasIMatrial.purchase_price
            + "\n Quantity : " + purchaseOrderHasIMatrial.quantity
            + "\n Line Total : " + purchaseOrderHasIMatrial.line_total;
        let userResponce = window.confirm(confirmMs);

        if (userResponce) {
            purchaseorder.purchaseOrderHasMaterialList.push(purchaseOrderHasIMatrial);
            alert("Save Succecfully...!");
            refreshInnerFormTable();

        }
    } else {
        alert("Material Allready ext...!")
    }


}

const innreFormReFill = (innerob, rowind) => {
    innerRowNo = rowind;
    purchaseOrderHasIMatrial = JSON.parse(JSON.stringify(innerob));
    oldPurchaseOrderHasIMatrial = JSON.parse(JSON.stringify(innerob));

    materials = getServiceRequest("/material/list");
    fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", purchaseOrderHasIMatrial.material_id.code);
    cmbMaterial.disabled = true;

    txtUnitPrice.value = purchaseOrderHasIMatrial.purchase_price;
    txtUnitPrice.disabled = true;
    txtQuantity.value = purchaseOrderHasIMatrial.quantity;
    txtLinePricet.value =purchaseOrderHasIMatrial.line_total;
    txtLinePricet.disabled = true;

    cmbMaterial.style.borderBottom = "2px solid  green";
    txtUnitPrice.style.borderBottom = "2px solid  green";
    txtQuantity.style.borderBottom = "2px solid  green";
    txtLinePricet.style.borderBottom = "2px solid  green";

    buttonInnerUpdate.disabled = true;
    buttonInnerAdd.disabled = true;
}

function buttonInnerUpdateMC(){
    if(purchaseOrderHasIMatrial.quantity != oldPurchaseOrderHasIMatrial.quantity || purchaseOrderHasIMatrial.material_id.name != oldPurchaseOrderHasIMatrial.material_id.name ) {
        let updateInnerMsg = "Are you sure to update following Purchase order Material..?" +
            "\n Material : " + purchaseOrderHasIMatrial.material_id.name +
            "\n Quantity : " + purchaseOrderHasIMatrial.quantity;

        let innerUpdateUserResponce = window.confirm(updateInnerMsg);

        if (innerUpdateUserResponce) {

            purchaseorder.purchaseOrderHasMaterialList[innerRowNo] = purchaseOrderHasIMatrial;
            alert("Update Successfully...!");
            refreshInnerFormTable();

        }
    }else
        alert("Nothing Updated..!");
}

const innerRowDelete = (innerob, rowind) => {
    let deleteInnerMsg = "Are you sure to delete following Purchase order Material..?" +
        "\n Material : " + innerob.material_id.name;

    let innserdeleteUserResponce = window.confirm(deleteInnerMsg);

    if (innserdeleteUserResponce) {

        purchaseorder.purchaseOrderHasMaterialList.splice(rowind, 1)
        alert("Removed Successfully...!");
        refreshInnerFormTable();

    }
}

const innerRowView = () => {
}


// function for check form erros
const checkErrors = () => {
    let errors = "";

    if (purchaseorder.supplier_id == null) {
        errors = errors + "Supplier Not Selected \n";

    }
    if (purchaseorder.quatation_id == null) {
        errors = errors + "Quotation  Not Selected \n";

    }

    if (purchaseorder.required_date == null) {
        errors = errors + "Required Date Not Selected \n";

    }

    if (purchaseorder.total_amount == null) {
        errors = errors + "Total Amount Not entered \n";

    }
    if (purchaseorder.purchaseOrderHasMaterialList.length == 0) {
        errors = errors + "Material Not selected \n";

    }
    return errors;
}

//
function buttonSubmitMC() {

    // need to check form errors n required field
    let errors = checkErrors();

    if (errors == "") {
        //

        // need to get user confirmation
        let confirmMs = "Are you sure to add following purchase order details \n"
            + "\n Supplier : " + purchaseorder.supplier_id.company_name
            + "\n Quotation : " + purchaseorder.quatation_id.number
            + "\n Required Date : " + purchaseorder.required_date
            + "\n Total Amount : " + purchaseorder.total_amount;
        let userResponce = window.confirm(confirmMs);
        if (userResponce) {
            let serverResponce = getHTTPServiceRequest("/purchaseorder", "POST", purchaseorder)
            if (serverResponce == "0") {
                alert("Save Succecfully...!");
                refreshTable();
                refreshPOForm();
                // need to close modal
                $("#modalPurchaseOrderForm").modal("hide");
            } else {
                alert("Fail to add, You have following error... \n" + serverResponce);
            }
        }

    } else {
        alert("You have following error in your form... \n" + errors);
    }

}

function buttonClearMC(){
    refreshPOForm();
}

//
const rowView = (ob, rowno) => {

}

//
const rowDelete = (ob, rowno) => {

    let deleteMsg = "Are you sure to delete following Purchase order..?" +
        "\n Purchase order no : " + ob.order_no +
        "\n Supplier : " + ob.supplier_id.req_no +
        +"\n Quotation : " + ob.quatation_id.number
        + "\n Required Date : " + ob.required_date
        + "\n Total Amount : " + ob.total_amount;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let serverResponce = getHTTPServiceRequest("/purchaseorder", "DELETE", ob);

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

    purchaseorder = getServiceRequest("/purchaseorder/getbyid/" + ob.id);
    oldpurchaseorder = getServiceRequest("/purchaseorder/getbyid/" + ob.id);
    // set value into feilds

    if (purchaseorder.note != null)
        txtNote.value = purchaseorder.note; else txtNote.value = "";


    txtTotalAmount.value = purchaseorder.total_amount;
    dteRequiredDate.value = purchaseorder.required_date

    fillSelectFeild(cmbSupplier, "Select Supplier", supplierslist, "company_name", purchaseorder.supplier_id.company_name);
    fillSelectFeild(cmbQuotation, "Select Quotation", quotationslist, "number", purchaseorder.quatation_id.number);
    cmbSupplier.disabled = true;
    cmbQuotation.disabled = true;
    fillSelectFeild(cmbPOStatus, "Select Status", porderstatuses, "name", purchaseorder.purchase_order_status_id.name, true);
    cmbPOStatus.disabled = false;
    let porderArray = [cmbSupplier,cmbQuotation,cmbPOStatus,txtTotalAmount,dteRequiredDate,txtNote]
    setIDStyle(porderArray,"1px solid green");

    if (purchaseorder.note == null)
        txtNote.style.borderBottom = "2px solid rgb(118, 118, 118)";

    disabledButton(false, true);
    btnAddNew.click();

    refreshInnerFormTable();
}

const checkUpdates = () => {
    let updates = "";

    if (purchaseorder != null && oldpurchaseorder != null) {

        if (purchaseorder.supplier_id.company_name != oldpurchaseorder.supplier_id.company_name) {
            updates = updates + "Supplier is Changed " + oldpurchaseorder.supplier_id.company_name + " into " + purchaseorder.supplier_id.company_name + "\n";
        }

        if (purchaseorder.quatation_id.number != oldpurchaseorder.quatation_id.number) {
            updates = updates + "Quotation is Changed " + oldpurchaseorder.quatation_id.number + " into " + purchaseorder.quatation_id.number + "\n";
        }

        if (purchaseorder.total_amount != oldpurchaseorder.total_amount) {
            updates = updates + "Porder Total Amount is Changed " + purchaseorder.total_amount + " into " + oldpurchaseorder.total_amount + "\n";
        }

        if (purchaseorder.purchase_order_status_id.name != oldpurchaseorder.purchase_order_status_id.name) {
            updates = updates + "Porder Status is Changed " + oldpurchaseorder.purchase_order_status_id.name + " into " + purchaseorder.purchase_order_status_id.name + "\n";
        }

        if (purchaseorder.required_date != oldpurchaseorder.required_date) {
            updates = updates + "Required Date is Changed " + oldpurchaseorder.required_date + " into " + oldpurchaseorder.required_date + "\n";
        }

        if (purchaseorder.note != oldpurchaseorder.note) {
            updates = updates + "Porder Note is Changed " + oldpurchaseorder.note + " into " + purchaseorder.note + "\n";
        }
        if (purchaseorder.purchaseOrderHasMaterialList.length != oldpurchaseorder.purchaseOrderHasMaterialList.length) {
            updates = updates + "Porder Material is changed " + "\n";
        } else {

            let extMat = 0;

            for (i = 0; i < purchaseorder.purchaseOrderHasMaterialList.length; i++) {
                for (let l = 0; l < oldpurchaseorder.purchaseOrderHasMaterialList.length; l++) {

                    if (purchaseorder.purchaseOrderHasMaterialList[i].quantity == oldpurchaseorder.purchaseOrderHasMaterialList[l].quantity ) {
                        extMat = parseInt(extMat) + 1;
                    }
                }
            }
            if (extMat != purchaseorder.purchaseOrderHasMaterialList.length) {
                updates = updates + "Porder Material is changed " + "\n";
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
            let userConfirm = window.confirm("Are yoy sure to update following purchase order chnagers..\n " + updates);
            if (userConfirm) {
                //server responce
                let updateServerResponce = getHTTPServiceRequest("/purchaseorder", "PUT", purchaseorder);
                if (updateServerResponce == "0") {
                    alert("update Successfully....!");
                    $("#modalPurchaseOrderForm").modal().hide();
                    refreshTable();
                    refreshPOForm();
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

function buttonModalCloseMC() {
    buttonCloseModal("#modalPurchaseOrderForm",refreshPOForm);
}

function buttonInnerClearMC(){
    refreshInnerFormTable();
}
