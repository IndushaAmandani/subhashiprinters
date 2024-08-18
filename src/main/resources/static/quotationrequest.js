    window.addEventListener("load", refreshUI);


/// browser refresh function
function refreshUI() {

    $('[data-toggle="tooltip"]').tooltip();

    // get loged user privilage for item module
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Quotationrequest");

    refreshTable();
    refreshQRForm();
}

// Create function for refresh table
const refreshTable = ()=>{

    quotationrequests = new Array();
    quotationrequests = getServiceRequest("/quotationrequest/findall"); //

    //call filldataintotablefunction
    // fillDataIntoTable(tableid , dataList,displayPropertyList , dpDataTypeList,formrefillfunctionname,
    // rowdeletefunctionname, rowviewfunctonname, buttonvisibility , buttonsprivilages)
    let displayPropertyList =  ['request_number','supplier_id.company_name','required_date','quatation_req_status_id.name'];
    let dpDataTypeList = ['text','object','text','object'];
    fillDataIntoTable(tableQuotationRequest,quotationrequests,displayPropertyList,dpDataTypeList,reFillItemForm , deleteItemRow , viewItemRow, true, lggeduserprivilage);

    for(let index in quotationrequests){
        tableQuotationRequest.children[1].children[index].children[5].children[0].style.display = "none";
        tableQuotationRequest.children[1].children[index].children[5].children[2].style.display = "none";

        if(quotationrequests[index].quatation_req_status_id.name == "Removed"){
            tableQuotationRequest.children[1].children[index].style.backgroundColor = "#ad9393";

            tableQuotationRequest.children[1].children[index].children[5].children[1].disabled = true;
            tableQuotationRequest.children[1].children[index].children[5].children[1].style.pointerEvents = "all";
            tableQuotationRequest.children[1].children[index].children[5].children[1].style.cursor = "not-allowed";

        }
    }

    $("#tableQuotationRequest").dataTable();
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


const refreshQRForm = ()=> {

    newQuotationRequest = new Object();
    oldQuotationRequest  = null;

    // need to fill data into dropdown element
    suppliers = getServiceRequest("/supplier/getSupplierListnotHaveQR"); //
    qrStatuses = getServiceRequest("/qrstatus/list"); //

    fillSelectFeild(cmbSupplier,"Select Supplier" , suppliers ,"company_name","");

    fillSelectFeild(cmbQRStatus,"Select QR Status" , qrStatuses ,"name","Requested");
    newQuotationRequest.quatation_req_status_id = JSON.parse(cmbQRStatus.value);

    cmbQRStatus.disabled = true;



    // clear input feilds

    dteRequiredDate.value = "";
    let mindate = new Date();
    let maxDate = new Date();

    maxDate.setDate(maxDate.getDate()+10);
    dteRequiredDate.max = getCurrentDate2("date",maxDate);

    dteRequiredDate.min = getCurrentDate2("date",mindate);
    txtNote.value = "";

    qrarray  =[cmbSupplier,cmbQRStatus,dteRequiredDate,txtNote]
    setIDStyle(qrarray,"1px solid #ced4da");
    cmbQRStatus.style.borderBottom = "2px solid green";

    disabledQRButton(true,false);
}

 const  disabledQRButton = (addbtn, updbtn) =>{
     if (addbtn && lggeduserprivilage.ins) {
         buttonAdd.disabled = false;
         $("#buttonAdd").css("pointer-events", "all");
         $("#buttonAdd").css("cursor", "pointer");
     } else {
         buttonAdd.disabled = true;
         $("#buttonAdd").css("pointer-events", "all");
         $("#buttonAdd").css("cursor", "not-allowed");
     }
 }


//check available errors in form
const checkQRFormError = ()=>{
    let formerror = "";

    if( newQuotationRequest.supplier_id == null){
        formerror = formerror + "Please Select Supplier ..! \n";

    }

    if( newQuotationRequest.required_date == null){
        formerror = formerror + "Please Select Required Date..! \n";

    }

    if( newQuotationRequest.quatation_req_status_id == null){
        formerror = formerror + "Please Select Supplier Status..! \n";

    }

    return formerror;
}

function buttonQRSave() {
    // check form error
    let errors = checkQRFormError();
    if(errors != ""){
        window.alert("form has following erros \n" + errors);
    }else {
        //get user confirmation
        let userCofirmMsg = "Are you sure to add Following Quotation Request ..? " +
            "\n Supplier Name : " + newQuotationRequest.supplier_id.company_name +
            "\n Required Date : " + newQuotationRequest.required_date +
            "\n QR Status : " + newQuotationRequest.quatation_req_status_id.name ;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if(userSaveResponce){
            //call post services
            let serverResponce = getHTTPServiceRequest("/quotationrequest" , "POST" , newQuotationRequest);
            if(serverResponce == "0"){
                $("#modalQuotationRequestForm").modal("hide");
                refreshTable();
                refreshQRForm();
                window.alert("Quotation Request Insert Successfully...");
            }else {
                window.alert("Quotation Request Insert Not Successfully you have server error...\n" + serverResponce);
            }

        }
    }
}
// Since when the date change can't handel the status
    function reFillItemForm(){};

// //form refill function
// function reFillItemForm(rowob,rowind) {
//
//
//
//     newQuotationRequest = getServiceRequest("/quotationrequest/getbyid/"+rowob.id);
//     oldQuotationRequest = getServiceRequest("/quotationrequest/getbyid/"+rowob.id);
//
//   fillSelectFeild(cmbSupplier,"Select Supplier" , suppliers ,"company_name",newQuotationRequest.supplier_id.company_name);
//
//     fillSelectFeild(cmbQRStatus,"Select QR Status" , qrStatuses ,"name",newQuotationRequest.quatation_req_status_id.name);
//     cmbQRStatus.disabled = true;
//
//     // clear input feilds
//
//     dteRequiredDate.value = newQuotationRequest.required_date;
//     if( newQuotationRequest.note != null)
//     txtNote.value = newQuotationRequest.note; else  txtNote.value = "";
//
//     setUiElementColor("1px solid green");
//
//     if( newQuotationRequest.note == null)
//         txtNote.style.borderBottom = "1px solid #ced4da";
//     disabledButton(false , true);
//     $("#modalQuotationRequestForm").modal("show");
// }
//
//
// const checkQRFormUpdates = () =>{
//
//     let updates = "";
//
//     if(newQuotationRequest != null && oldQuotationRequest != null){
//
//         if(newQuotationRequest.required_date != oldQuotationRequest.required_date){
//             updates = updates + "Require Date  is changed " +  oldQuotationRequest.required_date + " into " + newQuotationRequest.required_date + "\n";
//         }
//
//         if(newQuotationRequest.note != oldQuotationRequest.note){
//             updates = updates + "Quotation Request Note No is changed " + oldQuotationRequest.note + " into " + newQuotationRequest.note + "\n";
//         }
//
//         if(newQuotationRequest.supplier_id.id != oldQuotationRequest.supplier_id.id){
//             updates = updates + "Supplier  is changed " + oldQuotationRequest.supplier_id.company_name + " into " + newQuotationRequest.supplier_id.company_name + "\n";
//         }
//
//         if(newQuotationRequest.quatation_req_status_id.name != oldQuotationRequest.quatation_req_status_id.name){
//             updates = updates + "Supplier Status is changed " + oldQuotationRequest.quatation_req_status_id.name + " into " + newQuotationRequest.quatation_req_status_id.name + "\n";
//         }
//
//     }
//
//
//     return updates;
// }
//
// //function for update button
// function buttonQRUpdate() {
//     $("#modalQuotationRequestForm").modal("hide");
//    let formeErrors = checkQRFormError();
//     if( formeErrors == ""){
//         let formUpdates = checkQRFormUpdates();
//         if(formUpdates == ""){
//             window.alert("Nothing updated...!");
//         }else {
//
//             let userUpdConfirmation = window.confirm("Are you sure to update following changers..? \n"+ formUpdates);
//
//             if(userUpdConfirmation){
//                 let serverUpdResponce = getHTTPServiceRequest("/quotationrequest" , "PUT" , newQuotationRequest);
//                 if(serverUpdResponce == "0"){
//                     $("#supplierAddModal").modal("hide");
//                     window.alert("Quotation Request Update Successfully...");
//                     refreshTable();
//                     refreshQRForm();
//
//
//                 }else {
//                     window.alert("Quotation Request Update Not Successfully you have server error...\n" + serverUpdResponce);
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
//

//create function for delete row
function deleteItemRow(ob) {

    if(ob.quatation_req_status_id.name == "Requested"){

        // get uesr confirmation
        let deleteConfirmMSG = "Are you sure to delete follwing Quotation Request..? \n" +
            " QR Number : " + ob.request_number +
            " Supplier Name : " + ob.supplier_id.company_name +
            "\n Required Date : " + ob.required_date;

        let userResponce =  window.confirm(deleteConfirmMSG);

        if(userResponce){
            let deleteServieResponce = getHTTPServiceRequest("/quotationrequest" , "DELETE" , ob);
            if(deleteServieResponce == "0"){
                refreshTable();
                window.alert("Quotation Request Delete Successfully...");
            }else {
                window.alert("Quotation Request Delete Not Successfully you have server error...\n" + deleteServieResponce);
            }

        }

    }else{
        window.alert("Quotation Request Delete Not Successful : This quotation is not in the requessted state!");
    }


}


function viewItemRow(rowob,rowind) {

    let printItem = getServeiceRequst("/item/getbyid/"+rowob.id);

    tdItemCode.innerText = printItem.itemcode;

}

function  buttonModalCloseMC (){
    buttonCloseModal("#modalQuotationRequestForm",refreshQRForm);
}

 function buttonMClear(){
     refreshQRForm();
 }