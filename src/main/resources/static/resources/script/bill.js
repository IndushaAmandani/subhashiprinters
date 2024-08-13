


//function for the Printing Order Invoice
//insert customer order payment object as parameter
const printOrderDetailsAtCustomerPayment = (customerOrderObject) => {

    let customerCode = customerOrderObject.customer_id.customer_code;
    let customerName = customerOrderObject.customer_id.customer_name;
    let customerMobile = customerOrderObject.customer_id.mobile;

    let addedUserName = customerOrderObject.added_user_id.username;
    let addedDate = customerOrderObject.added_date.split('T')[0];
    let addedTime = customerOrderObject.added_date.split('T')[1];


    let orderDate = customerOrderObject.customer_order_id.added_date.split('T')[0];
    let requiredDate = customerOrderObject.customer_order_id.required_date;

    let orderCode = customerOrderObject.order_code;


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`

    let onloadFunctionContent = `window.addEventListener('load', () => {
    const fillDataIntoBillingTable = (tableBodyID, dataList, displayColumnList) => {

        const tableBody = document.getElementById(tableBodyID);
        tableBody.innerHTML = "";

        dataList.forEach((element, index) => {
            const tr = document.createElement('tr');

            const tdIndex = document.createElement('td');
            tdIndex.innerText = index + 1;
            tr.appendChild(tdIndex);

            displayColumnList.forEach(column => {
                const td = document.createElement('td');
                if (column.dataType == 'text') {
                    td.innerText = element[column.propertyName];
                }
                if (column.dataType == 'function') {
                    td.innerHTML = column.propertyName(element);
                }

                tr.appendChild(td);
            });

            tableBody.appendChild(tr); // table row append into table body
        });
    }
    const displayPropertyList = [
        { dataType: 'function', propertyName: getProductName },
        { dataType: 'function', propertyName: getUnit_price },
        { dataType: 'function', propertyName: getQuantity },
        { dataType: 'function', propertyName: getLine_price }
    ]

    fillDataIntoBillingTable("tbodyPrintBillTable", ${customerOrderObject.customer_order_id.customerOrderHasProductList}, displayPropertyList)

    const getUnit_price = (ob) => {
        return 'LKR' + parseFloat(ob.product_cost).toFixed(2);
    }
    const getLine_price = (ob) => {
        return 'LKR' + parseFloat(ob.line_total).toFixed(2);
    }
    const getQuantity = (ob) => {
        return parseFloat(ob.order_qty);
    }
    const getProductName = (ob) => {
        return parseFloat(ob.product_id.name);
    }
});`

    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bill Print</title>
        
            <!-- Boostrap CSS -->
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
        
            <!-- Boostrap Js -->
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
        
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        `+ windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8">
                                <h2>Subhashi Printers - Deniyaya</h1>
                            </div>
                            <div class="col-4">
                                <h3>Order No.</h3>
                                <h4 class="pull-right">${orderCode}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Billed To :</strong><br>
                                    Customer Code : ${customerCode}<br>
                                    Customer Name : ${customerName}<br>
                                    Customer Mobile : ${customerMobile}
                                </address>
                            </div>
                            <div class="col-4">
                                <address>
                                <strong>Order Date :</strong><br>
                                ${orderDate} <br>
                                <strong>Order Date :</strong><br>
                                ${requiredDate}                                    
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Billed By :</strong><br>
                                    Username : ${addedUserName}<br>
                                    Date : ${addedDate}<br>
                                    Time : ${addedTime}<br>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Order summary</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td><strong>Product</strong></td>
                                                <td class="text-center"><strong>Price</strong></td>
                                                <td class="text-center"><strong>Quantity</strong></td>
                                                <td class="text-right"><strong>Totals</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tbodyPrintBillTable">
                                            <!-- Calling the Table fill function -->
                                            <script>`+`
                                            </script>
                                            <tr>
                                                <td>BS-200</td>
                                                <td class="text-center">$10.99</td>
                                                <td class="text-center">1</td>
                                                <td class="text-right">$10.99</td>
                                            </tr>
                                            <tr>
                                                <td>BS-400</td>
                                                <td class="text-center">$20.00</td>
                                                <td class="text-center">3</td>
                                                <td class="text-right">$60.00</td>
                                            </tr>
                                            <tr>
                                                <td>BS-1000</td>
                                                <td class="text-center">$600.00</td>
                                                <td class="text-center">1</td>
                                                <td class="text-right">$600.00</td>
                                            </tr>
                                            <tr>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line text-center"><strong>Total</strong></td>
                                                <td class="thick-line text-right">LKR ${parseFloat(customerOrderObject.total_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-center"><strong>Payment</strong></td>
                                                <td class="no-line text-right">LKR ${parseFloat(customerOrderObject.paid_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-center"><strong>Remaining Balance</strong></td>
                                                <td class="no-line text-right">LKR - ${parseFloat(customerOrderObject.after_balance_amount).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        <script>`+onloadFunctionContent+`</script>
        
        <script src="script/commonFunction.js"></script>

        </html>`


    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}

// window.addEventListener('load', () => {
//
// //Priniting Bill Table Refill
//     const fillDataIntoBillingTable = (tableBodyID, dataList, displayColumnList) => {
//
//         const tableBody = document.getElementById(tableBodyID);
//         tableBody.innerHTML = "";
//
//         dataList.forEach((element, index) => {
//             const tr = document.createElement('tr');
//
//             const tdIndex = document.createElement('td');
//             tdIndex.innerText = index + 1;
//             tr.appendChild(tdIndex);
//
//             displayColumnList.forEach(column => {
//                 const td = document.createElement('td');
//                 if (column.dataType == 'text') {
//                     td.innerText = element[column.propertyName];
//                 }
//                 if (column.dataType == 'function') {
//                     td.innerHTML = column.propertyName(element);
//                 }
//
//                 tr.appendChild(td);
//             });
//
//             tableBody.appendChild(tr); // table row append into table body
//         });
//     }
//     const displayPropertyList = [
//         { dataType: 'function', propertyName: getProductName },
//         { dataType: 'function', propertyName: getUnit_price },
//         { dataType: 'function', propertyName: getQuantity },
//         { dataType: 'function', propertyName: getLine_price }
//     ]
//
//     fillDataIntoBillingTable("tbodyPrintBillTable", customerOrderObject.customer_order_id.customerOrderHasProductList, displayPropertyList)
//
//     const getUnit_price = (ob) => {
//         return 'LKR' + parseFloat(ob.product_cost).toFixed(2);
//     }
//     const getLine_price = (ob) => {
//         return 'LKR' + parseFloat(ob.line_total).toFixed(2);
//     }
//     const getQuantity = (ob) => {
//         return parseFloat(ob.order_qty);
//     }
//     const getProductName = (ob) => {
//         return parseFloat(ob.product_id.name);
//     }
// });


