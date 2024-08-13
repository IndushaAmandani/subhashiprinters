const refreshProfileEditForm = () => {
    currentLoggedUser = getServiceRequest("/userlogged");
    oldcurrentLoggedUser = null;

    textUName.value = currentLoggedUser.username;

    textEmail.value = currentLoggedUser.email;

    //refill photo
    if (currentLoggedUser.userphoto == null) {
        uImage.src = "resources/images/user_photo/user.png";
        txtuPhoto.value = "";
    } else {
        uImage.src = atob(currentLoggedUser.userphoto);
        txtuPhoto.value = currentLoggedUser.photoname;
    }


}


const submitUserSetting = () =>     {


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




//photo clearing settings
document.getElementById("btnUClearImage").addEventListener('click', () => {
    currentLoggedUser.image = null;
    txtuPhoto.innerText = "";
    uImage.src = "resources/images/user_photo/user.png";
    userFilePhoto.files = null;
});

function textReTypePasswordValidator() {

    if (txtReTypePassword.value == txtPassword.value) {
        txtReTypePassword.style.borderBottom = "2px solid green";
    } else {
        txtReTypePassword.style.borderBottom = "2px solid red";
    }
}