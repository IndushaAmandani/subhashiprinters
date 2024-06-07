

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
    $("tableDailyProduct").dataTable();




    //Hide view icon
    for (let index in dailyProduct) {
        tableDailyProduct.children[1].children[index].children[7].children[0].style.display = "none";
        tableDailyProduct.children[1].children[index].children[7].children[1].style.display = "none";
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
   const  idArray = [cmbCustomerOrder,cmbProduct,txtTotalQuantity,txtcompletedQuantity,txtPreBalanceQuantity,txtDailyQuantity,txtNewBalanceQuantity]
    setIDStyle(idArray,"1px solid #ced4da");
    txtNewBalanceQuantity.disabled=true;
    disabledButton(true, false);

}



function getProductList() {

    productsByCustomerOrder = getServiceRequest("/product/listbyCOrder/" + JSON.parse(cmbCustomerOrder.value).id);
    fillSelectFeild2(cmbProduct, "Select Product", productsByCustomerOrder, "product_code", "p_name", "");
}

function getCOPQty() {
    customerOrderProduct = getServiceRequest("/customerOrderHasproduct/orderedQtyBycoidPid/" + JSON.parse(cmbCustomerOrder.value).id +"/"+ JSON.parse(cmbProduct.value).id );
    txtTotalQuantity.value = customerOrderProduct.order_qty;
     dailyP.totalqty = txtTotalQuantity.value;
    txtTotalQuantity.style.borderBottom = "2px solid green";

    txtcompletedQuantity.value = customerOrderProduct.completedqty;
    dailyP.completedqty = txtcompletedQuantity.value;
    txtcompletedQuantity.style.borderBottom = "2px solid green";
    setValue();

}

function setValue() {
    txtPreBalanceQuantity.value = parseInt(txtTotalQuantity.value)- parseInt(txtcompletedQuantity.value);
    dailyP.pre_balance_qty = txtPreBalanceQuantity.value;
    txtPreBalanceQuantity.style.borderBottom = "2px solid green";
}

function getBalanceAmount(){
    if (txtDailyQuantity.value != "") {
        let pattern = new RegExp("^[1-9][0-9]{0,8}$");
        if (pattern.test(txtDailyQuantity.value)) {
            if(parseInt(txtPreBalanceQuantity.value) >= parseInt(txtDailyQuantity.value)) {
                txtNewBalanceQuantity.value = parseInt(txtPreBalanceQuantity.value) - parseInt(txtDailyQuantity.value);
                dailyP.new_balance_qty = txtNewBalanceQuantity.value;
                dailyP.dailyqty = txtDailyQuantity.value;
                txtNewBalanceQuantity.style.borderBottom="2px solid green";
                txtNewBalanceQuantity.style.borderBottom = "2px solid green";
                buttonAdd.disabled = false;
            }else {
                txtDailyQuantity.style.borderBottom = "2px solid red";
                txtNewBalanceQuantity.style.borderBottom = "2px solid red";
                // txtDailyQuantity.value = "";
                // txtDailyQuantity.value = "";
                dailyP.dailyqty = null;
                dailyP.new_balance_qty = null;
                buttonAdd.disabled = false;

            }
        } else {
            txtDailyQuantity.style.borderBottom = "2px solid red";
            txtNewBalanceQuantity.style.borderBottom ="2px solid red";
            // txtDailyQuantity.value = "";
            // txtDailyQuantity.value = "";
            dailyP.dailyqty = null;
            dailyP.new_balance_qty = null;
            buttonAdd.disabled = true;

        }
    }else {
        txtDailyQuantity.style.borderBottom = "2px solid red";
        txtDailyQuantity.style.borderBottom = "2px solid red";
        // txtDailyQuantity.value = "";
        // txtDailyQuantity.value = "";
        dailyP.dailyqty = null;
        dailyP.new_balance_qty = null;
        buttonAdd.disabled = true;
    }
}
function formRefill(){}


const rowDelete = (ob, row) => {
    // let deleteMsg = "Are you surely want to delete following Product..? \n" + ob.p_name;
    //
    // let serverResponce = window.confirm(deleteMsg);
    // if (serverResponce) {
    //     let serverResponce;
    //     serverResponce = getHTTPServiceRequest("/dailyProduct", "DELETE", ob);
    //     if (serverResponce == "0") {
    //         alert("Delete Successfully... !");
    //         refreshTable();
    //
    //     } else {
    //         alert("Fail to Delete,You have folowing error .. \n" + serverResponce);
    //
    //     }
    //
    // }
}


function buttonSubmitMC() {

//need to check form errors
    let errors = checkErrors();

    if(errors == ""){
        let submitConfirmMsg  = "Are you sure to add following... " +

            "\n Customer Full Name : " + dailyP.customer_order_id.order_code +
            "\n Product Name : " + dailyP.product_id.p_name ;
        let userResponce = window.confirm(submitConfirmMsg);

        if(userResponce){
            let postServieResponce ;
            $.ajax("/dailyProduct",{
                async : false,
                type : "POST",
                data : JSON.stringify(dailyP),
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
                refreshdailyProductForm();
                $("#modalDailyForm").modal("hide");
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
function checkErrors(){
let errors = "";
    if (dailyP.customer_order_id == null) {
        errors = errors + "Customer Order is not selected \n";
    }   
    if (dailyP.product_id == null) {
        errors = errors + "Customer Order is not selected \n";
    }
    if (dailyP.dailyqty == null) {
        errors = errors + "Daily quantities  is not entered\n";
    }
    return errors;
}

function buttonModalCloseMC() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        refreshdailyProductForm();
        $("#modalDailyForm").modal("hide");
    }
}

//View

function buttonModalCloseMCV() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {

        $("#modalViewDailyPForm").modal("hide");
    }
}

function printRowItemMC() {
    let newWindow = window.open();
    newWindow.document.write("<link rel='stylesheet' href= 'resources/bootstrap/css/bootstrap.min.css'>"+"<h2>Daily Product Details</h2>" + "<div>"+tablePrintDailyP.outerHTML +"</div>");
    setTimeout(function () {
        newWindow.print();
        newWindow.close();
    },1000);
}

const rowView = (ob,rowind) => {
    $("#modalViewDailyPForm").modal("show");

//as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.



    tdCOrderCode.innerHTML = ob.customer_order_id.order_code;
    tdProduct.innerHTML = ob.product_id.p_name;
    tdTQuantity.innerHTML = ob.totalqty;
    tdCQuantity.innerHTML = ob.completedqty;
    tdDQuantity.innerHTML = ob.dailyqty;
    tdNewBQuantity.innerHTML = ob.new_balance_qty;
}

