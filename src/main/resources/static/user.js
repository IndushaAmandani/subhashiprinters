window.addEventListener('load', ev => {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=User");

    refreshTable();

    refreshUForm();

})

// Create function for refresh table
const refreshTable = () => {

    users = new Array();

    users = getServiceRequest("/user/findall")

    let displayPropertyList = ['employee_id.calling_name', 'username', 'password', 'email', 'status'];
    let dPDTList = ['object', 'text', getUserRole, 'text', 'text'];

    fillDataIntoTable(tableUser, users, displayPropertyList, dPDTList, formRefill, deleteRow, viewRow, true, lggeduserprivilage);

    for (let index in users) {
        tableUser.children[1].children[index].children[5].children[0].style.color = "red";
        tableUser.children[1].children[index].children[6].children[2].style.display = "none";
    }

    $('#tableUser').dataTable();
}

const refreshUForm = () => {

    user = new Object();
    olduser = null; //initially old object null then if null check password and retype password

    user.roles = new Array();

    let roleList = getServiceRequest("/role/list");
    divRoles.innerHTML = "";
    for (let index in roleList) {
        let rolediv = document.createElement('div')
        rolediv.classList.add('form-check');

        let checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.classList.add("form-check-input");
        checkBox.value = index;

        checkBox.onchange = function () {

            if (this.checked) {
                user.roles.push(roleList[this.value]);
            } else {
                let extindex = user.roles.map(role => role.id).indexOf(roleList[parseInt(this.value)]['id']);
                if (extindex != -1) {
                    user.roles.splice(extindex, 1);
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
    fillSelectFeild2(selectEmployee, "Select Employee", employeesListwithoutUserAccount, "calling_name", "number", "")

    // empty text feild
    textUserName.value = "";
    textPassword.value = "";
    textReTypePassword.value = "";
    textPassword.disabled = false;
    textReTypePassword.disabled = false;
    textUserEmail.value = "";
    txtDescription.value = "";

    textReTypePassword.disabled = true;
  let  userArray = [textUserName, textPassword, textReTypePassword, textUserEmail, txtDescription]
    setIDStyle(userArray, "2px solid #ced4da");
    user.status = true;
    chkUserStatus.checked = true;
    lblUserStatus.innerText = "User Account is Active";

    disabledButton(true, false);


}

function buttonSubmitMC() {
    console.log("Add user")
    //need to check form errors
    let errors = checkErrors();

    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following ... " +
            "\n User Name : " + user.username;
        let userResponce = window.confirm(submitConfirmMsg);


        //getting resonce
        if (userResponce) {
            let postServieResponce;
            $.ajax("/user", {
                async: false,
                type: "POST", // method delete
                data: JSON.stringify(user), // object
                contentType: "application/json",
                success: function (susResdata, susStatus, ajresob) {
                    postServieResponce = susResdata;
                },
                error: function (errRsOb, errStatus, errorMsg) {
                    postServieResponce = errorMsg;
                }
            });

            if (postServieResponce == "0") {

                alert("Add Successfull..!");
                refreshTable();
                refreshUForm();
                $("#modalUserForm").modal("hide");
            } else {
                window.alert("You have following error \n" + postServieResponce);
            }


        }


    } else {

        alert("Form have following errors \n" + errors);
    }
}


function getUserRole(ob) {
    let userRole = getServiceRequest("/role/listbyuser?userid=" + ob.id);
    console.log(userRole)
    let userrolename = "";
    for (let index in userRole) {
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
document.getElementById("selectEmployee").addEventListener('change', () => {

    user.email = (JSON.parse(selectEmployee.value).email);
    user.username = (JSON.parse(selectEmployee.value).calling_name) + (JSON.parse(selectEmployee.value).number);
    textUserName.value = user.username;
    document.getElementById("textUserEmail").style.borderBottom = "2px solid green";
    document.getElementById("textUserEmail").value = user.email;

})


const formRefill = (ob, rowno) => {

    user = getServiceRequest("/user/getbyid/" + ob.id);
    olduser = getServiceRequest("/user/getbyid/" + ob.id);


    user.password = null;

    const userfindall= getServiceRequest("/employee/listwithuseraccount");


   // console.log(employeesListwithoutUserAccount)
    fillSelectFeild2(selectEmployee, "Select Employee",userfindall, "calling_name","number",user.employee_id.calling_name+" --> "+user.employee_id.number,true );

    // empty text feild
    textUserName.value = user.username;
    textUserName.style.borderBottom = "2px solid green";
    // textPassword.disabled = true;
    selectEmployee.disabled = true;
    //textReTypePassword.disabled= true;
    textUserEmail.value = user.email;
    textUserEmail.style.borderBottom = "2px solid green";
    if (user.status) {
        chkUserStatus.checked = true;
        lblUserStatus.innerText = "User Account is Active";
    } else {
        chkUserStatus.checked = false;
        lblUserStatus.innerText = "User Account is Not Active";
    }


    if (user.description == "" || user.description == null) {
        txtDescription.value = "-"
        txtDescription.style.borderBottom = "2px solid #ced4ea";

    } else {
        txtDescription.value = user.description;
        txtDescription.style.borderBottom = "2px solid green";
    }
    //refilling role list
    let roleList = getServiceRequest("/role/list");

    divRoles.innerHTML = "";
    for (let index in roleList) {
        let rolediv = document.createElement('div')
        rolediv.classList.add('form-check');

        let checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.classList.add("form-check-input");
        checkBox.value = index;

        checkBox.onchange = function () {

            if (this.checked) {
                user.roles.push(roleList[this.value]);
            } else {
                let extindex = user.roles.map(role => role.id).indexOf(roleList[parseInt(this.value)]['id']);
                if (extindex != -1) {
                    user.roles.splice(extindex, 1);
                }
            }
        }
        let extindex = user.roles.map(role => role.id).indexOf(roleList[index]['id']);
        if (extindex != -1) {
            checkBox.checked = true;
        }
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
    btnAddNew.click();

    textUserName = user.employee_id.calling_name;
// update  the check box

    disabledButton(false, true);

}

function checkUpdate() {
    let updates = "";

    if (user.password != null)
        updates = updates + "User password Changed..\n"

    if (user.username != null && olduser.username != null) {
        updates = updates + "User name is Changed..\n" + olduser.name;
    }
    if (user.roles.length != olduser.roles.length) {
        updates = updates + "User roles are Changed..\n";
    } else {
        let extCount = 0;
        for (let index in olduser.roles) {
            for (let ind in user.roles) {
                if (olduser.roles[index]['id'] == user.roles[ind]['id']) {
                    //convert any dt into data type ;integer
                    extCount = parseInt(extCount) + 1;
                    break;

                    // let index = olduser.roles.map(olduser => oldrole.id).indexOf(newrole.id);
                    // if (index == -1)
                    // updates = updates + "User role is changed"
                }
            }
        }
        if (user.roles.length != extCount) {
            updates = updates + "User roles are Changed ..\n";
        }
    }
    return updates;
}

const deleteRow = (ob) => {

    let deleteMsg = "Are you sure to delete following User..? \n"
        + "Employee number : " + ob.employee_id.number
        + "\n User name : " + ob.username;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let deleteServerResponce;

        $.ajax("/user", {
            async: false,
            type: "DELETE", // method delete
            data: JSON.stringify(ob), // object
            contentType: "application/json",
            success: function (susResdata, susStatus, ajresob) {
                deleteServerResponce = susResdata;
            },
            error: function (errRsOb, errStatus, errorMsg) {
                deleteServerResponce = errorMsg;
            }
        });

        if (deleteServerResponce == "0") {
            alert("Delete Successfull..!");
            refreshTable();
        } else {
            window.alert("You have following error \n" + deleteServerResponce);
        }
    }
}
const viewRow = () => {
}

const checkErrors = () => {

    let errors = "";

    if (user.employee_id == null) {
        errors = errors + "Employee not selected.. \n";
    }

    if (user.username == null) {
        errors = errors + "User name is not entered.. \n";
    }


    if (olduser == null) {

        if (user.password == null) {
            errors = errors + "User password is not entered.. \n";
        }
        if (textReTypePassword.value == "") {
            errors = errors + "Password Re-type is not entered.. \n";
        }
        if (textReTypePassword.value != textPassword.value) {
            errors = errors + "Password Re-type not Matched.. \n";
        }
    }

    if (user.email == null) {
        errors = errors + "User email is not entered.. \n";
    }
    if (user.status == null) {
        errors = errors + "Status not selected.. \n";
    }

    return errors;
}

document.getElementById("textPassword").addEventListener('keyup', () => {

    if (textPassword.value != "" || (textPassword.value != null)) {
       let  userPasswordpattern = new RegExp("^([A-za-z0-9!@#$%^&*().]{5,15})$");
        if (userPasswordpattern.test(textPassword.value)) {
            textPassword.style.borderBottom = "2px solid green";
            textReTypePassword.disabled = false;
            textReTypePassword.value = "";
            textReTypePassword.style.borderBottom = "2px solid #ced4ea";

        } else {

            textReTypePassword.style.borderBottom = "2px solid #ced4ea";
            textReTypePassword.disabled = true;
            textReTypePassword.value = "";
            textPassword.style.borderBottom = "2px solid red";
            user.password = null;
        }

    } else {
        textReTypePassword.value = "";
        user.password = null;
        textPassword.style.borderBottom = "2px solid red";
        textReTypePassword.style.borderBottom = "2px solid #ced4ea";
        textReTypePassword.disabled = true;
    }

})

document.getElementById("textReTypePassword").addEventListener('keyup',()=>{
    textReTypePasswordValidator();
})
function textReTypePasswordValidator() {

    if (textReTypePassword.value == textPassword.value) {
        textPassword.style.borderBottom = "2px solid green";
        textReTypePassword.style.borderBottom = "2px solid green";
        user.password = textPassword.value;
    } else {

        textPassword.style.borderBottom = "2px solid red";
        textReTypePassword.style.borderBottom = "2px solid red";
        user.password = null;
    }
}

function buttonUpdateMC() {
    //
    let errors = checkErrors();
    if (errors == "") {
        //
        let updates = checkUpdate();
        if (updates == "") {

            window.alert("Nothing updated...! \n ");
        } else {

            let updateResponce = window.confirm("Are you sure to update following User..? \n" + updates);

            if (updateResponce) {
                let putResponce;

                $.ajax("/user", {
                    async: false,
                    type: "PUT", // method delete
                    data: JSON.stringify(user), // object
                    contentType: "application/json",
                    success: function (susResdata, susStatus, ajresob) {
                        putResponce = susResdata;
                    },
                    error: function (errRsOb, errStatus, errorMsg) {
                        putResponce = errorMsg;
                    }
                });


                if (putResponce == "0") {
                    window.alert("Update Successfully...!");
                    refreshTable();
                    refreshUForm();
                    $('#modalUserForm').modal('hide');


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

function buttonModalCloseMC() {
    buttonCloseModal('#modalUserForm', refreshUForm);

}

