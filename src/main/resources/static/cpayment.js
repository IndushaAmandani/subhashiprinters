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
    cpayments = new Array();
    cpayments = getServiceRequest("cpayment/findall");

    let displayPropList = ['customer_payment_bill_number','customer_id.customer_name','total_amount','after_balance_amount','customer_payment_status_id.name'];
    let displayPropDataTypeList = ['object','object','text','text','object'];

    fillDataIntoTable(tableCustomerPayment,cpayments,displayPropList,displayPropDataTypeList,refillForm,deleteRow,viewRow,true,lggeduserprivilage);
    $("tableCustomerPayment").dataTable();
}

const  refreshCPaymentForm = () =>{
    cpayments = new Array();
    oldcpayments =null;





}
const refillForm = () =>{}
const deleteRow = () =>{}
const viewRow = () =>{}