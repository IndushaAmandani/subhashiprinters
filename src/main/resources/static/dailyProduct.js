

window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=DailyProduct");

    refreshdailyProductTable();
    refreshdailyProductForm();
}

function refreshdailyProductTable() {
    //create array for stor data
    dailyProduct = new Array();
    dailyProduct = getServiceRequest("/dailyProduct/findall");

    //create display property list
 let dispalyPropertyList = ['customer_order_id.order_code','product_id.p_name', 'totalqty', 'completedqty','dailyqty','new_balance_qty'];
    //Property type list
    let dispalyPropertyDTList = [ 'object', 'object', 'text', 'text', 'text','text' ];



    //called filldataintotable function for fill data
    fillDataIntoTable(tableDailyProduct,dailyProduct,dispalyPropertyList,dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);
    // need to add jquerty table
    $('tableDailyProduct').dataTable();




    //Hide view icon
    for (let index in dailyProduct) {
        tableDailyProduct.children[1].children[index].children[7].children[0].style.display = "none";
        tableDailyProduct.children[1].children[index].children[7].children[2].style.display = "none";
    }
}

function refreshdailyProductForm(){
    dailyP = new Object();
    olddailyP = null;

    customerOrder = getServiceRequest("/customerOrder/list")
   fillSelectFeild( cmbCustomerOrder,"Select Customer Order",customerOrder,"order_code","")

    productset = getServiceRequest("/product/list")
    fillSelectFeild2(cmbProduct,"Select Product",productset,"product_code","p_name","")


    txtTotalQuantity.disabled = true;
    txtcompletedQuantity.disabled =true;
    txtPreBalanceQuantity.disabled=true;
    let x = 0;

    txtNewBalanceQuantity.disabled=true;

}


function getProductList() {
    productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerOrder.value).id);
    fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
}

function getCOPQty() {
    customerOrderProduct = getServiceRequest("/customerOrderHasproduct/orderedQtyBycoidPid/" + JSON.parse(cmbCustomerOrder.value).id +"/"+ JSON.parse(cmbProduct.value).id )
    txtTotalQuantity.value = customerOrderProduct.order_qty;
     dailyP.totalqty = txtTotalQuantity.value;

    txtcompletedQuantity.value = customerOrderProduct.completedqty;
    dailyP.completedqty = txtcompletedQuantity.value;

    txtPreBalanceQuantity.value = parseInt(txtTotalQuantity.value) - parseInt(txtcompletedQuantity.value);
    dailyP.pre_balance_qty = txtPreBalanceQuantity.value;
    txtNewBalanceQuantity.style.borderbottomstyle= green;


}

function getBalanceAmount(){

    let pattern = new RegExp("^[1-9][0-9]{0,5}$");
    if(pattern.test(txtDailyQuantity.value)){
        if((txtPreBalanceQuantity.value >= txtDailyQuantityvalue.value) && (txtDailyQuantity.value>0) ){
            txtNewBalanceQuantity.value = parseInt(txtPreBalanceQuantity.value) - parseInt(txtDailyQuantity.value);
            dailyP.new_balance_qty = txtNewBalanceQuantity.value;
            txtNewBalanceQuantity.style.borderbottomstyle = green;
        }

    } else{

        txtNewBalanceQuantity.style.borderbottomstyle = red;
    }

}
function formRefill(){}
function rowDelete(){}
function rowView(){}

function buttonSubmitMC() {
    console.log("Add Daily Product ")

//need to check form errors
    let errors = checkErrors();

    if(errors == ""){
        let submitConfirmMsg  = "Are you sure to add following... " +
            "\n Daily Product Id : " + dailyProduct.id +
            "\n Customer Full Name : " + dailyProduct.customer_name +
            "\n Product Name : " + dailyProduct.product_id.p_name ;
        let userResponce = window.confirm(submitConfirmMsg);

        if(userResponce){
            let postServieResponce ;
            $.ajax("/dailyProduct",{
                async : false,
                type : "POST",
                data : JSON.stringify(customer),
                contentType :"application/json",
                success: function (susResdata,susStatus,ajresob){
                    postServieResponce = susResdata;
                },
                error: function(errRsOb, errStatus, errorMsg) {
                    postServieResponce = errorMsg;
                }

            });

            if(postServieResponce == "0"){

                alert("Add Successfull..!");
                refreshdailyProductTable();
                refreshdailyProductTable;
                $('modalDailyForm').modal('hide');
            }else {
                window.alert("You have following error \n" + postServieResponce);
            }


        }else{

            alert("Form have following errors \n" + errors);
        }
    }else{
        window.alert("You have following error \n"+ errors);
    }
}
function checkErrors(){}