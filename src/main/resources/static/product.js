//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Product");
    console.log(lggeduserprivilage);
    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshTable();

// called refreshproductForm function
    refreshProductForm();


}


//define refresh table function
const refreshTable = () => {

    // create array for stor data
    products = new Array();

    products = getServiceRequest("/product/findall");
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
    let displayPropertyList = ['product_code', 'customer_id.customer_name', 'p_name', 'product_size_id.name', 'single_or_double', 'product_category_id.name', 'papercolors_id.name', 'printcolors_id.name', 'price', 'product_status_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'object', 'text', 'object', 'text', 'object', 'object', 'object', 'text', 'object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableProduct, products, displayPropertyList, displayDatatypeList,
        formRefill, rowDelete, rowView, true, lggeduserprivilage);

    for (let index in products ){
        if (products[index].product_status_id.name == "Not-Active") {
            tableProduct.children[1].children[index].style.backgroundColor = "#ad9393";
            tableProduct.children[1].children[index].children[11].children[1].disabled = true;
            tableProduct.children[1].children[index].children[11].children[1].style.pointerEvents = "all";
            tableProduct.children[1].children[index].children[11].children[1].style.cursor = "not-allowed";

        }
    }

    // need to add jquerty table
    $('#tableProduct').dataTable();
}

//define form refreshProductForm
refreshProductForm = () => {

    product = new Object();
    oldproduct = null;

    product.productCopyList = new Array();

product.productHasMaterialList = new Array();
// ###################productCategory#########################
    // productCategory = [{ id: 1, name: "Label" }, { id: 2, name: "Posters" }];
    productcategories = new Array();
    $.ajax('productCategory/list', {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            productcategories = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            productcategories = [];
        }
    })
    fillSelectFeild(cmbproductCategory, "Select product category", productcategories, 'name', '');
    //Defaultly value is gained when the data is parsed here it is working
    // as no default values from above statement// product.product_category_id = JSON.parse(cmbproductCategory.value)

// ######################Product  Status##########################
    productStatuses = new Array();

    $.ajax('product_Status/list', {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            productStatuses = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            productStatuses = [];
        }
    })
    fillSelectFeild(cmbProductStatus, "Select Status", productStatuses, 'name', 'Active',true);
    product.product_status_id = JSON.parse(cmbProductStatus.value);

    // ######################Product  Size ##########################
    productSizes = new Array();
    $.ajax('productsize/list', {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            productSizes = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            productSizes = [];
        }
    })
    fillSelectFeild(cmbproductSize, "Add sizes", productSizes, "name", "");

    // ######################Paper Types ##########################
    paperTypes = getServiceRequest("/paperTypes/list")
    cmbpaperTypes.disabled = true;
    fillSelectFeild(cmbpaperTypes, "Select Paper Type", paperTypes, "name", "");

    // ######################Paper Colors ##########################
    paperColors = getServiceRequest("/paperColors/list")
    cmbpaperColors.disabled = true;
    fillSelectFeild(cmbpaperColors, "Select Paper Colors", paperColors, "name", "");

    // ######################Customers ##########################
    customers = getServiceRequest("/customer/list")
    fillSelectFeild(cmbCustomer, "Select Customer", customers, "customer_name", "");

    // ###################### PrintColors ##########################
    printColors = getServiceRequest("/printColors/list")
    fillSelectFeild(cmbprintColors, "Select Print Colors", printColors, "name", "");
  // // ###################### PaperSide  ##########################


    txtProductname.value="";
    txtHeight.value="";
    txtWidth.value="";
    productImage.value="";

    txtPrice.value="";
    txtDescription.value="";

    refreshPInnerFormTable();
    refreshMQFormTable();
    setStyle("1px solid #cacfe7")
    disabledButton(true, false);

}

function setStyle(style){
    txtProductname.style.border = style;
    txtHeight.style.border = style;
    txtWidth.style.border = style;
    txtPrice.style.border = style;
    txtDescription.style.border = style;
    cmbprintColors.style.border = style;
    cmbpaperColors.style.border = style;
    cmbCustomer.style.border = style;
    cmbproductCategory.style.border = style;
    cmbproductSize.style.border = style;
    cmbpaperTypes.style.border = style;
    lblRadioSingle.style.border = style;
    lblRadioDouble.style.border = style;
}

const buttonMInnerAddMC = (value) => {
    let productcopyset = false;

    for (let index in product.producthasMaterial) {

        if (product.producthasMaterial[index].material_id.name == productHasMaterial.material_id.name) {
            productcopyset = true;
            break;
        }

    }
    if (!productcopyset) {

            let confirmMs = "Are you sure to add following Product Details \n"
                + "\n Material : " + productHasMaterial.material_id.name
                + "\n Quantity : " + productHasMaterial.quantity;
            let userResponce = window.confirm(confirmMs);


            if (userResponce) {
                product.productHasMaterialList.push(productHasMaterial);
                alert("Save Succecfully...!");
                refreshMQFormTable();

            }



    }

}


const rowDelete = (ob, row) => {
    let deleteMsg = "Are you surely want to delete following Product..? \n" + ob.p_name;

    let serverResponce = window.confirm(deleteMsg);
    if (serverResponce) {
        let serverResponce;
        serverResponce = getHTTPServiceRequest("/product", "DELETE", ob);
    if (serverResponce == "0") {
        alert("Delete Successfully... !");
        refreshTable();

    } else {
        alert("Fail to Delete,You have folowing error .. \n" + serverResponce);

    }

}
}

const formRefill = (ob, rowno) => {

    product = new Object();
    oldproduct = new Object();

    $.ajax('/product/getbyid/' + ob.id, {
        async: false,
        dataType: 'json',
        //responce obj -xhr
        success: function (data, status, xhr) {
            product = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            product = {};
        }
    })

    $.ajax('/product/getbyid?id=' + ob.id, {
        async: false,
        dataType: 'json',
        success: function (data, status, xhr) {
            oldproduct = data;
        },
        error: function (rxhrdata, errorstatus, errorMessge) {
            oldproduct = {};
        }
    })
    console.log(product)

    // set value into  feilds


    // txtProductname
    // cmbproductCategory
    // cmbproductSize
    // txtHeight
    // txtWeight
    // txtSideType


    // //Optional calue checking
    // if (product.p_name != undefined)
    //     txtProductname.value = product.p_name; else txtProductname.value = "";
    //
    // if (txtProductname != undefined)
    //     txtDescription.value = product.description; else txtDescription.value = "";
    //


    // //radio button value checking

    if (product.single_or_double == "Single") {
        radioSingle.checked = true;
    } else {
        radioDouble.checked = true;
    }
    txtProductname.value=product.p_name
    txtHeight.value=product.height
    txtWidth.value=product.width

    txtPrice.value=product.price
    txtDescription.value=product.description
   // productImage.src =atob(product.image);



    fillSelectFeild(cmbCustomer, "Select Customer", customers, "customer_name", product.customer_id.customer_name);
//    productCategory= getServiceRequest("/productCategory/list")
    fillSelectFeild(cmbproductCategory, "Select product category", productcategories, 'name',product.product_category_id.name);
 // productStatuses = getServiceRequest("/product_Status/list")
    fillSelectFeild(cmbProductStatus, "Select Status", productStatuses, 'name',product.product_status_id.name);
  //  productSizes = getServiceRequest("productsize/list")
    fillSelectFeild(cmbproductSize, "Add sizes", productSizes, "name", product.product_size_id.name);
  //  paperTypes = getServiceRequest("/paperTypes/list")
    fillSelectFeild(cmbpaperTypes, "Select Paper Type", paperTypes, "name", product.papertype_id.name);
 //   printColors = getServiceRequest("/printColors/list")
    fillSelectFeild(cmbprintColors, "Select Print Colors", printColors, "name", product.printcolors_id.name);
    fillSelectFeild(cmbpaperColors, "Select Paper Colors", paperColors, "name", product.papercolors_id.name);

    setStyle("2px dotted green");




    $('#modalProductForm').modal("show");

    disabledButton(false, true);
    refreshPInnerFormTable();
    refreshMQFormTable();

}



function setStyle(style) {

    txtProductname.style.border = style;
    txtHeight.style.border = style;
    txtWidth.style.border = style;

    txtPrice.style.border = style;
    txtDescription.style.border = style;
    // txtDescription.style.border = style;
    // cmbCustomerCategory.style.borderBottom = style;
    // cmbCustomerStatus.style.borderBottom = style;
    cmbCustomer.style.border = style
    cmbproductCategory.style.border = style
    cmbProductStatus.style.border = style
    cmbproductSize.style.border = style
    cmbpaperTypes.style.border = style
    cmbprintColors.style.border = style
    cmbpaperColors.style.border = style
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



//Inner Form available when category is bill book
function divInnerPCopyFormshow() {
    if (JSON.parse(cmbproductCategory.value).name == "Bill Book") {
        divInnerPCopyForm.style.display = "block";


    } else {
        divInnerPCopyForm.style.display = "none";


    }

    getPaperType();
}


//get customized Size values when size is selected as customized size
function showCustomizedproductSize() {
    if (JSON.parse(cmbproductSize.value).name == "Customized Size") {
        divproductSize.style.display = "block";
    } else {
        divproductSize.style.display = "none";
    }
}


// //genepaperTypes according to the Category
function getPaperType() {
    let paperTypesByCategory = getServiceRequest("/paperTypes/getbyCategory/" + JSON.parse(cmbproductCategory.value).id);
    fillSelectFeild(cmbpaperTypes, "Select Paper Type", paperTypesByCategory, "name", "");
    fillSelectFeild(cmbPcopypaperTypes, "Select Paper Type", paperTypesByCategory, "name", "");
}

//json.parse --> creating java object and filteering by id using .id
//Set paper colors
function selectpaperColors() {
    let paperColorsByPaperType = getServiceRequest("/paperColors/getbyPType/" + JSON.parse(cmbpaperTypes.value).id);
    fillSelectFeild(cmbpaperColors, "Select Paper Colors", paperColorsByPaperType, "name", "");
}


function selectInnerpaperColors() {
    let paperColorsByPaperType = getServiceRequest("/paperColors/getbyPType/" + JSON.parse(cmbPcopypaperTypes.value).id);
    fillSelectFeild(cmbPcopypaperColors, "Select Paper Colors", paperColorsByPaperType, "name", "");
}
// generating prodct Size according to the Category main form
function getP_SizeByPCategory() {

    productSizebyPCategory = getServiceRequest("/productsize/getByPCategory/" + JSON.parse(cmbproductCategory.value).id);
    fillSelectFeild(cmbproductSize, "Add sizes", productSizebyPCategory, "name", "");

}

const checkErrors = () => {
    let errors = "";

    if (product.customer_id == null) {
        errors = errors + "Customer Name is Not Selected \n";
    }
    if (product.p_name == null) {
        errors = errors + "Product Name is not entered \n";
    }
    if (product.product_category_id == null) {
        errors = errors + "Product Category is not selected \n";
    } else {
        if (product.product_category_id.name == "Bill Book") {
            if (product.productCopyList.length == 0) {
                errors = errors + " Product Copies Not selected \n";
            }
        }

    }
    if (product.product_size_id == null) {
        errors = errors + "Product Size is not selected\n";
    } else if (product.product_size_id.name == "Customized Size") {

        if (product.height == null) {
            errors = errors + "Customized Size height is not selected\n";
            if (product.width == null) {
                errors = errors + "Customized Size width is not selected\n";
            }

        }

    }


    if (product.single_or_double == null) {
        errors = errors + "Product print sides not selected\n";
    }
    if (product.papertype_id == null) {
        errors = errors + "Product paper type is not selected\n";
    }
    if (product.papercolors_id == null) {
        errors = errors + "Product paper color is not selected\n";
    }
    if (product.printcolors_id == null) {
        errors = errors + "Product print color is not selected\n";
    }
    if (product.price == null) {
        errors = errors + "Product print copies is not entered\n";
    }

    if (product.productHasMaterialList.length == 0) {
        errors = errors + "Material Not selected \n";
    }

    return errors;

}

const checkUpdate = () => {
    let updates = "";

    if (product != null && oldproduct != null) {

      if(product.single_or_double != oldproduct.single_or_double){
          updates = updates + "Product Paaper Side changed " + oldproduct.single_or_double
              + " into " + product.single_or_double + "\n";
    }
      if(product.p_name !=oldproduct.p_name){
          updates = updates + "Product name has changed " + oldproduct.p_name
              + " into " +product.p_name  + "\n";
      }
       if( product.height!=oldproduct.height){
           updates = updates + "Product height has changed " + oldproduct.height
               + " into " + product.height + "\n";
       }
       if(  product.width !=oldproduct.width){
           updates = updates + "Product weight has changed " + oldproduct.width
               + " into " + product.width + "\n";
       }
       if(  product.price != oldproduct.price){
           updates = updates + "Product price has changed " + oldproduct.price
               + " into " + product.price + "\n";
       }
       if(  product.customer_id.customer_name != oldproduct.customer_id.customer_name){
           updates = updates + "Product customer_name name has changed " + oldproduct.customer_id.customer_name
               + " into " + product.customer_id.customer_name + "\n";
       }
       if(  product.product_category_id.name != oldproduct.product_category_id.name){
           updates = updates + "Product product_category name has changed " + oldproduct.product_category_id.name
               + " into " + product.product_category_id.name + "\n";
       }
       if( product.product_status_id.name != oldproduct.product_status_id.name){
           updates = updates + "Product Status name has changed " + oldproduct.product_status_id.name
               + " into " + product.product_status_id.name + "\n";
       }
      if(  product.product_size_id.name != oldproduct.product_size_id.name){
          updates = updates + "Product size has changed " + oldproduct.product_size_id.name
              + " into " +product.product_size_id.name+ "\n";
      }
      if(  product.papertype_id.name != oldproduct.papertype_id.name){
          updates = updates + "Product papertype name name has changed " + oldproduct.papertype_id.name
              + " into " + product.papertype_id.name + "\n";
      }
      if(  product.printcolors_id.name != oldproduct.printcolors_id.name){
          updates = updates + "Product print colors has changed " + oldproduct.printcolors_id.name
              + " into " + product.printcolors_id.name + "\n";
      }

      if(  product.papercolors_id.name != oldproduct.papercolors_id.name){
          updates = updates + "Product paper colors has changed " + oldproduct.papercolors_id.name
              + " into " + product.papercolors_id.name + "\n";
      }


    }
return updates;
}

function buttonSubmitMC() {

    // need to check form errors n required field
    let errors = checkErrors();

    if (errors == "") {
        //

        // need to get user confirmation
        let confirmMs = "Are you sure to add following product details \n"
            + "\n Customer Name : " + product.customer_id.customer_name
            + "\n Product Name: " + product.p_name
            + "\n Price : " + product.price;
        let userResponce = window.confirm(confirmMs);
        if (userResponce) {
            let serverResponce = getHTTPServiceRequest("/product", "POST", product)
            if (serverResponce == "0") {
                alert("Save Succecfully...!");
                refreshTable();
                refreshProductForm();

                // need to close modal
                $('#modalProductForm').modal('hide');
            } else {
                alert("Fail to add, You have following error... \n" + serverResponce);
            }
        }

    } else {
        alert("You have following error in your form... \n" + errors);
    }

}

function buttonClearMC(){
    refreshProductForm();
}

function buttonUpdateMC(){
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

                $.ajax("/product", {
                    async: false,
                    type: "PUT", // method delete
                    data: JSON.stringify(product), // object
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
                    refreshProductForm();
                    $("#modalProductForm").modal("hide");


                } else {
                    //
                    window.alert("Fail to update ...! \n " + putResponce);
                }

            }
        }
    }else {

        window.alert("You have following error in your form...! \n " + errors);
    }


}

//Modal close
function buttonModalCloseMC() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {
        refreshProductForm();
        $("#modalProductForm").modal("hide");

    }
}

//Inner Form
refreshPInnerFormTable = () => {
    productCopy = new Object();
    oldprodctCopy = null;

    if(cmbproductCategory.value != ""){
        let paperTypesByCategory = getServiceRequest("/paperTypes/getbyCategory/" + JSON.parse(cmbproductCategory.value).id);
        fillSelectFeild(cmbPcopypaperTypes, "Select Paper Type", paperTypesByCategory, "name", "");
    }else {
        pCopypTbyPCategory = getServiceRequest("/paperTypes/list");
        fillSelectFeild(cmbPcopypaperTypes, "Select Paper Types", pCopypTbyPCategory, "name", "");
    }

    pCopypaperColors = getServiceRequest("/paperColors/list")
    fillSelectFeild(cmbPcopypaperColors, "Select Paper Colors", pCopypaperColors, "name", "");


//   Innere Table
    let displayPropList = ['papertype_id.name', 'papercolors_id.name'];
    let disPPDTypeList = ['object', 'object'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};
    if (product.productCopyList.length < 3) {
        fillDataIntoTable(tablePCopies, product.productCopyList, displayPropList, disPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);

        for (let index in product.productCopyList) {
            tablePCopies.children[1].children[index].children[3].children[0].style.display = "none";
            tablePCopies.children[1].children[index].children[3].children[2].style.display = "none";

        }
    } else {

    }


    buttonMInnerAdd.disabled = false;
    buttonInnerUpdate.disabled = true;
}
function buttonMInnerClearMC() {
    refreshMQFormTable();
}
function checkErrorz() {
    let errors = "";
       if (product.product_category_id.name == "Bill Book") {
               if (productCopy.papertype_id == null) {
                   errors = errors + "Paper Type is not selected \n";
               }
               if (productCopy.papercolors_id == null) {
                   errors = errors + "Paper Colors are not selected\n";
               }
           }


return errors;


}
const buttonInnerAddMC = (value) => {
    // need to check form errors n required field
    let errors = checkErrorz();

    if (errors == "") {
        //


        let productcopyset = false;

        for (let index in product.productCopyList) {

            if (product.productCopyList[index].papertype_id.name == productCopy.papertype_id.name && product.productCopyList[index].papercolors_id.id == productCopy.papercolors_id.id) {
                productcopyset = true;
                break;
            }

        }
        if (!productcopyset) {

            if (product.productCopyList.length < 2) {

                let confirmMs = "Are you sure to add following Product Details \n"
                    + "\n Paper Type : " + productCopy.papertype_id.name
                    + "\n Paper Colors : " + productCopy.papercolors_id.name;
                let userResponce = window.confirm(confirmMs);


                if (userResponce) {
                    product.productCopyList.push(productCopy);
                    alert("Save Succecfully...!");
                    refreshPInnerFormTable();

                }

            } else {
                return (alert("Only Two Copies are allowed!"));
            }

        }
    }else {
        alert("You have following error in your form... \n" + errors);
    }

}

//inner form-inner tale-row button functions
const innerFormReFill = (innerob, rowind) => {


    //    pCopypTbyPCategory = getServiceRequest("/paperTypes/list");
    fillSelectFeild(cmbPcopypaperTypes, "Select Paper Types", pCopypTbyPCategory, "name",productCopy.papertype_id.name);
//    pCopypaperColors = getServiceRequest("/paperColors/list")
    fillSelectFeild(cmbPcopypaperColors, "Select Paper Colors", pCopypaperColors, "name", "");
    //  productCategory= getServiceRequest("/productCategory/list")
    fillSelectFeild(cmbproductCategory, "Select product category", productcategories, 'name', '');

    buttonInnerUpdate.disabled = false;
    buttonInnerAdd.disabled = true;

}
const innerRowDelete = (innerob, rowind) => {


    let deleteInnerMsg = "Are you sure to delete following Product Copy Details..?" +
        "\n Paper Typr: " + innerob.papertype_id.name
        + "\n Paper Colors : " + innerob.papercolors_id.name;

    let innserdeleteUserResponce = window.confirm(deleteInnerMsg);

    if (innserdeleteUserResponce) {
        //splice --> remove content of the array
        product.productCopyList.splice(rowind, 1)
        alert("Remove Successfully...!");
        refreshPInnerFormTable();
    }
}
const innerRowView = () => {
}
//@@@@@@@@@ Material Inner FormTable@@@@@@@@@@@@@
function refreshMQFormTable() {
    /* inner Form */
    productHasMaterial =  new Object();
    oldproductHasMaterial = null;

    getMaterial =   getServiceRequest("/material/list")
    fillSelectFeild(cmbMaterial, "Select Materials", getMaterial, "name", "");

    // if (cmbMaterial.value != "") {
    //     materialsByP = getServiceRequest("/material/listbysupplier/" + JSON.parse(cmbSupplier.value).id);
    //     fillSelectFeild2(cmbMaterial, "Select Material", materialsByQR, "code", "name", "");
    //     cmbMaterial.disabled = false;
    // } else {
    //     fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", "");
    //     cmbMaterial.disabled = true;
    // }

    txtQty.value="";
    txtQty.style.borderBottom = "1px solid #cacfe7";
    cmbMaterial.style.borderBottom = "1px solid #cacfe7";

//   Innere Table
    let displayPropList = ['material_id.name', 'quantity'];
    let disPPDTypeList = ['object', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    fillDataIntoTable(tableMateiralQuantity, product.productHasMaterialList, displayPropList, disPPDTypeList, innerFormMReFill, innerMRowDelete, innerMRowView, true, innerlogedUserPrivilage);

    for (let index in product.productHasMaterialList) {
        tableMateiralQuantity.children[1].children[index].children[3].children[0].style.display = "none";
        tableMateiralQuantity.children[1].children[index].children[3].children[2].style.display = "none";

    }

    buttonMInnerAdd.disabled = true;

}
//inner form-inner tale-row button functions
const innerFormMReFill = (innerob, rowind) => {

    productHasMaterialList = JSON.parse(JSON.stringify(innerob));
    oldproductHasMaterialList = JSON.parse(JSON.stringify(innerob));


    //    pCopypTbyPCategory = getServiceRequest("/paperTypes/list");
    fillSelectFeild(cmbMaterial, "Select Materials", getMaterial, "name",productHasMaterialList.papertype_id.name);

 txtQty.value = productHasMaterialList.quantity;


    cmbMaterial.style.borderBottom = "2px solid  green";
    txtQty.style.borderBottom = "2px solid  green";



    buttonMInnerAdd.disabled = true;

}
const innerMRowDelete = (innerob, rowind) => {


    let deleteInnerMsg = "Are you sure to delete following Product Copy Details..?" +
        "\n Material: " + innerob.material_id.name
        + "\n Quantity : " + innerob.quantity;

    let innserdeleteUserResponce = window.confirm(deleteInnerMsg);

    if (innserdeleteUserResponce) {
        product.productHasMaterialList.splice(rowind, 1)
        alert("Remove Successfully...!");
        refreshMQFormTable();
    }
}
const innerMRowView = () => {
}
//Button disable on Inner forms  - Material

function buttondisabling() {

    let regpattern = new RegExp("^[1-9][0-9]{1,5}$");

    if (regpattern.test(txtQty.value)) {
        if(txtQty.value == null) {
            buttonMInnerAdd.disabled = true;
        }else{
            buttonMInnerAdd.disabled = false;
        }
    } else {
        buttonMInnerAdd.disabled = true;
    }



}

//View

function buttonModalCloseMCV() {

    let userConfirm = window.confirm("Are you sure to close the Modal...?");

    if (userConfirm) {

        $("#modalViewCustomerForm").modal("hide");
    }
}

function printRowItemMC() {
    let newWindow = window.open();
    newWindow.document.write("<link rel='stylesheet' href= 'resources/bootstrap/css/bootstrap.min.css'>"+"<h2>Product Details</h2>" + "<div>"+tablePrintCustomer.outerHTML +"</div>");
    setTimeout(function () {
        newWindow.print();
        newWindow.close();
    },1000);
}

const rowView = (ob,rowind) => {
    $("#modalViewCustomerForm").modal("show");
//as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.
//    printproduct = getServiceRequest("/product/getbyid/"+ob.id) ;
    printproduct = ob;
    tdPCode.innerHTML = printproduct.product_code ;
    tdCName.innerHTML = printproduct.customer_id.customer_name ;
    tdPSize.innerHTML = printproduct.product_size_id.name ;

       tdPSizeWidth.innerHTML=printproduct.product_size_id.width;
       tdPSizeHeight.innerHTML=printproduct.product_size_id.height;

    // tdpType.innerHTML = printproduct.papertype_id.name ;
    tdPColors.innerHTML = printproduct.papercolors_id.name ;

}
