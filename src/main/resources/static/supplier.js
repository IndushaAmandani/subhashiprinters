window.addEventListener("load", refreshUI);


/// browser refresh function
function refreshUI() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Supplier");

    refreshTable();
   refreshSupplierForm();
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
    let supplyIMaterialList = getServiceRequest("/material/listbysupplier/"+ob.id);
    // console.log(supplyIMaterialList);
    let materialsName = "";

for(index in supplyIMaterialList ){
    materialsName = materialsName + supplyIMaterialList[index]['name'] + ","
 //String - poster paper,dimai,
}
    return materialsName;
}


const refreshSupplierForm = ()=> {

    newSupplier = new Object();
    oldSupplier = null;

    // need to fill data into dropdown element
    supplierStatuses = getServiceRequest("/supplierstatus/list");
    fillSelectFeild(cmbSupplierStatus,"Select Supplier Status" , supplierStatuses ,"name","Active");
    newSupplier.supplier_status_id = JSON.parse(cmbSupplierStatus.value);
    cmbSupplierStatus.disabled = true;

    // clear input feilds


    txtSupplierName.value = "";
    txtSupplierAddress.value = "";
    txtSupplierNote.value = "";
    txtContactNo.value = "";
    txtEmailAddress.value = "";

    txtCompanyRegno.value = "";
    txtContactPersonName.value = "";
    txtContactPersonMobile.value = "";
    txtBankName.value = "";
    txtBankBranchName.value = "";
    txtBankAccountNumber.value = "";
    txtBankAccountHolderName.value = "";

    setStyle("1px solid #ced4da");
    cmbSupplierStatus.style.borderBottom = "2px solid green";

    disabledButton(true, false);
    newSupplier.materialList = new Array();

    allMateialList = getServiceRequest("/material/list");
    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","");

    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");

}

let disabledButton = (addbtn, updbtn) => {

    if (addbtn && lggeduserprivilage.ins) {
        buttonAdd.disabled = false;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "pointer");
    } else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "not-allowed");
    }

    if (updbtn && lggeduserprivilage.upd) {
        buttonUpdate.disabled = false;
        $("#buttonUpdate").css("pointer-events", "all");
        $("#buttonUpdate").css("cursor", "pointer");
    } else {
        buttonUpdate.disabled = true;
        $("#buttonUpdate").css("pointer-events", "all");
        $("#buttonUpdate").css("cursor", "not-allowed");
    }
}

function setStyle(style) {

    txtSupplierName.style.borderBottom = style;
    txtSupplierAddress.style.borderBottom = style;
    txtSupplierNote.style.borderBottom = style;
    txtContactNo.style.borderBottom = style;
    txtEmailAddress.style.borderBottom = style;
    cmbSupplierStatus.style.borderBottom = style;
    txtCompanyRegno.style.borderBottom = style;
    txtContactPersonName.style.borderBottom = style;
    txtContactPersonMobile.style.borderBottom = style;
    txtBankName.style.borderBottom = style;
    txtBankBranchName.style.borderBottom = style;
    txtBankAccountNumber.style.borderBottom = style;
    txtBankAccountHolderName.style.borderBottom = style;

}


function buttonAddByOne() {
    let selectedItem = JSON.parse(selectMaterial.value);
    newSupplier.materialList.push(selectedItem);
    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");

    for (let index in allMateialList){
        if(allMateialList[index]['name'] == selectedItem.name){
            allMateialList.splice(index,1);
            break;
        }
    }
    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","")

}
function buttonAddByAll() {
    for(let index in allMateialList){
        newSupplier.materialList.push(allMateialList[index]);
    }
    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");

    allMateialList = [];
    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","");
}

function buttonRemoveByOne() {
    let selectedItem = JSON.parse(selectSelectedItem.value);
    allMateialList.push(selectedItem);
    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","")


    for (let index in newSupplier.materialList){
        if(newSupplier.materialList[index]['name'] == selectedItem.name){
            newSupplier.materialList.splice(index,1);
            break;
        }
    }
    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");

}

function buttonRemoveByAll() {
    for (let index in newSupplier.materialList){
        allMateialList.push(newSupplier.materialList[index]);
    }

    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","");


    newSupplier.materialList = [];
    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");
}


//check available errors in form
const checkSupplierFormError = ()=>{
    let formerror = "";

    if( newSupplier.company_name == null){
        formerror = formerror + "Please enter Supplier name..! \n";

    }
    if( newSupplier.address == null){
        formerror = formerror + "Please enter Supplier Address..! \n";

    }
    if( newSupplier.company_email == null){
        formerror = formerror + "Please Supplier email address..! \n";

    }

    if( newSupplier.company_contact_no == null){
        formerror = formerror + "Please enter supplier Contact No..! \n";

    }

    if( newSupplier.supplier_status_id == null){
        formerror = formerror + "Please Select Supplier Status..! \n"
    }

    if( newSupplier.materialList.length == 0){
        formerror = formerror + "Please Select supply Material ..! \n";
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
            "\n Supplier Name : " + newSupplier.company_name +
            "\n Supplier Contact No : " + newSupplier.company_contact_no +
            "\n Supplier Email : " + newSupplier.company_email ;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if(userSaveResponce){
            //call post services
            let serverResponce = getHTTPServiceRequest("/supplier" , "POST" , newSupplier);
            if(serverResponce == "0"){
                refreshTable();
                refreshSupplierForm();
                $("#modalSupplierForm").modal("hide");

                window.alert("Supplier Insert Successfully...");
            }else {
                window.alert("Supplier Insert Not Successfully you have server error...\n" + serverResponce);
            }

        }
    }
}

//form refill function
function reFillItemForm(rowob,rowind) {

// console.log("Hi");
    newSupplier = getServiceRequest("/supplier/getbyid/"+rowob.id);
    oldSupplier = getServiceRequest("/supplier/getbyid/"+rowob.id);

    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");

    allMateialList = getServiceRequest("/item/listbysupplier/"+rowob.id);
    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","");

    fillSelectFeild(cmbSupplierStatus,"Select Supplier Status" , supplierStatuses ,"name",newSupplier.supplier_status_id.name);

     cmbSupplierStatus.style.borderBottom = "2px solid green";
     cmbSupplierStatus.disabled = false;

    //  clear input feilds
    txtSupplierName.value = newSupplier.name;
    txtSupplierName.style.borderBottom = "1px solid green";
    txtEmailAddress.value = newSupplier.email;
    txtEmailAddress.style.borderBottom = "1px solid green";
    txtContactNo.value = newSupplier.contactno;
    txtContactNo.style.borderBottom = "1px solid green";


    $("#modalSupplierForm").modal("show");
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


        if(newSupplier.materialList.length != oldSupplier.itemList.length){
            updates = updates + "Supply Item is changed "+ "\n";
        }else {
            let extitem = 0;

            for( i=0; i< newSupplier.materialList.length ; i++){
                for (let l=0; l< oldSupplier.itemList.length ; l++){

                    if(newSupplier.materialList[i].id == oldSupplier.itemList[l].id ){
                        extitem = parseInt(extitem) + 1;
                    }
                }
            }
            if (extitem != newSupplier.materialList.length){
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
        " Supplier Name : " + ob.company_name +
        "\n Supplier Email : " + ob.company_email;

    let userResponce =  window.confirm(deleteConfirmMSG);

    if(userResponce){
        let deleteServieResponce = getHTTPServiceRequest("/supplier" , "DELETE" , ob);
        if(deleteServieResponce == "0"){
            refreshTable();
            window.alert("Supplier Delete Successfully...");
        }else {
            window.alert("Supplier Delete Not Successfully you have server error...\n" + deleteServieResponce);
        }

    }

}


function viewItemRow(rowob,rowind) {

    let printItem = getServiceRequest("/item/getbyid/"+rowob.id);

    tdItemCode.innerText = printItem.itemcode;

}

$('#myModal').modal({
    keyboard: false
})


function buttonModalCloseMC() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        refreshSupplierForm();
        $("#modalSupplierForm").modal("hide");
        $("#modalSupplierForm").modal({
            keyboard: false
        })
    }
}