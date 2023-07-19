//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=customerPayment");
    $('[data-toggle="tooltip"]').tooltip();
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshTable();

// called refreshproductForm function
    refreshCPaymentForm();


}


//define refresh table function
const refreshTable = () => {
    cpayment = new Array();
    cpayment = getServiceRequest("cpayment/findall");

    let displayPropList = ['customer_payment_bill_number','customer_id.customer_name','total_amount','after_balance_amount','customer_payment_status_id.name'];
    let displayPropDataTypeList = ['object','object','text','text','object'];

    fillDataIntoTable(tableCustomerPayment,cpayment,displayPropList,displayPropDataTypeList,refillForm,deleteRow,viewRow,true,lggeduserprivilage);
    $("tableCustomerPayment").dataTable();
}

const  refreshCPaymentForm = () =>{
    cpayments = new Object();
    oldcpayments =null;





    customers = getServiceRequest("/customer/list")
    fillSelectFeild(cmbCustomer, "Select Customer", customers, "customer_name", "");

console.log(cmbCustomer.value);
    cordersNo = getServiceRequest("customerOrder/notpaidCustomers")
    fillSelectFeild(cmbCON,"Select Customer Order",cordersNo,"order_code","")

    customerPaymentMethod = getServiceRequest("/cptype/list")
    fillSelectFeild(cmbPMethod,"Select Payemnt Method",customerPaymentMethod,"name","");

    paymentstatus = getServiceRequest("cpstatus/list")
    fillSelectFeild(cmbPSStatus,"Select Payemnt Status",paymentstatus,"name","");
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
    txtPreBalanceAmount.value = "";
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
    disabledButton(true , false);

    setStyle("1px solid #cacfe7")

}

function getCOListbyCustomers(){
    activeCOrders = getServiceRequest("/customerOrder/getActivePayCOrders/" + JSON.parse(cmbCustomer.value).id);
    fillSelectFeild(cmbCON,"Select Customer Order",activeCOrders,"order_code","");
}
function disabledButton(addbtn , updbtn){

    if(addbtn && lggeduserprivilage.ins){
        buttonAdd.disabled = false;
        $("buttonAdd").css("pointer-events","all");
        $("buttonAdd").css("cursor","pointer");
    }else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events","all");
        $("#buttonAdd").css("cursor","not-allowed");
    }

}

function setStyle(style) {
    txtPreBalanceAmount.style.border = style;
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
}



function buttonSubmitMC() {
//need to check form errors
    let errors = checkErrors();

    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following... " +
            "\n Customer Payment: " + cpayments.customer_id.customer_name +
            "\n Customer Payment Bill Number" + cpayments.customer_payment_bill_number;

  let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
            $.ajax("/cpayment", {
                async: false,
                type: "POST",
                data: JSON.stringify(cpayments),
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
                $('#modalCustomerPaymentForm').modal('hide');
            } else {
                window.alert("You have following error \n" + postServieResponce);
            }

        }
    } else {
        window.alert("You have following error \n" + errors);
    }
}
const refillForm = () =>{}
const deleteRow = (ob,rowno) =>{

    let deleteMsg = "Are you sure to delete following payment details..? \n"

        + "\n Customer Order Code : " + ob.customer_payment_bill_number
        + "\n Customer number : " + ob.customer_id.customer_name;


    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let deleteServerResponce;

        $.ajax("/cpayment", {
            async: false,
            type: "DELETE", // method delete
            data: JSON.stringify(ob), // object
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
            window.alert("You have following error \n" + deleteServerResponce);
        }
    }
}
const viewRow = (rowob,rowind) =>{

        let printItem = getServeiceRequst("/cpayment/getbyid/"+rowob.id);

        tdItemCode.innerText = printItem.itemcode;

    }

