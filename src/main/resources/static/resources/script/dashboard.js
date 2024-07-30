
function logoutMC() {

    let userconfirm = window.confirm("Are you sure to logout...? \n");
    if(userconfirm){
        window.location.replace("/logout");
    }
    
}
//
const refreshProfileEditForm = () => {
    currentLoggedUser = getServiceRequest("/userlogged");
    oldcurrentLoggedUser = null;

    textUserName.value = currentLoggedUser.username  ;
    textEmail.value = currentLoggedUser.email;

    //refill photo
    if(currentLoggedUser.userphoto == null){
        employeeImage.src = "resources/images/user_photo/user.png";
        txtempPhoto.value = "";
    }else{
        employeeImage.src = atob(currentLoggedUser.userphoto);
        txtempPhoto.value = currentLoggedUser.photoname;
    }



}


const submitUserSetting = () => {



        $.ajax("/changeuser", {
            async: false,
            type: "PUT", // method delete
            data: JSON.stringify(currentLoggedUser), // object
            contentType: "application/json",
            success: function (susResdata, susStatus, ajresob) {
                putResponce = susResdata;
            },
            error: function (errRsOb, errStatus, errorMsg) {
                putResponce = errorMsg;
            }
        });


        if (putResponce == "0") {
            window.alert("Use Profile Changed Successfully...!");
            $("#modalProductForm").modal("hide");
            window.location.assign("/logout");

        } else {

            window.alert("Fail to update ...! \n " + putResponce);
        }

    }

const buttonModalCloseLogUMC = () => {
    buttonCloseModal("#modalUserSettingForm", refreshProfileEditForm);
}


window.addEventListener("load",ev => {

    let loggedUser = getServiceRequest("/loggeduser");

    console.log(loggedUser);
    if(loggedUser != null){
        loggedUserName.innerText = loggedUser.username;
        // loggeduserRole.innerText = loggedUser.role;
        if( loggedUser.userphoto !=null){
            imgUserPhoto.src = atob(loggedUser.userphoto);
        }
        else {
            imgUserPhoto.src = "resources/images/user_photo/user.png";
        }
    }else {
        window.location.replace("/login");
    }

})

//photo clearing settings
document.getElementById("btnClearImage").addEventListener('click', () => {
    currentLoggedUser.image = null;
    txtempPhoto.innerText = "";
    employeeImage.src = "resources/images/user_photo/user.png";
    empFilePhoto.files = null;
});

function textReTypePasswordValidator(){

    if(textReTypePassword.value == textPassword.value){
        textReTypePassword.style.borderBottom = "2px solid green";
    }else{
        textReTypePassword.style.borderBottom = "2px solid red";
    }
}
//
//     window.addEventListener("load",()=>{
//
//     let userphoto = /*[[${loggeduserphoto}]]*/'loggeduserphoto';
//     if(userphoto != null){
//     imgUserPhoto.src = atob(userphoto);
// }
// });
