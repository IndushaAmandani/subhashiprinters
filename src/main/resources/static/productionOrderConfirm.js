

window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=CustomerOrder");

    refreshtablePendingCOrder();

}

function refreshtablePendingCOrder() {
    //create array for stor data
    productoinOrders = new Array();
    productoinOrders = getServiceRequest("/productoinOrderConfirm/findall");

    //create display property list
 let dispalyPropertyList = [ 'order_code','customer_id.customer_name','customer_id.customer_code','production_status_id.name'];
    //Property type list
 let dispalyPropertyDTList = [ 'text','object' ,'object', 'object'];

    //called filldataintotable function for fill data
  fillDataIntoTable(productionOrderConfirmTable,productoinOrders,dispalyPropertyList,dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);

    for (let index in productoinOrders ){
        productionOrderConfirmTable.children[1].children[index].children[5].children[2].style.display = "none";
        productionOrderConfirmTable.children[1].children[index].children[5].children[1].style.display = "none";
            productionOrderConfirmTable.children[1].children[index].children[5].children[0].innerHTML = "Accepted";
            productionOrderConfirmTable.children[1].children[index].children[5].children[0].style.backgroundColor = "lightblue";

    }

  // need to add jquerty table
    $('#productionOrderConfirmTable').dataTable();



}

function refreshPOrderConfirmForm() {


    pOcn = new Array();
    pOcn = getServiceRequest("/productoinOrderConfirm/findall")

    txtName.value = pOcn.customer_id.customer_name;
    txtOrderCodeNo.value= pOcn.customer_id.customer_code;





}


function getProductList() {
    productsByCustomerOrder = getServiceRequest("/product/listbyCustomer/" + JSON.parse(cmbCustomerName.value).id);
    fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
}


function getProductCost() {
    //productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerName.value).id);
    txtProductCost.value = JSON.parse(cmbProduct.value).price;
    txtProductCost.style.borderBottom = "2px solid  green";
    customerOrderHasProduct.product_cost = txtProductCost.value;
}
/*
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



}*/






const refreshInnerFormTable = () => {
    /* inner Form */
    customerOrderHasProduct = new Object();
    oldcustomerOrderHasProduct = null;

    buttonInnerAdd.disabled = true;
    buttonInnerUpdate.disabled = true;



    if (cmbCustomerName.value != "") {
        productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerName.value).id);
        fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
        cmbProduct.disabled = false;
    } else {
        products = getServiceRequest("/product/list")
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

const rowDelete = () => {
}
const rowView = () => {
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
            cmbCustomerName.disabled = true;

        }
    } else {
        alert("Product Allready ext...!")
    }


}


