// add function browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Material");

    //called refreshtable function -- >
    refreshTable();

//called refreshMaterialForm function -- >
 refreshMaterialForm();
}

//define refresh table function
const refreshTable = () => {

    // create array for stor data
    materials = new Array();

    materials = getServiceRequest("/material/findall");

    //create display proporty list
    let displayPropertyList = ['code', 'name', 'measuring_count', 'material_catedory_id.name', 'materal_unit_type_id.name', 'material_status_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'text', 'text', 'object', 'object', 'object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableMaterial, materials, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, true, lggeduserprivilage);

    for (let index in materials) {
        if (materials[index].material_status_id.name == "Removed") {
            tableMaterial.children[1].children[index].style.backgroundColor = "pink";

            tableMaterial.children[1].children[index].children[7].children[1].disabled = true;
            tableMaterial.children[1].children[index].children[7].children[1].style.pointerEvents = "all";
            tableMaterial.children[1].children[index].children[7].children[1].style.cursor = "not-allowed";

        }
    }

    // need to add jquerty table
    $('#tableMaterial').dataTable();
}

const rowView = () => {
}

// functon for refresh form
const refreshMaterialForm = () => {

    //create new object with it's old object(duplicatie object)
    material = new Object();
    oldmaterial = null;

    //create arrys for get data for fill select ellement
    materialcategories = getServiceRequest("/materialCategory/list");
    unittypes = getServiceRequest("/materialUnitType/list");
    materialstatuses = getServiceRequest("/materialstatus/list");

    fillSelectFeild(cmbCategory, "Select Category", materialcategories, "name");
    fillSelectFeild(cmbUnitType, "Select Unit Type", unittypes, "name");

    fillSelectFeild(cmbMaterialStatus, "Select Status", materialstatuses, "name", "Usable", true);
    material.material_status_id = JSON.parse(cmbMaterialStatus.value);

    txtMCNo.value = "Material Code is auto generated";
    txtDescription.value = "";
    txtMaterialName.value = "";
    txtMeasuringCount.value = "";

    setStyle("1px solid #ced4da");
    cmbMaterialStatus.style.borderBottom = "2px solid green";

    disabledButton(true, false);


}

let disabledButton = (addbtn, updbtn) => {

    if (addbtn && lggeduserprivilage.ins) {
        buttonAdd.disabled = false;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "pointer");
    } else {
        buttonAdd.disabled = true;
        $("#buttonAdd").css("pointer-events", "all");
        $("#buttonAdd").css("cursor", "not-allowed");
    }

    if (updbtn && lggeduserprivilage.upd) {
        buttonUpdate.disabled = false;
        $("#buttonUpdate").css("pointer-events", "all");
        $("#buttonUpdate").css("cursor", "pointer");
    } else {
        buttonUpdate.disabled = true;
        $("#buttonUpdate").css("pointer-events", "all");
        $("#buttonUpdate").css("cursor", "not-allowed");
    }
}

function setStyle(style) {
    cmbCategory.style.borderBottom = style;
    cmbUnitType.style.borderBottom = style;
    cmbMaterialStatus.style.borderBottom = style;
    txtMCNo.style.borderBottom = style;
    txtDescription.style.borderBottom = style;
    txtMaterialName.style.borderBottom = style;
    txtMeasuringCount.style.borderBottom = style;

}

//check available errors in form
const checkMFormError = ()=>{
    let formerror = "";

    if( material.name == null){
        formerror = formerror + "Please Enter Material name ..! \n";

    }

    if( material.material_catedory_id == null){
        formerror = formerror + "Please Select Category..! \n";

    }
    if( material.measuring_count == null){
        formerror = formerror + "Please Enter Measuring Count..! \n";

    }

    if( material.materal_unit_type_id == null){
        formerror = formerror + "Please Select Unit Type..! \n";

    }
    if( material.material_status_id == null){
        formerror = formerror + "Please Select Material Status..! \n";

    }

    return formerror;
}

function buttonMSave() {
    // check form error
    let errors = checkMFormError();
    if(errors != ""){
        window.alert("form has following erros \n" + errors);
    }else {
        //get user confirmation
        let userCofirmMsg = "Are you sure to add Following Materialt ..? " +
            "\n Material Name : " + material.name +
            "\n Material Category : " + material.material_catedory_id.name +
            "\n Material Unit Type : " + material.materal_unit_type_id.name ;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if(userSaveResponce){
            //call post services
            let serverResponce = getHTTPServiceRequest("/material" , "POST" , material);
            if(serverResponce == "0"){
                $("#modalMaterialForm").modal("hide");
                window.alert("Material Insert Successfully...");
                refreshTable();
                refreshMaterialForm();

            }else {
                window.alert("Material Insert Not Successfully you have server error...\n" + serverResponce);
            }

        }
    }
}


//form refill function
function formRefill(rowob,rowind) {

    material = getServiceRequest("/material/getbyid/"+rowob.id);
    oldmaterial = getServiceRequest("/material/getbyid/"+rowob.id);

    fillSelectFeild(cmbCategory, "Select Category", materialcategories, "name",material.material_catedory_id.name);
    fillSelectFeild(cmbUnitType, "Select Unit Type", unittypes, "name",material.materal_unit_type_id.name);

    fillSelectFeild(cmbMaterialStatus, "Select Status", materialstatuses, "name", material.material_status_id.name , false);

    txtMCNo.value =  material.code;

    if(material.description != null)
    txtDescription.value = material.description ; else txtDescription.value = "";

     txtMaterialName.value = material.name ;
    txtMeasuringCount.value = material.measuring_count ;

    setStyle("1px solid green");


    if( material.description == null)
        txtDescription.style.borderBottom = "1px solid #ced4da";

    disabledButton(false , true);


    $("#modalMaterialForm").modal("show");
}


const checkMFormUpdates = () =>{

    let updates = "";

    if(material != null && oldmaterial != null){

        if(material.name != oldmaterial.name){
            updates = updates + "Material Name is changed " +  oldmaterial.name + " into " + material.name + "\n";
        }

        if(material.description != oldmaterial.description){
            updates = updates + "Material Note  is changed " + oldmaterial.description + " into " + material.description + "\n";
        }

        if(material.material_status_id.id != oldmaterial.material_status_id.id){
            updates = updates + "Material Satatus  is changed " + oldmaterial.material_status_id.name + " into " + material.material_status_id.name + "\n";
        }

        if(material.material_catedory_id.id != oldmaterial.material_catedory_id.id){
            updates = updates + "Material Category is changed " + oldmaterial.material_category_id.name + " into " + material.material_category_id.name + "\n";
        }

        if(material.measuring_count != oldmaterial.measuring_count){
            updates = updates + "Material Measuring Count is changed " + oldmaterial.measuring_count + " into " + material.measuring_count + "\n";
        }

        if(material.materal_unit_type_id.id != oldmaterial.materal_unit_type_id.id){
            updates = updates + "Material Unit Type is changed " + oldmaterial.materal_unit_type_id.name + " into " + material.materal_unit_type_id.name + "\n";
        }

    }


    return updates;
}

//function for update button
function buttonMUpdate() {

    let formeErrors = checkMFormError();
    if( formeErrors == ""){
        let formUpdates = checkMFormUpdates();
        if(formUpdates == ""){
            window.alert("Nothing updated...!");
        }else {

            let userUpdConfirmation = window.confirm("Are you sure to update following changers..? \n"+ formUpdates);

            if(userUpdConfirmation){
                let serverUpdResponce = getHTTPServiceRequest("/material" , "PUT" , material);
                if(serverUpdResponce == "0"){
                    $("#modalMaterialForm").modal("hide");
                    window.alert("Material Update Successfully...");
                    refreshTable();
                    refreshMaterialForm();


                }else {
                    window.alert("Material Update Not Successfully you have server error...\n" + serverUpdResponce);
                }

            }


        }
    }else {
        window.alert("form has following erros \n" + formeErrors);
    }
}







const rowDelete = (ob, rowno) => {

    let deleteMsg = "Are you sure want to delete following Material ..? \n" + ob.name;

    let deleteUserResponce = window.confirm(deleteMsg);

    if (deleteUserResponce) {

        let serverResponce = getHTTPServiceRequest("/material", "DELETE",ob);

        if (serverResponce == "0") {
            alert("Delete Successfully... !")
            refreshTable();
        } else {
            alert("Fail to Delete,You have folowing error .. \n" + serverResponce)
        }
    }
}