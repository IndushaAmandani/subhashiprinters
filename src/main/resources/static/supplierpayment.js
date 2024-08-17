window.addEventListener("load", refreshUI);


/// browser refresh function
function refreshUI() {

    document.getElementById("spFormBody").style.pointerEvents = "auto";

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=SupplierPayment");

    refreshTable();
    refreshSPForm();
}

// Create function for refresh table
const refreshTable = () => {

    supplierpayments = new Array();
    supplierpayments = getServiceRequest("/supplierpayment/findall"); //

    //call filldataintotablefunction
    // fillDataIntoTable(tableid , dataList,displayPropertyList , dpDataTypeList,formrefillfunctionname,
    // rowdeletefunctionname, rowviewfunctonname, buttonvisibility , buttonsprivilages)
    let displayPropertyList = ['bill_no', 'supplier_id.company_name', 'material_recieve_note_id.recieve_no', 'material_recieve_note_id.net_amount', 'total_amount',
        'paid_amount', 'balance_amount', 'added_date', 'supplier_payment_type_id.name', 'supplier_payment_status_id.name'];
    let dpDataTypeList = ['text', 'object', 'object', getNetAmount, getTotalAmount, getPaidAmount, getBalanceAmount, getAddedDatetime, 'object', 'object'];
    fillDataIntoTable(tableSupplierPayment, supplierpayments, displayPropertyList, dpDataTypeList, reFillSPForm, deleteSPRow, viewSPRow, true, lggeduserprivilage);

    for (let index in supplierpayments) {

        tableSupplierPayment.children[1].children[index].children[11].children[0].style.display = "none";
        tableSupplierPayment.children[1].children[index].children[11].children[1].style.display = "none";

    }

    $("#tableSupplierPayment").dataTable();
}


// create function for get sales price
function getNetAmount(ob) {
    if ((ob.net_amount == null) || (ob.net_amount == "")) {
        return "-";
    } else {
        return parseFloat(ob.net_amount).toFixed(2);
    }

}

function getTotalAmount(ob) {
    return parseFloat(ob.total_amount).toFixed(2);
}

function getPaidAmount(ob) {
    return parseFloat(ob.paid_amount).toFixed(2);
}

function getBalanceAmount(ob) {
    return parseFloat(ob.balance_amount).toFixed(2);
}

function getAddedDatetime(ob) {
    return ob.added_date.split("T")[0] + "  " + ob.added_date.split("T")[1];
}


const refreshSPForm = () => {

    newSupplierPayment = new Object();
    oldSupplierPayment = null;

    // need to fill data into dropdown element
    //  suppliers = getServiceRequest("/supplier/list"); //
    suppliers = getServiceRequest("/supplier/tobepaidlist");
    mrns = getServiceRequest("/mrn/getnotpaid"); //
    spstatuses = getServiceRequest("/spstatus/list"); //
    sptypes = getServiceRequest("/sptype/list"); //

    fillSelectFeild(cmbSupplier, "Select Supplier", suppliers, "company_name", "");
    fillSelectFeild(cmbPMethod, "Select Method", sptypes, "name", );
    fillSelectFeild(cmbMrn, "Select MRN", mrns, "recieve_no", "", true);
    fillSelectFeild(cmbSPStatus, "Select Payment Status", spstatuses, "name","",true);

    //newSupplierPayment.supplier_payment_status_id = JSON.parse(cmbSPStatus.value);
  //  newSupplierPayment.supplier_payment_type_id = JSON.parse(cmbPMethod.value);
    // newSupplierPayment.supplier_payment_status_id = (cmbSPStatus.value);
    // newSupplierPayment.supplier_payment_type_id = (cmbPMethod.value);


    // clear input feilds
    // txtSPNo.value = "Supplier Payment Bill number is auto generated";

    txtNetAmount.value = "";
    txtTotalAmount.value = "";
    txtPaidAmount.value = "";
    txtBalanceAmount.value = "";
    txtNote.value = "";

    setSupplierArray = [cmbSPStatus, cmbPMethod, cmbSupplier, cmbMrn, txtNetAmount, txtTotalAmount, txtPaidAmount, txtBalanceAmount, txtNote]
    setIDStyle(setSupplierArray, "2px solid #ced4da")

    cmbPMethod.style.borderBottom = "2px solid #ced4da";

    txtPaidAmount.disabled = true;
    disabledSPButton(true, false);
}

let disabledSPButton = (addbtn, updbtn) => {

    if (addbtn && lggeduserprivilage.ins) {
        buttonAdd.disabled = false;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "pointer");
    } else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "not-allowed");
    }
    /*
        if(updbtn && lggeduserprivilage.upd){
            buttonUpdate.disabled = false;
            $("#buttonUpdate").css("pointer-events","all");
            $("#buttonUpdate").css("cursor","pointer");
        }else {
            buttonUpdate.disabled = true;
            $("#buttonUpdate").css("pointer-events","all");
            $("#buttonUpdate").css("cursor","not-allowed");
        }*/
}


setSupplierArray = [cmbSPStatus, cmbPMethod, cmbSupplier, cmbMrn, txtNetAmount, txtTotalAmount, txtPaidAmount, txtBalanceAmount, txtNote]


//check available errors in form
const checkSPFormError = () => {
    let formerror = "";

    if (newSupplierPayment.supplier_id == null) {
        formerror = formerror + "Please Select Supplier ..! \n";
    }

    if (newSupplierPayment.material_recieve_note_id == null) {
        formerror = formerror + "Please Select MRN ..! \n";
    }
    if (newSupplierPayment.total_amount == null) {
        formerror = formerror + "Please Enter Total Amount ..! \n";
    }

    if (newSupplierPayment.paid_amount == null) {
        formerror = formerror + "Please Paid Amount..! \n";
    }

    if (newSupplierPayment.balance_amount == null) {
        formerror = formerror + "Please Balance Amount..! \n";
    }
    if (newSupplierPayment.supplier_payment_type_id == null) {
        formerror = formerror + "Please Select Supplier Payment Type ..! \n";
    }

    return formerror;
}

function buttonSPSave() {
    // check form error
    let errors = checkSPFormError();
    if (errors != "") {
        window.alert("form has following erros \n" + errors);
    } else {
        //get user confirmation
        let userCofirmMsg = "Are you sure to add Following Supplier Payment ..? " +
            "\n Supplier Name : " + newSupplierPayment.supplier_id.company_name +
            "\n MRN  No : " + newSupplierPayment.material_recieve_note_id.recieve_no +
            "\n Total Amount : " + newSupplierPayment.total_amount +
            "\n Paid Amount : " + newSupplierPayment.paid_amount +
            "\n Balance Amount : " + newSupplierPayment.balance_amount;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if (userSaveResponce) {
            //call post services
            let serverResponce = getHTTPServiceRequest("/supplierpayment", "POST", newSupplierPayment);
            if (serverResponce == "0") {
                refreshSPForm();
                $("#modalSupplierPaymentForm").modal("hide");
                refreshTable();
                window.alert("Supplier Payment Insert Successfully...");
            } else {
                window.alert("Supplier Payment Insert Not Successfully you have server error...\n" + serverResponce);
            }

        }
    }
}

//form refill function
function reFillSPForm(rowob, rowind) {
    newSupplierPayment = getServiceRequest("/supplierpayment/getbyid/" + rowob.id);
    oldSupplierPayment = getServiceRequest("/supplierpayment/getbyid/" + rowob.id);

    // fillSelectFeild(cmbSupplier,"Select Supplier" ,suppliers,newSupplierPayment.supplier_id.company_name,"company_name","",true);
    // fillSelectFeild(cmbPMethod,"Select Method" , sptypes ,newSupplierPayment.supplier_payment_type_id,"name","Cash");
    //
    fillSelectFeild(cmbSupplier, "Select Supplier", suppliers, "company_name", newSupplierPayment.supplier_id.company_name);
    fillSelectFeild(cmbPMethod, "Select Method", sptypes, "name", newSupplierPayment.supplier_payment_type_id.name);
    fillSelectFeild(cmbMrn, "Select MRN", mrns, "recieve_no", newSupplierPayment.material_recieve_note_id.recieve_no);
    fillSelectFeild(cmbSPStatus, "Select Payment Status", spstatuses, "name", newSupplierPayment.supplier_payment_status_id.name);


    txtTotalAmount.value = parseFloat(newSupplierPayment.total_amount).toFixed(2);
    txtPaidAmount.value = newSupplierPayment.paid_amount;
    txtBalanceAmount.value = newSupplierPayment.balance_amount;
    if (newSupplierPayment.description != null) {
        txtNote.value = newSupplierPayment.description;
        txtNote.style.borderBottom = "2px solid #ced4da";
    } else {
        txtNote.value = "";
        txtNote.style.borderBottom = "2px solid #ced4da";
    }
    sPArry = [cmbSupplier, cmbPMethod, cmbMrn, cmbSPStatus, txtTotalAmount, txtPaidAmount, txtBalanceAmount];
    setIDStyle(sPArry, "2px solid #ced4da")


    btnAddNew.click();
}

//create function for delete row
function deleteSPRow(ob) {
}


function viewSPRow(rowob, rowind) {
    reFillSPForm(rowob, rowind);
    setIDStyle(sPArry, "2px solid #ced4da");
    document.getElementById("spFormBody").style.pointerEvents = "none";

}

document.getElementById("cmbSupplier").addEventListener('change', () => {
    getMRN();
});

function getMRN() {
    cmbMrn.disabled = false;
    mrns = getServiceRequest("/mrn/listbysupplier/" + JSON.parse(cmbSupplier.value).id);
    fillSelectFeild(cmbMrn, "Select MRN", mrns, "recieve_no", "");


}

document.getElementById("cmbMrn").addEventListener('change', () => {
    setNetAmount();
    getTotalPayble()

})

function setNetAmount() {
    newSupplierPayment.material_recieve_note_id = JSON.parse(cmbMrn.value);
    txtNetAmount.value = parseFloat(JSON.parse(cmbMrn.value).net_amount).toFixed(2);
    txtNetAmount.style.borderBottom = "2px solid green";
    newSupplierPayment.net_amount = txtNetAmount.value;
}

function getTotalPayble() {
    if ((parseFloat(JSON.parse(cmbMrn.value).paidamount) > 0.00) || (JSON.parse(cmbMrn.value).paidamount) != null) {
        txtTotalAmount.value = (parseFloat(JSON.parse(cmbMrn.value).net_amount) - parseFloat(JSON.parse(cmbMrn.value).paidamount)).toFixed(2);
        newSupplierPayment.total_amount = txtTotalAmount.value;
        txtTotalAmount.style.borderBottom = "2px solid green";


    } else {
        txtTotalAmount.value = (parseFloat(JSON.parse(cmbSupplier.value).amount)).toFixed(2);
        if(txtTotalAmount.value == ""){
            txtTotalAmount.value = 0.00;
        }
        txtTotalAmount.value = newSupplierPayment.net_amount;
        txtTotalAmount.style.borderBottom = "2px solid green";
    }
    txtPaidAmount.disabled = false;
}


document.getElementById("txtPaidAmount").addEventListener('keyup', () => {
    getSPBalanceAmount();
});

function getSPBalanceAmount() {

    let paidpattern = new RegExp("^(([1-9][0-9]{0,5})|([1-9][0-9]{0,5}[.][0-9]{2}))$");
    if (paidpattern.test(txtPaidAmount.value)) {
        if (parseFloat(txtPaidAmount.value) < parseFloat(txtTotalAmount.value)) {
            txtBalanceAmount.value = (parseFloat(txtTotalAmount.value) - parseFloat(txtPaidAmount.value)).toFixed(2);
            console.log(txtTotalAmount.value)
            console.log(txtPaidAmount.value)
            console.log(txtBalanceAmount.value);

            txtBalanceAmount.style.borderBottom = "2px solid green";
            txtPaidAmount.style.borderBottom = "2px solid green";
            newSupplierPayment.paid_amount = txtPaidAmount.value;
            newSupplierPayment.balance_amount = txtBalanceAmount.value;
            newSupplierPayment.total_amount = txtTotalAmount.value;
            fillSelectFeild(cmbSPStatus, "Select Payment Status", spstatuses, "name", "Half Paid");
            cmbSPStatus.style.borderBottom = "2px solid green";
            newSupplierPayment.supplier_payment_status_id = JSON.parse(cmbSPStatus.value);

        } else if (parseFloat(txtPaidAmount.value) == parseFloat(txtTotalAmount.value)) {
            if(txtBalanceAmount.value == ""){
                txtBalanceAmount.value = 0.00;
            }
            txtBalanceAmount.style.borderBottom = "2px solid green";
            txtPaidAmount.style.borderBottom = "2px solid green";
            newSupplierPayment.paid_amount = txtPaidAmount.value;
            newSupplierPayment.balance_amount = txtBalanceAmount.value;

            fillSelectFeild(cmbSPStatus, "Select Payment Status", spstatuses, "name", "Full paid");
            cmbSPStatus.style.borderBottom = "2px solid green";
            newSupplierPayment.supplier_payment_status_id = JSON.parse(cmbSPStatus.value);

        } else {
            txtBalanceAmount.value = "";
            txtBalanceAmount.style.borderBottom = "2px solid  #ced4da";
            txtPaidAmount.style.borderBottom = "2px solid red";
            newSupplierPayment.paid_amount = null;
            newSupplierPayment.balance_amount = null;
            fillSelectFeild(cmbSPStatus, "Select Payment Status", spstatuses, "name");
            cmbSPStatus.style.borderBottom = "2px solid #ced4da";
            newSupplierPayment.supplier_payment_status_id = null;
        }
    } else {
        txtBalanceAmount.value = "";
        txtBalanceAmount.style.borderBottom = "2px solid  #ced4da";
        txtPaidAmount.style.borderBottom = "2px solid red";
        newSupplierPayment.paid_amount = null;
        newSupplierPayment.balance_amount = null;
        fillSelectFeild(cmbSPStatus, "Select Payment Status", spstatuses, "name");
        cmbSPStatus.style.borderBottom = "2px solid #ced4da";
        newSupplierPayment.supplier_payment_status_id = null;

    }


}


function buttonModalCloseMC() {
    buttonCloseModal("#modalSupplierPaymentForm", refreshSPForm);

}
