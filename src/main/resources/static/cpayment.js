//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=customerPayment");
    $('[data-toggle="tooltip"]').tooltip();
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshTable();
    divbankName.style.display = "none";
    divbankDetails.style.display = "none";
    divonlinePaymentDetails.style.display = "none";
// called refreshproductForm function
    refreshCPaymentForm();


}


//define refresh table function
const refreshTable = () => {
    cpayments = new Array();
    cpayments = getServiceRequest("cpayment/findall");

    let displayPropList = ['customer_payment_bill_number', 'customer_id.customer_name', 'total_amount', 'after_balance_amount', 'customer_payment_status_id.name'];
    let displayPropDataTypeList = ['object', 'object', 'text', 'text', 'object'];

    fillDataIntoTable(tableCustomerPayment, cpayments, displayPropList, displayPropDataTypeList, refillForm, deleteRow, viewRow, true, lggeduserprivilage);
    for (let index in cpayments ){
        tableCustomerPayment.children[1].children[index].children[6].children[0].style.display = "none";
        tableCustomerPayment.children[1].children[index].children[6].children[1].style.display = "none";

    }
    $("tableCustomerPayment").dataTable();
}

const refreshCPaymentForm = () => {
    cPayment = new Object();
    oldcPayment = null;


    customers = getServiceRequest("/customer/list")
    fillSelectFeild(cmbCustomerName, "Select Customer", customers, "customer_name", "");

    cordersNo = getServiceRequest("customerOrder/notpaidCustomers")
    fillSelectFeild(cmbCON, "Select Customer Order", cordersNo, "order_code", "")

    customerPaymentMethod = getServiceRequest("/cptype/list")
    fillSelectFeild(cmbPMethod, "Select Payemnt Method", customerPaymentMethod, "name", "");

    paymentstatus = getServiceRequest("cpstatus/list")
    fillSelectFeild(cmbPSStatus, "Select Payemnt Status", paymentstatus, "name", "Not-Complete");
    cPayment.customer_payment_status_id = JSON.parse(cmbPSStatus.value);


    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() - 4);
    dteTransDate.min = getCurrentDate2("date", currentDateForMin);

    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate());
    dteTransDate.max = getCurrentDate("date", currentDateForMax);

    // txtPreBalanceAmount
    // txtSPNo
    // txtTotalAmount
    // txtPreBalanceAmount
    // txtPaidAmount
    // txtAfterBalanceAmount
    // txtBankName
    // txtBranchName
    // txtAccountHolder
    // txtAccNumber
    // txtNote
    dteTransDate = "";
    txtPreBalanceAmount.value = "";
    txtPreBalanceAmount.disabled = true;
    txtTotalAmount.disabled = true;
    txtAfterBalanceAmount.disabled = true;
    txtSPNo.value = "";
    txtTotalAmount.value = "";
    txtPreBalanceAmount.value = "";
    txtPaidAmount.value = "";
    txtAfterBalanceAmount.value = "";
    txtBankName.value = "";
    txtBranchName.value = "";
    txtAccountHolder.value = "";
    txtAccNumber.value = "";
    txtNote.value = "";
    txtTransid.value = "";
    disabledButton(false, false);

    setStyle("1px solid #cacfe7")

}

function getCOListbyCustomers() {
    let activeCOrders = getServiceRequest("/customerOrder/getActivePayCOrders/" + JSON.parse(cmbCustomerName.value).id);
    fillSelectFeild(cmbCON, "Select Customer Order", activeCOrders, "order_code", "");
}

function setValue() {

    txtTotalAmount.value = JSON.parse(cmbCON.value).total_amount;
    txtTotalAmount.style.borderBottom = "2px solid green";
    cPayment.total_amount = txtTotalAmount.value;

    txtPreBalanceAmount.value = JSON.parse(cmbCON.value).order_balance;
    txtPreBalanceAmount.style.borderBottom = "2px solid green";
    cPayment.pre_balance_amount = txtPreBalanceAmount.value;

}

function checkValidPaidAmount() {
  //parseFloat() - used to accept a string and convert it into a floating-point numbe
  let regPattern =new RegExp("^([1-9][0-9]{0,5}[.]{1}[0-9]{2})$");
     if(regPattern.test(txtPaidAmount.value)){
           if(parseFloat(txtPaidAmount.value) <= parseFloat(txtPreBalanceAmount.value)){
               cPayment.paid_amount = txtPaidAmount.value;
               txtPaidAmount.style.borderBottom = "2px solid green";
                calculatingAfterBAmount();
           } else {
               cPayment.paid_amount = null;
               txtPaidAmount.style.borderBottom = "2px solid red";
               return(alert("Maiximum Paid amount is exceeded!"));
               txtPaidAmount.value = "";
               txtAfterBalanceAmount.value = "";
           }
       }else {
           cPayment.paid_amount = null;
           txtAfterBalanceAmount.value = "";
           txtPaidAmount.style.borderBottom = "2px solid red";
       }


}

function calculatingAfterBAmount() {

    txtAfterBalanceAmount.value = (parseFloat(txtPreBalanceAmount.value) - parseFloat(txtPaidAmount.value)).toFixed(2);
    txtAfterBalanceAmount.style.borderBottom = "2px solid green";
    cPayment.after_balance_amount = txtAfterBalanceAmount.value;
    buttonAdd.disabled = false;

}


function showdivBankDetails() {

    if (JSON.parse(cmbPMethod.value).name == "Bank Payment-Deposit") {
        divbankName.style.display = "block";
        divbankDetails.style.display = "block";
    } else {
        divbankName.style.display = "none";
        divbankDetails.style.display = "none";
    }
    if (JSON.parse(cmbPMethod.value).name == "Bank Payment-Online") {
        divonlinePaymentDetails.style.display = "block";
    } else {
        divonlinePaymentDetails.style.display = "none";
    }
    /* if(JSON.parse(cmbPMethod.value).name == "Checque"){
     divCheqDetails.style.display  = "block";
     }else{
         divCheqDetails.style.display  = "none";
     }*/

}

// function checkBalance() {
//     console.log(txtAfterBalanceAmount.value);
//     if((txtAfterBalanceAmount.value) == null){
//         if(parseFloat(txtAfterBalanceAmount.value)== 0.00)
//         paymentstatus = getServiceRequest("cpstatus/list")
//         cmbPSStatus.innerHTML = "Completed";
//         cPayment.customer_payment_status_id = JSON.parse(cmbPSStatus.value);
//     }else{
//         paymentstatus = getServiceRequest("cpstatus/list")
//         cmbPSStatus.value= "Not-Complete";
//         cPayment.customer_payment_status_id = JSON.parse(cmbPSStatus.value);
//     }
//     // else{
//     //     cPayment.customer_payment_status_id = JSON.parse(cmbPSStatus.value);
//     // }
// }
function disabledButton(addbtn, updbtn) {

    if (addbtn && lggeduserprivilage.ins) {
        buttonAdd.disabled = false;
        $("buttonAdd").css("pointer-events", "all");
        $("buttonAdd").css("cursor", "pointer");
    } else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "not-allowed");
    }

}

function setStyle(style) {
    txtPreBalanceAmount.style.border = style;
    cmbCustomerName.style.border = style;
    cmbCON.style.border = style;
    cmbPMethod.style.border = style;
    cmbPSStatus.style.border = style;
    txtSPNo.style.border = style;
    txtTotalAmount.style.border = style;
    txtPreBalanceAmount.style.border = style;
    txtPaidAmount.style.border = style;
    txtAfterBalanceAmount.style.border = style;
    txtBankName.style.border = style;
    txtBranchName.style.border = style;
    txtAccountHolder.style.border = style;
    txtAccNumber.style.border = style;
    txtNote.style.border = style;
    txtTransid.style.border = style;
}


function checkErrors() {
    let errors = "";


    if (cPayment.customer_id == null) {
        errors = errors + "Customer  is Not Selected \n";
    }
    if (cPayment.customer_order_id == null) {
        errors = errors + "Customer  Order is Not Selected \n";
    }

 if (cPayment.customer_payment_type_id.name == "Bank Paymnt-Online") {
    if (cPayment.transfer_id == null) {
        errors = errors + "Transfer Number is Not Entered \n";
    }
    if (cPayment.transfer_date == null) {
        errors = errors + "Transfer Date is Not Selected \n";
    }
 }  else if (cPayment.customer_payment_type_id.name == "Bank Paymnt-Deposit") {

    if (cPayment.bank_name == null) {
        errors = errors + "Bank Name is Not Entered \n";
    }
    if (cPayment.bank_branchname == null) {
        errors = errors + "Bank Branch Name is Not Entered \n";
    }
    if (cPayment.account_holder_name == null) {
        errors = errors + "Account Holder Name is Not Entered \n";
    }
    if (cPayment.account_number == null) {
        errors = errors + "Account Number is Not Entered \n";
    }
}
if (cPayment.paid_amount == null) {
    errors = errors + "Paid Amount is Not Entered \n";
}
return errors;
}

function buttonSubmitMC() {
//need to check form errors
    let errors = checkErrors();

    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following... " +
            "\n Customer Payment : " + cPayment.customer_id.customer_name +
            "\n Customer Order Code :" + cPayment.customer_order_id.order_code;
//ob.findall values data:ob
        let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
            $.ajax("/cpayment", {
                async: false,
                type: "POST",
                data: JSON.stringify(cPayment),
                contentType: "application/json",
                success: function (susResdata, susStatus, ajresob) {
                    postServieResponce = susResdata;
                },
                error: function (errRsOb, errStatus, errorMsg) {
                    postServieResponce = errorMsg;
                }

            });

            if (postServieResponce == "0") {

                alert("Add Successfull..!");
                refreshCPaymentForm();
                refreshTable();
                $("#modalCustomerPaymentForm").modal("hide");
            } else {
                window.alert("You have following errorss \n" + postServieResponce);
            }

        }
    } else {
        window.alert("You have following error \n" + errors);
    }
}

const refillForm = () => {
}
const deleteRow = (ob, rowno) => {

    let deleteMsg = "Are you sure to delete following payment details..? \n"

        + "\n Customer Order Code : " + ob.customer_payment_bill_number
        + "\n Customer number : " + ob.customer_id.customer_name;


    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let deleteServerResponce;

        $.ajax("/cpayment", {
            async: false,
            type: "DELETE", // method delete
            data: JSON.stringify(cPayment), // object
            contentType: "application/json",
            success: function (susResdata, susStatus, ajresob) {
                deleteServerResponce = susResdata;
            },
            error: function (errRsOb, errStatus, errorMsg) {
                deleteServerResponce = errorMsg;
            }
        });

        if (deleteServerResponce == "0") {

            alert("Delete Successfull..!");
            refreshTable();

        } else {
            window.alert("You have following errorr \n" + deleteServerResponce);
        }
    }
}
const viewRow = (rowob, rowind) => {

    let printItem = getServeiceRequst("/cpayment/getbyid/" + rowob.id);

    tdItemCode.innerText = printItem.itemcode;

}
function buttonModalCloseMC() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        refreshCPaymentForm();
        $("#modalCustomerPaymentForm").modal("hide");
    }
}

