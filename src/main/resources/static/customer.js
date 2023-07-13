window.addEventListener('load', loadUI);

function loadUI() {
    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Customer");
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
    let dispalyPropertyList = [ 'customer_code', 'customer_name', 'mobile', 'customer_email', 'customer_category_id.name','customer_type_id.name','customerstatus_id.name'];
    //Property type list
    let dispalyPropertyDTList = [ 'text', 'text', 'text', 'text', 'object', 'object', 'object'];

    //called filldataintotable function for fill data
    fillDataIntoTable(tableCustomer,customers,dispalyPropertyList,dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);
    // need to add jquerty table
    $('#tableCustomer').dataTable();

}

const rowView = () => { }


//create from refresh funcion for refresh from element
const refreshCustomerForm = () => {
    customer = new Object();
    oldcustomer = null;


    //dropdowns
    customerStatuses = getServiceRequest("/customerstatus/list");
    fillSelectFeild(cmbCustomerStatus, "Select Status", customerStatuses, 'name', 'Active');
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
    txtCompanyName.value = "";
    txtCompanyNumber.value = "";
    txtCompanyEmail.value = "";
    //cmbCustomerType.value = "";
    // lblRadioYes.style.color = "black";
    // lblRadioNo.style.color = "black";
    // lblRadioYes  = false;
    // lblRadioNo = false;
    dteAssigndate.value = getCurrentDate();
  
    disabledButton(true , false);

    setStyle("1px solid #cacfe7")
    

    cmbCustomerStatus.style.borderBottom = "1px solid green";
}

function disabledButton(addbtn , updbtn){

    if(addbtn && lggeduserprivilage.ins){
        buttonAdd.disabled = false; 
        $("buttonAdd").css("pointer-events","all");
        $("buttonAdd").css("cursor","pointer");
    }else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events","all");
        $("#buttonAdd").css("cursor","not-allowed");
    }
    if(updbtn && lggeduserprivilage.upd){
        buttonUpdate.disabled = false;
        $("#buttonUpdate").css("pointer-events","all");
        $("#buttonUpdate").css("cursor","pointer");
    }else {
        buttonUpdate.disabled = true;
        $("#buttonUpdate").css("pointer-events","all");
        $("#buttonUpdate").css("cursor","not-allowed");
    }

}

function setUiElementColor(style) {
    txtFirstname.style.borderBottom = style;
    txtLastname.style.borderBottom = style;
    txtNIC.style.borderBottom = style;
    txtMobile.style.borderBottom = style;
    cmbCstomerStatus.style.borderBottom = style;
    cmbCompanyName.style.borderBottom = style;
}

const  checkErrors = () => {

    let errors = "";

    if(customer.customer_name == null){
        errors = errors + "Customer name is not entered.. \n";
    }

    if(customer.mobile == null){
        errors = errors + "Customer mobile is not entered.. \n";
    }

    if(customer.customer_email == null){
        errors = errors + "Customer email is not entered.. \n";
    }
   
    
    if(customer.customerstatus_id == null){
        errors = errors + "Company status is not entered.. \n";
    }
    
    if(customer.customer_category_id == null){
        errors = errors + "Company category is not entered.. \n";
    }else{
        if(customer.customer_category_id.name == "company"){

            if(customer.company_name == null){
                errors = errors + "Company name is not entered.. \n "
            }
        
            if(customer.company_contactnumber == null){
                errors = errors + "Company Contact Number is not entered.. \n";
            }
        
            if(customer.company_email == null){
                errors = errors + "Company email is not entered.. \n";
            }
        }
    }

    
    if(customer.customer_type_id = null){
        errors = errors + "Customer type is not entered.. \n";
    }

    return errors;
}

function buttonSubmitMC() {
//need to check form errors
    let errors = checkErrors();

    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following... " +
            "\n Customer Full Name : " + customer.customer_name;
        let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
            $.ajax("/customer", {
                async: false,
                type: "POST",
                data: JSON.stringify(customer),
                contentType: "application/json",
                success: function (susResdata, susStatus, ajresob) {
                    postServieResponce = susResdata;
                },
                error: function (errRsOb, errStatus, errorMsg) {
                    postServieResponce = errorMsg;
                }

            });

            if (postServieResponce == "0") {

                alert("Add Successfull..!");
                refreshCustomerTable();
                refreshCustomerForm();
                $('#modalCustomerForm').modal('hide');
            } else {
                window.alert("You have following error \n" + postServieResponce);
            }

        }
    } else {
        window.alert("You have following error \n" + errors);
    }
}

    const formRefill = (ob, rowno) => {
         rowno
        customer = JSON.parse(JSON.stringify((ob)));
        oldcustomer = JSON.parse(JSON.stringify((ob)))

    customergetbyid =getServiceRequest("/customer/getbyid/" )


        //set value into fields
        txtName.value = customer.customer_name;
        txtMobile.value = customer.mobile;
        txtCustomerEmail.value = customer.customer_email;
        showCompanyForm();
        if (customer.customer_category_id.name == "company") {

            txtCompanyName.value = customer.company_name;
            txtCompanyNumber.value = customer.company_contactnumber;
            txtCompanyEmail.value = customer.company_email;
        }


        //option clue checaking
        if (customer.description != undefined)
            txtDescription.value = customer.description; else txtDescription.value = "";

        //radio button value checking


        fillSelectFeild(cmbCustomerCategory, "Select Category", categories, 'name', customer.customer_category_id.name);
        //fillSelectFeild(cmbCustomerType, "Select Types", types, 'name', customer.customer_type_id.name);
        fillSelectFeild(cmbCustomerStatus, "Select Customer status", customerstatuses, 'name', customer.customerstatus_id.name);

        setStyle("2px dotted green");

        $('#modalCustomerForm').modal('show');

        disabledButton(false, true);


    }

    function setStyle(style) {
        txtName.style.border = style;
        txtMobile.style.border = style;
        txtCustomerEmail.style.border = style;
        txtCompanyName.style.border = style;
        txtCompanyNumber.style.border = style;
        txtCompanyEmail.style.border = style;
        txtDescription.style.border = style;
        cmbCustomerCategory.style.borderBottom = style;
        cmbCustomerStatus.style.borderBottom = style;

    }

    const checkUpdate = () => {
        let update = "";

        if (customer != null && oldcustomer != null) {

            if (customer.customer_name != oldcustomer.customer_name) {
                updates = updates + "Customer name has changed " + oldcustomer.customer_name
                    + "into " + customer.customer_name + "\n";
            }
            if (customer.mobile != oldcustomer.mobile) {
                updates = updates + "Customer name has changed " + oldcustomer.mobile
                    + "into " + customer.mobile + "\n";
            }
            if (customer.customer_email != oldcustomer.customer_email) {
                updates = updates + "Customer name has changed " + oldcustomer.customer_email
                    + "into " + customer.customer_email + "\n";
            }
            if (customer.customer_ != oldcustomer.customer_name) {
                updates = updates + "Customer name has changed " + oldcustomer.customer_name
                    + "into " + customer.customer_name + "\n";

            }
            if (customer.company_name != oldcustomer.company_name) {
                updates = updates + "Customer name has changed " + oldcustomer.company_name
                    + "into " + customer.company_name + "\n";
            }
            if (customer.company_email != oldcustomer.company_email) {
                updates = updates + "Customer name has changed " + oldcustomer.company_email
                    + "into " + customer.company_email + "\n";
            }
            if (customer.company_contactnumber != oldcustomer.company_contactnumber) {
                updates = updates + "Customer name has changed " + oldcustomer.company_contactnumber
                    + "into " + customer.company_contactnumber + "\n";
            }

        }
        return update;
    }

    function buttonUpdateMC() {
        //
        let errors = checkErrors();
        if (errors == "") {
            //
            let updates = checkUpdate();
            if (updates == "") {

                window.alert("Nothing updated...! \n ");
            } else {

                let updateResponce = window.confirm("Are you sure to update following customer..? \n" + updates);

                if (updateResponce) {
                    let putResponce;

                    $.ajax("/customer", {
                        async: false,
                        type: "PUT", // method delete
                        data: JSON.stringify(customer), // object
                        contentType: "application/json",
                        success: function (susResdata, susStatus, ajresob) {
                            putResponce = susResdata;
                        },
                        error: function (errRsOb, errStatus, errorMsg) {
                            putResponce = errorMsg;
                        }
                    });


                    if (putResponce == "0") {
                        window.alert("Update Successfully...!");
                        refreshCustomerTable();
                        refreshCustomerForm();
                        $("#modalCustomerForm").modal("hide");


                    } else {
                        //
                        window.alert("Fail to update ...! \n " + putResponce);
                    }

                }
            }
        } else {

            window.alert("You have following error in your form...! \n " + errors);
        }

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

    if (JSON.parse(cmbCustomerCategory.value).name == "company") {
        divCompanyDetails.style.display = "block";
    } else {
        divCompanyDetails.style.display = "none";
    }
}