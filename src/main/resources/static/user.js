
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
    let dPDTList = ['object' , 'text' ,getUserRole ,'text' , getUserStatus ];

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

function getUserStatus(ob){
    let userstatus;
    if(ob.status){
        userstatus = "<i class='fas fa-cross'></i>";
    }else {
        userstatus = "<i class='fas fa-check'></i>";
    }

    return userstatus;
}

function selectEmployeeCH() {

    textEmail.value = JSON.parse(selectEmployee.value).email;
    user.email = textEmail.value;
    textEmail.style.border = "2px solid green";
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

        let chkLabel = document.createElement('label');
        chkLabel.innerText = roleList[index]['name'];
        chkLabel.classList.add("form-check-label");
        chkLabel.classList.add("fw-bold");
        chkLabel.classList.add("ms-2");

        rolediv.appendChild(checkBox);
        rolediv.appendChild(chkLabel);
        divRoles.appendChild(rolediv);
    }

    // fill data into employee select element
    employeeswithoutUserAccount = getServiceRequest("/employee/listwithoutuseraccount")
    fillSelectFeild(selectEmployee,"Select Employee..." , employeeswithoutUserAccount , "calling_name","")

    // emplty text feild
    textUserName.value = "";
    textPassword.value = "";
    textReTypePassword.value = "";
    textEmail.value = "";
    textDescription.value = "";

    user.status = true;
    chkUserStatus.checked = true;
    lblUserStatus.innerText = "User Account is Active";



}

function buttonSubmitMC() {
    console.log(user)
}

const formRefill = (ob) => {
    user = getServiceRequest("user/getbyid/" + ob.id);
}

function checkUpdate(){
    let updates = "";

    if(user != null && olduser != null){
        updates = updates + "User name is Changed..\n";
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
const deleteRow = () => {}
const viewRow = () => {}