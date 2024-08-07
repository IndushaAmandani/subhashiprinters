//add funtion browser onload event
window.addEventListener('load',loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Employee");

    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}


    //called refreshtable function -- >
    refreshTable();

//called refreshEmployeeForm function -- >
    refreshEmployeeForm();
    let dob = document.getElementById("dteDOB")
    dob.addEventListener("change",checkDoB())

}

//define refresh table function
const refreshTable = () =>{

    // create array for stor data
    employees = new Array();

    employees = getServiceRequest("/employee/findall");
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
    let displayPropertyList = ['calling_name', 'fullname', 'nic' ,'mobile' ,'email','employeestatus_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'text','text','text','text','object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableEmployee,employees,displayPropertyList,displayDatatypeList,formRefill , rowDelete , rowView,true,lggeduserprivilage);
    for (let index in employees ){
        if (employees[index].employeestatus_id.name == "Resign") {
            tableEmployee.children[1].children[index].style.backgroundColor = "#ad9393";
            tableEmployee.children[1].children[index].style.color = "#0f100f";
            tableEmployee.children[1].children[index].children[7].children[1].disabled = true;
            tableEmployee.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableEmployee.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    // need to add jquerty table
    $('#tableEmployee').dataTable();

}


const rowView = (ob) => {
    $("#modalViewEmployeeForm").modal("show");

     //creting html form or table and name those td in following

    tdfullname.innerText   = ob.fullname;
    tdCName.innerText = ob.calling_name;
    tdnic.innerText = ob.nic;
    tddob.innerText = ob.dob;
    tdMobile.innerText = ob.mobile;
    tdland.innerText = ob.land;
    tdaddress.innerText = ob.address;

}


//create function for refresh Form
const refreshEmployeeForm = () => {

    employee = new Object();
    oldemployee = null;

   // civilstatuses = [{ id: 1, name: "Single" }, { id: 2, name: "Married" }];
    civilstatuses = new Array();
    $.ajax('/civilstatus/list',{
        async: false,
        dataType:'json',
        success: function (data,status, xhr){
            civilstatuses = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            civilstatuses = [];
        }
    })
    //
    fillSelectFeild(cmbCivilStatus, "Select Civilstatus", civilstatuses, 'name', '');

  /*  designations = [{ id: 1, name: "Manager" }, { id: 2, name: "Assis-Manager" },
        , { id: 3, name: "Cashier" }, { id: 4, name: "Stock Manager" }];*/
    designations = new Array();
    $.ajax('/designation/list',{
        async: false,
        dataType:'json',
        success: function (data,status, xhr){
            designations = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            designations = [];
        }
    })
    fillSelectFeild(cmbDesignation, "Select Desiganation", designations, 'name', '');

   /* employeeStatuses = [{ id: 1, status: "Working" }, { id: 2, status: "Resign" },
        { id: 3, status: "Deleted" }];*/
    employeeStatuses = new Array();
    $.ajax('/employeestatus/list',{
        async: false,
        dataType:'json',
        success: function (data,status, xhr){
            employeeStatuses = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            employeeStatuses = [];
        }
    })
    fillSelectFeild(cmbEmployeeStatus, "Select Status", employeeStatuses, 'name', 'Working');

 //Defaultly value is gained when the data is parsed here it is worki/ng
    // employee.employeestatus_id = JSON.parse(cmbEmployeeStatus.value);

    // need to empty form element

    txtFullname.value = "";
    txtCallingname.value = "";
    txtNIC.value = "";
    dteDOB.value = "";

    let currentdate = new Date();
    let mindate = new Date();
    let maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear()-18);
    dteDOB.max = getCurrentDate2("date",maxDate);

    mindate.setFullYear(mindate.getFullYear()-60);
    dteDOB.min = getCurrentDate2("date",mindate);

    txtMobile.value = "";
    txtDescription.value = "";
    txtAddress.value = "";  
    txtLand.value = "";  
    txtEmail.value = "";  
    lblRadioMale.style.color = "black";  
    lblRadioFemale.style.color = "black";  
    radioMale.checked = false;
    radioFemale.checked = false;

    //photo reset
    employee.emp_photo = null;
    employee.emp_photo_name = "";
    employeeImage.src = "resources/images/user_photo/user.png";
    txtempPhoto.value = "";
    empFilePhoto.files = null;


    dteAssigndate.value = getCurrentDate();


console.log(lggeduserprivilage);
   disabledButton(true,false);

    setStyle("2px solid #cacfe7");
}



//
const chechErrors = () => {
  let errors = "";

    if (employee.fullname == null) {
        errors = errors + "Employee Full name Not Entered.. \n";
    }

    if (employee.calling_name == null) {
        errors = errors + "Employee callingname Not Entered.. \n";
    }

    if (employee.nic == null) {
        errors = errors + "Employee nic Not Entered.. \n";
    }

    if (employee.gender == null) {
        errors = errors + "Employee gender Not selected.. \n";
    }

    if (employee.dob == null) {
        errors = errors + "Employee DOB Not selected.. \n";
    }

    if (employee.mobile == null) {
        errors = errors + "Employee Mobile not entered.. \n";
    }

    if (employee.designation_id == null) {
        errors = errors + "Employee Designation Not selected.. \n";
    }

    if (employee.employeestatus_id == null) {
        errors = errors + "Employee Status Not selected.. \n";
    }

    return errors;
}

function buttonSubmitMC() {
    console.log("Add employee")
    // need to check form errors
    let errors = chechErrors();
    if(errors == ""){
        let submitConfirmMsg = "Are you sure to add following ... " +
            "\n Employee Full Name : " + employee.fullname +
            "\n Employee nic : " + employee.nic;
        let userResponce = window.confirm(submitConfirmMsg);

        if(userResponce){
            let postServieResponce ;
            $.ajax("/employee", {
                async : false,
                type : "POST", // method delete
                data: JSON.stringify(employee) , // object
                contentType:"application/json",
                success: function (susResdata , susStatus , ajresob) {
                    postServieResponce = susResdata;
                    console.log(postServieResponce);
                },
                error: function (errRsOb , errStatus, errorMsg) {
                    postServieResponce = errorMsg;
                }
            });

            if(postServieResponce == "0"){

                alert("Add Successfull..!");
                refreshTable();
                refreshEmployeeForm();
                $('#modalEmployeeForm').modal('hide');
                window.location.replace("/user");
            }else {
                window.alert("You have following error \n" + postServieResponce);
            }


        }

    }else {

        alert("Form have following errors \n" + errors);
    }


}


//
const formRefill = (ob, rowno) => {


    employee = new Object();
    oldemployee = new Object();

    $.ajax('/employee/getbyid/'+ob.id,{
        async: false,
        dataType:'json',
        //responce obj -xhr
        success: function (data,status, xhr){
            employee = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            employee = {};
        }
    })

    $.ajax('/employee/getbyid?id='+ob.id,{
        async: false,
        dataType:'json',
        success: function (data,status, xhr){
            oldemployee = data;
        },
        error: function (rxhrdata,errorstatus,errorMessge){
            oldemployee = {};
        }
    })

    //refill photo
    if(employee.emp_photo == null){
        employeeImage.src = "resources/images/user_photo/user.png";
        txtempPhoto.value = "";
    }else{
        employeeImage.src = atob(employee.emp_photo);
        txtempPhoto.value = employee.emp_photo_name;
    }

    // set value into  feilds

    txtFullname.value = employee.fullname;
    txtCallingname.value = employee.calling_name;
    txtNIC.value = employee.nic;
    txtEmail.value = employee.email;
    dteDOB.value = employee.dob;
    txtAddress.value = employee.address;
    txtMobile.value = employee.mobile;
    txtLand.value = employee.land;
    

    //Optional calue checking
    if(employee.land != undefined )
    txtLand.value = employee.land; else  txtLand.value ="";

    if(employee.description != undefined)
    txtDescription.value = employee.description ; else txtDescription.value = "";

   //radio button value checking

    if (employee.gender == "Male") {
        radioMale.checked = true;
    } else {
        radioFemale.checked = true;
    }

    fillSelectFeild(cmbDesignation, "Select Desiganation", designations, 'name', employee.designation_id.name);
    fillSelectFeild(cmbCivilStatus, "Select Civilstatus", civilstatuses, 'name', employee.civilstatus_id.name);
    fillSelectFeild(cmbEmployeeStatus, "Select Emp Status", employeeStatuses, 'name', employee.employeestatus_id.name);


    
    setStyle("2px dotted green");

    if(employee.land == undefined )
        txtLand.style.borderBottom = "2px solid #ced4da";

    btnAddNew.click();

    disabledButton(false , true);


}



//
function setStyle(style) {
    txtFullname.style.border = style;
    txtCallingname.style.borderBottom = style;
    txtNIC.style.borderBottom = style;
    txtLand.style.borderBottom = style;
    txtMobile.style.borderBottom = style;
    txtDescription.style.borderBottom = style;
    txtAddress.style.borderBottom = style;
    txtEmail.style.borderBottom = style;
    dteDOB.style.borderBottom = style;

    cmbDesignation.style.borderBottom = style;
    cmbCivilStatus.style.borderBottom = style;
    cmbEmployeeStatus.style.borderBottom = style;

}

//photo settings
document.getElementById("btnClearImage").addEventListener("click", ()=>{
    employee.emp_photo = null;
    employee.emp_photo_name = "";
    employeeImage.src = "resources/images/user_photo/user.png";
    txtempPhoto.value = "";
    empFilePhoto.files = null;
})

///
const checkUpdate = () => {
    let updates = "";

    if (employee != null && oldemployee != null) {

        if (employee.calling_name != oldemployee.calling_name) {
            updates = updates + "Employee Calling is Changed " + oldemployee.calling_name
                + " into " + employee.calling_name +" \n";
        }

        if (employee.fullname != oldemployee.fullname) {
            updates = updates + "Employee Full name is Changed \n";
        }

        if (employee.nic != oldemployee.nic) {
            updates = updates + "Employee nic  is Changed \n";
        }

        if (employee.mobile != oldemployee.mobile) {
            updates = updates + "Employee mobile is Changed \n";
        }

        if (employee.land != oldemployee.land) {
            updates = updates + "Employee land is Changed \n";
        }

        if (employee.civilstatus_id.name != oldemployee.civilstatus_id.name) {
            updates = updates + "Employee civilstatus is Changed \n";
        }

        if (employee.employeestatus_id.name != oldemployee.employeestatus_id.name) {
            updates = updates + "Employee status is Changed \n";
        }

        if((employee.emp_photo) != (oldemployee.emp_photo)){
            updates = updates + "Employee image is Changed \n";
        }

    }

    return updates;
}

//
function buttonUpdateMC() {
    //
    let errors = chechErrors();
    if (errors == "") {
        //
        let updates = checkUpdate();
        if (updates == "") {

            window.alert("Nothing updated...! \n ");
        } else {

            let updateResponce = window.confirm("Are you sure to update following empoyee..? \n" + updates);

            if (updateResponce) {
                let putResponce ;

                $.ajax("/employee", {
                    async : false,
                    type : "PUT", // method delete
                    data: JSON.stringify(employee) , // object
                    contentType:"application/json",
                    success: function (susResdata , susStatus , ajresob) {
                        putResponce = susResdata;
                    },
                    error: function (errRsOb , errStatus, errorMsg) {
                        putResponce = errorMsg;
                    }
                });


                if (putResponce == "0") {
                    window.alert("Update Successfully...!");
                    refreshTable();
                    refreshEmployeeForm();

                    $('#modalEmployeeForm').modal("hide");


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


const rowDelete = (ob) => {

    let deleteMsg = "Are you sure to delete following employee..? \n"
                    + "Employee number : " + ob.number
                    + "\n Empoloyee Callingname : " + ob.calling_name
                    + "\n Employee Fullname : " + ob.fullname;

    let deleteUserResponce = window.confirm(deleteMsg);

    if(deleteUserResponce){
        let deleteServerResponce;

        $.ajax("/employee", {
            async : false,
            type : "DELETE", // method delete
            data: JSON.stringify(ob) , // object
            contentType:"application/json",
            success: function (susResdata , susStatus , ajresob) {
                deleteServerResponce = susResdata;
            },
            error: function (errRsOb , errStatus, errorMsg) {
                deleteServerResponce = errorMsg;
            }
        });

        if(deleteServerResponce == "0"){

            alert("Delete Successfull..!");
            refreshTable();
        }else {
            window.alert("You have following error \n" + deleteServerResponce);
        }
    }
}


function checkDoB(){
    console.log(dteDOB.value);

    let datepattern = new RegExp("^[0-9]{4}[-][0-9]{2}[0-2]{2}$");


    if(datepattern.test(dteDOB.value)){
        let empDob = new Date(dteDOB.value);
        let currentdate = new Date();

        let dobTime = empDob.getTime();
        let currentTime = currentdate.getTime();
        let dobGapTime ;
        
        //after 1970
        if(empDob.getFullYear()>1970)
        dobGapTime = currentTime - dobTime;
        else
        //calculation before 1970
        dobGapTime = currentTime +(-1 * dobTime);

        if((18*365*24*60*1000)< dobGapTime  && dobGapTime < (60*365*24*60*60*1000)){
            dteDOB.style.borderBottom = "2px solid green";
        }else{
            dteDOB.style.borderBottom = "2px solid red";
        }

    }else{
        dteDOB.style.borderBottom = "2px solid red"
    }
}
//buttonModalCloseMC( "#modalEmployeeForm",refreshEmployeeForm());



function buttonModalCloseMC() {
    buttonCloseModal("#modalEmployeeForm",refreshEmployeeForm);

}

function buttonModalCloseMCVM(){
    buttonCloseVModal("#modalViewEmployeeForm");
}


