window.addEventListener("load", refreshUI);


/// browser refresh function
function refreshUI() {

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
            tableSupplier.children[1].children[index].style.backgroundColor = "#ad9393";
            tableSupplier.children[1].children[index].style.color = "#0f100f";
            tableSupplier.children[1].children[index].children[7].children[1].disabled = true;
            tableSupplier.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableSupplier.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    $("#tableSupplier").dataTable();
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

    // txtCompanyRegno.value = "";
    txtContactPersonName.value = "";
    txtContactPersonMobile.value = "";
    txtBankName.value = "";
    txtBankBranchName.value = "";
    txtBankAccountNumber.value = "";
    txtBankAccountHolderName.value = "";



    let supplierArray = [txtSupplierName,txtSupplierAddress,txtSupplierNote,txtContactNo,txtEmailAddress,cmbSupplierStatus,txtContactPersonName,txtContactPersonMobile,txtBankName,txtBankBranchName,txtBankAccountNumber,txtBankAccountHolderName]
setIDStyle(supplierArray,"1px solid #ced4da");

    cmbSupplierStatus.style.borderBottom = "1px solid green";

    disabledButton(true, false);
    newSupplier.materialList = new Array();

    allMateialList = getServiceRequest("/material/list");
    fillSelectFeild(selectMaterial,"" , allMateialList ,"name","");

    fillSelectFeild(selectSelectedItem,"" , newSupplier.materialList ,"name","");

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

// create function for get sales price
function getSupplyMaterialName(ob){
    let supplyIMaterialList = getServiceRequest("/material/listbysupplier/"+ob.id);
    // console.log(supplyIMaterialList);
    let materialsName = "";

    for(let index in supplyIMaterialList ){
        materialsName = materialsName + supplyIMaterialList[index]['name'] + ","
        //String - poster paper,dimai,
    }
    return materialsName;
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
    txtSupplierName.value = newSupplier.company_name;
    txtEmailAddress.value = newSupplier.company_email;
    txtContactNo.value = newSupplier.company_contact_no;
    txtContactPersonName.value = newSupplier.contact_person_name;
    txtContactPersonMobile.value= newSupplier.contact_person_number;
    txtSupplierAddress.value = newSupplier.address;
    txtBankName.value = newSupplier.bank_name;
    txtBankBranchName.value = newSupplier.branch_name;
    txtBankAccountNumber.value = newSupplier.account_number;
    txtBankAccountHolderName.value = newSupplier.account_holder_name;


            if(newSupplier.bank_name ) {
                txtBankName.value = newSupplier.bank_name;
                txtBankBranchName.value = newSupplier.branch_name;
                txtBankAccountNumber.value = newSupplier.account_number;
                txtBankAccountHolderName.value = newSupplier.account_holder_name;
            }


    let supplierArray = [txtSupplierName,txtSupplierAddress,txtSupplierNote,txtContactNo,txtEmailAddress,cmbSupplierStatus,txtContactPersonName,txtContactPersonMobile,txtBankName,txtBankBranchName,txtBankAccountNumber,txtBankAccountHolderName]
 setIDStyle(supplierArray,"1px dotted green");
    btnAddNew.click();
disabledButton(false,true);
}


const checkSupplierFormUpdates = () =>{
    let updates = "";

    if(oldSupplier != null && newSupplier != null){

        if(newSupplier.company_name != oldSupplier.company_name){
            updates = updates + "Supplier Name is changed " + oldSupplier.company_name + " into " + newSupplier.company_name + "\n";
        }

        if(newSupplier.company_contact_no != oldSupplier.company_contact_no){
            updates = updates + "Supplier Contact No is changed " + oldSupplier.company_contact_no + " into " + newSupplier.company_contact_no + "\n";
        }

        if(newSupplier.company_email != oldSupplier.company_email){
            updates = updates + "Supplier Email is changed " + oldSupplier.company_email + " into " + newSupplier.company_email + "\n";
        }

        if(newSupplier.supplier_status_id.name != oldSupplier.supplier_status_id.name){
            updates = updates + "Supplier Status is changed " + oldSupplier.supplier_status_id.name + " into " + newSupplier.supplier_status_id.name + "\n";
        }


        if(newSupplier.materialList.length != oldSupplier.materialList.length){
            updates = updates + "Supply Item is changed "+ "\n";
        }else {
            let extitem = 0;

            for( i=0; i< newSupplier.materialList.length ; i++){
                for (let l=0; l< oldSupplier.materialList.length ; l++){

                    if(newSupplier.materialList[i].id == oldSupplier.materialList[i].id ){
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
function buttonUpdateMC(){
    updatemodal("newSupplier",checkSupplierFormError,checkSupplierFormUpdates,"/supplier",newSupplier,refreshTable,refreshSupplierForm,"#modalSupplierForm");
}

//Add eventlistener to bank detail add b
let supBankdetails =  document.getElementById("SupplierBankDetails");
supBankdetails.addEventListener("click", () =>{
    cardSupBankDetails.style.display = "block";
})
//function for update button
// function buttonSupplierUpdate() {
//
//     let formeErrors = checkSupplierFormError();
//     if( formeErrors == ""){
//         let formUpdates = checkSupplierFormUpdates();
//         if(formUpdates == ""){
//             window.alert("Nothing updated...!");
//         }else {
//
//             let userUpdConfirmation = window.confirm("Are you sure to update following changers..? \n"+ formUpdates);
//
//             if(userUpdConfirmation){
//                 let serverUpdResponce = getHTTPRequestService("/supplier" , "PUT" , newSupplier);
//                 if(serverUpdResponce == "0"){
//                     window.alert("Supplier Update Successfully...");
//                     refreshTable();
//                     refreshSupplierForm();
//                     $("#supplierAddModal").modal("hide");
//
//                 }else {
//                     window.alert("Supplier Update Not Successfully you have server error...\n" + serverUpdResponce);
//                 }
//
//             }
//
//
//         }
//     }else {
//         window.alert("form has following erros \n" + formeErrors);
//     }
// }


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


function viewItemRow(rowob) {

    $("#modalViewSupplierForm").modal("show");
    let printItem = getServiceRequest("/supplier/getbyid/"+rowob.id);


    tdSCode.innerText = printItem.reg_no;
    tdSName.innerText = printItem.company_name;
    tdSMobile.innerText = printItem.contact_person_number;



        let supplyIMaterialList = getServiceRequest("/material/listbysupplier/"+rowob.id);
    // console.log(supplyIMaterialList);
    function materialList() {
        let materialsName = "";

        for (let index in supplyIMaterialList) {
            materialsName = materialsName + supplyIMaterialList[index]['name'] + ","
            //String - poster paper,dimai,
        }
        return materialsName;
    }
    tdM.innerText = materialList();

}


function buttonModalCloseMCSup() {
    buttonCloseModal("#modalSupplierForm",refreshSupplierForm);

}

 function buttonModalCloseMMCVM(){
    buttonCloseVModal("#modalViewSupplierForm");
 }



