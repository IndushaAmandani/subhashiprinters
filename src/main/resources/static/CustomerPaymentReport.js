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

    // create array for stor data

     payments  = getServiceRequest("/customerPaymentreport/bysdateedate/" +JSON.parse(dteStartDate.value)+"/");
    console.log(materials);

    //create display proporty list
    let displayPropertyList = [ 'code','name','measuring_count'];
    // creat display property data type list
    let displayDatatypeList = ['text','text', 'text', 'object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableMaterial,materials, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, false, lggeduserprivilage);


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

    let tablehtml = tableMaterial.outerHTML;
    newwindow.document.write(
      "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>"+
        "<div>"+ "<h3>" + "Subhashi Printers" + "</h3>" +
           " <h4>" + "Report - Usable Paper Material List" + "</h4>" + "<br>"+
       " </div>"+ "<br>"+
        "<div>" + tablehtml + "</div>"
    )
    setTimeout(function (){
newwindow.print()
    },300)
}