window.addEventListener("load", () => {

    let loggedUser = getServiceRequest("/loggeduser");

    //  console.log(loggedUser);
    if (loggedUser != null) {
        loggedUserName.innerText = loggedUser.username;
         loggeduserRole.innerText = loggedUser.role;
        if (loggedUser.userphoto != null) {
            imgUserPhoto.src = atob(loggedUser.userphoto);
        } else {
            imgUserPhoto.src = "resources/images/user_photo/user.png";
        }
    } else {
        window.location.replace("/login");
    }



    const refill = () => {}
    const deleterwo = () => {}
    const veiwrow = () => {}
    //show inventory

    let currentInventory = new Array();

    currentInventory = getServiceRequest("/inventory/availbleQtyofMaterials");

    const ctx = document.getElementById('myChart');

    let materialname = currentInventory.map(item => item.material_id.name);

    let avaQty = currentInventory.map(item => item.avaqty);
    let colorlistforChart = [];
    const colorset = new Array();
    let arrayIndex = 0;
    backgroundColors = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

    currentInventory.forEach((el) => {
        let colorno = arrayIndex % (backgroundColors.length);
        colorlistforChart = backgroundColors[colorno];
        arrayIndex = arrayIndex + 1;
        colorset.push(colorlistforChart)

    })


    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: materialname,
            datasets: [{
                label: 'available qty',
                data: avaQty,
                backgroundColors: colorset,
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

    urgentOrderListTable = document.getElementById("urgentOrderListTable");

    urgentCO = new Array();
    urgentCO = getServiceRequest("/customerOrder/urgentCorders");


    displayPropList = ['order_no','order_status']
    disPPDTypeList = ['text','object']
    fillDataIntoTable(urgentOrderListTable, urgentCO, displayPropList, disPPDTypeList, refill, deleterwo, veiwrow, false)




    //set count of  active cutomer number to the card
    let activeCustomers = getServiceRequest("/customer/getActiveCustomerCount");
    document.getElementById("activeCCount").innerText = parseInt(activeCustomers.id);




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





