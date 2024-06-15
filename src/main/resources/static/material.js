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
//m.id, m.name, m.code,m.measuring_count,m.width,m.height,m.material_category_id, m.material_unit_type_id, m.material_status_id
    //create display proporty list
    let displayPropertyList = ['code','name', 'measuring_count','width','height', 'material_category_id.name', 'material_unit_type_id.name', 'material_status_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'text', 'text','text','text', 'object', 'object', 'object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableMaterial, materials, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, true, lggeduserprivilage);

    for (let index in materials) {
        if (materials[index].material_status_id.name == "Removed") {
            tableMaterial.children[1].children[index].style.backgroundColor = "#ad9393";
            tableMaterial.children[1].children[index].style.color = "#0f100f";
            tableMaterial.children[1].children[index].children[9].children[1].disabled = true;
            tableMaterial.children[1].children[index].children[9].children[1].style.pointerEvents = "all";
            tableMaterial.children[1].children[index].children[9].children[1].style.cursor = "not-allowed";

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
     paperinkTypes =getServiceRequest("/paperInkTypes/list")

    fillSelectFeild(cmbCategory, "Select Category", materialcategories, "name");
    fillSelectFeild(cmbUnitType, "Select Unit Type", unittypes, "name");
    fillSelectFeild(cmbMaterialStatus, "Select Status", materialstatuses, "name", "Usable", true);
    material.material_status_id = JSON.parse(cmbMaterialStatus.value);
fillSelectFeild(cmbSubCategory,"Select Sub Category",paperinkTypes,"name");

    txtDescription.value = "";
    txtMaterialName.value = "";
    txtMeasuringCount.value = "";

    if(cmbCategory){
        txtPaperHeight.value="";
        txtPaperWidth.value="";
        txtPaperHeight.style.borderBottom ="2px solid green";
        txtPaperWidth.style.borderBottom ="2px solid green";

    }


    setStyle("1px solid #cacfe7");
    cmbMaterialStatus.style.borderBottom = "2px solid green";

    disabledButton(true, false);


}



function setStyle(style) {
    cmbCategory.style.borderBottom = style;
    cmbUnitType.style.borderBottom = style;
    cmbMaterialStatus.style.borderBottom = style;
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

    if( material.material_category_id == null){
        formerror = formerror + "Please Select Category..! \n";

    }
    if( material.measuring_count == null){
        formerror = formerror + "Please Enter Measuring Count..! \n";

    }

    if( material.material_unit_type_id == null){
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
            "\n Material Category : " + material.material_category_id.name +
            "\n Material Unit Type : " + material.material_unit_type_id.name ;

        let userSaveResponce = window.confirm(userCofirmMsg);

        if(userSaveResponce){
            //call post services
            let serverResponce = getHTTPServiceRequest("/material" , "POST" , material);
            if(serverResponce == "0"){
                window.alert("Material Insert Successfully...");
                $("#modalMaterialForm").modal("hide");
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

    fillSelectFeild(cmbCategory, "Select Category", materialcategories, "name",material.material_category_id.name);
    fillSelectFeild(cmbUnitType, "Select Unit Type", unittypes, "name",material.material_unit_type_id.name);
    fillSelectFeild(cmbMaterialStatus, "Select Status", materialstatuses, "name", material.material_status_id.name , false);

  //  fillSelectFeild(cmbSubCategory,"Select Sub Category",paperinkTypes,"name",material.paper);

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

        if(material.material_category_id.id != oldmaterial.material_category_id.id){
            updates = updates + "Material Category is changed " + oldmaterial.material_category_id.name + " into " + material.material_category_id.name + "\n";
        }

        if(material.measuring_count != oldmaterial.measuring_count){
            updates = updates + "Material Measuring Count is changed " + oldmaterial.measuring_count + " into " + material.measuring_count + "\n";
        }

        if(material.material_unit_type_id.id != oldmaterial.material_unit_type_id.id){
            updates = updates + "Material Unit Type is changed " + oldmaterial.material_unit_type_id.name + " into " + material.material_unit_type_id.name + "\n";
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

function buttonModalCloseMC() {

    buttonCloseModal("#modalMaterialForm",refreshMaterialForm)
}

function showPaperSize(){
    if (JSON.parse(cmbCategory.value).name == "Paper") {
        divPaperSize.style.display = "block";


    } else {
        divPaperSize.style.display = "none";


    }
}
//Get material unit type by its category
function getMaterialUnitTypeByMCategory(){

   let materialtypeByCategory=  getServiceRequest( "/materialUnitType/getByMCategory/"+ JSON.parse(cmbCategory.value).id);
    fillSelectFeild(cmbUnitType,"Select Material Type",materialtypeByCategory,"name","")
}

// buttonMSubAdd
const Addbutton = document.getElementById("buttonMSubAdd");
Addbutton.addEventListener("click",() => {
    document.getElementById("divAddButtonPaperInkType").style.display = "block";
    refreshbuttonAddPaperType();
})


const refreshbuttonAddPaperType =() => {

    paperInkType = new Object();
    oldpaperInkType = null;
    materialcategories =  getServiceRequest("/materialCategory/list");
    fillSelectFeild(cmbMaterialCategory, "Select Material Category", materialcategories, "name",)
    txtPtItname.value = "";
    txtPtItname.style.borderBottom= "1px solid #cacfe7";
      cmbMaterialCategory.style.borderBottom = "1px solid #cacfe7";
}


//Add Eventlisteners to Papertype cancel button
const cancelPT = document.getElementById('btnAddpaperTypeCancel');
const divAddPTy = document.getElementById("divAddButtonPaperType");
cancelPT.addEventListener("click",() => {
    refreshbuttonAddPaperType();
    divAddPTy.style.display = "none" ;
});


//Add Eventlistener to Papertype add button
const addPT = document.getElementById("btnAddpaperTypeSubmit");
addPT.addEventListener("click",()=>{

    let  errors = checkaddPTErrors();
    if(errors != ""){
        return "You have following errors :\n" +errors ;
        refreshbuttonAddPaperType();
        divAddButtonPaperInkType.style.display = "block";
    }else {
        let serverResponce = getHTTPServiceRequest("/paperInkTypes", "POST", paperInkType);
        if (serverResponce == "0") {

            alert("Saved Successfully");
            let paperTypesByMCategory = getServiceRequest("/paperInkTypes/getbyMCategory/" + JSON.parse(cmbCategory.value).id);
            fillSelectFeild(cmbSubCategory, "Select Sub Category", paperTypesByMCategory, "name", "");
            refreshbuttonAddPaperType();
            divAddButtonPaperInkType.style.display = "none";
        } else {
            return alert("Failed to add ...You have following error..\n" + serverResponce);
        }
    }
})

const checkaddPTErrors = () =>{
    let errors = "";
    if(paperInkType.name == null){
        errors = errors + "Paper Type Name is not entered.."
    }
    return errors;
}


function enbleAddPTITypeButton(){

    let addbtn = document.getElementById('addPaperInkType')
    if (!material.material_category_id) {
        addbtn.style.display = "none";
    } else{
        addbtn.style.display = "block"}
}