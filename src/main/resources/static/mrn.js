window.addEventListener('load', loadUi);

function loadUi() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Mrn");

    refreshTable();
    console.log("Hii")
    refreshMrnForm();

}

// fonction for refresh table ( fill data into table)
const refreshTable = () => {

    mrns = new Array();
    mrns = getServiceRequest("/mrn/findall");

    let displayPropList = ['recieve_no', 'purchase_order_id.supplier_id.company_name', 'purchase_order_id.order_no', 'supplier_inovice_no', 'recieve_date', 'net_amount', 'material_recieve_note_status_id.name'];
    let disPPDTypeList = ['text', 'object', 'object', 'text', 'text', 'text', 'object'];

    fillDataIntoTable(tableMrn, mrns, displayPropList, disPPDTypeList, formReFill, rowDelete, rowView, true, lggeduserprivilage);


    for (let index in mrns) {
        if (mrns[index].material_recieve_note_status_id.name == "Removed") {
            tableMrn.children[1].children[index].style.backgroundColor = "pink";

            tableMrn.children[1].children[index].children[7].children[1].disabled = true;
            tableMrn.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableMrn.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    $('#tableMrn').dataTable();

}
/*
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
*/

// functon for refresh form
const refreshMrnForm = () => {

    //create new object with it's old object(duplicatie object)
    mrn = new Object();
    oldmrn = null;

    mrn.mrnHasMaterialList = new Array();

    //create arrys for get data for fill select ellement
    suppliers = getServiceRequest("/supplier/list");
    porderlist = getServiceRequest("/purchaseorder/list");
    cmbPurchaseOrder.disabled = true;
    fillSelectFeild(cmbSupplier, "Select Supplier", suppliers, "company_name");
    fillSelectFeild(cmbPurchaseOrder, "Select Purchase Order", porderlist, "order_no");
    // cmbPurchaseOrder.disabled = true;
    mrnstatuses = getServiceRequest("/mrnstatus/list")
    fillSelectFeild(cmbMrnStatus, "Select Status", mrnstatuses, "name", "Received", true);
    mrn.material_recieve_note_status_id = JSON.parse(cmbMrnStatus.value);
    cmbMrnStatus.style.borderBottom = "1px solid #ced4da";


    txtTotalAmount.value = "";
    txtTotalAmount.disabled = true;
    txtNote.value = "";
    dteReceivedDate.value = "";


    let currentDateForMin = new Date();

    currentDateForMin.setDate(currentDateForMin.getDate() - 2);
    dteReceivedDate.min = getCurrentDate2("date", currentDateForMin);

    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate());
    dteReceivedDate.max = getCurrentDate2("date", currentDateForMax);

    let mrnArray = [cmbSupplier, cmbPurchaseOrder, dteReceivedDate, txtSupplierInvoiceNO, txtTotalAmount, txtDiscountRatio, txtNetAmount, txtNote, cmbMrnStatus];
    setIDStyle(mrnArray, "1px solid #ced4da");


    disabledButton(true, false);

    refreshInnerFormTable();
}


// function setStyle(style) {
//     cmbSupplier.style.borderBottom = style;
//     cmbPurchaseOrder.style.borderBottom = style;
//     cmbPOStatus.style.borderBottom = style;
//     txtPONo.style.borderBottom = style;
//     txtTotalAmount.style.borderBottom = style;
//     dteReceivedDate.style.borderBottom = style;
//     txtNote.style.borderBottom = style;
//
// }


// function getMaterialByQuotation() {
//
//     materialsByQuotation = getServiceRequest("/material/listbyquotation/" + JSON.parse(cmbPurchaseOrder.value).id);
//     cmbMaterial.disabled = false;
//     fillSelectFeild2(cmbMaterial, "Select Material", materialsByQuotation, "code", "name", "");
//
// }


const refreshInnerFormTable = () => {

    /* inner Form */
    mrnHasMaterial = new Object();
    oldmrnHasMaterial = null;

    buttonInnerAdd.disabled = true;
    buttonInnerUpdate.disabled = true;

    materials = getServiceRequest("/material/list");
    fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", "");
    cmbMaterial.disabled = true;


    // txtUnitPrice.value = "";
    txtUnitPrice.disabled = true;
    // txtQuantity.value = "";
    // txtLinePricet.value = "";
    txtLinePricet.disabled = true;
    const mrnInnerArray = [cmbMaterial, txtUnitPrice, txtQuantity, txtLinePricet];
    setIDStyle(mrnInnerArray, "2px solid  #ced4da");
    setIDValueNull(mrnInnerArray);

    // .style.borderBottom = "2px solid  #ced4da";
    // .style.borderBottom = "2px solid  #ced4da";
    // .style.borderBottom = "2px solid  #ced4da";
    // .style.borderBottom = "2px solid  #ced4da";

    /* Inner Table */

    let totalAmount = 0.00;
    let displayPropList = ['material_id.name', 'purchase_price', 'quantity', 'line_total'];
    let disPPDTypeList = ['object', 'text', 'text', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableInnerMrn, mrn.mrnHasMaterialList, displayPropList, disPPDTypeList, innreFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);


    for (let index in mrn.mrnHasMaterialList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(mrn.mrnHasMaterialList[index].line_total);
        tableInnerMrn.children[1].children[index].children[5].children[2].style.display = "none";
    }


    if (totalAmount != 0.00) {
        txtTotalAmount.value = parseFloat(totalAmount).toFixed(2);
        mrn.total_amount = txtTotalAmount.value;

        if (oldmrn != null && mrn.total_amount != oldmrn.total_amount) {
            txtTotalAmount.style.borderBottom = "2px solid orange";
        } else {
            txtTotalAmount.style.borderBottom = "2px solid green";
        }
    }

}

function getMaterialByPOrder() {
    if (cmbPurchaseOrder.value != "") {
        ///listbyporder/{poid}
        materialsByPOrder = getServiceRequest("/material/listbyporder/" + JSON.parse(cmbPurchaseOrder.value).id);
        fillSelectFeild2(cmbMaterial, "Select Material", materialsByPOrder, "code", "name", "");
        cmbMaterial.disabled = false;
        txtQuantity.disabled = false;

    } else {
        materials = getServiceRequest("/material/list");
        console.log(materials);
        fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", "");
        cmbMaterial.disabled = true;
    }
}

function getMaterialUnitPrice() {

    pOrderhasMaterial = getServiceRequest("/PorderHasMaterial/getMaterialbyPordr/" + JSON.parse(cmbPurchaseOrder.value).id + "/" + JSON.parse(cmbMaterial.value).id);
    txtUnitPrice.value = parseFloat(pOrderhasMaterial.purchase_price).toFixed(2);
    txtUnitPrice.style.borderBottom = "2px solid green";
    mrnHasMaterial.purchase_price = txtUnitPrice.value;

}

function getLineTotal() {

    if (txtQuantity.value != 0) {

        let regpattern = new RegExp("^[0-9]{1,4}$");

        if (regpattern.test(txtQuantity.value)) {
            txtLinePricet.value = (parseFloat(txtQuantity.value) * parseFloat(txtUnitPrice.value)).toFixed(2);
            txtLinePricet.style.borderBottom = "2px solid   green";
            mrnHasMaterial.line_total = txtLinePricet.value;
            txtDiscountRatio.disabled = false;

            if (oldmrnHasMaterial == null)
                buttonInnerAdd.disabled = false; else buttonInnerUpdate.disabled = false;
        } else {
            txtQuantity.style.borderBottom = "2px solid red";
            mrnHasMaterial.quantity = null;
            buttonInnerAdd.disabled = true;
            buttonInnerUpdate.disabled = true;
        }


    } else {
        txtQuantity.style.borderBottom = "2px solid red";
        mrnHasMaterial.quantity = null;
        buttonInnerAdd.disabled = true;
        buttonInnerUpdate.disabled = true;

    }
}


function discountedValueFunction(field) {
    let discountValue = parseFloat((field).value);
    let totalAmountField = document.getElementById("txtTotalAmount");
    let netAmountField = document.getElementById("txtNetAmount");
    if ((discountValue != "null") || (discountValue != "")) {
        //set regex pattern to variable
        let regpattern = new RegExp("^[0-9]||[1][0]$");
        //check discount value with regex pattern
        if (regpattern.test(discountValue)) {
            mrn.discount_rate = discountValue;
            field.style.borderBottom = "2px solid green";
            netAmountField.value = parseFloat(totalAmountField.value) - ((parseFloat(totalAmountField.value) * discountValue) / 100);
            mrn.net_amount = parseFloat(totalAmountField.value) - ((parseFloat(totalAmountField.value) * discountValue) / 100);
            netAmountField.style.borderBottom = "2px solid green";
        } else {
            mrn.discount_rate = null;
            field.style.borderBottom = "2px solid red";
            netAmountField.value = "";
            mrn.net_amount = null;
            netAmountField.style.borderBottom = "2px solid red";
        }

    } else {
        field.style.borderBottom = "2px solid #ced4da";
        mrn.discount_rate = 0;
        netAmountField.value = 0;
        mrn.net_amount = 0;
        netAmountField.style.borderBottom = "2px solid green";
    }
}




// function getmrnAfterTaxamount(){
//
//     if(txtTaxRatio.value != 0){
//      let  pattern = new RegExp("^([0-9]{1,9}[.]{1}[0-9]{2})|([0-9]{1,9}$");
//         if(pattern.test(txtTaxRatio.value)){
//             txtTaxRatio.style.borderBottom ="2px solid green";
//             txtNetAmount.disabled = false;
//             buttonAdd.disabled = false;
//             buttonUpdate.disabled = false;
//         }else{
//             txtNetAmount.disabled = true;
//             txtTaxRatio.style.borderBottom = "2px solid red";
//             buttonAdd.disabled = true;
//             buttonUpdate.disabled = true;
//         }
//
//     }else{
//         txtTaxRatio.style.borderBottom = "2px solid red";
//         buttonAdd.disabled = true;
//         buttonUpdate.disabled = true;
//     }
// }


const checkInnerFormError = () => {

    let errors = "";
    if (mrnHasMaterial.quantity == null) {
        errors = errors + "Please input quantity"
    }
    return errors;
}
const buttonInnerAddMC = () => {

    //to check whether the availbility of the vale that we are going to add as material ,first check with the already created array marHasMarerialList
    let materialext = false;

    for (let index in mrn.mrnHasMaterialList) {
        if (mrn.mrnHasMaterialList[index].material_id.id == mrnHasMaterial.material_id.id) {
            materialext = true;
            break;
        }
    }


    if (!materialext) {
        let errors = checkInnerFormError();
        if (errors == "") {
            let confirmMs = "Are you sure to add following Porder Material Details \n"

                + "\n Unit Price : " + mrnHasMaterial.purchase_price
                + "\n Quantity : " + mrnHasMaterial.quantity
                + "\n Line Total : " + mrnHasMaterial.line_total;
            let userResponce = window.confirm(confirmMs);

            if (userResponce) {
                mrn.mrnHasMaterialList.push(mrnHasMaterial);
                alert("Save Succecfully...!");
                refreshInnerFormTable();
                getMaterialByPOrder();

            }
        } else {
            window.alert("You have following error \n" + errors);
        }
    } else {
        alert("Material Allready ext...!");
        refreshInnerFormTable();
        getMaterialByPOrder();
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
    txtLinePricet.value = purchaseOrderHasIMatrial.line_total;
    txtLinePricet.disabled = true;

    cmbMaterial.style.borderBottom = "2px solid  green";
    txtUnitPrice.style.borderBottom = "2px solid  green";
    txtQuantity.style.borderBottom = "2px solid  green";
    txtLinePricet.style.borderBottom = "2px solid  green";

    buttonInnerUpdate.disabled = true;
    buttonInnerAdd.disabled = true;
}

function buttonInnerUpdateMC() {
    if (purchaseOrderHasIMatrial.quantity != oldPurchaseOrderHasIMatrial.quantity || purchaseOrderHasIMatrial.material_id.name != oldPurchaseOrderHasIMatrial.material_id.name) {
        let updateInnerMsg = "Are you sure to update following Purchase order Material..?" +
            "\n Material : " + purchaseOrderHasIMatrial.material_id.name +
            "\n Quantity : " + purchaseOrderHasIMatrial.quantity;

        let innerUpdateUserResponce = window.confirm(updateInnerMsg);

        if (innerUpdateUserResponce) {

            mrn.purchaseOrderHasMaterialList[innerRowNo] = purchaseOrderHasIMatrial;
            alert("Update Successfully...!");
            refreshInnerFormTable();

        }
    } else
        alert("Nothing Updated..!");
}

const innerRowDelete = (innerob, rowind) => {
    let deleteInnerMsg = "Are you sure to delete following Purchase order Material..?" +
        "\n Material : " + innerob.material_id.name;

    let innserdeleteUserResponce = window.confirm(deleteInnerMsg);

    if (innserdeleteUserResponce) {

        mrn.purchaseOrderHasMaterialList.splice(rowind, 1)
        alert("Romve Successfully...!");
        refreshInnerFormTable();

    }
}

const innerRowView = () => {
}


// function for check form erros
const checkErrors = () => {
    let errors = "";

    if (mrn.supplier_id == null) {
        errors = errors + "Supplier Not Selected \n";

    }
    if (mrn.quatation_id == null) {
        errors = errors + "Quotation  Not Selected \n";

    }

    if (mrn.recieve_date == null) {
        errors = errors + "Required Date Not Selected \n";

    }

    if (mrn.total_amount == null) {
        errors = errors + "Total Amount Not entered \n";

    }
    if (mrn.purchaseOrderHasMaterialList.length == 0) {
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
            + "\n Supplier : " + mrn.supplier_id.company_name
            + "\n Quotation : " + mrn.quatation_id.number
            + "\n Required Date : " + mrn.recieve_date
            + "\n Total Amount : " + mrn.total_amount;
        let userResponce = window.confirm(confirmMs);
        if (userResponce) {
            let serverResponce = getHTTPServiceRequest("/mrn", "POST", mrn)
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

function buttonClearMC() {
    refreshForm();
}

//
const rowView = (ob, rowno) => {

}

//
const rowDelete = (ob, rowno) => {

    let deleteMsg = "Are you sure to delete following Purchase order..?" +
        "\n Purchase order no : " + ob.order_no +
        "\n Supplier : " + ob.callingname +
        +"\n Quotation : " + ob.quatation_id.number
        + "\n Required Date : " + ob.recieve_date
        + "\n Total Amount : " + ob.total_amount;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let serverResponce = getHTTPServiceRequest("/mrn", "DELETE", ob);

        if (serverResponce == "0") {
            alert("Delete Successfully...!");
            refreshTable();
        } else {
            alert("Fail to Delete, You have following error... \n" + serverResponce);
        }
    }

}


const formReFill = (ob, rowno) => {

    mrn = getServiceRequest("/mrn/getbyid/" + ob.id);
    oldmrn = getServiceRequest("/mrn/getbyid/" + ob.id);
    // set value into feilds

    if (mrn.note != null)
        txtNote.value = mrn.note; else txtNote.value = "";

    txtPONo.value = mrn.order_no;
    txtTotalAmount.value = mrn.total_amount;
    dteReceivedDate.value = mrn.recieve_date;


    quotations = getServiceRequest("/quotation/listall");

    fillSelectFeild(cmbSupplier, "Select Supplier", suppliers, "company_name", mrn.purchase_order_id.supplier_id.company_name);
    fillSelectFeild(cmbPurchaseOrder, "Select Quotation", quotations, "number", mrn.purchase_order_id.order_no);
    cmbSupplier.disabled = true;
    cmbPurchaseOrder.disabled = true;
    fillSelectFeild(cmbPurchaseOrder, "Select Status", porderstatuses, "name", mrn.purchase_order_status_id.name, true);
    cmbPOStatus.disabled = false;
    //  let mrnArray = {cmbSupplier,cmbPurchaseOrder,dteReceivedDate,txtSupplierInvoiceNO,txtTotalAmount,txtTaxRatio,txtDiscountRatio,txtNetAmount,txtNote,cmbMrnStatus}
    // setIDStyle(mrnArray,"1px doted #ced4da");


    if (mrn.note == null)
        txtNote.style.borderBottom = "2px solid rgb(118, 118, 118)";

    disabledButton(false, true);
    $("#modalPurchaseOrderForm").modal("show");

    refreshInnerFormTable();
}

const checkUpdates = () => {
    let updates = "";

    if (mrn != null && oldmrn != null) {

        if (mrn.supplier_id.company_name != oldmrn.supplier_id.company_name) {
            updates = updates + "Supplier is Changed " + oldmrn.supplier_id.company_name + " into " + mrn.supplier_id.company_name + "\n";
        }

        if (mrn.quatation_id.number != oldmrn.quatation_id.number) {
            updates = updates + "Quotation is Changed " + oldmrn.quatation_id.number + " into " + mrn.quatation_id.number + "\n";
        }

        if (mrn.total_amount != oldmrn.total_amount) {
            updates = updates + "Porder Total Amount is Changed " + mrn.total_amount + " into " + oldmrn.total_amount + "\n";
        }

        if (mrn.purchase_order_status_id.name != oldmrn.purchase_order_status_id.name) {
            updates = updates + "Porder Status is Changed " + oldmrn.purchase_order_status_id.name + " into " + mrn.purchase_order_status_id.name + "\n";
        }

        if (mrn.recieve_date != oldmrn.recieve_date) {
            updates = updates + "Required Date is Changed " + oldmrn.recieve_date + " into " + oldmrn.recieve_date + "\n";
        }

        if (mrn.note != oldmrn.note) {
            updates = updates + "Porder Note is Changed " + oldmrn.note + " into " + mrn.note + "\n";
        }
        if (mrn.purchaseOrderHasMaterialList.length != oldmrn.purchaseOrderHasMaterialList.length) {
            updates = updates + "Porder Material is changed " + "\n";
        } else {

            let extMat = 0;

            for (i = 0; i < mrn.purchaseOrderHasMaterialList.length; i++) {
                for (let l = 0; l < oldmrn.purchaseOrderHasMaterialList.length; l++) {

                    if (mrn.purchaseOrderHasMaterialList[i].quantity == oldmrn.purchaseOrderHasMaterialList[l].quantity) {
                        extMat = parseInt(extMat) + 1;
                    }
                }
            }
            if (extMat != mrn.purchaseOrderHasMaterialList.length) {
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
                let updateServerResponce = getHTTPServiceRequest("/mrn", "PUT", mrn);
                if (updateServerResponce == "0") {
                    alert("update Successfully....!")
                    refreshTable();
                    refreshPOForm();
                    $("#modalPurchaseOrderForm").modal("hide");
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

function getPObysupplier() {
    //quotationsBySupRequdate = getServiceRequest("/quotation/listvalid/" + JSON.parse(cmbSupplier.value).id + "/" + dteRequiredDate.value);
//    mrn = getServiceRequest("/purchaseorder/getPObySupplierid/" + JSON.parse(cmbSupplier.value).id) ;
// fillSelectFeild(cmbPurchaseOrder,"Select Purchase Order",mrn,"order_no");
//     cmbPurchaseOrder.disabled = false;

}


function getValidPOrder() {
    // poderbyrecieveddate = getServiceRequest("/purchaseorder/pOrdervalid/" + JSON.parse(cmbSupplier.value).id + "/" + dteReceivedDate.value);
    // fillSelectFeild(cmbPurchaseOrder, "Select Purchase Order", poderbyrecieveddate, "");
    // cmbPurchaseOrder.disabled = false;
}

function buttonModalCloseMC() {
    buttonCloseModal("#modalPurchaseOrderForm", refreshMrnForm);
}


/**
 * Line Number          Functions
 * 3                    loadui
 * 17                   refreshTable
 * 57                   refreshMrnForm
 * 125                  getUnitPrice
 * 197                  getLineTotal
 * 158                  refreshInnerFormTable
 * 214                  buttonInnerAddMC
 * 247                  innreFormReFill
 * 271                  buttonInnerUpdateMC
 * 290                  innerRowDelete
 * 305                  innerRowView
 * 310                  checkErrors
 * 339                  buttonSubmitMC
 * 373                  buttonClearMC
 * 378                   rowView
 * 383                  rowDelete
 * 408                  formReFill
 * 444                  rowDelete
 * 498                  buttonUpdateMC
 * 192                  getMaterialByPOrder
 * 550                  getValidPOrder
 * 557                  buttonModalCloseMC
 * 191                 getMaterialUnitPrice
 **/
