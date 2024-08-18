//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Material");
    console.log(lggeduserprivilage);
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshInventoryTable();

}


//define refresh table function
const refreshInventoryTable = () => {

    // create array for stor data
    inventory = new Array();

    inventory = getServiceRequest("/inventory/list");
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
    let displayPropertyList = ['material_id.name', 'totalqty', 'avaqty','inventorystatus_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['object', 'text', 'text','object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableInventory, inventory, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, false, lggeduserprivilage);

    // for (let index in inventory) {
    //     tableInventory.children[1].children[index].children[6].children[0].style.display = "none";
    //     tableInventory.children[1].children[index].children[6].children[1].style.display = "none";
    //     tableInventory.children[1].children[index].children[6].children[2].style.display = "none";
    //
    //
    //     }


    // need to add jquerty table
    $('#tableInventory').dataTable();

}

function  formRefill(){}

function  rowDelete(){}


   function rowView(){}