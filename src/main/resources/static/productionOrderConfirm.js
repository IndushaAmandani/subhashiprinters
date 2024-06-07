window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=CustomerOrder");

    refreshtablePendingCOrder();

}

function refreshtablePendingCOrder() {
    //create array for stor data
    productoinOrders = new Array();
    productoinOrders = getServiceRequest("/productoinOrderConfirm/findbyStatus");


    //create display property list
    let dispalyPropertyList = ['order_code', 'customer_id.customer_name', 'customer_id.customer_code', 'production_status_id.name'];
    //Property type list
    let dispalyPropertyDTList = ['text', 'object', 'object', 'object'];

    //called filldataintotable function for fill data
    fillDataIntoTable(productionOrderConfirmTable, productoinOrders, dispalyPropertyList, dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);

    for (let index in productoinOrders) {
        productionOrderConfirmTable.children[1].children[index].children[5].children[2].style.display = "none";
        productionOrderConfirmTable.children[1].children[index].children[5].children[1].style.display = "none";
        productionOrderConfirmTable.children[1].children[index].children[5].children[0].innerHTML = "Confirmed";
        productionOrderConfirmTable.children[1].children[index].children[5].children[0].innerHTML = "Confirmed";
        productionOrderConfirmTable.children[1].children[index].children[5].children[0].style.backgroundColor = "lightblue";

// #ffff66
    }

    // need to add jquerty table
    $("#productionOrderConfirmTable").dataTable();


}




const refreshInnerFormTable = () => {

    /* Inner Table */

    //product name,product cost,width,height,quantity
    let displayPropList = ['product_id.p_name','order_qty',];
    let disPPDTypeList = ['object','text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tablePendingCustomerOrder, pOrders.customerOrderHasProductList, displayPropList, disPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, false, innerlogedUserPrivilage);





}
function innerFormReFill() {

}

function innerRowDelete() {

}

function innerRowView() {

}
const rowDelete = () => {
}
const formRefill = (ob, rowno) => {


    pOrders = getServiceRequest("/productoinOrderConfirm/getbyid/" + ob.id);

    pStatuses = getServiceRequest("/productionStatus/list");
    fillSelectFeild(cmbOrderStatus,"Select Statuses",pStatuses,"name","Accepted","")
    pOrders.production_status_id = JSON.parse(cmbOrderStatus.value);


    //set value into fields
    txtName.value = pOrders.customer_id.customer_name;
    txtOrderCodeNo.value = pOrders.order_code;
    dteRequiredDate.value = pOrders.required_date;


    dteAcceptedDate.value = getCurrentDate();
    pOrders.confirmdate =  dteAcceptedDate.value;

    dteAcceptedDate.style.borderBottom ="2px solid green";
    refreshInnerFormTable();
    $("#modalProductionOrderForm").modal("show");


    let allMaerials = new Array();
     pOrders.customerOrderHasMaterialList = new Array();

    for (let index in pOrders.customerOrderHasProductList){
        let requiredMaterials = pOrders.customerOrderHasProductList[index].product_id.productHasMaterialList;
        console.log(requiredMaterials)
        for(let matInd in requiredMaterials){
            let allMat = new Object();
            allMat.material_id = requiredMaterials[matInd].material_id;
            allMat.required_quantity = parseFloat(requiredMaterials[matInd].quantity) * parseFloat(pOrders.customerOrderHasProductList[index].order_qty);
            allMaerials.push(allMat);
        }
    }


    let displayPropList = ['material_id.name','required_quantity',];
    let disPPDTypeList = ['object','text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableRequiredMaterial, allMaerials, displayPropList, disPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, false, innerlogedUserPrivilage);



    let allmatwithoutduplicate = new Array();

    for (let i=0 ; i<allMaerials.length; i++ ){
        //--- 0
        for (let j= i+1; j<allMaerials.length ; j++){
            //-- 1

            if(allMaerials[i].material_id.name == allMaerials[j].material_id.name){
                allMaerials[i].required_quantity = parseFloat(allMaerials[i].required_quantity) + parseFloat(allMaerials[j].required_quantity)
            }

        }

        if(allmatwithoutduplicate.length !=0 ){
            let ext =false;
            for(let k= 0; k<allmatwithoutduplicate.length ; k++){
                if(allmatwithoutduplicate[k].material_id.name == allMaerials[i].material_id.name) {
                    ext = true;
                    break
                }
            }
            if (!ext){
                allmatwithoutduplicate.push(allMaerials[i]);
            }
        }else {
            allmatwithoutduplicate.push(allMaerials[i]);
        }


    }

    console.log(allmatwithoutduplicate);
    for (let index in allmatwithoutduplicate){
        let materialid = allmatwithoutduplicate[index].material_id.id;
        let requiredmaterials = getServiceRequest("/materialInventory/bymaterial/"+materialid);
        allmatwithoutduplicate[index].available_quantity = requiredmaterials.avaqty;
    }

    pOrders.customerOrderHasMaterialList  = allmatwithoutduplicate;


    let comdisplayPropList = ['material_id.name','required_quantity','available_quantity'];
    let comdisPPDTypeList = ['object','text','text'];
    let cominnerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableAvailableMaterial, pOrders.customerOrderHasMaterialList, comdisplayPropList, comdisPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, false, cominnerlogedUserPrivilage);

    let canaccept = true;
    for(let index in pOrders.customerOrderHasMaterialList){
        if(pOrders.customerOrderHasMaterialList[index].available_quantity < pOrders.customerOrderHasMaterialList[index].required_quantity){

            tableAvailableMaterial.children[1].children[index].style.backgroundColor = "red";
            canaccept= false;
        }
    }

    if(canaccept){
        buttonAdd.disabled = false;
    }else {
        buttonAdd.disabled = true;
    }




}


const rowView = () => {
}


function buttonSubmitMC(){
    let confirmMs = "Are you acceptig t he product to the production?"
    let userResponce = window.confirm(confirmMs);


    if (userResponce) {
        alert("Save Succecfully...!");
        refreshInnerFormTable();

    }
}



function buttonModalCloseMC() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        refreshInnerFormTable();
        $("#modalProductionOrderForm").modal("hide");
    }
}


