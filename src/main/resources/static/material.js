// add function browser onload event
window.addEventListener('load',loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Material");

    //called refreshtable function -- >
    refreshTable();

//called refreshEmployeeForm function -- >
    refreshCustomerForm();
}

//define refresh table function
const refreshTable = () =>{

    // create array for stor data
    material = new Array();

    material = getServiceRequest("/material/findall");
   /* $.ajax('/employee/findall',{
        async: false,
        dataType:'json',
        success: function (data,status, xhr){
            employees = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            employees = [];
        }
    })*/
    //create display proporty list
    let displayPropertyList = ['name', 'code', 'measuring_count' ,'material_catedory_id.name' ,'materal_unit_type_id.name','material_status_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'text','number','object','object','object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableMaterial,materials,displayPropertyList,displayDatatypeList,
        formRefill , rowDelete , rowView,true,lggeduserprivilage);
    // need to add jquerty table
    $('#tableMaterial').dataTable();
}

const rowView = () => {}
const rowDelete = (ob,rowno) => {
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