//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Privilage");
    $('[data-toggle="tooltip"]').tooltip();
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshTable();

// called refreshproductForm function
    refreshPrivilageForm();


}


//define refresh table function
const refreshTable = () => {

    privileges = getServiceRequest("/privilage/findall");


    let displayPropList = ['role_id.name','module_id.name','slect','insrt','updt','deltt'];
    let displayPropDataTypeList = ['object','object',getSelectPri,getInsertPri,getUpdatePri,getDeletePri];

    fillDataIntoTable(tablePrivilage,privileges,displayPropList,displayPropDataTypeList,refillForm,deleteRow,viewRow,true,lggeduserprivilage);
    $("tablePrivilage").dataTable();

}
//privilage- slect,insrt,updt,updt,deltt

const getSelectPri = (ob)=>{
    let selectPri ="Not Granted";
    if(ob.slect){
    selectPri=  "Granted";
}
    return selectPri;
}

const getInsertPri = (ob) =>{
let insertPri = "Not Granted";
if(ob.insrt){
    insertPri = "Granted"
}
return insertPri;
}
const getUpdatePri = (ob ) =>{
    let updatePri = "Not Granted";
    if(ob.updt){
        updatePri = "Granted";
    }
    return updatePri;
}

const getDeletePri = (ob) => {
    let deletPri = "Not Granted";
    if(ob.deltt){
        deletPri = "Granted";
    }
    return deletPri;
}
const refillForm = () =>{}
const deleteRow = (empob) =>{
let deleteMsg = "Are you sure want to delete following privilage details\n"
        +"Role :" + empob.role_id.name
        + "\n Module :" + empob.module_id.name;

let userDeleteResponce= window.confirm(deleteMsg);

if(userDeleteResponce){
    let deleteServiceResponce = getHTTPServiceRequest("/privilage","DELETE",empob);
    if(deleteServiceResponce == "0"){
        alert("Delete Successfully...!")
        refreshTable();
    }else{
        alert("You have following error...!\n" + deleteServiceResponce);
    }
}
}
const viewRow = () =>{}

const refreshPrivilageForm = () =>{



};