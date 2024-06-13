//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=ProductCategory");
    console.log(lggeduserprivilage);
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshProductCategoryTable();

// called refreshproductForm function
    refreshProductCategoryForm();


}

function refreshProductCategoryTable(){

}

function refreshProductCategoryForm(){
productCategory = new Object();
    oldproductCategory = null;


}

function refreshInnerPChasMaterialForm(){
    pCategoryHasMaterial = new Object();
    oldpCategoryHasMaterial = null;
}

function buttonModalClosePCMC(){
    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {

        $("#modalProductCategoryForm").modal("hide");
    }
}