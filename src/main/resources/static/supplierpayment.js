window.addEventListener("load", refreshUI);


/// browser refresh function
function refreshUI() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=SupplierPayment");

    refreshTable();
    refreshSPForm();
}

// Create function for refresh table
const refreshTable = ()=>{

    supplierpayments = new Array();
    supplierpayments = getServiceRequest("/supplierpayment/findall"); //

    //call filldataintotablefunction
    // fillDataIntoTable(tableid , dataList,displayPropertyList , dpDataTypeList,formrefillfunctionname,
    // rowdeletefunctionname, rowviewfunctonname, buttonvisibility , buttonsprivilages)
    let displayPropertyList =  ['bill_no','supplier_id.company_name','material_recieve_note_id.recieve_no','net_amount','total_amount',
        'paid_amount', 'balance_amount','added_date','supplier_payment_type_id.name','supplier_payment_status_id.name'];
    let dpDataTypeList = ['text','object','object',getNetAmount,getTotalAmount, getPaidAmount, getBalanceAmount,getAddedDatetime,'object','object'];
    fillDataIntoTable(tableSupplierPayment,supplierpayments,displayPropertyList,dpDataTypeList,reFillSPForm , deleteSPRow , viewSPRow, true, lggeduserprivilage);

    for(let index in supplierpayments){

        tableSupplierPayment.children[1].children[index].children[11].children[0].style.display = "none";
        tableSupplierPayment.children[1].children[index].children[11].children[1].style.display = "none";

    }

    $("#tableSupplierPayment").dataTable();
}


// create function for get sales price
function getNetAmount(ob){
    return  parseFloat(ob.net_amount).toFixed(2);
}

function getTotalAmount(ob) {
    return  parseFloat(ob.total_amount).toFixed(2);
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


const refreshSPForm = ()=> {

    newSupplierPayment = new Object();
    oldSupplierPayment  = null;

    // need to fill data into dropdown element
  //  suppliers = getServiceRequest("/supplier/list"); //
    suppliers = getServiceRequest("/supplier/tobepaidlist");
    mrns = getServiceRequest("/mrn/getnotpaid"); //
    spstatuses = getServiceRequest("/spstatus/list"); //
    sptypes = getServiceRequest("/sptype/list"); //

    fillSelectFeild(cmbSupplier,"Select Supplier" , suppliers ,"company_name","");
    fillSelectFeild(cmbPMethod,"Select Method" , sptypes ,"name","Cash");
    fillSelectFeild(cmbMrn,"Select MRN" , mrns ,"recieve_no","");
    fillSelectFeild(cmbSPStatus,"Select Payment Status" , spstatuses ,"name","");

    newSupplierPayment.supplier_payment_status_id = JSON.parse(cmbSPStatus.value);
    newSupplierPayment.supplier_payment_type_id = JSON.parse(cmbPMethod.value);
    newSupplierPayment.supplier_payment_status_id = (cmbSPStatus.value);
    newSupplierPayment.supplier_payment_type_id = (cmbPMethod.value);



    // clear input feilds
    // txtSPNo.value = "Supplier Payment Bill number is auto generated";

    txtNetAmount.value ="";
    txtTotalAmount.value ="";
    txtPaidAmount.value ="";
    txtBalanceAmount.value ="";
    txtNote.value = "";

    setSupplierArray = [cmbSPStatus,cmbPMethod,cmbSupplier,cmbMrn,txtNetAmount,txtTotalAmount,txtPaidAmount,txtBalanceAmount,txtNote]
    setIDStyle(setSupplierArray,"1px solid #ced4da")
    cmbSPStatus.style.borderBottom = "2px solid green";
    cmbPMethod.style.borderBottom = "2px solid green";

    disabledSPButton(true , false);
}

let disabledSPButton = (addbtn , updbtn) => {

    if(addbtn && lggeduserprivilage.ins){
        buttonAdd.disabled = false;
        $("#buttonAdd").css("pointer-events","all");
        $("#buttonAdd").css("cursor","pointer");
    }else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events","all");
        $("#buttonAdd").css("cursor","not-allowed");
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


setSupplierArray = [cmbSPStatus,cmbPMethod,cmbSupplier,cmbMrn,txtNetAmount,txtTotalAmount,txtPaidAmount,txtBalanceAmount,txtNote]



//check available errors in form
const checkSPFormError = ()=>{
    let formerror = "";

    if( newSupplierPayment.company_name == null){
        formerror = formerror + "Please Select Supplier ..! \n";
    }

    if( newSupplierPayment.material_recieve_note_id == null){
        formerror = formerror + "Please Select MRN ..! \n";
    }
    if( newSupplierPayment.total_amount == null){
        formerror = formerror + "Please Enter Total Amount ..! \n";
    }

    if( newSupplierPayment.paid_amount == null){
        formerror = formerror + "Please Paid Amount..! \n";
    }

    if( newSupplierPayment.balance_amount == null){
        formerror = formerror + "Please Balance Amount..! \n";
    }

    return formerror;
}

function buttonSPSave() {
    // check form error
    let errors = checkSPFormError();
    if(errors != ""){
        window.alert("form has following erros \n" + errors);
    }else {
        //get user confirmation
        let userCofirmMsg = "Are you sure to add Following Supplier Payment ..? " +
            "\n Supplier Name : " + newSupplierPayment.supplier_id.company_name +
            "\n MRN  No : " + newSupplierPayment.material_recieve_note_id.recieve_no +
            "\n Total Amount : " + newSupplierPayment.total_amount +
            "\n Paid Amount : " + newSupplierPayment.paid_amount +
            "\n Balance Amount : " + newSupplierPayment.balance_amount ;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if(userSaveResponce){
            //call post services
            let serverResponce = getHTTPServiceRequest("/supplierpayment" , "POST" , newSupplierPayment);
            if(serverResponce == "0"){
                $("#modalSupplierPaymentForm").modal("hide");
                refreshTable();
                refreshSPForm();
                window.alert("Supplier Payment Insert Successfully...");
            }else {
                window.alert("Supplier Payment Insert Not Successfully you have server error...\n" + serverResponce);
            }

        }
    }
}

//form refill function
function reFillSPForm(rowob,rowind) {

}

//create function for delete row
function deleteSPRow(ob) {
}


function viewSPRow(rowob,rowind) {

    let printItem = getServeiceRequst("/item/getbyid/"+rowob.id);

    tdItemCode.innerText = printItem.itemcode;

}

function getMRN() {
    cmbMrn.disabled = false;
        mrns = getServiceRequest("/mrn/listbysupplier/"+JSON.parse(cmbSupplier.value).id); //
    fillSelectFeild(cmbMrn,"Select MRN Status" , mrns ,"recieve_no","");
    txtTotalAmount.value =  parseFloat(JSON.parse(cmbSupplier.value).amount).toFixed(2);
    txtTotalAmount.style.borderBottom = "2px solid green";
    newSupplierPayment.total_amount = txtTotalAmount.value;
}




function getTotalAmountFormMRN() {
    txtNetAmount.value = parseFloat(JSON.parse(cmbMrn.value).net_amount).toFixed(2);
    txtTotalAmount.value = (parseFloat( txtTotalAmount.value) + parseFloat( txtNetAmount.value)).toFixed(2)
    txtNetAmount.style.borderBottom = "2px solid green";
    txtTotalAmount.style.borderBottom = "2px solid green";

    newSupplierPayment.net_amount = txtNetAmount.value;
    newSupplierPayment.total_amount = txtTotalAmount.value;
}

function getSPBalanceAmount() {

    let  paidpattern = new RegExp("^(([1-9][0-9]{0,5})|([1-9][0-9]{0,5}[.][0-9]{2}))$");
    if(paidpattern.test( txtPaidAmount.value)){
        if( parseFloat(txtPaidAmount.value) <= parseFloat(  txtTotalAmount.value)){
            txtBalanceAmount.value = (parseFloat(  txtTotalAmount.value) -  parseFloat(txtPaidAmount.value)).toFixed(2);
            txtBalanceAmount.style.borderBottom = "2px solid green";
            txtPaidAmount.style.borderBottom = "2px solid green";
            newSupplierPayment.paid_amount = txtPaidAmount.value;
            newSupplierPayment.balance_amount = txtBalanceAmount.value;

            if((txtBalanceAmount.value = "0") || (txtBalanceAmount.value = "0.00")){
                cmbSPStatus.value = "Full paid";
                cmbSPStatus.style.borderBottom = "2px solid green";
                newSupplierPayment.supplier_payment_status_id = cmbSPStatus.value;


            }else{
                cmbSPStatus.value = "Half paid";
                cmbSPStatus.style.borderBottom = "2px solid green";
                newSupplierPayment.supplier_payment_status_id = cmbSPStatus.value;
            }
        }else {
            txtBalanceAmount.value ="";
            txtBalanceAmount.style.borderBottom = "2px solid  #ced4da";
            txtPaidAmount.style.borderBottom = "2px solid red";
            newSupplierPayment.paid_amount = null;
            newSupplierPayment.balance_amount = null;
        }
    }else {
        txtBalanceAmount.value ="";
        txtBalanceAmount.style.borderBottom = "2px solid  #ced4da";
        txtPaidAmount.style.borderBottom = "2px solid red";
        newSupplierPayment.paid_amount = null;
        newSupplierPayment.balance_amount = null;
    }


}


function buttonModalCloseMC() {
    buttonCloseModal("#modalSupplierPaymentForm",refreshSPForm);

}
