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

    let displayPropList = ['customer_payment_bill_number', 'customer_id.customer_name', 'total_amount', 'after_balance_amount'];
    let displayPropDataTypeList = ['object', 'object', 'decimal', 'decimal', 'object'];

    fillDataIntoTable(tableCustomerPayment, cpayments, displayPropList, displayPropDataTypeList, refillForm, deleteRow, viewRow, true, lggeduserprivilage);
    for (let index in cpayments) {
        tableCustomerPayment.children[1].children[index].children[5].children[0].style.display = "none";
        tableCustomerPayment.children[1].children[index].children[5].children[1].style.display = "none";

        if (cpayments[index].customer_payment_status_id.name == "Completed") {
            tableCustomerPayment.children[1].children[index].style.backgroundColor = "#6c8c86";
            tableCustomerPayment.children[1].children[index].style.color = "#0f100f";
        }

    }
    $('#tableCustomerPayment').dataTable();
}
const refreshCPaymentForm = () => {
    cPayment = new Object();
    oldcPayment = null;

    ///customer/getCustomerbyCOSatus
    // customers = getServiceRequest("/customer/list")
    // fillSelectFeild(cmbCustomerName, "Select Customer", customers, "customer_name", "");

   customers = getServiceRequest("/customer/getCustomerNamebyCorderwhenCObalanceAvailable")
   fillSelectFeild(cmbCustomerName, "Select Customer", customers, 'customer_name', "");


    cordersNo = getServiceRequest("/customerOrder/notpaidCustomers")
    fillSelectFeild(cmbCON, "Select Customer Order", cordersNo, "order_code", "")
    cmbCON.disabled = true;
    customerPaymentMethod = getServiceRequest("/cptype/list")
    fillSelectFeild(cmbPMethod, "Select Payemnt Method", customerPaymentMethod, "name", "");

    paymentstatus = getServiceRequest("cpstatus/list")
    fillSelectFeild(cmbPSStatus, "Select Payemnt Status", paymentstatus, "name", "Not-Complete");
    cPayment.customer_payment_status_id = JSON.parse(cmbPSStatus.value);
    cmbPSStatus.disabled = true;


    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() - 2);
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
    txtPreBalanceAmount.value = 0.00;
    txtPreBalanceAmount.disabled = true;
    txtTotalAmount.disabled = true;
    txtAfterBalanceAmount.disabled = true;
    txtPaidAmount.disabled = true;
    // txtSPNo.value = "";
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
    disabledSupButton(true, false);
    const idArray = [txtPreBalanceAmount, cmbCustomerName, cmbCON, cmbPMethod, cmbPSStatus, txtTotalAmount, txtPreBalanceAmount, txtPaidAmount, txtAfterBalanceAmount, txtBankName, txtBranchName, txtAccountHolder, txtAccNumber, txtNote, txtTransid];
    setIDStyle(idArray, "1px solid #cacfe7")

}

document.getElementById("cmbCustomerName").addEventListener('change', () => {
    getCOListbyCustomers();
})

function getCOListbyCustomers() {
    let activeCOrders = getServiceRequest("/customerOrder/getActivePayCOrders/" + JSON.parse(cmbCustomerName.value).id);
    fillSelectFeild(cmbCON, "Select Customer Order", activeCOrders, "order_code", "");
}

function disabledSupButton(addbtn, updbtn) {

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

document.getElementById("cmbCON").addEventListener('change', () => {
    cmbCustomerName.disabled = true;
    setValue();
    txtPaidAmount.disabled = false;


})

function setValue() {

    txtTotalAmount.value = parseFloat(JSON.parse(cmbCON.value).total_amount).toFixed(2);
    // txtTotalAmount.value = parseFloat(cPayment.customer_order_id.total_amount).toFixed(2);
    txtTotalAmount.style.borderBottom = "2px solid green";
    cPayment.total_amount = txtTotalAmount.value;

    txtPreBalanceAmount.value = parseFloat(JSON.parse(cmbCON.value).order_balance).toFixed(2);
    txtPreBalanceAmount.style.borderBottom = "2px solid green";
    cPayment.pre_balance_amount = parseFloat(txtPreBalanceAmount.value).toFixed(2);

}

// document.getElementById("txtPreBalanceAmount").addEventListener('change',()=>{
//     txtPaidAmount.value = "";
//     txtPaidAmount.disabled = false;
// })

document.getElementById("txtPaidAmount").addEventListener('keyup', () => {
    checkValidPaidAmount();
})

function checkValidPaidAmount() {
    //parseFloat() - used to accept a string and convert it into a floating-point numbe
    let regPattern = new RegExp("^([1-9][0-9]{0,7}[.][0-9]{2})$");
    if (regPattern.test(txtPaidAmount.value)) {
        cPayment.paid_amount = parseFloat(txtPaidAmount.value).toFixed(2);
        if (parseFloat(cPayment.paid_amount) < parseFloat(cPayment.pre_balance_amount)) {
            cPayment.paid_amount = parseFloat(txtPaidAmount.value).toFixed(2);
            txtPaidAmount.style.borderBottom = "2px solid green";
            calculatingAfterBAmount();
        } else if (parseFloat(cPayment.paid_amount) == parseFloat(cPayment.pre_balance_amount)) {
            cPayment.paid_amount = parseFloat(txtPaidAmount.value).toFixed(2);
            txtPaidAmount.style.borderBottom = "2px solid green";
            calculatingAfterBAmount();
        } else {
            cPayment.paid_amount = null;
            txtPaidAmount.style.borderBottom = "2px solid red";
            return (alert("Maiximum Paid amount is exceeded!"));
            txtPaidAmount.value = "";
            txtAfterBalanceAmount.value = "";
        }
    } else {
        cPayment.paid_amount = null;
        txtAfterBalanceAmount.value = "";
        txtPaidAmount.style.borderBottom = "2px solid red";
    }


}

function calculatingAfterBAmount() {

    cPayment.after_balance_amount = (parseFloat(cPayment.pre_balance_amount) - parseFloat(cPayment.paid_amount)).toFixed(2);
    txtAfterBalanceAmount.style.borderBottom = "2px solid green";
    txtAfterBalanceAmount.value = cPayment.after_balance_amount;
    buttonAdd.disabled = false;
    fillSelectFeild(cmbPSStatus, "Select Payemnt Status", paymentstatus, "name", "Completed");
    cPayment.customer_payment_status_id = JSON.parse(cmbPSStatus.value);


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


function checkErrors() {
    let errors = "";


    if (cPayment.customer_id == null) {
        errors = errors + "Customer  is Not Selected \n";
    }
    if (cPayment.customer_order_id == null) {
        errors = errors + "Customer  Order is Not Selected \n";
    }
    if (cPayment.customer_payment_type_id == null) {
        errors = errors + "Customer  Payment Type is Not Selected \n";
    } else {
        if (cPayment.customer_payment_type_id.name == "Bank Payment-Online") {
            if (cPayment.transfer_id == null) {
                errors = errors + "Transfer Number is Not Entered \n";
            }
            if (cPayment.transfer_date == null) {
                errors = errors + "Transfer Date is Not Selected \n";
            }
        } else if (cPayment.customer_payment_type_id.name == "Bank Payment-Deposit") {

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
                $('#modalCustomerPaymentForm').modal("hide");
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

function buttonCloseModalMC() {
    buttonCloseModal("#modalCustomerPaymentForm", refreshCPaymentForm);


}


function buttonClearMC() {
    refreshCPaymentForm();
}


function buttonModalCloseMCV() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {

        $("#modalViewCPaymentForm").modal("hide");
    }
}

function printRowItemMC() {
    let newWindow = window.open();
    newWindow.document.write("<link rel='stylesheet' href= 'resources/bootstrap/css/bootstrap.min.css'>" + "<h2>Customer Payment Details</h2>" + "<div>" + tableCPaymentView.outerHTML + "</div>");
    setTimeout(function () {
        newWindow.print();
        newWindow.close();
    }, 1000);
}

const viewRow = (ob, rowind) => {
//     $("#modalViewCustomerForm").modal("show");
//     printCPymnet = getServiceRequest("/cpayment/getbyid/" + ob.id)
// //as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.
//     tdCOCode.innerHTML = printCPymnet.customer_order_id.order_code;
//     tdTAmount.innerHTML = printCPymnet.total_amount ;
//     tdPreBalance.innerHTML = printCPymnet.pre_balance_amount ;
//     tdPAmount.innerHTML = printCPymnet.paid_amount ;
    //console.log(getServiceRequest("/cpayment/getbyid/" + ob.id))
    const fillDataIntoBillingTable = (tableBodyID, dataList, displayColumnList) => {

        const tableBody = document.getElementById(tableBodyID);
        tableBody.innerHTML = "";

        dataList.forEach((element, index) => {
            const tr = document.createElement('tr');

            const tdIndex = document.createElement('td');
            tdIndex.innerText = index + 1;
            tr.appendChild(tdIndex);

            displayColumnList.forEach(column => {
                const td = document.createElement('td');
                td.classList.add('text-center');
                if (column.dataType == 'text') {
                    td.innerText = element[column.propertyName];
                }
                if (column.dataType == 'function') {
                    td.innerHTML = column.propertyName(element);
                }

                tr.appendChild(td);
            });

            tableBody.appendChild(tr); // table row append into table body
        });
    }
    const getUnit_price = (ob) => {
        return 'LKR' + parseFloat(ob.product_cost).toFixed(2);
    }
    const getLine_price = (ob) => {
        return 'LKR' + parseFloat(ob.line_total).toFixed(2);
    }
    const getQuantity = (ob) => {
        return parseFloat(ob.order_qty);
    }
    const getProductName = (ob) => {
        return ob.product_id.p_name;
    }
    const displayPropertyList = [
        {dataType: 'function', propertyName: getProductName},
        {dataType: 'function', propertyName: getUnit_price},
        {dataType: 'function', propertyName: getQuantity},
        {dataType: 'function', propertyName: getLine_price}
    ]

    let paymentProductsArray = getServiceRequest("/cpayment/getbyid/" + ob.id).customer_order_id.customerOrderHasProductList;
    console.log(paymentProductsArray);
    fillDataIntoBillingTable("tbodyPrintBill", paymentProductsArray, displayPropertyList)

    let tableBodyContent = document.getElementById("tbodyPrintBill").innerHTML;


    printOrderDetailsAtCPayment(getServiceRequest("/cpayment/getbyid/" + ob.id), tableBodyContent);

}


//function for the Printing Order Invoice
//insert customer order payment object as parameter
const printOrderDetailsAtCPayment = (customerOrderObject, tableBody) => {

    let customerCode = customerOrderObject.customer_id.customer_code;
    let customerName = customerOrderObject.customer_id.customer_name;
    let customerMobile = customerOrderObject.customer_id.mobile;


    let addedUserName = customerOrderObject.added_user_id.username;
    let addedDate = customerOrderObject.added_date.split('T')[0];
    let addedTime = customerOrderObject.added_date.split('T')[1];


    let orderDate = customerOrderObject.customer_order_id.added_date.split('T')[0];
    let requiredDate = customerOrderObject.customer_order_id.required_date;

    let orderCode = customerOrderObject.customer_order_id.order_code;


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`

    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bill Print</title>
        
            <link rel="apple-touch-icon" href="/app-assets/images/ico/apple-icon-120.png">
            <link rel="shortcut icon" type="image/x-icon" href="/app-assets/images/ico/favicon.ico">
            <link
            href="https://fonts.googleapis.com/css?family=Muli:300,300i,400,400i,600,600i,700,700i|Comfortaa:300,400,500,700"
            rel="stylesheet">
            <!-- BEGIN VENDOR CSS-->
            <link rel="stylesheet" type="text/css" href="/app-assets/css/vendors.css">

            <link rel="stylesheet" type="text/css" href="/resources/fontawesome/css/all.css">
            <!-- END VENDOR CSS-->

            <link rel="stylesheet" type="text/css" href="/app-assets/css/core/menu/menu-types/vertical-compact-menu.css">
            <link rel="stylesheet" type="text/css" href="/app-assets/vendors/css/cryptocoins/cryptocoins.css">
            <link rel="stylesheet" type="text/css" href="/app-assets/css/pages/transactions.css">

            <!-- BEGIN MODERN CSS-->
            <link rel="stylesheet" type="text/css" href="/app-assets/css/app.css">
            <!-- END MODERN CSS-->

            <link rel="stylesheet" type="text/css" href="/app-assets/assets/css/style.css">

            <link rel="stylesheet" type="text/css" href="/resources/datatable/css/datatables.min.css">
            <!-- END Custom CSS-->
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        ` + windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8">
                                <h2>Subhashi Printers - Deniyaya</h1>
                            </div>
                            <div class="col-4">
                                <h3>Order No.</h3><br>
                                <h4 class="pull-right">${orderCode}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Billed To :</strong><br>
                                    Customer Code : ${customerCode}<br>
                                    Customer Name : ${customerName}<br>
                                    Customer Mobile : ${customerMobile}
                                </address>
                            </div>
                            <div class="col-4">
                                <address>
                                <strong>Order Date :</strong><br>
                                ${orderDate} <br>
                                <strong>Order Date :</strong><br>
                                ${requiredDate}                                    
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Billed By :</strong><br>
                                    Username : ${addedUserName}<br>
                                    Date : ${addedDate}<br>
                                    Time : ${addedTime}<br>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Order summary</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td class="text-center"><strong>#</strong></td>
                                                <td class="text-center"><strong>Product</strong></td>
                                                <td class="text-center"><strong>Price</strong></td>
                                                <td class="text-center"><strong>Quantity</strong></td>
                                                <td class="text-right"><strong>Totals</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        ` + tableBody + `
                                            <!-- Calling the Table fill function -->                                            <tr>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line text-center"><strong>Total</strong></td>
                                                <td class="thick-line text-right">LKR ${parseFloat(customerOrderObject.total_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-center"><strong>Payment</strong></td>
                                                <td class="no-line text-right">LKR ${parseFloat(customerOrderObject.paid_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-center"><strong>Remaining Balance</strong></td>
                                                <td class="no-line text-right">LKR - ${parseFloat(customerOrderObject.after_balance_amount).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>

        </html>`


    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}

