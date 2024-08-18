// add function browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = {select:true,insert:true,update:true,delete:true};

    //called refreshtable function -- >
    refreshTable();

}

//define refresh table function
const refreshTable = () => {


    //material Price List

    materailPriceList = new Array();
    materailPriceList = getServiceRequest("/material/list");


    displayPropList = ['name', 'unit_price']
    disPPDTypeList = ['text', 'decimal']
    fillDataIntoTable(materialListTable, materailPriceList, displayPropList, disPPDTypeList, formRefill, rowDelete, rowView, false)



}

const rowView = () => {
}




//form refill function
function formRefill(rowob,rowind) {

}


const rowDelete = (ob, rowno) => {

}

function buttonPrint(){
    let newwindow = window.open();

    let tablehtml = materialListTable.outerHTML;
    newwindow.document.write(
      "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>"+
        "<div>"+ "<h3>" + "Subhashi Printers" + "</h3>" +
           " <h4>" + "Current Material Purchase Price List" + "</h4>" + "<br>"+
       " </div>"+ "<br>"+
        "<div>" + tablehtml + "</div>"
    )
    setTimeout(function (){
newwindow.print()
    },300)
}