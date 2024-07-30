// privilage- slect,insrt,updt,updt,deltt
function getServiceRequest(url) {

    let responceDate;
//jQuery.ajax()
    $.ajax(url,{
        async: false,
        dataType:'json', //DATA that you are exopecting back from the server
        success: function (data,status, xhr){
          //  $('#err').append("Service : " + url + "<br>");
           // $('#err').append("data : " + JSON.parse(data) + "<br>");
            responceDate = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            responceDate = [];
        }
    })

    return responceDate;
}

function getHTTPServiceRequest(url , method , data) {

    let responceDate;

    $.ajax(url, {
        async : false,
        type : method, // method delete
        data: JSON.stringify(data) , // object
        contentType:"application/json",
        success: function (susResdata , susStatus , ajresob) {
            responceDate = susResdata;
        },
        error: function (errRsOb , errStatus, errorMsg) {
            responceDate = errorMsg;
        }
    });

    return responceDate;
}



//create function for remve style
const clearTableStyle = (tableid) => {
    for (let index = 0; index < tableEmployeeD.children[1].children.length; index++) {
        tableid.children[1].children[index].style.backgroundColor = "white";

      }
}

//Files as Photos
const fileFieldValidator = (fieldid,object,property,oldobject) => {
    let ob = window[object];
    let oldob = window[oldobject];

    console.log(fieldid.files[0]);

    let filereader = new FileReader();

    filereader.onload = function (){
        productImage.src = filereader.result;
        ob[property] = btoa(filereader.result);

        if(oldob != null &&  ob[property] != oldob[property]){
            fieldid.style.borderBottom = "2px solid orange";

        }else{
            fieldid.style.borderBottom = "2px solid green";
        }

        return;
    }

filereader.readAsDataURL(fieldid.files[0]);


}

//Validator for photo - new
const fileValidator = (fieldid,object,property1,property2,oldobject,previewId,nameFieldId) => {

    if(fieldid.value != ""){
        let file = fieldid.files[0];
        nameFieldId.value =file['name'];
        window[object][property2] = file['name'];

        let fileReader = new FileReader();
        //file object is passed for the function
        fileReader.onload = function (e){
            previewId.src = e.target.result;
            window[object][property1] = btoa(e.target.result);
        }
//after rading url then it triggers the onload
        fileReader.readAsDataURL(file);
        return;
    }
}


// ok
const textFeildValidtor = (feildid,pattern,object,property,oldobject) =>{

     let ob = window[object];
     let oldob = window[oldobject];

     if(feildid.value != ""){
             const namepattern = new RegExp(pattern);
             if (namepattern.test(feildid.value)) {
                 ob[property] = feildid.value; 
             
                 if (oldob != null && ob[property] != oldob[property]) {
                    //updated
                    feildid.style.borderBottom = '2px solid orange';
                 } else {
                    // valid
                    feildid.style.borderBottom = '2px solid green';
                 }
    
             } else {
                 ob[property] = null; 
                feildid.style.borderBottom = '2px solid red';
             }
            
         }else{
             ob[property] = null; 
             if(feildid.required){
              feildid.style.borderBottom = '2px solid red';
             }else{
               feildid.style.borderBottom = '2px solid rgb(118, 118, 118)';
             }
      
         }
        
 }



 // comman validatior for radio buttons
 const redioFeildValidator = (feildid,pattern,object,property,lblid1,lblid2) => {
     let ob = window[object];
     if (feildid.checked) {
         ob[property] = feildid.value;
         lblid1.style.color = 'green';
         lblid2.style.color = 'black';
     } else {
         ob[property] = null;
         lblid1.style.color = 'red';
         lblid2.style.color = 'red';
     }
 }


 // create function for date feild validate and data binding
 const dateFeildValidator = (feildid,pattern,object,property,oldobject) => {

    let ob = window[object];
    let oldob = window[oldobject];

    //data binding for object property
     ob[property] = feildid.value;

     if(oldob != null && ob[property] != oldob[property]){
         //updated
         feildid.style.borderBottom = "2px solid orange";
     }else{
         // valid
         feildid.style.borderBottom = "2px solid green";
     }
 }


 //
 const selectValidator = (feildid,pattern,object,property,oldobject) => {
     let ob = window[object];
     let oldob = window[oldobject];

     if (feildid.value != "") {
         ob[property] = JSON.parse(feildid.value);
         if(oldob != null && ob[property]['id'] != oldob[property]['id'] ){
             //updqted
             feildid.style.borderBottom = '2px solid orange';
         }else {
           //valid
             feildid.style.borderBottom = '2px solid green';
         }
     } else {
         ob[property] = null;
        feildid.style.borderBottom = '2px solid red';
     }
 }

 //
 const checkBoxValidator = (feildid,pattern,object, property,setTruevalue,setFalseValue,oldobject,lblid,trueMsg,falseMsg )=>{
  let  ob = window[object];
  let  oldob = window[oldobject];

  if (feildid.checked) {
    ob[property] = true;
    if(trueMsg != ""){
        lblid.value = setTruevalue;
        lblid.innerText = trueMsg;
        if(oldob != null && ob[property] != oldob[property]){
            lblid.style.color = "orange";
        }else{
            lblid.style.color = "green";
        }
    }
    
    
  } else {
    ob[property] = false;
    if(falseMsg != ""){
        lblid.value = setFalseValue;
        lblid.innerText = falseMsg;
        if(oldob != null && ob[property] != oldob[property]){
            lblid.style.color = "orange";
        }else{
            lblid.style.color = "green";
        }
    }
    
  }


 }

 //function use to fill data into select element -- ok
 const fillSelectFeild = (feildid, displayMessage, dataList,displayProperty, selectedValue, visibility=false) => {
    feildid.innerHTML = "" ;
    if(displayMessage.value != ""){
        optionPlaceholder = document.createElement('option');
        optionPlaceholder.value = "";
        optionPlaceholder.selected = true;
        optionPlaceholder.disabled = true;
        optionPlaceholder.innerText = displayMessage;
        feildid.appendChild(optionPlaceholder);
    }


    for(index in dataList){
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        optionValues.innerText = dataList[index][displayProperty];
        if(dataList[index][displayProperty] == selectedValue){
            optionValues.selected = true;
            feildid.style.borderBottom = "2px solid green";
        }

        feildid.appendChild(optionValues);
    }

    if(visibility)
        feildid.disabled = true; 
    else
        feildid.disabled = false;
}

const fillSelectFeild2 = (feildid, displayMessage, dataList,displayProperty,displayProperty2, selectedValue, visibility=false) => {
    feildid.innerHTML = "";
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = "";
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for(index in dataList){
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
      //  optionValues.innerText = getDataFromObject(dataList[index], displayPropertyList)
        optionValues.innerText =  dataList[index][displayProperty] + " --> "+ dataList[index][displayProperty2];
        if(dataList[index][displayProperty] + " --> "+ dataList[index][displayProperty2] == selectedValue){
            optionValues.selected = true;
            feildid.style.borderBottom = "2px solid green";
        }
        feildid.appendChild(optionValues);

    }


    if(visibility)
        feildid.disabled = true; 
    else
        feildid.disabled = false;
}

const fillSelectFeild3 = (feildid, displayMessage, dataList,displayProperty,displayProperty2,displayProperty21, visibility=false) => {
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = "";
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for(index in dataList){
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
      //  optionValues.innerText = getDataFromObject(dataList[index], displayPropertyList)
        optionValues.innerText =  dataList[index][displayProperty2][displayProperty21] + " "+ dataList[index][displayProperty];
        feildid.appendChild(optionValues);
    }


    if(visibility)
        feildid.disabled = true; 
    else
        feildid.disabled = false;
}

// create function for fill data into given table using given parameters
const fillDataIntoTable = (tableid,dataList,propertyList,displayDTList,
                           modifyFunction,deleteFunction,viewFunction, buttonvisibility=true,userPrivilage) => {

     //
     tbody = tableid.children[1];
     tbody.innerHTML = "";
//object wise findalla
    for(let index in dataList){
       
        // create tr node
        tr = document.createElement("tr"); 
        //create td node
        tdind = document.createElement("td"); 
        //create automatic index to each row which SHOW IN UI
        tdind.innerText = parseInt(index) + 1;
        tr.appendChild(tdind);

        for(pro in propertyList){
            //create td node
             td = document.createElement("td"); 
             tdp = document.createElement("p"); 
            let data = dataList[index][propertyList[pro]];
            //  customers[0][dispalyPropertyList[0]]
            // customer.customer_code
            // console.log(propertyList[pro]);
          //  console.log(displayDTList[pro]);

            if(displayDTList[pro] == 'text'){
                if(data == null){
                    td.innerText = "-";
                }else{
                    tdp.innerText = data;
                    td.appendChild(tdp);
                }
            } else if(displayDTList[pro] == 'decimal'){
                if(data == null) {
                    td.innerText = "-";
                }else {
                    td.innerText=parseFloat(data).toFixed(2)
                }
            }
            else if(displayDTList[pro] == 'object'){

               // console.log(propertyList[pro]);
                tdp.innerText = getDataFromObject(dataList[index],propertyList[pro]);
                td.appendChild(tdp);

            } else if(displayDTList[pro] == 'yearbydate'){
                if(data == null){
                    td.innerText = "-";
                }else{
                    td.innerText = new Date(data).getFullYear();
                }
            } else if(displayDTList[pro] == 'imagearray'){
                //create img node
              let img = document.createElement('img'); // DOM 
               img.style.width = '50px';
               img.style.height = '50px';
                if(data == null){
                    img.src = "res/images/sort_asc.png";
                }else{
                    img.src = atob(data);
                }
                td.appendChild(img);
            }else{
               // td.innerText = displayDTList[pro](dataList[index]);
                tdp.innerHTML =  displayDTList[pro](dataList[index]);
                td.appendChild(tdp);
            }

    
            tr.appendChild(td);
        }
       
        //Create td for add modify buttons
        tdB = document.createElement("td"); 
        tdB.classList.add('modifyCol');

        //Create buttons 
        btnEdit = document.createElement("button");
        btnEdit.style.pointerEvents = "all";
        btnEdit.classList.add('btn');
        btnEdit.classList.add('btn-sm');
        btnEdit.onclick = function(){
           // alert("edit");
           let indx = this.parentNode.parentNode.firstChild.innerHTML;
            modifyFunction(dataList[parseInt(indx)-1],parseInt(indx)-1);
        }

        btnDelete = document.createElement("button");
        btnDelete.style.pointerEvents = "all";
        btnDelete.classList.add('btn');
        btnDelete.classList.add('btn-sm');

        btnDelete.classList.add('ms-1');
        btnDelete.classList.add('me-1');
        btnDelete.onclick = function(){
            //alert("Delete");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            deleteFunction(dataList[parseInt(indx)-1],parseInt(indx)-1);
        }

        btnView = document.createElement("button");
        btnView.classList.add('btn');
        btnView.classList.add('btn-sm');
        btnView.onclick = function(){
           // alert("View");
           let indx = this.parentNode.parentNode.firstChild.innerHTML;
            viewFunction(dataList[parseInt(indx)-1],parseInt(indx)-1);
        }

        btnEdit.innerHTML = "<i class='fas fa-edit'></i>";
        btnDelete.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
        btnView.innerHTML = "<i class='fa-solid fa-eye'></i>";



        if(buttonvisibility){

            if(userPrivilage.upd){
                btnEdit.disabled = false;
                btnEdit.style.cursor = "pointer";
            }else {
                btnEdit.disabled = true;
                btnEdit.style.cursor = "not-allowed";
            }

            if(userPrivilage.del){
                btnDelete.disabled = false;
                btnDelete.style.cursor = "pointer";
            }else {
                btnDelete.disabled = true;
                btnDelete.style.cursor = "not-allowed";
            }

            tdB.appendChild(btnEdit);
            tdB.appendChild(btnDelete);
            tdB.appendChild(btnView);
            tr.appendChild(tdB);
        }


        tbody.appendChild(tr);

    }
}

const fillDataIntoTable2 = (tableid,dataList,propertyList,displayDTList,
                           modifyFunction,deleteFunction,redirectFunction, buttonvisibility=true,userPrivilage) => {

    //
    tbody = tableid.children[1];
    tbody.innerHTML = "";
//object wise findalla
    for(let index in dataList){

        // create tr node
        tr = document.createElement("tr");
        //create td node
        tdind = document.createElement("td");
        //create automatic index to each row which SHOW IN UI
        tdind.innerText = parseInt(index) + 1;
        tr.appendChild(tdind);

        for(pro in propertyList){
            //create td node
            td = document.createElement("td");
            tdp = document.createElement("p");
            let data = dataList[index][propertyList[pro]];
            //  customers[0][dispalyPropertyList[0]]
            // customer.customer_code
            // console.log(propertyList[pro]);
            //  console.log(displayDTList[pro]);

            if(displayDTList[pro] == 'text'){
                if(data == null){
                    td.innerText = "-";
                }else{
                    tdp.innerText = data;
                    td.appendChild(tdp);
                }
            } else if(displayDTList[pro] == 'decimal'){
                if(data == null) {
                    td.innerText = "-";
                }else {
                    td.innerText=parseFloat(data).toFixed(2)
                }
            }
            else if(displayDTList[pro] == 'object'){

                // console.log(propertyList[pro]);
                tdp.innerText = getDataFromObject(dataList[index],propertyList[pro]);
                td.appendChild(tdp);

            } else if(displayDTList[pro] == 'yearbydate'){
                if(data == null){
                    td.innerText = "-";
                }else{
                    td.innerText = new Date(data).getFullYear();
                }
            } else if(displayDTList[pro] == 'imagearray'){
                //create img node
                let img = document.createElement('img'); // DOM
                img.style.width = '50px';
                img.style.height = '50px';
                if(data == null){
                    img.src = "res/images/sort_asc.png";
                }else{
                    img.src = atob(data);
                }
                td.appendChild(img);
            }else{
                // td.innerText = displayDTList[pro](dataList[index]);
                tdp.innerHTML =  displayDTList[pro](dataList[index]);
                td.appendChild(tdp);
            }


            tr.appendChild(td);
        }

        //Create td for add modify buttons
        tdB = document.createElement("td");
        tdB.classList.add('modifyCol');

        //Create buttons
        btnEdit = document.createElement("button");
        btnEdit.style.pointerEvents = "all";
        btnEdit.classList.add('btn');
        btnEdit.classList.add('btn-sm');
        btnEdit.onclick = function(){
            // alert("edit");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            modifyFunction(dataList[parseInt(indx)-1],parseInt(indx)-1);
        }

        btnDelete = document.createElement("button");
        btnDelete.style.pointerEvents = "all";
        btnDelete.classList.add('btn');
        btnDelete.classList.add('btn-sm');

        btnDelete.classList.add('ms-1');
        btnDelete.classList.add('me-1');
        btnDelete.onclick = function(){
            //alert("Delete");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            deleteFunction(dataList[parseInt(indx)-1],parseInt(indx)-1);
        }

        btnView = document.createElement("button");
        btnView.classList.add('btn');
        btnView.classList.add('btn-sm');
        btnView.onclick = function(){
            // alert("redirect");
            let indx = this.parentNode.parentNode.firstChild.innerHTML;
            redirectFunction(dataList[parseInt(indx)-1],parseInt(indx)-1);
        }

        btnEdit.innerHTML = "<i class='fas fa-edit'></i>";
        btnDelete.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
        btnView.innerHTML = "<i class='fa-solid fa-arrow-right-from-file'></i>";



        if(buttonvisibility){

            if(userPrivilage.upd){
                btnEdit.disabled = false;
                btnEdit.style.cursor = "pointer";
            }else {
                btnEdit.disabled = true;
                btnEdit.style.cursor = "not-allowed";
            }

            if(userPrivilage.del){
                btnDelete.disabled = false;
                btnDelete.style.cursor = "pointer";
            }else {
                btnDelete.disabled = true;
                btnDelete.style.cursor = "not-allowed";
            }

            tdB.appendChild(btnEdit);
            tdB.appendChild(btnDelete);
            tdB.appendChild(btnView);
            tr.appendChild(tdB);
        }


        tbody.appendChild(tr);

    }
}

const getDataFromObject = (ob , path) => {
    console.log(ob);
    console.log(path);

     let getData = (modal , propPath) => {
        let paths = propPath.split('.');

        if(paths.length >1 && typeof modal[paths[0]] === "object" ){
            return getData(modal[paths[0]],paths.slice(1).join('.'));
        }else{
            return modal[paths[0]];
        }
     }

     let data = getData(ob, path);

     return data;

}

//Get current date ;showing only
const getCurrentDate = () => {
    let nowDate = new Date();
 // retrive 0 to 11   
    let month = nowDate.getMonth() + 1;//return 0 jan-11
//retrive 1-31
    let date = nowDate.getDate();//return 1-31
//year 
    let year = nowDate.getFullYear();

    if(month < 10){
        month = "0"+ month;
    }
    if(date < 10){
        date = "0" + date;
    }


    return year + "-" + month + "-" + date ;
}


//Get current date ;showing only
const getCurrentDate2 = (format,givendate) => {
    let nowDate = new Date(givendate);
 // retrive 0 to 11   
    let month = nowDate.getMonth() + 1;//return 0jan-11Dec
//retrive 1-31
    let date = nowDate.getDate();//return 1-31
//year 
    let year = nowDate.getFullYear();

    if(month < 10){
        month = "0"+ month;
    }
    if(date < 10){
        date = "0" + date;
    }


    return year + "-" + month + "-" + date ;
}

const showModal = (modalId) => {/*

    let div = document.createElement("div");

    div.className = 'modal-backdrop show';
    $('body').append(div);*/
    $(modalId).modal().show();

}
const buttonCloseModal = (modalId, refreshForm)=> {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        refreshForm();
       // $(modalId).modal().hide();
      //  $(".modal-backdrop").remove();
    }
}

const   buttonCloseVModal = (modalId) => {
    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        $(modalId).modal('hide');
        $(".modal-backdrop").remove();
    }

}

const submitmodal = (checkErrors,submitConfirmQuestionlabel,obj,objectQsProperties,url,redirectUrl,refreshTable,refreshForm,modalID) => {

  let errors = checkErrors();
    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following... " +
            "\n "+ submitConfirmQuestionlabel  + objectQsProperties ;
        let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
        $.ajax(url, {
            async: false,
            type: "POST",
            data: JSON.stringify(obj),
            contentType: "application/json",
            success: function (susResdata, susStatus, ajresob) {
                postServieResponce = susResdata;
            },
            error: function (errRsOb, errStatus, errorMsg) {
                postServieResponce = errorMsg;
            }

        });

        if (postServieResponce == "0") {

            alert("Add Successfully..!");
            window.location.replace(redirectUrl);
            refreshTable();
            refreshForm();
            $(modalID).modal("hide");
        } else {
            window.alert("You have following error \n" + postServieResponce);
        }

    }
} else {
    window.alert("You have following error \n" + errors);
}
}

const updatemodal = (updateObjName,checkErrors,checkUpdate,url,obj,refreshTable,refreshForm,modalformID) =>{

    let updateResponceMsg = "Are you sure to update following "+ updateObjName +"..? \n";
    let errors = checkErrors();
    if (errors == "") {
        //
        let updates = checkUpdate();
        if (updates == "") {

            window.alert("Nothing updated...! \n ");
        } else {

            let updateResponce = window.confirm( updateResponceMsg + updates);

            if (updateResponce) {
                let putResponce;

                $.ajax(url, {
                    async: false,
                    type: "PUT", // method delete
                    data: JSON.stringify(obj), // object
                    contentType: "application/json",
                    success: function (susResdata, susStatus, ajresob) {
                        putResponce = susResdata;
                    },
                    error: function (errRsOb, errStatus, errorMsg) {
                        putResponce = errorMsg;
                    }
                });


                if (putResponce == "0") {
                    window.alert(updateObjName +" update Successfully...!");
                    refreshTable();
                    refreshForm();



                } else {
                    //
                    window.alert(updateObjName + " fail to update ...! \n " + putResponce);
                }

            }
        }
    } else {

        window.alert("You have following error in your form...! \n " + errors);
    }

}

const  setIDStyle = (arrayId,style) => {
    arrayId.forEach(
        (item) =>
    {item.style.border = style}
    )

    // txtCompanyName.style.border = style;
    //  txtCompanyNumber.style.border = style;
    //  txtCompanyEmail.style.border = style;
}

const setIDValueNull = (arrayID)=> {
    arrayID.forEach((item)=>{item.value = "";});
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

const  divInnerFormshow = (elementIdName,value,divId) => {
    if (JSON.parse(elementIdName.value).name == value) {
        divId.style.display = "block";
    } else {
        divId.style.display = "none";
    }
}