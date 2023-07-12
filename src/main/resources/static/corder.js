

window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=CustomerOrder");

    refreshCustomerOrderTable();
    refreshCustomerOrderForm();
}

function refreshCustomerOrderTable() {
    //create array for stor data
    customerOrder = new Array();
    customerOrder = getServiceRequest("/customerOrder/findall");

    //create display property list
//  let dispalyPropertyList = [ '', 'name', 'mobile', 'customer_email', 'customer_category_id.name','customer_type_id.name','customerstatus_id.name'];
    //Property type list
  //  let dispalyPropertyDTList = [ 'text', 'text', 'text', 'text', 'object', 'object', 'object'];

    //called filldataintotable function for fill data
 //  fillDataIntoTable(tableCOrder,customerOrder,dispalyPropertyList,dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);
    // need to add jquerty table
   // $('tableCOrder').dataTable();



}

function refreshCustomerOrderForm() {
    corder = new Object();
    oldcorder = null;


    corder.customerOrderHasProductList = new Array();


    customers = getServiceRequest("/customer/list")
    fillSelectFeild(cmbCustomerName, "Select Customer", customers, "customer_name", "");


    cOrdrStatus = getServiceRequest("/cOrderstatus/list")
    fillSelectFeild(cmbOrderStatus, "Select Status", cOrdrStatus, "name", "Active",true);
    disabledButton(true , false);
//dteRequiredDate
    let currentDateForVDMin = new Date();
    dteRequiredDate.min = getCurrentDate2("date", currentDateForVDMin);

    let currentDateForVDMax = new Date();
    currentDateForVDMax.setDate(currentDateForVDMax.getDate() + 90);
    dteRequiredDate.max = getCurrentDate2("date", currentDateForVDMax);

    refreshInnerFormTable()
}


function getProductList() {
    productsByCustomerOrder = getServiceRequest("/product/listbyCustomer/" + JSON.parse(cmbCustomerName.value).id);
    fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
}
function formRefill(){}
function getProductCost() {
    //productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerName.value).id);
    txtProductCost.value = JSON.parse(cmbProduct.value).price;
    txtProductCost.style.borderBottom = "2px solid  green";
    customerOrderHasProduct.product_cost = txtProductCost.value;
}

function getLineTotal() {
    if (txtOrderedQuantity.value != 0) {
        let regpattern = new RegExp("^[0-9]{1,4}$");
        if (regpattern.test(txtOrderedQuantity.value)) {
            //toFixed -Convert number to a string
            //parseFloat - parses a string and returns the first number:
            txtLinePrice.value = (parseFloat(txtOrderedQuantity.value) * parseFloat(txtProductCost.value)).toFixed(2);
            txtLinePrice.style.borderBottom = "2px solid  green";
            customerOrderHasProduct.line_total = txtLinePrice.value;
            if (oldcustomerOrderHasProduct == null)
                buttonInnerAdd.disabled = false; else buttonInnerUpdate.disabled = false;
        } else {
            txtLinePrice.style.borderBottom = "2px solid red";
            customerOrderHasProduct.order_qty = null;
            buttonInnerAdd.disabled = true;
            buttonInnerUpdate.disabled = true;
        }
    } else {
        txtLinePrice.style.borderBottom = "2px solid red";
        customerOrderHasProduct.order_qty = null;
        buttonInnerAdd.disabled = true;
        buttonInnerUpdate.disabled = true;
    }



}






const refreshInnerFormTable = () => {
    /* inner Form */
    customerOrderHasProduct = new Object();
    oldcustomerOrderHasProduct = null;

    buttonInnerAdd.disabled = true;
    buttonInnerUpdate.disabled = true;


    products = getServiceRequest("/product/list")
    if (cmbCustomerName.value != "") {
        productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerName.value).id);
        fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
    } else {
        fillSelectFeild(cmbProduct, "Select Product", products, "product_code", "p_name", "");
        cmbProduct.disabled = false;
    }



    txtProductCost.value ="";


    cmbProduct.style.borderBottom = "2px solid  #ced4da";
    cmbProduct.disabled = true;

    txtProductCost.value = "";
    txtProductCost.disabled = true;
    txtProductCost.style.borderBottom = "2px solid  #ced4da";

    txtOrderedQuantity.value = "";
    txtOrderedQuantity.style.borderBottom = "2px solid  #ced4da";

    txtLinePrice.value = "";
    txtLinePrice.disabled = true;
    txtLinePrice.style.borderBottom = "2px solid  #ced4da";



    /* Inner Table */
    let totalLineAmount = 0.00;
    let displayPropList = ['product_id.p_name', 'product_id.price', 'order_qty', 'line_total', 'completed_qty',];
    let disPPDTypeList = ['object', 'object', 'text', 'text', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableCustomerOrderHasProducts, corder.customerOrderHasProductList, displayPropList, disPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);

    //Hide view icon
    for (let index in corder.customerOrderHasProductList) {
        // parseFloat() parses a string and returns the first number:
        totalLineAmount = parseFloat(totalLineAmount)+ parseFloat(corder.customerOrderHasProductList[index].line_total);
        tableCustomerOrderHasProducts.children[1].children[index].children[6].children[2].style.display = "none";
    }


    if (totalLineAmount != 0.00) {
        //toFixed() converts a number to a string, rounded to a specified number of decimals:
        txtLineTotal.value = parseFloat(totalLineAmount).toFixed(2);
        corder.total_of_lines = txtLineTotal.value;

        if (oldcorder != null && corder.total_amount != oldcorder.total_amount) {
            txtLineTotal.style.borderBottom = "2px solid orange";
        } else {
            txtLineTotal.style.borderBottom = "2px solid green";
        }
    }

}


function checkValidPrice(){
    if(txtDiscountRatio.value >= txtLineTotal.value ){
        txtDiscountRatio.style.borderBottom = "2px solid red";


    }else {
        txtTotalAmount =   parseFloat(txtLineTotal) - parseFloat(txtDiscountRatio);
        corder.total_of_lines=txtTotalAmount.value;
        txtTotalAmount.style.borderBottom = "2px solid green";

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

        }
    } else {
        alert("Product Allready ext...!")
    }


}
const innerFormReFill = (innerob, rowind) => {
    innerRowNo = rowind;
    customerOrderHasProduct = JSON.parse(JSON.stringify(innerob));
    oldcustomerOrderHasProduct = JSON.parse(JSON.stringify(innerob));

    productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerName.value).id);
    fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
    cmbProduct.disabled = true;

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
const innerRowDelete = (innerob, rowind) => {

}


const innerRowView = () => {
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
    if(updbtn && lggeduserprivilage.upd){
        buttonUpdate.disabled = false;
        $("#buttonUpdate").css("pointer-events","all");
        $("#buttonUpdate").css("cursor","pointer");
    }else {
        buttonUpdate.disabled = true;
        $("#buttonUpdate").css("pointer-events","all");
        $("#buttonUpdate").css("cursor","not-allowed");
    }

}