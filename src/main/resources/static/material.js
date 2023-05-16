

const rowDelte = (ob,rowno) => {
let deleteMsg = "Are you sure want to delete following Material ..? \n" + ob.customer_name ;

 let deleteUserResponce = window.confirm(deleteMsg);

if(deleteUserResponce){

    let serverResponce = getHTTPRequestService("/material","DELETE",ob);
    if(serverResponce == "0"){
        alert("Delete Successfully... !")
    }else{
        alert("Fail to Delete,You have folowing error .. \n" + serverResponce)
    }
}
}