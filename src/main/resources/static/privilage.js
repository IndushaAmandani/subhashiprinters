//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Privilage");
    $('[data-toggle="tooltip"]').tooltip();
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshPrivilageTable();

// called refreshproductForm function
    refreshPrivilageForm();


}


//define refresh table function
const refreshPrivilageTable = () => {

    privileges = getServiceRequest("/privilage/findall");


    let displayPropList = ['role_id.name','module_id.name', 'slect', 'insrt', 'updt', 'deltt'];
    let displayPropDataTypeList = ['object', 'object', getSelectPri, getInsertPri, getUpdatePri, getDeletePri];

    fillDataIntoTable(tablePrivilage, privileges, displayPropList, displayPropDataTypeList, refillForm, deleteRow, viewRow, true, lggeduserprivilage);
    for(index in privileges){
        tablePrivilage.children[1].children[index].children[7].children[1].style.display = "none";
    }
    $("#tablePrivilage").dataTable();

}

const refreshPrivilageForm = () => {

    privileage = new Object();
    oldprivileage = null;

    roles = getServiceRequest("role/list");
    modules = getServiceRequest("module/list");

    fillSelectFeild(cmbRoleName, "Select Role", roles, "name", "");
    cmbRoleName.style.borderBottom = "2px solid #ced4da";
    fillSelectFeild(cmbModuleName, "Select Modules", modules, "name", "");
    cmbModuleName.style.borderBottom = "2px solid #ced4da";
    checkSelect.checked = false;
    privileage.sel = false;
    lblSelect.innerText = "Select Not Granted";
    lblSelect.style.color = "black"
    checkInsert.checked = false;
    privileage.ins = false;
    lblInsert.innerText = "Insert Not Granted";
    lblInsert.style.color = "black"
    chekUpdate.checked = false;
    privileage.upd = false;
    lblUpdate.innerText = "Update Not Granted";
    lblUpdate.style.color = "black"

    checkDelete.checked = false;
    lblDelete.style.color = "black"
    privileage.del = false;
    lblDelete.innerText = "Delete Not Granted";

disabledButton(true,false);
};
//privilage- slect,insrt,updt,updt,deltt

const getSelectPri = (ob) => {
    let selectPri = "Not Granted";
    if (ob.sel) {
        selectPri = "Granted";
    }
    return selectPri;
}

const getInsertPri = (ob) => {
    let insertPri = "Not Granted";
    if (ob.ins) {
        insertPri = "Granted"
    }
    return insertPri;
}
const getUpdatePri = (ob) => {
    let updatePri = "Not Granted";
    if (ob.upd) {
        updatePri = "Granted";
    }
    return updatePri;
}

const getDeletePri = (ob) => {
    let deletPri = "Not Granted";
    if (ob.del) {
        deletPri = "Granted";
    }
    return deletPri;
}


const refillForm = (ob, rowno) => {


    privileage = JSON.parse(JSON.stringify(ob));
    oldprivileage = JSON.parse(JSON.stringify(ob));


    fillSelectFeild(cmbRoleName, "Select Role", roles, "name", privileage.role_id.name,);
    cmbRoleName.style.borderBottom = "2px solid green";
    fillSelectFeild(cmbModuleName, "Select Modules", modules, "name", privileage.module_id.name,);
    cmbModuleName.style.borderBottom = "2px solid green";

    if (privileage.sel) {
        checkSelect.checked = true;
        lblSelect.innerText = "Select Priv. Granted";
        lblSelect.style.color = "green";
    } else {
        checkSelect.checked = false;
        lblSelect.innerText = "Select Not Granted";
        lblSelect.style.color = "black";
    }
    if (privileage.ins) {
        checkInsert.checked = true;
        lblInsert.innerText = "Insert Priv. Granted";
        lblInsert.style.color = "green";
    } else {
        checkInsert.checked = false;
        lblInsert.innerText = "Insert Not Granted";
        lblInsert.style.color = "black";
    }
    if (privileage.upd) {
        chekUpdate.checked = true;
        lblUpdate.innerText = "Update Priv. Granted";
        lblUpdate.style.color = "green";
    } else {
        chekUpdate.checked = false;
        lblUpdate.innerText = "Update Not Granted";
        lblUpdate.style.color = "black";
    }

    if (privileage.del) {
        checkDelete.checked = true;
        lblDelete.innerText = "Delete Priv. Granted";
        lblDelete.style.color = "green";
    } else {
        checkDelete.checked = false;
        lblDelete.innerText = "Delete Not Granted";
        lblDelete.style.color = "black";
    }
    disabledButton(false,true);

    btnAddNew.click();

}

const deleteRow = (empob) => {
    let deleteMsg = "Are you sure want to delete following privilage details\n"
        + "Role :" + empob.role_id.name
        + "\n Module :" + empob.module_id.name;

    let userDeleteResponce = window.confirm(deleteMsg);

    if (userDeleteResponce) {
        let deleteServiceResponce = getHTTPServiceRequest("/privilage", "DELETE", empob);
        if (deleteServiceResponce == "0") {
            alert("Delete Successfully...!")
            refreshPrivilageTable();
        } else {
            alert("You have following error...!\n" + deleteServiceResponce);
        }
    }
}
const viewRow = (ob,rowno) => {
    $("#modalViewPrivilageForm").modal("show");
//as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.
    printPrivilage = ob;

    tdrole.innerText = printPrivilage.role_id.name ;
    tdModule.innerText = printPrivilage.module_id.name ;
    tdSelect.innerText =getSelectPri(printPrivilage);
    tdIns.innerText = getInsertPri(printPrivilage);
    tdUpd.innerText = getUpdatePri(printPrivilage);
    tdDel.innerText = getDeletePri(printPrivilage);
}


function buttonModalCloseMC() {
    buttonCloseModal("#modalAddPrivilageForm",refreshPrivilageForm)
}

 function buttonModalCloseMMCVM(){
    buttonCloseVModal("#modalViewPrivilageForm");
}

function buttonSubmit() {
    //  need to check form errors
    let errors = checkErrors();

    if (errors == "") {
        let submitConfirmMsg = "Are you sure to add following Priv...\n " +
            "Role : " + privileage.role_id.name +
            "\nModule : " + privileage.module_id.name +
            "\nSelect :" + getSelectPri(privileage);

        let userResponce = window.confirm(submitConfirmMsg);

        if (userResponce) {
            let postServieResponce;
            $.ajax("/privilage ", {
                async: false,
                type: "POST",
                data: JSON.stringify(privileage),
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
                refreshPrivilageForm();
                refreshPrivilageTable()
                $("#modalAddPrivilageForm").modal("hide");
            } else {
                window.alert("You have following error \n" + postServieResponce);
            }

        }
    } else {
        window.alert("You have following error \n" + errors);
    }
}

checkErrors = () => {
    let errors = "";
    if (privileage.role_id == null) {
        errors = errors + "Role is not selected \n";
    }

    if (privileage.module_id == null) {
        errors = errors + "Modules not selected \n";

    }
    return errors;
}

//check available update
const checkUpdate = () => {
    let updates = "";

    if (privileage != null && oldprivileage != null) {
        if (privileage.role_id.name != oldprivileage.role_id.name) {
            updates = updates + "Role is changed \n";
        }
        if (privileage.module_id.name != oldprivileage.module_id.name) {
            updates = updates + "Module  is changed \n";
        }
        if (privileage.sel != oldprivileage.sel) {
            updates = updates + "Select Priv.  is changed \n";
        }

        if (privileage.ins != oldprivileage.ins) {
            updates = updates + "Insert Priv.  is changed \n";
        }
        if (privileage.upd != oldprivileage.upd) {
            updates = updates + "Update Priv.  is changed \n";
        }
        if (privileage.del != oldprivileage.del) {
            updates = updates + "Delete  Priv.  is changed \n";
        }
        return updates;

    }
}
function buttonUpdat() {

    let errors = checkErrors();
    if(errors ==""){
        let updates = checkUpdate();
        if(updates == ""){
            alert("Nothing updated \n");
        }else{
            let updateUserConfirm = window.confirm("Are you sure to update following changes \n" + updates);

            if(updateUserConfirm){
                let putResponce = getHTTPServiceRequest("/privilage","PUT",privileage)
                if(putResponce == "0"){
                    alert("Update Successfull..!");
                    refreshPrivilageTable();
                    refreshPrivilageForm();
                    $("#modalAddPrivilageForm").modal("hide");
                } else {
                    window.alert("You have following errorss \n" + putResponce);
                }

            }
        }

    }else{
        window.alert("You have following errors \n" + errors);
    }
}

function printRowItemMC() {
    let newWindow = window.open();
    newWindow.document.write("<title>Details</title>"+"<link rel='stylesheet' href= 'resources/bootstrap/css/bootstrap.min.css'>"+"<h2>Privilage Details</h2>" + "<div>"+tablePrintPrivilage.outerHTML +"</div>");
    setTimeout(function () {
        newWindow.print();
         newWindow.close();
    },100000);
}

function buttonClear(){
    refreshPrivilageForm();
}
