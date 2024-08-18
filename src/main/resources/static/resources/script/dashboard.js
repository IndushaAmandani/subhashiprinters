window.addEventListener("load", () => {

    let loggedUser = getServiceRequest("/loggeduser");

    //  console.log(loggedUser);
    if (loggedUser != null) {
        loggedUserName.innerText = loggedUser.username;
        loggeduserRole.innerText = loggedUser.role;

        //returns who doesn't have view priviledge to any of his roles
        let modulesbyusername = getServiceRequest("/module/listbyuser/"+ loggedUser.username);
        //getting each module object from the list modulesbyusername where returns who doesn't have view priviledge to any of his roles
        for (const modulesbyusernameElement of modulesbyusername) {
            //`` is used since this class name is changing accorning to the above for modulesbyusernameElement element
            $(`.${modulesbyusernameElement.name}`).remove();
        }
        if(loggedUser.role !="MANAGER"){
            document.getElementById("reportModule").style.display = 'none';
        }
        if(loggedUser.role =="ADMIN"){
            document.getElementById("reportModule").style.display = 'block';

        }
        if(loggedUser.role =="CASHIER"){
            document.getElementById("reportModule").style.display = 'none';
            document.getElementById('inventory').style.display = 'none';

        }


        if (loggedUser.userphoto != null) {
            imgUserPhoto.src = atob(loggedUser.userphoto);
        } else {
            imgUserPhoto.src = "resources/images/user_photo/user.png";
        }
    } else {
        window.location.replace("/login");
    }


    const refill = () => {
    }
    const deleterwo = () => {
    }
    const veiwrow = () => {
    }
    //show inventory

    let currentInventory = new Array();

    currentInventory = getServiceRequest("/inventory/availbleQtyofMaterials");

    const ctx = document.getElementById('myChart');

    let materialname = currentInventory.map(item => item.material_id.name);

    let avaQty = currentInventory.map(item => item.avaqty);


    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: materialname,
            datasets: [{
                label: 'available qty',
                data: avaQty,
                backgroundColors:  'rgb(32,135,180)',
                borderWidth: 1,


            }],

        },
        options: {
            scales: {
                y: {

                    beginAtZero: true
                }
            }
        }
    });



    urgentCO = new Array();
    urgentCO = getServiceRequest("/customerOrder/urgentCorders");


    displayPropList = ['order_code', 'order_status_id.name']
    disPPDTypeList = ['text', 'object']
    fillDataIntoTable(urgentOrderListTable, urgentCO, displayPropList, disPPDTypeList, refill, deleterwo, veiwrow, false)






    //set count of  active cutomer number to the card
    let activeCustomers = getServiceRequest("/customer/getActiveCustomerCount");
    document.getElementById("activeCCount").innerText = activeCustomers.id;
    if(urgentCO.length==0){
        document.getElementById("urgentOrderList").style.display='none';
    }

    let customerOrder = getServiceRequest("/customerOrder/pendingOrders")
    document.getElementById("pendingCOCount").innerText = customerOrder.id;


})

function logoutMC() {

    let userconfirm = window.confirm("Are you sure to logout...? \n");
    if (userconfirm) {
        window.location.replace("/logout");
    }

}

//


//
//     window.addEventListener("load",()=>{
//
//     let userphoto = /*[[${loggeduserphoto}]]*/'loggeduserphoto';
//     if(userphoto != null){
//     imgUserPhoto.src = atob(userphoto);
// }
// });





