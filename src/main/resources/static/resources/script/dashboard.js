
function logoutMC() {

    let userconfirm = window.confirm("Are you sure to logout...? \n");
    if(userconfirm){
        window.location.replace("/logout");
    }
    
}


window.addEventListener("load",ev => {

    let loggedUser = getServiceRequest("/loggeduser");

    if(loggedUser != null){
        hUsername.innerText = loggedUser.username;
        spnRole.innerText = loggedUser.role;
        if( loggedUser.photopath != "")
        imgUserPhoto.src = loggedUser.photopath + loggedUser.photoname;

    }else {
        window.location.replace("/login");
    }

})