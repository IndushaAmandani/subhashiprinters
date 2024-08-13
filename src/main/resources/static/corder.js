window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=CustomerOrder");

    refreshCustomerOrderTable();
    refreshCustomerOrderForm();
}

function refreshCustomerOrderTable() {
    //create array for stor data
    customerOrders = new Array();
    customerOrders = getServiceRequest("/customerOrder/findall");

    //create display property list
    let dispalyPropertyList = ['order_code', 'required_date', 'total_amount', 'advanced_amount', 'final_balanced_amount', 'production_status_id.name', 'order_status_id.name'];
    //Property type list
    let dispalyPropertyDTList = ['text', 'text', 'decimal', 'decimal', 'decimal', 'object', 'object'];

    //called filldataintotable function for fill data
    fillDataIntoTable(tableCOrder, customerOrders, dispalyPropertyList, dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);
    for (let index in customerOrders) {
        tableCOrder.children[1].children[index].children[8].children[0].style.display = "none";

        if (customerOrders[index].order_status_id.name == "Finished") {
            tableCOrder.children[1].children[index].style.backgroundColor = "#6c8c86";
            tableCOrder.children[1].children[index].style.color = "#0f100f";
            tableCOrder.children[1].children[index].children[8].children[1].disabled = true;
            tableCOrder.children[1].children[index].children[8].children[1].style.pointerEvents = "all";
            tableCOrder.children[1].children[index].children[8].children[1].style.cursor = "not-allowed";
        }

    }


    // need to add jquerty table
    $('#tableCOrder').dataTable();


}

function refreshCustomerOrderForm() {
    corder = new Object();
    oldcorder = null;


    corder.customerOrderHasProductList = new Array();
    corder.customerOrderHasMaterialList = new Array();


    customers = getServiceRequest("/customer/list")
    fillSelectFeild(cmbCustomerName, "Select Customer", customers, "customer_name", "");


    cOrdrStatus = getServiceRequest("/cOrderstatus/list")
    fillSelectFeild(cmbOrderStatus, "Select Status", cOrdrStatus, "name", "Pending", true);


//dteRequiredDate
    let currentDateForVDMin = new Date();
    dteRequiredDate.min = getCurrentDate2("date", currentDateForVDMin);

    let currentDateForVDMax = new Date();
    currentDateForVDMax.setDate(currentDateForVDMax.getDate() + 90);
    dteRequiredDate.max = getCurrentDate2("date", currentDateForVDMax);
    cmbProduct.disabled = true;
    const idArray = [cmbCustomerName, txtDiscountRatio, dteRequiredDate, txtTotalAmount, txtTAdvanceAmount, txtFBalanceAmount, txtDescription];
    setIDStyle(idArray, "1px solid #ced4da");
    disabledCButton(true, false);
    refreshInnerFormTable()
    txtTotalAmount.disabled = true;
    txtTotalAmount.value = 0.00
    txtDiscountRatio.value = 0.00
    corder.discount = parseFloat(txtDiscountRatio.value).toFixed(2);
    txtFBalanceAmount.value = 0.00;
    txtTAdvanceAmount.disabled = true;
    txtDiscountRatio.disabled = true;
}


document.getElementById("cmbCustomerName").addEventListener('change', () => {
    refreshInnerFormTable();
    getProductList();
})

function getProductList() {
    productsByCustomerOrder = getServiceRequest("/product/listbyCustomer/" + JSON.parse(cmbCustomerName.value).id);
    fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");

}

function formRefill() {

}

document.getElementById("cmbProduct").addEventListener('change', () => {
    getProductCost();
})

function getProductCost() {
    // productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerName.value).id);
    txtProductCost.value = JSON.parse(cmbProduct.value).price;
    txtProductCost.style.borderBottom = "2px solid  green";
    customerOrderHasProduct.product_cost = parseFloat(txtProductCost.value).toFixed(2);
    txtOrderedQuantity.disabled = false;
}

document.getElementById("txtOrderedQuantity").addEventListener('keyup', () => {
    getLineTotal();
});

function getLineTotal() {

    if (txtOrderedQuantity.value != 0) {
        let regpattern = new RegExp("^(([1-9][0-9]{0,3})|([1][0]{4}))$");
        if (regpattern.test(txtOrderedQuantity.value)) {
            //toFixed -round the string to a specifioed decimls
            //parseFloat - parses a string and returns the first number:
            customerOrderHasProduct.order_qty = parseFloat(txtOrderedQuantity.value);
            txtOrderedQuantity.style.borderBottom = "2px solid  green";
            customerOrderHasProduct.line_total = (parseFloat(customerOrderHasProduct.order_qty) * parseFloat(customerOrderHasProduct.product_cost)).toFixed(2);
            txtLinePrice.style.borderBottom = "2px solid  green";
            txtLinePrice.value = parseFloat(customerOrderHasProduct.line_total).toFixed(2);


            if (oldcustomerOrderHasProduct == null) {
                buttonInnerAdd.disabled = false;
            } else {
              //  buttonInnerUpdate.disabled = false;
            }

        } else {
            txtLinePrice.value = '';
            txtLinePrice.style.borderBottom = "2px solid red";
            customerOrderHasProduct.line_total = null;
            txtOrderedQuantity.value = '';
            txtOrderedQuantity.style.borderBottom = "2px solid red";
            customerOrderHasProduct.order_qty = null;
            buttonInnerAdd.disabled = true;
          //  buttonInnerUpdate.disabled = true;
        }
    } else {
        txtLinePrice.value = '';
        txtLinePrice.style.borderBottom = "2px solid #ced4da";
        customerOrderHasProduct.line_total = null;
        txtOrderedQuantity.value = '';
        txtOrderedQuantity.style.borderBottom = "2px solid #ced4da";
        customerOrderHasProduct.order_qty = null;
        buttonInnerAdd.disabled = true;
       // buttonInnerUpdate.disabled = true;
    }


}


let disabledCButton = (addbtn, updbtn) => {

    if (addbtn && lggeduserprivilage.ins) {
        buttonAdd.disabled = false;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "pointer");
    } else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "not-allowed");
    }

}

const refreshInnerFormTable = () => {
    /* inner Form */
    customerOrderHasProduct = new Object();
    oldcustomerOrderHasProduct = null;


  //  buttonInnerUpdate.disabled = true;


    if (cmbCustomerName.value != "") {
        productsByCustomerOrder = getServiceRequest("/product/listbyCustomer/" + JSON.parse(cmbCustomerName.value).id);
        fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
        cmbProduct.disabled = false;
    } else {
        products = getServiceRequest("/product/list")
        fillSelectFeild2(cmbProduct, "Select Product", products, "product_code", "p_name", "");
        cmbProduct.disabled = true;
    }


    restFormInput();
    txtLineTotal.value = "";
    txtLineTotal.style.borderBottom = "2px solid  #ced4da";
    txtTotalAmount.value = "";
    txtTotalAmount.style.borderBottom = "2px solid  #ced4da";
    txtDiscountRatio.value = "";
    txtDiscountRatio.style.borderBottom = "2px solid  #ced4da";
    txtTAdvanceAmount.value = "";
    txtTAdvanceAmount.style.borderBottom = "2px solid  #ced4da";

    txtDiscountRatio.disabled = false;
    txtDiscountRatio.style.borderBottom = "2px solid  #ced4da";
    txtDiscountRatio.value = "";

    /* Inner Table */
    let totalLineAmount = 0.00;
    let displayPropList = ['product_id.p_name', 'product_id.price', 'order_qty', 'line_total'];
    let disPPDTypeList = ['object', 'object', 'text', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableCustomerOrderHasProducts, corder.customerOrderHasProductList, displayPropList, disPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);

    //Hide view icon
    for (let index in corder.customerOrderHasProductList) {
        // parseFloat() parses a string and returns the first number:
        totalLineAmount = (parseFloat(totalLineAmount) + parseFloat(corder.customerOrderHasProductList[index].line_total)).toFixed(2);
        tableCustomerOrderHasProducts.children[1].children[index].children[5].children[2].style.display = "none";
    }


    if (totalLineAmount != 0.00) {
        //toFixed() converts a number to a string, rounded to a specified number of decimals:
        txtLineTotal.value = parseFloat(totalLineAmount).toFixed(2);
        corder.total_of_lines = txtLineTotal.value;
        txtDiscountRatio.disabled = false;
        checkValidPrice();


        if (oldcorder != null && corder.total_amount != oldcorder.total_amount) {
            txtLineTotal.style.borderBottom = "2px solid orange";
        } else {
            txtLineTotal.style.borderBottom = "2px solid green";
        }
    } else {
        txtDiscountRatio.disabled = true;
        txtDiscountRatio.style.borderBottom = "2px solid #ced4da"
    }



}

const restFormInput = () => {
    buttonInnerAdd.disabled = true;
    cmbProduct.style.borderBottom = "2px solid  #ced4da";

    txtProductCost.value = "";
    cmbProduct.style.borderBottom = "2px solid  #ced4da";
    txtProductCost.value = "";
    txtProductCost.disabled = true;
    txtProductCost.style.borderBottom = "2px solid  #ced4da";

    txtOrderedQuantity.value = "";
    txtOrderedQuantity.disabled = true;
    txtOrderedQuantity.style.borderBottom = "2px solid  #ced4da";

    txtLinePrice.value = "";
    txtLinePrice.disabled = true;
    txtLinePrice.style.borderBottom = "2px solid  #ced4da";
}

const rowDelete = (ob, rowno) => {
    // one row
    let deleteMsg = "Are you sure to delete following Customer order..?" +
        "\n Customer order no : " + ob.order_code +
        "\n Balance amount : " + ob.final_balanced_amount;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let serverResponce = getHTTPServiceRequest("/customerOrder", "DELETE", ob);

        if (serverResponce == "0") {
            alert("Delete Successfully...!");
            refreshCustomerOrderTable();
        } else {
            alert("Fail to Delete, You have following error... \n" + serverResponce);
        }
    }

}

function formRefillM() {

}

function rowDeleteM() {

}

function rowViewM() {

}




//Calculating Total amount
function checkValidPrice() {

    if (txtDiscountRatio.value != '') {
        let regpattern = new RegExp("^(([0-9][0-9]{0,7}[.][0-9]{2})|([0-9][0-9]{0,7}))$");
        if (regpattern.test(txtDiscountRatio.value)) {
            if (parseFloat(txtDiscountRatio.value) >= parseFloat(txtLineTotal.value)) {
                //console.log(txtDiscountRatio.value);
                txtTotalAmount.value = "";
                txtDiscountRatio.style.borderBottom = "2px solid red";
                txtTotalAmount.style.borderBottom = "2px solid  red";
                corder.discount = parseFloat(txtDiscountRatio.value).toFixed(2);
                corder.total_amount = null;
                return (alert("Maximum discount rate is exceeded"));

            } else {
                txtDiscountRatio.style.borderBottom = "2px solid green";
                corder.discount = parseFloat(txtDiscountRatio.value);
                corder.total_amount = (parseFloat(corder.total_of_lines) - parseFloat(corder.discount)).toFixed(2);
                txtTotalAmount.value = corder.total_amount;
                corder.advanced_amount = Math.round(parseFloat(corder.total_amount) * 0.25).toFixed(2);
                txtTAdvanceAmount.value = corder.advanced_amount;
                calculatingTotalAmount();
                txtTAdvanceAmount.style.borderBottom = "2px solid green"
                txtTotalAmount.style.borderBottom = "2px solid  green";
            }
        } else {
            txtDiscountRatio.style.borderBottom = "2px solid red";
            corder.discount = parseFloat(txtDiscountRatio.value).toFixed(2);
            corder.total_amount = corder.total_of_lines;
            txtTotalAmount.value = corder.total_amount;
        }


    } else {
        txtDiscountRatio.style.borderBottom = "2px solid #ced4da ";
        corder.total_amount = corder.total_of_lines;
        corder.discount = parseFloat(txtDiscountRatio.value).toFixed(2);
        txtTotalAmount.value = corder.total_amount;
    }

}

//onkeyup="textFeildValidtor(txtTAdvanceAmount,'^([1-9][0-9]{1,5}[.]{1}[0-9]{2})$','corder','advanced_amount','oldcorder');calculatingTotalAmount()"

document.getElementById("txtTAdvanceAmount").addEventListener('keyup', () => {
    if (txtTAdvanceAmount.value != '') {
        let regpattern = new RegExp("^(([1-9][0-9]{0,7}[.][0-9]{2})|([1-9][0-9]{0,7}))$");
        if (regpattern.test(txtTAdvanceAmount.value)) {
            if (parseFloat(corder.total_amount) >= parseFloat(txtTAdvanceAmount.value))
                txtTAdvanceAmount.style.borderBottom = "2px solid green";
            corder.advanced_amount = parseFloat(txtTAdvanceAmount.value).toFixed(2);
            calculatingTotalAmount();
        } else {
            txtTAdvanceAmount.style.borderBottom = "2px solid red";
            corder.advanced_amount = null;
            calculatingTotalAmount();
        }

    } else {
        txtTAdvanceAmount.style.borderBottom = "2px solid #ced4da";
        corder.advanced_amount = null;
        calculatingTotalAmount();

    }
});
// Calculation for final balance amount
const calculatingTotalAmount = () => {

    if (corder.total_amount != 0) {
        if (parseFloat(corder.total_amount) >= parseFloat(corder.advanced_amount)) {
            //round id .50 Math.round() nearest integer
            corder.final_balanced_amount = (parseFloat(corder.total_amount) - parseFloat(corder.advanced_amount)).toFixed(2);
            txtFBalanceAmount.style.borderBottom = "2px solid green";
            txtFBalanceAmount.value = corder.final_balanced_amount;
            corder.advanced_amount = txtTAdvanceAmount.value;
            txtTAdvanceAmount.disabled = true;
        } else {

            txtFBalanceAmount.style.borderBottom = "2px solid red";
            txtFBalanceAmount.value = "";
            corder.final_balanced_amount = null;
            txtTAdvanceAmount.disabled = true;

        }
    } else {
        txtFBalanceAmount.value = "";
        txtFBalanceAmount.style.borderBottom = "2px solid #ced4da";
        corder.final_balanced_amount = null;
        txtTAdvanceAmount.disabled = true;
    }
}
const buttonInnerAddMC = () => {

    let orderSet = false;

    for (let index in corder.customerOrderHasProductList) {
        if (corder.customerOrderHasProductList[index].product_id.id == customerOrderHasProduct.product_id.id) {
            orderSet = true;
            break;
        }
    }
    // let displayPropList = ['product_id.name', 'product_cost', 'order_qty', 'line_total', 'completed_qty',];
    if (!orderSet) {
        let confirmMs = "Are you sure to add following Product Details \n"
            + "\n Product Name : " + customerOrderHasProduct.product_id.p_name
            + "\n Product Cost : " + customerOrderHasProduct.product_cost
            + "\n Ordered Quantity : " + customerOrderHasProduct.order_qty
            + "\n Line Total : " + customerOrderHasProduct.line_total;
        let userResponce = window.confirm(confirmMs);

        if (userResponce) {
            corder.customerOrderHasProductList.push(customerOrderHasProduct);
            alert("Save Succecfully...!");

            refreshInnerFormTable();
            cmbCustomerName.disabled = true;

        }
    } else {
        alert("Product Allready ext...!");
        getProductList();
        restFormInput();
    }


}
function innerFormReFill(){}
// function buttonInnerUpdateMC() {
//
//     if (customerOrderHasProduct.line_total != oldcustomerOrderHasProduct.line_total || customerOrderHasProduct.product_id.p_name != oldcustomerOrderHasProduct.product_id.p_name) {
//         let updateInnerMsg = "Are you sure to update following Purchase order Material..?" +
//             "\n Product : " + customerOrderHasProduct.product_id.product_code +
//             "\n Line Total : " + customerOrderHasProduct.line_total;
//
//         let innerUpdateUserResponce = window.confirm(updateInnerMsg);
//
//         if (innerUpdateUserResponce) {
//
//             corder.customerOrderHasProductList[innerRowNo] = customerOrderHasProduct;
//             alert("Update Successfully...!");
//             refreshInnerFormTable();
//
//         }
//     } else
//         alert("Nothing Updated..!");
// }

//Inner Table modification
// const innerFormReFill = (innerob, rowind) => {
//     innerRowNo = rowind;
//     customerOrderHasProduct = JSON.parse(JSON.stringify(innerob));
//     oldcustomerOrderHasProduct = JSON.parse(JSON.stringify(innerob));
//
//     productsByCustomerOrder = getServiceRequest("/product/listbyCustomer/" + JSON.parse(cmbCustomerName.value).id);
//     fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", productsByCustomerOrder.product_id.product_code);
//     cmbProduct.disabled = true;
//
//
//     txtLinePrice.value = customerOrderHasProduct.line_total;
//     txtOrderedQuantity.value = customerOrderHasProduct.order_qty;
//     txtProductCost.value = customerOrderHasProduct.product_cost;
//     txtLinePrice.disabled = true;
//     txtLinePrice.style.borderBottom = "2px solid  orange";
//     txtOrderedQuantity.style.borderBottom = "2px solid  orange";
//     txtProductCost.style.borderBottom = "2px solid  orange";
//
//     buttonInnerAdd.disabled = true;
//     buttonInnerUpdate.disabled = false;
// }
const innerRowDelete = (innerob, rowind) => {

    let deleteMsg = "Are you sure to delete following Product..?" +
        "\n Product Name : " + innerob.product_id.p_name
        + "\n Line Price : " + innerob.line_total;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        corder.customerOrderHasProductList.splice(rowind, 1)
        alert("Delete Successfully...!");
        refreshInnerFormTable();
    }

}
const innerRowView = () => {
}

const checkErrors = () => {
    let errors = "";

    if (corder.customer_id == null) {
        errors = errors + "Customer Name is Not Selected \n";
    }
    if (corder.required_date == null) {
        errors = errors + "Required date is Not Selected \n";
    }
    if (corder.advanced_amount == null) {
        errors = errors + "Advanced Amount is Not Entered \n";
    }
    return errors;


}

function buttonSubmitMC() {
//need to check form errors
    let errors = checkErrors();

    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following... " +
            "\n Customer Order : " + corder.customer_id.customer_name +
            "\n Final Balance Amount : " + corder.final_balanced_amount;
        let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
            $.ajax("/customerOrder", {
                async: false,
                type: "POST",
                data: JSON.stringify(corder),
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
                refreshCustomerOrderForm();
                refreshCustomerOrderTable();
                $('#modalCustomerOrderForm').modal('hide');
            } else {
                window.alert("You have following error \n" + postServieResponce);
            }

        }
    } else {
        window.alert("You have following error \n" + errors);
    }
}

function buttonModalCloseMC() {
    buttonCloseModal("#modalCustomerOrderForm", refreshCustomerOrderForm)
}


function buttonModalCloseMCV() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {

        $("#modalViewCOrderForm").modal("hide");
    }
}

function buttonInnerClearMC() {
    refreshInnerFormTable();
}

function buttonClearMC() {
    refreshCustomerOrderForm();
}

// XXXXXXXXXXXXXXXXXXXXXXXX Print   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const rowView = (ob, rowno) => {


    //$("#modalViewCOrderForm").modal("show");
//as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.


    printCOrder = getServiceRequest("/customerOrder/getbyid/" + ob.id)


    tdCOCode.innerHTML = printCOrder.order_code;
    tdCName.innerHTML = printCOrder.customer_id.customer_name;
    tdReqDate.innerHTML = printCOrder.required_date;


    let dispalyPropertyList = ['product_id.p_name', 'product_cost', 'order_qty', 'completedqty', 'production_status_id.name', 'line_total'];
    //Property type list
    let dispalyPropertyDTList = ['object', 'text', 'text', 'text', 'object', 'text'];

    fillDataIntoTable(tableInnerCustomerOrderHasProducts, printCOrder.customerOrderHasProductList, dispalyPropertyList, dispalyPropertyDTList, formRefillM, rowDeleteM, rowViewM, false, lggeduserprivilage);
    tdTotalofLines.innerHTML = parseFloat(printCOrder.total_of_lines).toFixed(2);
    tdTotalAmount.innerHTML = parseFloat(printCOrder.total_amount).toFixed(2);
    tdAdvanceAmout.innerHTML = parseFloat(printCOrder.advanced_amount).toFixed(2);
    tdBalanceAmount.innerHTML = parseFloat(printCOrder.final_balanced_amount).toFixed(2);

    let modalBodyValue = document.getElementById("modalBodyCOrderForm").innerHTML;
    let modalFooterValue = document.getElementById("modalFooterCOrderForm").innerHTML;
    let windowHeadvalues = `
<html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">


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



</head>
<body>`;

    let htmlfooterlinkvalues = `

<script src="/app-assets/vendors/js/vendors.min.js" type="text/javascript"></script>

<script src="/app-assets/js/core/app-menu.js" type="text/javascript"></script>
<script src="/app-assets/js/core/app.js" type="text/javascript"></script>


<script src="/resources/datatable/js/datatables.min.js" type="text/javascript"></script>

<script src="/resources/bootstrap/js/bootstrap.bundle.min.js" type="text/javascript"></script>


<script src="/corder.js" type="text/javascript"></script>

</body>
</html>`;

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(windowHeadvalues+`<div class="row card" style="margin:10px;">${modalBodyValue} <br><br><div id="printButtonDiv" >${modalFooterValue}</div></div>`+htmlfooterlinkvalues);
    newWindow.document.close();




}
