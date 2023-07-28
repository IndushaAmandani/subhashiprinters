
window.addEventListener('load',ev => {

    loggedUserPrivilage = getServiceRequest("/userprivilage/bymodule?modulename=User");

    refreshTable();

    refreshForm();

})

// Create function for refresh table
const refreshTable = () =>{

    users = new Array();

    users = getServiceRequest("/user/findall")

    let displayPropertyList = ['employee_id.calling_name' , 'username' , 'password' ,'email','status'];
    let dPDTList = ['object' , 'text' ,getUserRole ,'text','text' ];

    fillDataIntoTable(tableUser,users,displayPropertyList, dPDTList, formRefill , deleteRow , viewRow , true , loggedUserPrivilage);

    for(let index in users){
        tableUser.children[1].children[index].children[5].children[0].style.color = "red";
    }

    $('#tableUser').dataTable();
}

function getUserRole(ob) {
    let userRole = getServiceRequest("/role/listbyuser?userid="+ob.id);
    console.log(userRole)
    let userrolename = "" ;
     for(let index in userRole){
         userrolename = userrolename + userRole[index]['name'] + " ,";
     }
    return userrolename;
}



//Check this out
// function selectEmployeeCH() {
//     if(JSON.parse(selectEmployee.value).email == null){
//         textEmail.value = disabled;
//     }else{
//     getElementById("textEmail").placeholder = "Auto genereated";
//     user.email = JSON.parse(selectEmployee.value).email;
//     textEmail.style.borderbottom= "2px solid green";
//     }
    
    
// }

function selectEmployeeCH(){

    textEmail.value = JSON.parse(selectEmployee.value).email;
    textEmail.style.borderbottom= "2px solid green";
    textFeildValidtor(textEmail,'^[A-Za-z0-9]{5,20}[@][a-z]{4,10}[.][a-z]{2,5}$','user','email','olduser');
}

const  refreshForm = () => {

   user =  new Object();
   olduser = null;

   user.roles = new Array();

    let roleList = getServiceRequest("/role/list");
    divRoles.innerHTML = "";
    for(let index in roleList){
        let rolediv = document.createElement('div')
        rolediv.classList.add('form-check');

        let checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.classList.add("form-check-input");
        checkBox.value = index;

        checkBox.onchange = function () {

            if(this.checked){
                user.roles.push(roleList[this.value]);
            }else{
              for(let ind in user.roles){
                  if(user.roles[ind]['id'] == roleList[this.value]['id']){
                      user.roles.splice(ind,1);
                  }
              }
            }

        }

        // divroles = document.createElement('div');
        //  inputCheckbox = document.createElement('input');
        // inputLabel = document.createElement('label'); 
        // divRoles.appendchild(divroles);
        // divRoles.appendchild(inputCheckbox);
        // divRoles.appendchild(inputLabel);
        // inputLabel.innerHTML = "Manager" ;

        let chkLabel = document.createElement('label');
        chkLabel.innerText = roleList[index]['name'];
        chkLabel.classList.add("form-check-label");
        chkLabel.classList.add("font-weight-bold");
        //margin start
        chkLabel.classList.add("ms-2");

        rolediv.appendChild(checkBox);
        rolediv.appendChild(chkLabel);
        divRoles.appendChild(rolediv);


    }

    // fill data into employee select element
    employeesListwithoutUserAccount = getServiceRequest("/employee/listwithoutuseraccount")
    fillSelectFeild2(selectEmployee,"Select Employee...",employeesListwithoutUserAccount ,"calling_name","number","")

    // empty text feild
    textUserName.value = "";
    textPassword.value = "";
    textReTypePassword.value = "";
    textPassword.disabled =false;
    textReTypePassword.disabled = false;
    textEmail.value = "";
    textDescription.value = "";

    user.status = true;
    chkUserStatus.checked = true;
    lblUserStatus.innerText = "User Account is Active";
 
}

function buttonSubmitMC() {
    console.log("Add user")
    //need to check form errors
    let errors = checkErrors();

    if(errors == ""){
        let submitConfirmMsg = "Are you sure to add following ... " +
            "\n User Name : " + user.username ;
        let userResponce = window.confirm(submitConfirmMsg);
   
    
    //getting resonce
    if(userResponce){
        let postServieResponce ;
        $.ajax("/user", {
            async : false,
            type : "POST", // method delete
            data: JSON.stringify(user) , // object
            contentType:"application/json",
            success: function (susResdata , susStatus , ajresob) {
                postServieResponce = susResdata;
            },
            error: function (errRsOb , errStatus, errorMsg) {
                postServieResponce = errorMsg;
            }
        });

        if(postServieResponce == "0"){

            alert("Add Successfull..!");
            refreshTable();
            refreshForm();
            $("#modalUserForm").modal("hide");
        }else {
            window.alert("You have following error \n" + postServieResponce);
        }


    }

    
}else {

    alert("Form have following errors \n" + errors);
}
}

const formRefill = (ob,rowno) => {
console.log("hi");
 //user = getServiceRequest("user/getbyid/" + ob.id);
user = JSON.parse(JSON.stringify(ob));
olduser = JSON.parse(JSON.stringify(ob));


 // $.ajax('user/getbyid/'+ob.id,{
 //     async: false,
 //     dataType:'json',
 //     //responce obj -xhr
 //     success: function (data,status, xhr){
 //         user = data;
 //     },
 //     error: function (rxhrdata,errorstatus,errorMessge){
 //        user = {};
 //     }
 // })
 //
 // $.ajax('user/getbyid?id='+ob.id,{
 //     async: false,
 //     dataType:'json',
 //     success: function (data,status, xhr){
 //        olduser = data;
 //     },
 //     error: function (rxhrdata,errorstatus,errorMessge){
 //        olduser  = {};
 //     }
 // })


    // fill data into employee select element
    employeesListwithoutUserAccount.push(ob.employee_id);
    fillSelectFeild2(selectEmployee,"Select Employee...",employeesListwithoutUserAccount ,"calling_name","number","")

    // empty text feild
    textUserName.value = user.username  ;
    textPassword.disabled = true;
    textReTypePassword.disabled= true;
    textEmail.value = user.email;

    user.status = true;
    chkUserStatus.checked = true;
    lblUserStatus.innerText = "User Account is Active";




}

function checkUpdate(){
    let updates = "";

    if(user != null && olduser != null){
        updates = updates + "User name is Changed..\n" + olduser.name;
    }
    if(user.roles.length != olduser.roles.length){
        updates = updates + "User roles are Changed..\n";
    }else{
        let extCount = 0;
        for(let index in olduser.roles){
           for(let ind in user.roles){
            if(olduser.roles[index]['id'] == user.roles[ind]['id']){
                //convert any dt into data type ;integer
                extCount = parseInt(extCount) + 1;
                break;
            }
           }
        }
        if(user.roles.length != extCount){
            updates = updates +"User roles are Changed ..\n";
        }
    }
}
const deleteRow = (ob) => {

    let deleteMsg = "Are you sure to delete following User..? \n"
                    + "Employee number : " + ob.employee_id.number
                    + "\n User name : " + ob.username;

    let deleteUserResponce = window.confirm(deleteMsg);

    if(deleteUserResponce){
        let deleteServerResponce;

        $.ajax("/user", {
            async : false,
            type : "DELETE", // method delete
            data: JSON.stringify(ob) , // object
            contentType:"application/json",
            success: function (susResdata , susStatus , ajresob) {
                deleteServerResponce = susResdata;
            },
            error: function (errRsOb , errStatus, errorMsg) {
                deleteServerResponce = errorMsg;
            }
        });

        if(deleteServerResponce == "0"){
            alert("Delete Successfull..!");
            refreshTable();
        }else {
            window.alert("You have following error \n" + deleteServerResponce);
        }
    }
}
const viewRow = () => {}

const checkErrors = () => {

    let errors = "";

    if(user.employee_id == null){
        errors = errors + "Employee not selected.. \n";
    }

    if(user.username == null){
        errors = errors + "User name is not entered.. \n";
    }
    
    if(user.password == null){
        errors = errors + "User password is not entered.. \n";
    }

    if(textReTypePassword.value == ""){
        errors = errors + "Password Re-type is not entered.. \n";
    }
    
    if(textReTypePassword.value != textPassword.value){
        errors = errors + "Password Re-type not Matched.. \n";
    }
    if(user.email == null){  
        errors = errors + "User email is not entered.. \n";
    }
    if(user.status == null){
        errors = errors + "Status not selected.. \n";
    }

    return errors;
}

function textReTypePasswordValidator(){

    if(textReTypePassword.value == textPassword.value){
        textReTypePassword.style.borderBottom = "2px solid green";
    }else{
        textReTypePassword.style.borderBottom = "2px solid red";
    }
}

function buttonUpdateMC() {
    //
    let errors = chechErrors();
    if (errors == "") {
        //
        let updates = checkUpdate();
        if (updates == "") {

            window.alert("Nothing updated...! \n ");
        } else {

            let updateResponce = window.confirm("Are you sure to update following User..? \n" + updates);

            if (updateResponce) {
                let putResponce ;

                $.ajax("/user", {
                    async : false,
                    type : "PUT", // method delete
                    data: JSON.stringify(user) , // object
                    contentType:"application/json",
                    success: function (susResdata , susStatus , ajresob) {
                        putResponce = susResdata;
                    },
                    error: function (errRsOb , errStatus, errorMsg) {
                        putResponce = errorMsg;
                    }
                });


                if (putResponce == "0") {
                    window.alert("Update Successfully...!");
                    refreshTable();
                    refreshForm();
                    $('#modalUserForm').modal("hide");


                } else {
                    //
                    window.alert("Fail to update ...! \n " + putResponce);
                }

            }
        }
    } else {

        window.alert("You have following error in your form...! \n " + errors);
    }

}

