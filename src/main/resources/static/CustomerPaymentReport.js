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



    let currentDateForMin = new Date();
    currentDateForMin.setDate(currentDateForMin.getDate() - 730);
    dteStartDate.min = getCurrentDate2("date", currentDateForMin);

    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() - 1);
    dteStartDate.max = getCurrentDate2("date",currentDateForMax);

    let currentDateForMinE = new Date();

    currentDateForMinE.setDate(currentDateForMinE.getDate() - 729);
    dteEndDate.min = getCurrentDate2("date",currentDateForMinE);

    dteEndDate.max = getCurrentDate();


    // create array for stor data

     // payments  = getServiceRequest("/customerPaymentreport/bysdateedate/" +JSON.parse(dteStartDate.value)+"/");
    // console.log(materials);

    //create display proporty list
    // let displayPropertyList = [ 'code','name','measuring_count'];
    // // creat display property data type list
    // let displayDatatypeList = ['text','text', 'text', 'object'];
    // //called filldataintotable function for fill data
    // fillDataIntoTable(tableMaterial,materials, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, false, lggeduserprivilage);


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

    let tablehtml = tableCustomerPaymentReport.outerHTML;
    newwindow.document.write(
      "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>"+
        "<div>"+ "<h3>" + "Subhashi Printers" + "</h3>" +
           " <h4>" + "Report - Customer Total Payment Reports According to Time Period" + "</h4>" + "<br>"+
       " </div>"+ "<br>"+
        "<div>" + tablehtml + "</div>"
    )
    setTimeout(function (){
newwindow.print()
    },300)
}

function  generateReport(){
  cpaymentReport = getServiceRequest("/customerPaymentreport/bysdateedate/ "+dteStartDate.value+ "/"+dteEndDate.value+"/" +selectReportType.value);

    //create display proporty list
    let displayPropertyList = [ 'date','totalamount','cpaymentcount'];
    // creat display property data type list
    let displayDatatypeList = ['text','text', 'text'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableCustomerPaymentReport,cpaymentReport, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, false, lggeduserprivilage);

    if(cpaymentReport.length){
        chartofCustomerPayment();
    }



}

function chartofCustomerPayment(){
    const ctx = document.getElementById('cpaymentChart');



    let daterange = cpaymentReport.map(item => item.date);

    let amount = cpaymentReport.map(item => item.totalamount);


    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: daterange,
            datasets: [{
                label: 'totalamount(Rs.)',
                data: amount,
                backgroundColors:  'rgb(206,174,42)',
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
}