window.addEventListener("load", refreshUI);


/// browser refresh function
function refreshUI() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Supplier");

    refreshTable();
//    refreshSupplierForm();
}

// Create function for refresh table
const refreshTable = ()=>{

    suppliers = new Array();
    suppliers = getServiceRequest("/supplier/findall"); //

    //call filldataintotablefunction
    // fillDataIntoTable(tableid , dataList,displayPropertyList , dpDataTypeList,formrefillfunctionname,
    // rowdeletefunctionname, rowviewfunctonname, buttonvisibility , buttonsprivilages)
    let displayPropertyList =  ['reg_no','company_name','company_email','company_contact_no','materials','supplier_status_id.name'];
    let dpDataTypeList = ['text','text','text','text',getSupplyMaterialName,'object'];
    fillDataIntoTable(tableSupplier,suppliers,displayPropertyList,dpDataTypeList,reFillItemForm , deleteItemRow , viewItemRow, true, lggeduserprivilage);

    for(let index in suppliers){
        if(suppliers[index].supplier_status_id.name == "Removed"){
            tableSupplier.children[1].children[index].style.backgroundColor = "pink";

            tableSupplier.children[1].children[index].children[7].children[1].disabled = true;
            tableSupplier.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableSupplier.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    $("#tableSupplier").dataTable();
}


// create function for get sales price
function getSupplyMaterialName(ob){
    let supplyIMaterialList = getServiceRequest("/material/listbysupplier/"+ob.id)
    let materialName = "";
    for(let ind in supplyIMaterialList){
        if(supplyIMaterialList.length -1 == ind){
            materialName = materialName + supplyIMaterialList[ind].name ;
        }else
            materialName = materialName + supplyIMaterialList[ind].name + " ,";
    }

    return materialName;
}


const refreshSupplierForm = ()=> {

    newSupplier = new Object();
    oldSupplier = null;

    // need to fill data into dropdown element

    supplierStatuses = getServiceRequest("/supplierstatus/list");
    fillSelectFeild(selectSupplierStatus,"Select Supplier Status" , supplierStatuses ,"name","Active");
    newSupplier.supplierstatus_id = JSON.parse(selectSupplierStatus.value);
    selectSupplierStatus.style.borderBottom = "2px solid green";
    selectSupplierStatus.disabled = true;

    // clear input feilds
    textSupplierName.value = "";
    textSupplierName.style.borderBottom = "1px solid #ced4da";
    textEmail.value = "";
    textEmail.style.borderBottom = "1px solid #ced4da";
    textContactNo.value = "";
    textContactNo.style.borderBottom = "1px solid #ced4da";

    newSupplier.itemList = new Array();

    allitemList = getServeiceRequst("/item/list");
    fillSelectFeild(selectItem,"" , allitemList ,"itemname","");

    //fillSelectFeild(selectSelectedItem,"" , newSupplier.itemList ,"itemname","");



}

function buttonAddByOne() {
    let selectedItem = JSON.parse(selectItem.value);
    newSupplier.itemList.push(selectedItem);
    fillSelectFeild(selectSelectedItem,"" , newSupplier.itemList ,"itemname","");

    for (let index in allitemList){
        if(allitemList[index]['itemname'] == selectedItem.itemname){
            allitemList.splice(index,1);
            break;
        }
    }
    fillSelectFeild(selectItem,"" , allitemList ,"itemname","")

}
function buttonAddByAll() {
    for(let index in allitemList){
        newSupplier.itemList.push(allitemList[index]);
    }
    fillSelectFeild(selectSelectedItem,"" , newSupplier.itemList ,"itemname","");

    allitemList = [];
    fillSelectFeild(selectItem,"" , allitemList ,"itemname","");
}

function buttonRemoveByOne() {
    let selectedItem = JSON.parse(selectSelectedItem.value);
    allitemList.push(selectedItem);
    fillSelectFeild(selectItem,"" , allitemList ,"itemname","")


    for (let index in newSupplier.itemList){
        if(newSupplier.itemList[index]['itemname'] == selectedItem.itemname){
            newSupplier.itemList.splice(index,1);
            break;
        }
    }
    fillSelectFeild(selectSelectedItem,"" , newSupplier.itemList ,"itemname","");

}

function buttonRemoveByAll() {
    for (let index in newSupplier.itemList){
        allitemList.push(newSupplier.itemList[index]);
    }

    fillSelectFeild(selectItem,"" , allitemList ,"itemname","");


    newSupplier.itemList = [];
    fillSelectFeild(selectSelectedItem,"" , newSupplier.itemList ,"itemname","");
}


//check available errors in form
const checkSupplierFormError = ()=>{
    let formerror = "";

    if( newSupplier.name == null){
        formerror = formerror + "Please enter Supplier name..! \n";
        textSupplierName.style.borderBottom = "2px solid red";
        // selectBrand.classList.add("");
    }
    if( newSupplier.contactno == null){
        formerror = formerror + "Please Supplier Contact No..! \n";
        textContactNo.style.borderBottom = "2px solid red";
        // selectBrand.classList.add("");
    }

    if( newSupplier.email == null){
        formerror = formerror + "Please enter supplier email address..! \n";
        textEmail.style.borderBottom = "2px solid red";
        // selectBrand.classList.add("");
    }

    if( newSupplier.supplierstatus_id == null){
        formerror = formerror + "Please Select Supplier Status..! \n";
        selectSupplierStatus.style.borderBottom = "2px solid red";
        // selectBrand.classList.add("");
    }

    if( newSupplier.itemList.length == 0){
        formerror = formerror + "Please Select supply items ..! \n";

    }

    return formerror;
}

function buttonSupplierSave() {
    // check form error
    let errors = checkSupplierFormError();
    if(errors != ""){
        window.alert("form has following erros \n" + errors);
    }else {
        //get user confirmation
        let userCofirmMsg = "Are you sure to add Following Supplier ..? " +
            "\n Supplier Name : " + newSupplier.name +
            "\n Supplier Contact No : " + newSupplier.contactno +
            "\n Supplier Email : " + newSupplier.email ;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if(userSaveResponce){
            //call post services
            let serverResponce = getHTTPRequestService("/supplier" , "POST" , newSupplier);
            if(serverResponce == "0"){
                refreshTable();
                refreshSupplierForm();
                $("#supplierAddModal").modal("hide");

                window.alert("Supplier Insert Successfully...");
            }else {
                window.alert("Supplier Insert Not Successfully you have server error...\n" + serverResponce);
            }

        }
    }
}

//form refill function
function reFillItemForm(rowob,rowind) {


    newSupplier = getServiceRequest("/supplier/getbyid/"+rowob.id);
    oldSupplier = getServiceRequest("/supplier/getbyid/"+rowob.id);


   // fillSelectFeild(selectSelectedItem,"" , newSupplier.itemList ,"itemname","");

    // allitemList = getServiceRequest("/item/listbysupplier/"+rowob.id);
    // fillSelectFeild(selectItem,"" , allitemList ,"itemname","");

    supplierStatuses = getServiceRequest("/supplierstatus/list");
    fillSelectFeild(selectSupplierStatus,"Select Supplier Status" , supplierStatuses ,"name",newSupplier.supplierstatus_id.name);

    selectSupplierStatus.style.borderBottom = "2px solid green";
    selectSupplierStatus.disabled = false;

    // clear input feilds
    textSupplierName.value = newSupplier.name;
    textSupplierName.style.borderBottom = "1px solid green";
    textEmail.value = newSupplier.email;
    textEmail.style.borderBottom = "1px solid green";
    textContactNo.value = newSupplier.contactno;
    textContactNo.style.borderBottom = "1px solid green";


    $("#supplierAddModal").modal("show");
}


const checkSupplierFormUpdates = () =>{
    let updates = "";

    if(oldSupplier != null && newSupplier != null){

        if(newSupplier.name != oldSupplier.name){
            updates = updates + "Supplier Name is changed " + oldSupplier.name + " into " + newSupplier.name + "\n";
        }

        if(newSupplier.contactno != oldSupplier.contactno){
            updates = updates + "Supplier Contact No is changed " + oldSupplier.contactno + " into " + newSupplier.contactno + "\n";
        }

        if(newSupplier.email != oldSupplier.email){
            updates = updates + "Supplier Email is changed " + oldSupplier.email + " into " + newSupplier.email + "\n";
        }

        if(newSupplier.supplierstatus_id.name != oldSupplier.supplierstatus_id.name){
            updates = updates + "Supplier Status is changed " + oldSupplier.supplierstatus_id.name + " into " + newSupplier.supplierstatus_id.name + "\n";
        }


        if(newSupplier.itemList.length != oldSupplier.itemList.length){
            updates = updates + "Supply Item is changed "+ "\n";
        }else {
            let extitem = 0;

            for( i=0; i< newSupplier.itemList.length ; i++){
                for (let l=0; l< oldSupplier.itemList.length ; l++){

                    if(newSupplier.itemList[i].id == oldSupplier.itemList[l].id ){
                        extitem = parseInt(extitem) + 1;
                    }
                }
            }
            if (extitem != newSupplier.itemList.length){
                updates = updates + "Supply Item is changed "+ "\n";
            }
        }

    }


    return updates;
}

//function for update button
function buttonSupplierUpdate() {

    let formeErrors = checkSupplierFormError();
    if( formeErrors == ""){
        let formUpdates = checkSupplierFormUpdates();
        if(formUpdates == ""){
            window.alert("Nothing updated...!");
        }else {

            let userUpdConfirmation = window.confirm("Are you sure to update following changers..? \n"+ formUpdates);

            if(userUpdConfirmation){
                let serverUpdResponce = getHTTPRequestService("/supplier" , "PUT" , newSupplier);
                if(serverUpdResponce == "0"){
                    window.alert("Supplier Update Successfully...");
                    refreshTable();
                    refreshSupplierForm();
                    $("#supplierAddModal").modal("hide");

                }else {
                    window.alert("Supplier Update Not Successfully you have server error...\n" + serverUpdResponce);
                }

            }


        }
    }else {
        window.alert("form has following erros \n" + formeErrors);
    }
}


//create function for delete row
function deleteItemRow(ob) {
    // get uesr confirmation
    let deleteConfirmMSG = "Are you sure to delete follwing supplier..? \n" +
        " Supplier Name : " + ob.name +
        "\n Supplier Email : " + ob.email;

    let userResponce =  window.confirm(deleteConfirmMSG);

    if(userResponce){
        let deleteServieResponce = getHTTPRequestService("/supplier" , "DELETE" , ob);
        if(deleteServieResponce == "0"){
            refreshTable();
            window.alert("Supplier Delete Successfully...");
        }else {
            window.alert("Supplier Delete Not Successfully you have server error...\n" + deleteServieResponce);
        }

    }

}


function viewItemRow(rowob,rowind) {

    let printItem = getServeiceRequst("/item/getbyid/"+rowob.id);

    tdItemCode.innerText = printItem.itemcode;

}

