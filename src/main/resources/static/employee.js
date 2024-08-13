//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Employee");

    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}


    //called refreshtable function -- >
    refreshTable();

//called refreshEmployeeForm function -- >
    refreshEmployeeForm();


}

//define refresh table function
const refreshTable = () => {

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
    let displayPropertyList = ['calling_name', 'fullname', 'nic', 'mobile', 'email', 'employeestatus_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'text', 'text', 'text', 'text', 'object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableEmployee, employees, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, true, lggeduserprivilage);
    for (let index in employees) {
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


//create function for refresh Form
const refreshEmployeeForm = () => {

    document.getElementById("modalViewEmployeeForm").style.pointerEvents = "auto";
    employee = new Object();
    oldemployee = null;

    // civilstatuses = [{ id: 1, name: "Single" }, { id: 2, name: "Married" }];
    civilstatuses = new Array();
    $.ajax('/civilstatus/list', {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            civilstatuses = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            civilstatuses = [];
        }
    })
    //
    fillSelectFeild(cmbCivilStatus, "Select Civilstatus", civilstatuses, 'name', '');

    /*  designations = [{ id: 1, name: "Manager" }, { id: 2, name: "Assis-Manager" },
          , { id: 3, name: "Cashier" }, { id: 4, name: "Stock Manager" }];*/
    designations = new Array();
    $.ajax('/designation/list', {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            designations = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            designations = [];
        }
    })
    fillSelectFeild(cmbDesignation, "Select Desiganation", designations, 'name', '');

    /* employeeStatuses = [{ id: 1, status: "Working" }, { id: 2, status: "Resign" },
         { id: 3, status: "Deleted" }];*/
    employeeStatuses = new Array();
    $.ajax('/employeestatus/list', {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            employeeStatuses = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            employeeStatuses = [];
        }
    })
    fillSelectFeild(cmbEmployeeStatus, "Select Status", employeeStatuses, 'name', 'Working', true);
    cmbEmployeeStatus.style.borderBottom = "2px solid green";
    //Defaultly value is gained when the data is parsed here it is worki/ng
    employee.employeestatus_id = JSON.parse(cmbEmployeeStatus.value);

    // need to empty form element

    txtFullname.value = "";
    txtCallingname.value = "";
    txtNIC.value = "";
    dteDOB.value = "";

    let currentdate = new Date();
    let mindate = new Date();
    let maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear() - 18);
    dteDOB.max = getCurrentDate2("date", maxDate);

    mindate.setFullYear(mindate.getFullYear() - 60);
    dteDOB.min = getCurrentDate2("date", mindate);

    txtMobile.value = "";
    txtDescription.value = "";
    txtAddress.value = "";
    txtLand.value = "";
    txtEmail.value = "";
    lblRadioMale.style.color = "black";
    lblRadioFemale.style.color = "black";
    radioMale.checked = false;
    radioFemale.checked = false;
    radioMale.disabled = true;
    radioFemale.disabled = true;

    //photo reset
    employee.emp_photo = null;
    employee.emp_photo_name = "";
    employeeImage.src = "resources/images/user_photo/user.png";
    txtempPhoto.value = "";
    empFilePhoto.files = null;


    dteAssigndate.value = getCurrentDate();


    console.log(lggeduserprivilage);
    disabledButton(true, false);

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
    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following ... " +
            "\n Employee Full Name : " + employee.fullname +
            "\n Employee nic : " + employee.nic;
        let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
            $.ajax("/employee", {
                async: false,
                type: "POST", // method delete
                data: JSON.stringify(employee), // object
                contentType: "application/json",
                success: function (susResdata, susStatus, ajresob) {
                    postServieResponce = susResdata;
                    console.log(postServieResponce);
                },
                error: function (errRsOb, errStatus, errorMsg) {
                    postServieResponce = errorMsg;
                }
            });

            if (postServieResponce == "0") {

                alert("Add Successfull..!");
                refreshTable();
                refreshEmployeeForm();
                $('#modalEmployeeForm').modal('hide');
                window.location.replace("/user");
            } else {
                window.alert("You have following error \n" + postServieResponce);
            }


        }

    } else {

        alert("Form have following errors \n" + errors);
    }


}


//
const formRefill = (ob, rowno) => {


    employee = new Object();
    oldemployee = new Object();

    $.ajax('/employee/getbyid/' + ob.id, {
        async: false,
        dataType: 'json',
        //responce obj -xhr
        success: function (data, status, xhr) {
            employee = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            employee = {};
        }
    })

    $.ajax('/employee/getbyid?id=' + ob.id, {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            oldemployee = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            oldemployee = {};
        }
    })

    //refill photo
    if (employee.emp_photo == null) {
        employeeImage.src = "resources/images/user_photo/user.png";
        txtempPhoto.value = "";
    } else {
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
    if (employee.land != "")
        txtLand.value = employee.land; else txtLand.value = "-";

    if (employee.description == "") {
        txtDescription.value = "No data";
    } else {
        txtDescription.value = employee.description;
    }

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

    if (employee.land == undefined)
        txtLand.style.borderBottom = "2px solid #ced4da";

    btnAddNew.click();

    disabledButton(false, true);


}

employeeArray = [txtFullname, txtCallingname, txtNIC, txtLand, txtMobile, txtDescription, txtAddress, txtEmail, dteDOB, cmbDesignation, cmbCivilStatus, cmbEmployeeStatus]
//

const rowView = (ob, rowno) => {

    formRefill(ob, rowno);
    employeeArray = [txtFullname, txtCallingname, txtNIC, txtLand, txtMobile, txtDescription, txtAddress, txtEmail, dteDOB, cmbDesignation, cmbCivilStatus, cmbEmployeeStatus]

    setIDStyle(employeeArray, "2px solid #ced4da");
    document.getElementById("modalViewEmployeeForm").style.pointerEvents = "none";


}

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


}

//photo settings
document.getElementById("btnClearImage").addEventListener("click", () => {
    employee.emp_photo = null;
    employee.emp_photo_name = "";
    employeeImage.src = "resources/images/user_photo/user.png";
    txtempPhoto.value = "";
    empFilePhoto.files = null;
})


// let dob = document.getElementById("dteDOB")
// dob.addEventListener("change", checkDoB())
///
const checkUpdate = () => {
    let updates = "";

    if (employee != null && oldemployee != null) {

        if (employee.calling_name != oldemployee.calling_name) {
            updates = updates + "Employee Calling is Changed " + oldemployee.calling_name
                + " into " + employee.calling_name + " \n";
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
        if (employee.designation_id.name != oldemployee.designation_id.name) {
            updates = updates + "Employee Designation is Changed \n";
        }

        if (employee.employeestatus_id.name != oldemployee.employeestatus_id.name) {
            updates = updates + "Employee status is Changed \n";
        }

        if ((employee.emp_photo) != (oldemployee.emp_photo)) {
            updates = updates + "Employee image is Changed \n";
        }
        if ((employee.gender) != (oldemployee.gender)) {
            updates = updates + "Employee image is Changed \n";
        }
        if ((employee.email) != (oldemployee.email)) {
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
                let putResponce;

                $.ajax("/employee", {
                    async: false,
                    type: "PUT", // method delete
                    data: JSON.stringify(employee), // object
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

    if (deleteUserResponce) {
        let deleteServerResponce;

        $.ajax("/employee", {
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
            refreshTable();
        } else {
            window.alert("You have following error \n" + deleteServerResponce);
        }
    }
}


function checkDoB() {
    console.log(dteDOB.value);

    let datepattern = new RegExp("^[0-9]{4}[-][0-9]{2}[0-2]{2}$");


    if (datepattern.test(dteDOB.value)) {
        let empDob = new Date(dteDOB.value);
        let currentdate = new Date();

        let dobTime = empDob.getTime();
        let currentTime = currentdate.getTime();
        let dobGapTime;

        //after 1970
        if (empDob.getFullYear() > 1970)
            dobGapTime = currentTime - dobTime;
        else
            //calculation before 1970
            dobGapTime = currentTime + (-1 * dobTime);

        if ((18 * 365 * 24 * 60 * 1000) < dobGapTime && dobGapTime < (60 * 365 * 24 * 60 * 60 * 1000)) {
            dteDOB.style.borderBottom = "2px solid green";
        } else {
            dteDOB.style.borderBottom = "2px solid red";
        }

    } else {
        dteDOB.style.borderBottom = "2px solid red"
    }
}

//buttonModalCloseMC( "#modalEmployeeForm",refreshEmployeeForm());


function buttonModalCloseMC() {
    buttonCloseModal("#modalEmployeeForm", refreshEmployeeForm);

}

function buttonModalCloseMCVM() {
    buttonCloseVModal("#modalViewEmployeeForm");
}


function buttonClearMC() {
    refreshEmployeeForm();
}


// employee.nice =convertIDtoYearDate

const txtNICInputEl = document.getElementById("txtNIC");
txtNICInputEl.addEventListener('keyup', () => {
    if (txtNICInputEl.value != '') {
        let regpattern = new RegExp("^(([5,6,7,8,9]{1}[0-9]{1}[0,1,2,3,5,6,7,8]{1}[0-9]{6}[v|V|x|X])|([1,2]{1}[0,9]{1}[0-9]{2}[0,1,2,3,5,6,7,8]{1}[0-9]{7}))*$");
        if (regpattern.test(txtNICInputEl.value)) {
            employee.nic =  txtNICInputEl.value ;
            txtNICInputEl.style.borderBottom = "2px solid green";
            let bdayYear = convertIDtoYearDate(txtNICInputEl.value).year;
            let bdayMonth = (convertIDtoYearDate(txtNICInputEl.value).month);
            let bdayDay = convertIDtoYearDate(txtNICInputEl.value).day;



            let BdayTxt = bdayYear + '-' + bdayMonth.toString().padStart(2,"0") + '-' + bdayDay.toString().padStart(2,"0");
            // console.log(BdayTxt);
            dteDOB.value = BdayTxt;
            dateFeildValidator(dteDOB, '', 'employee', 'dob', 'oldemployee');

            let gender = (convertIDtoYearDate(txtNICInputEl.value).gender)
            //set value into radio element
            if (gender) {
                radioMale.checked = true;
                employee.gender = "Male";
              //  radioMale.disabled = false;



            } else {
                radioFemale.checked = true;
             //   radioFemale.disabled = false;
                employee.gender = "Female"
            }
        } else {
            txtNICInputEl.style.borderBottom = "2px solid red";
            radioMale.disabled = true;
            radioFemale.disabled = true;
            dteDOB.value ="";
            dteDOB.style.borderBottom = "2px solid red"
        }
    } else {
        txtNICInputEl.style.borderBottom = "2px solid ced4da";
        radioMale.disabled = true;
        radioFemale.disabled = true;
        dteDOB.style.borderBottom = "2px solid ced4da"
    }


});

//NIC function

//var NicNo = '199951003776';


/* Convert ID into year and day Text */
const convertIDtoYearDate = (NicNo) => {
    if (NicNo.length == 10) {
        year = parseInt("19" + NicNo[0] + NicNo[1]);
        dayText = parseInt(NicNo[2] + NicNo[3] + NicNo[4]);
        //console.log("NIC 10 digits. Year : "+year+" | day-text : "+dayText);
    } else if (NicNo.length == 12) {
        year = parseInt(NicNo[0] + NicNo[1] + NicNo[2] + NicNo[3]);
        dayText = parseInt(NicNo[4] + NicNo[5] + NicNo[6]);
        //console.log("NIC 12 digits. Year : "+year+" | day-text : "+dayText);
    } else {
        console.log("NIC Is Not Valid..");
    }
    gender = getGenderAndDayofYear(dayText);

    if (isLeapYear(year)) {
        let rLY = setDayMonthLeapYear(year, gender.dayOfYear);
        dateOutPut = new Date(year, (rLY.month - 1), rLY.day);
        month = rLY.month;
        day = rLY.day;

    } else {
        if (gender.dayOfYear < 1 || gender.dayOfYear > 365) {
            console.log("Invalid Id Number");
        } else {
            let rNY = setDayMonthNormalYear(gender.dayOfYear) //rNY is result of normal year funtion
            dateOutPut = new Date(year, (rNY.month - 1), rNY.day);
            month = rNY.month;
            day = rNY.day;

        }
    }
    return {
        year: year,
        month: month,
        day: day,
        dateOutPut: dateOutPut,
        dayOfYear: gender.dayOfYear,
        gender: gender.male
    };
}
/* Convert ID into year and day Text End*/


/* Checking For Gender  (if gender is male functions returns true)*/
const getGenderAndDayofYear = (dayValues) => {
    if (dayValues < 500) {
        return {male: true, dayOfYear: dayValues};
    } else {
        return {male: false, dayOfYear: (dayValues - 500)};
    }
}
/* Checking For Gender Ends*/


/* Checking For Leap year or not  */
const isLeapYear = (yearInt) => {
    // Three conditions to find out the leap year
    if ((0 == yearInt % 4) && (0 != yearInt % 100) || (0 == yearInt % 400)) {
        //console.log(yearInt + ' is a leap year');
        return true;
    } else {
        //console.log(yearInt + ' is not a leap year');
        return false;
    }
}
/* Checking For Leap year or not Ended */


/* Checking Bday Months in Normal Year*/
const setDayMonthNormalYear = (dayText) => {
    //Month
    if (dayText < 32) {
        day = dayText;
        month = "January";
        monthDigit = 0;
    } else if (dayText < 60) {
        day = dayText - 31;
        month = "Feb";
        monthDigit = 1;
    } else if (dayText < 91) {
        day = dayText - 59;
        month = "March";
        monthDigit = 2;
    } else if (dayText < 121) {
        day = dayText - 90;
        month = "April";
        monthDigit = 3;
    } else if (dayText < 152) {
        day = dayText - 120;
        month = "May";
        monthDigit = 4;
    } else if (dayText < 182) {
        day = dayText - 151;
        month = "June";
        monthDigit = 5;
    } else if (dayText < 213) {
        day = dayText - 181;
        month = "July";
        monthDigit = 6;
    } else if (dayText < 244) {
        day = dayText - 212;
        month = "August";
        monthDigit = 7;
    } else if (dayText < 274) {
        day = dayText - 243;
        month = "September";
        monthDigit = 8;
    } else if (dayText < 305) {
        day = dayText - 274;
        month = "October";
        monthDigit = 9;
    } else if (dayText < 335) {
        day = dayText - 305;
        month = "November";
        monthDigit = 10;
    } else {
        day = dayText - 334;
        month = "December";
        monthDigit = 11;
    }
    return {day: day, month: (monthDigit + 1)};
}
/* Checking Bday Months in Normal Year End*/

/* Checking Bday Months in Leap Year*/
const setDayMonthLeapYear = (year, dayText) => {
    let leapYearDate = new Date(year, 0);
    if (dayText < 32) {
        leapYearDate.setMonth(0);
        leapYearDate.setDate(dayText);
    } else if (dayText > 31 && dayText < 61) {
        leapYearDate.setMonth(1);
        leapYearDate.setDate(dayText - 31);
    } else if (dayText > 60) {
        leapYearDate.setDate(dayText);
    }
    let leapYearMonth = (leapYearDate.getMonth() + 1);
    let leapYearDay = leapYearDate.getDate();

    return {day: leapYearDay, month: leapYearMonth}
}
/* Checking Bday Months in Leap Year End*/


//console.log(covertIDtoYearDate('199951003776'));

