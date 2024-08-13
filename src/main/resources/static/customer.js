window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Customer");
    console.log(lggeduserprivilage);
    refreshCustomerTable();
    //call refresh from function
    refreshCustomerForm();

    divCompanyDetails.style.display = "none";
}

//define refresh table functions
const refreshCustomerTable = () => {

    //create array for stor data
    customers = new Array();
    customers = getServiceRequest("/customer/findall");

    //create display property list
    let dispalyPropertyList = ['customer_code', 'customer_name', 'mobile', 'customer_email', 'customer_category_id.name', 'customerstatus_id.name'];
    //Property type list
    let dispalyPropertyDTList = ['text', 'text', 'text', 'text', 'object', 'object'];

    //called filldataintotable function for fill data
    fillDataIntoTable(tableCustomer, customers, dispalyPropertyList, dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);
// contactp_name
//contactp_mobile


    for (let index in customers) {
        if (customers[index].customerstatus_id.name == "Inactive") {
            tableCustomer.children[1].children[index].style.backgroundColor = "#ad9393";
            tableCustomer.children[1].children[index].style.color = "#0f100f";
            tableCustomer.children[1].children[index].children[7].children[1].disabled = true;
            tableCustomer.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableCustomer.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    // need to add jquerty table
    $('#tableCustomer').dataTable();

}


//create from refresh funcion for refresh from element
const refreshCustomerForm = () => {
    customer = new Object();
    oldcustomer = null;


    //dropdowns
    customerStatuses = getServiceRequest("/customerstatus/list");
    fillSelectFeild(cmbCustomerStatus, "Select Status", customerStatuses, 'name', 'Active', true);
    //Defaultly value is gained when the data is parsed here it is working
    customer.customerstatus_id = JSON.parse(cmbCustomerStatus.value)

    //drop down for category
    customerCategories = getServiceRequest("/customerCategory/list");
    fillSelectFeild(cmbCustomerCategory, "Select Category", customerCategories, 'name', '');

    // //drop down for type 
    // customerTypes = getServiceRequest("/customerType/list")
    // fillSelectFeild(cmbCustomerType, "Select Cusotmer Type", customerTypes, 'name', '');


    //,String name,String description,String mobile, String customer_email,String company_name,String company_contactnumber,String company_email,CustomerCategory customer_category_id,CustomerType customer_type_id,CustomerStatus customerstatus_id

    //Set text field value = ""
    // txtCustomerCode.value = "";
    txtName.value = "";
    txtMobile.value = "";
    txtCustomerEmail.value = "";
    // cmbCustomerStatus.value = "";
    cmbCustomerCategory.value = "";
    // txtCompanyName.value = "";
    // txtCompanyNumber.value = "";
    // txtCompanyEmail.value = "";
    txtContactPName.value = "";
    txtContactPMobile.value = "";
    txtContactPEmail.value = "";
    //cmbCustomerType.value = "";
    // lblRadioYes.style.color = "black";
    // lblRadioNo.style.color = "black";
    // lblRadioYes  = false;
    // lblRadioNo = false;
    dteAssigndate.value = getCurrentDate();

    disabledButton(true, false);

    let customerArray = [txtName, txtMobile, txtCustomerEmail, txtContactPName, txtContactPMobile, txtContactPEmail, txtDescription, cmbCustomerCategory, cmbCustomerStatus]
    setIDStyle(customerArray, "1px solid #cacfe7");

    cmbCustomerStatus.style.borderBottom = "1px solid green";
}


const checkErrors = () => {

    let errors = "";
    if (customer.customer_name == null) {
        errors = errors + "Customer name is not entered.. \n";
    }

    if (customer.customer_category_id == null) {
        errors = errors + "Company category is not entered.. \n";
    } else {

        if (customer.customer_category_id.name == "individual") {

            if (customer.mobile == null) {
                errors = errors + "Customer mobile is not entered.. \n";
            }

            if (customer.customer_email == null) {
                errors = errors + "Customer email is not entered.. \n";
            }

        } else {
            if (customer.customer_category_id.name == "company") {

                if (customer.contactp_name == null) {
                    errors = errors + "Company name is not entered.. \n "
                }

                if (customer.contactpmobile == null) {
                    errors = errors + "Company Contact Number is not entered.. \n";
                }

                if (customer.contactp_email == null) {
                    errors = errors + "Company Contact email is not entered.. \n";
                }
            }
        }
    }

    // txtContactPName.style.borderBottom = style;
    // txtContactPMobile.style.borderBottom = style;
    if (customer.customer_type_id = null) {
        errors = errors + "Customer type is not entered.. \n";
    }

    return errors;
}

//(checkEerrors(),submitConfirmQuestion,objectQs0Properties,url,redirectUrl,refreshTable(),refreshUForm(),modalID)
function buttonSubmitMC() {
    submitmodal(checkErrors, "Customer Full Name :", customer, customer.customer_name, "/customer", "/product", refreshCustomerTable, refreshCustomerForm, "#modalCustomerForm");
}


const formRefill = (ob, rowno) => {

    customer = getServiceRequest("/customer/getbyid/" + ob.id)
    oldcustomer = getServiceRequest("/customer/getbyid?id=" + ob.id)


    //set value into fields
    txtName.value = customer.customer_name;
    txtMobile.value = customer.mobile;
    txtCustomerEmail.value = customer.customer_email;
    customerCategories = getServiceRequest("/customerCategory/list");
    fillSelectFeild(cmbCustomerCategory, "Select Category", customerCategories, 'name', customer.customer_category_id.name);
    if (customer.customer_category_id.name == "company") {

        // txtCompanyName.value = customer.company_name;
        // txtCompanyNumber.value = customer.company_contactnumber;
        // txtCompanyEmail.value = customer.company_email;
        txtContactPName.value = customer.contactp_name;
        txtContactPMobile.value = customer.contactp_mobile;
        txtContactPEmail.value = customer.contactp_email;

    }

    //option clue checaking
    if (customer.description != undefined)
        txtDescription.value = customer.description; else txtDescription.value = "";

    //radio button value checking
    customerCategories = getServiceRequest("/customerCategory/list");
    customerStatuses = getServiceRequest("/customerstatus/list");

    fillSelectFeild(cmbCustomerCategory, "Select Category", customerCategories, 'name', customer.customer_category_id.name);
    //fillSelectFeild(cmbCustomerType, "Select Types", types, 'name', customer.customer_type_id.name);
    fillSelectFeild(cmbCustomerStatus, "Select Customer status", customerStatuses, 'name', customer.customerstatus_id.name);

    let customerArray = [txtName, txtMobile, txtCustomerEmail, txtContactPName, txtContactPMobile, txtContactPEmail, txtDescription, cmbCustomerCategory, cmbCustomerStatus]
    setIDStyle(customerArray, "2px dotted green");


    // showModal("#modalCustomerForm");
    btnAddNew.click();

    disabledButton(false, true);


}


//setstyle
// txtCompanyName.style.border = style;
//  txtCompanyNumber.style.border = style;
//  txtCompanyEmail.style.border = style;


const checkUpdate = () => {
    let updates = "";

    if (customer != null && oldcustomer != null) {

        if (customer.customer_name != oldcustomer.customer_name) {
            updates = updates + "Customer name has changed " + oldcustomer.customer_name
                + "into " + customer.customer_name + "\n";
        }
        if (customer.mobile != oldcustomer.mobile) {
            updates = updates + "Customer mobile has changed " + oldcustomer.mobile
                + "into " + customer.mobile + "\n";
        }
        if (customer.customer_email != oldcustomer.customer_email) {
            updates = updates + "Customer Email has changed " + oldcustomer.customer_email
                + "into " + customer.customer_email + "\n";
        }
        if (customer.customer_category_id.name != oldcustomer.customer_category_id.name) {
            updates = updates + "Customer Type has changed " + oldcustomer.customer_category_id.name
                + " into " + customer.customer_category_id.name + "\n";
        }
        if (customer.contactp_name != oldcustomer.contactp_name) {
            updates = updates + "Customer company contact person name has changed " + oldcustomer.contactp_name
                + "into " + customer.contactp_name + "\n";
        }
        if (customer.contactp_email != oldcustomer.contactp_email) {
            updates = updates + "Customer company email has changed " + oldcustomer.contactp_email
                + "into " + customer.contactp_email + "\n";
        }
        if (customer.contactp_mobile != oldcustomer.contactp_mobile) {
            updates = updates + "Customer  company contact person mobile number has changed " + oldcustomer.contactp_mobile
                + "into " + customer.contactp_mobile + "\n";
        }

        if (customer.customerstatus_id.name != oldcustomer.customerstatus_id.name) {
            updates = updates + "Customer Status has changed " + oldcustomer.customerstatus_id.name
                + "into " + customer.customerstatus_id.name + "\n";
        }

    }
    return updates;
}

function buttonUpdateMC() {
    //(updateObj,checkErrors,checkUpdate,url,obj,refreshTable,refreshUForm,modalformID)
    updatemodal("customer", checkErrors, checkUpdate, "/customer", customer, refreshCustomerTable, refreshCustomerForm, "#modalCustomerForm")
}

const rowDelete = (ob, rowno) => {

    let deleteMsg = "Are you sure to delete following customer..? \n"

        + "\n Customer Name : " + ob.customer_name
        + "\n Customer number : " + ob.mobile;


    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {
        let deleteServerResponce;

        $.ajax("/customer", {
            async: false,
            type: "DELETE", // method delete
            data: JSON.stringify(ob), // object
            contentType: "application/json",
            success: function (susResdata, susStatus, ajresob) {
                deleteServerResponce = susResdata;
            },
            error: function (errRsOb, errStatus, errorMsg) {
                deleteServerResponce = errorMsg;
            }
        });

        if (deleteServerResponce == "0") {

            alert("Delete Successfull..!");
            refreshCustomerTable();

        } else {
            window.alert("You have following error \n" + deleteServerResponce);
        }
    }
}


function showCompanyForm() {


    /* if (cmbCustomerCategory.value.toString() == "company") */
    if (JSON.parse(cmbCustomerCategory.value).name == "company") {
        divContactdetails.style.display = "none"
        divCompanyDetails.style.display = "block";
    } else {
        divContactdetails.style.display = "block"
        divCompanyDetails.style.display = "none";
    }
}

document.getElementById("txtContactPEmail").addEventListener('change',()=>{
    txtCustomerEmail.value= customer.contactp_email
   textFeildValidtor(txtCustomerEmail,'^[A-Za-z0-9]{5,25}[@][a-z]{4,10}[.][a-z]{2,5}$','customer','customer_email','oldcustomer')
    }
)

document.getElementById("txtContactPMobile").addEventListener('change',()=>{
    txtMobile.value = customer.contactpmobile;
    textFeildValidtor(txtMobile,'^[0][7][01245678][0-9]{7}$','customer','mobile','oldcustomer')
    }
)




//divContactdetails

function buttonModalCloseMC() {
    buttonCloseModal("#modalCustomerForm", refreshCustomerForm);

}

function buttonModalCloseMMCVM() {
    buttonCloseVModal("#modalViewCustomerForm");

}






//View


function printRowItemMC() {
    let newWindow = window.open();
    // <script>
    //         // Avoid using about:blank by setting a valid URL from the start
    //         window.location.href = 'https://example.com';
    //     </script>
    newWindow.document.write("<link rel='stylesheet' href= 'resources/bootstrap/css/bootstrap.min.css'>" + "<h2>Customer Details</h2>" + "<div>" + tablePrintCustomer.outerHTML + "</div>");
    setTimeout(function () {
        newWindow.print();
        newWindow.close();

    }, 10000);
}

const rowView = (ob, rowind) => {
    $("#modalViewCustomerForm").modal("show");

//as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.
    printCustomer = getServiceRequest("/customer/getbyid/" + ob.id);


    tdCode.innerText = printCustomer.customer_code;
    tdName.innerText = printCustomer.customer_name;
    tdMobile.innerText = printCustomer.mobile;
    tdCompanyorNot.innerText = printCustomer.customer_category_id.name;
    tdEmail.innerText = printCustomer.customer_email;
    tdCompany.innerText = printCustomer.company_name
    tdCompanyCNumber.innerText = printCustomer.company_contactnumber;
}


