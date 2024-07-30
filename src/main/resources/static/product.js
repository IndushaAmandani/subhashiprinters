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

//json.parse --> creating java object and filteering by id using .id

// generating prodct Size according to the Category main form

 let filterPaperInkType = document.getElementById("cmbproductCategory");
filterPaperInkType.addEventListener( 'change', ()=>{

    refreshMQFormTable();
    refreshPInnerFormTable();
 let divInnerPCopyForm =    document.getElementById("divInnerPCopyForm");

        if (JSON.parse(cmbproductCategory.value).name == "Bill Book") {
            divInnerPCopyForm.style.display = "block";
            productPaperTypebyPCategory = getServiceRequest("/paperInkTypes/getPaperByProductCategory/" + JSON.parse(cmbproductCategory.value).id);
            fillSelectFeild(cmbPcopypaperTypes, "Add Paper Types", productPaperTypebyPCategory, "name", "");
            radioSingle.checked = "true"
            product.single_or_double = radioSingle.value;
            lblRadioSingle.style.color = 'green';
            divInnerMateialForm.style.display = "none";
            radioDouble.disabled = true;

        } else {
            divInnerPCopyForm.style.display = "none";
            divInnerMateialForm.style.display = "block"
        }







})

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
    let displayPropertyList = ['product_code', 'customer_id.customer_name', 'p_name', 'product_size_id.name', 'single_or_double', 'product_category_id.name', 'price', 'product_status_id.name'];
    // creat display property data type list
    let displayDatatypeList = ['text', 'object', 'text', 'object', 'text', 'object', 'text', 'object'];
    //called filldataintotable function for fill data
    fillDataIntoTable(tableProduct, products, displayPropertyList, displayDatatypeList, formRefill, rowDelete, rowView, true, lggeduserprivilage);

    for (let index in products) {
        if (products[index].product_status_id.name == "Not-Active") {
            tableProduct.children[1].children[index].style.backgroundColor = "#ad9393";
            tableProduct.children[1].children[index].style.color = "#0f100f";
            tableProduct.children[1].children[index].children[9].children[1].disabled = true;
            tableProduct.children[1].children[index].children[9].children[1].style.pointerEvents = "all";
            tableProduct.children[1].children[index].children[9].children[1].style.cursor = "not-allowed";

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

    // ######################Customers ##########################
    customers = getServiceRequest("/customer/list")
    fillSelectFeild(cmbCustomer, "Select Customer", customers, "customer_name", "");

    refreshMQFormTable();
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
    fillSelectFeild(cmbProductStatus, "Select Status", productStatuses, 'name', 'Active', true);
    product.product_status_id = JSON.parse(cmbProductStatus.value);
    cmbProductStatus.style.borderBottom= "1px solid green";

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
    fillSelectFeild(cmbproductSize, "Add sizes", productSizes, "name", "",true);


    // // ###################### PaperSide  ##########################

    txtProductname.value = "";
    txtHeight.value = "";
    txtWidth.value = "";
    //  productImage.value = "";

    txtPrice.value = "";
    txtDescription.value = "";

    //photo reset
    product.image = null;
    product.product_photo_name = "";
    productImage.src = "resources/images/product_photo/label_2.jpg";
    txtproductPhoto.value = "";
    pFilePhoto.files = null;

    refreshPInnerFormTable();
    refreshMQFormTable();
    const productArray = [txtProductname, txtPrice, txtDescription, cmbCustomer, cmbproductCategory, cmbProductStatus, cmbproductSize]
    setIDStyle(productArray, "1px solid #cacfe7")
    disabledButton(true, false);


}


const buttonMInnerAddMC = (value) => {
    let productMset = false;
    let productcopy = false;

    for (let index in product.producthasMaterial) {

        if (product.producthasMaterial[index].material_id.name == productHasMaterial.material_id.name) {
            productMset = true;
            break;
        }

    }

    let pCcount = product.productCopyList.length + 1;
    //  paper_ink_type_id
    let countPaper = 0;
    for (let index in product.producthasMaterial) {

        if (product.producthasMaterial[index].material_category_id.id == 1) {
            countPaper = countPaper + 1;
        }

    }
    //countpaper - material paper count
    //pCcount - product copy paper count
    if(pCcount <= countPaper && countPaper == 0 ){
        productcopy = true;
    }

    if (!productMset && !productcopy) {

        let confirmMs = "Are you sure to add following Product Details \n"
            + "\n Material : " + productHasMaterial.material_id.name
            + "\n Quantity : " + productHasMaterial.quantity;
        let userResponce = window.confirm(confirmMs);


        if (userResponce) {
            for (const phm of product.productHasMaterialList) {
                phm.unit_cost = (parseFloat(phm.material_id.unit_price) / parseFloat(phm.material_id.measuring_count)) * parseFloat(phm.quantity);

            }
            product.productHasMaterialList.push(productHasMaterial);
            alert("Save Succecfully...!");
            refreshMQFormTable();

        }


    }else{
        alert("Please Change material...!");
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

    // divAddButtonCustomerM.display = "none";
    // divAddButtonProductCategory.display = "none";
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
    txtProductname.value = product.p_name
    txtHeight.value = product.height
    txtWidth.value = product.width

    txtPrice.value = product.price
    txtDescription.value = product.description
    // productImage.src =atob(product.image);


    fillSelectFeild(cmbCustomer, "Select Customer", customers, "customer_name", product.customer_id.customer_name);
//    productCategory= getServiceRequest("/productCategory/list")
    fillSelectFeild(cmbproductCategory, "Select product category", productcategories, 'name', product.product_category_id.name);
    // productStatuses = getServiceRequest("/product_Status/list")
    fillSelectFeild(cmbProductStatus, "Select Status", productStatuses, 'name', product.product_status_id.name);
    //  productSizes = getServiceRequest("productsize/list")
    fillSelectFeild(cmbproductSize, "Add sizes", productSizes, "name", product.product_size_id.name);
    //  paperTypes = getServiceRequest("/paperTypes/list")
    // fillSelectFeild(cmbpaperTypes, "Select Paper Type", paperTypes, "name", product.papertype_id.name);
    //   printColors = getServiceRequest("/printColors/list")
    // fillSelectFeild(cmbprintColors, "Select Print Colors", printColors, "name", product.printcolors_id.name);
    //  fillSelectFeild(cmbpaperColors, "Select Paper Colors", paperColors, "name", product.papercolors_id.name);


    const idArray = [txtProductname, txtHeight, txtWidth, txtPrice, txtDescription, cmbCustomer, cmbproductCategory, cmbProductStatus, cmbproductSize]
    setIDStyle(idArray, "2px dotted green");


    //refill photo
    if (product.image == null) {
        productImage.src = "resources/images/product_photo/label_2.jpg";
        txtproductPhoto.value = "";
    } else {
        productImage.src = atob(product.image);
        txtproductPhoto.value = product.product_photo_name;
    }

    btnAddNew.click();


    disabledButton(false, true);
    refreshPInnerFormTable();
    refreshMQFormTable();

}


//get customized Size values when size is selected as customized size
function showCustomizedproductSize() {
    if (JSON.parse(cmbproductSize.value).name == "Customized Size") {
        divproductSize.style.display = "block";
    } else {
        divproductSize.style.display = "none";
    }
}


//photo clearing settings
document.getElementById("btnClearImage").addEventListener("click", () => {
    product.image = null;
    product.product_photo_name = "";
    productImage.src = "resources/images/product_photo/label_2.jpg";
    txtproductPhoto.value = "";
    pFilePhoto.files = null;
})

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

        if (product.single_or_double != oldproduct.single_or_double) {
            updates = updates + "Product Paaper Side changed " + oldproduct.single_or_double
                + " into " + product.single_or_double + "\n";
        }
        if (product.p_name != oldproduct.p_name) {
            updates = updates + "Product name has changed " + oldproduct.p_name
                + " into " + product.p_name + "\n";
        }
        if (product.height != oldproduct.height) {
            updates = updates + "Product height has changed " + oldproduct.height
                + " into " + product.height + "\n";
        }
        if (product.width != oldproduct.width) {
            updates = updates + "Product weight has changed " + oldproduct.width
                + " into " + product.width + "\n";
        }
        if (product.price != oldproduct.price) {
            updates = updates + "Product price has changed " + oldproduct.price
                + " into " + product.price + "\n";
        }
        if (product.customer_id.customer_name != oldproduct.customer_id.customer_name) {
            updates = updates + "Product customer_name name has changed " + oldproduct.customer_id.customer_name
                + " into " + product.customer_id.customer_name + "\n";
        }
        if (product.product_category_id.name != oldproduct.product_category_id.name) {
            updates = updates + "Product product_category name has changed " + oldproduct.product_category_id.name
                + " into " + product.product_category_id.name + "\n";
        }
        if (product.product_status_id.name != oldproduct.product_status_id.name) {
            updates = updates + "Product Status name has changed " + oldproduct.product_status_id.name
                + " into " + product.product_status_id.name + "\n";
        }
        if (product.product_size_id.name != oldproduct.product_size_id.name) {
            updates = updates + "Product size has changed " + oldproduct.product_size_id.name
                + " into " + product.product_size_id.name + "\n";
            // }
            // if (product.papertype_id.name != oldproduct.papertype_id.name) {
            //     updates = updates + "Product papertype name name has changed " + oldproduct.papertype_id.name
            //         + " into " + product.papertype_id.name + "\n";
            // }

        }

        if ((product.image) != (oldproduct.image)) {
            updates = updates + "Product image is Changed \n";
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

function buttonClearMC() {
    refreshProductForm();
}

function buttonUpdateMC() {
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
    } else {

        window.alert("You have following error in your form...! \n " + errors);
    }


}

//Modal close
function buttonModalCloseMC() {
    buttonCloseModal("#modalProductForm", refreshProductForm)
}

//Inner Form
refreshPInnerFormTable = () => {
    productCopy = new Object();
    oldprodctCopy = null;


    // let paperTypesByCategory = getServiceRequest("/paperInkTypes/list");
    // fillSelectFeild(cmbPcopypaperTypes, "Select Paper Type", paperTypesByCategory, "name", "");

    if (cmbproductCategory.value != "") {
        productPaperTypebyPCategory = getServiceRequest("/paperInkTypes/getPaperByProductCategory/" + JSON.parse(cmbproductCategory.value).id);
        fillSelectFeild(cmbPcopypaperTypes, "Add Paper Types", productPaperTypebyPCategory, "name", "");
        // productInkTypebyPCategory = getServiceRequest("/paperInkTypes/getInkByProductCategory/" + JSON.parse(cmbproductCategory.value).id);
        // fillSelectFeild(cmbPcopyprintColors, "Add Ink Types", productInkTypebyPCategory, "name", "");

    }


//   Innere Table
    let displayPropList = ['paper_type_id.name'];
    let disPPDTypeList = ['object'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};
    if (product.productCopyList.length < 6) {
        fillDataIntoTable(tablePCopies, product.productCopyList, displayPropList, disPPDTypeList, innerFormReFill, innerRowDelete, innerRowView, true, innerlogedUserPrivilage);

        for (let index in product.productCopyList) {
            tablePCopies.children[1].children[index].children[2].children[0].style.display = "none";
            tablePCopies.children[1].children[index].children[2].children[2].style.display = "none";

        }
    } else {

    }

    cmbPcopypaperTypes.style.borderBottom = "2px solid #cacfe7"

    // buttonInnerUpdate.disabled = true;
}

function buttonMInnerClearMC() {
    refreshMQFormTable();
}

function checkErrorz() {
    let errors = "";
    if (product.product_category_id.name == "Bill Book") {
        if (productCopy.paper_type_id == null) {
            errors = errors + "Paper Ink Types  are not selected \n";
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
//&& product.productCopyList[index].ink_type_id.id == productCopy.ink_type_id.id
            if (product.productCopyList[index].paper_type_id.name == productCopy.paper_type_id.name) {
                productcopyset = true;
                break;
            }
        }
        if (!productcopyset) {

            if (product.productCopyList.length < 6) {

                let confirmMs = "Are you sure to add following Product Details \n"
                    + "\n Paper Type : " + productCopy.paper_type_id.name;

                let userResponce = window.confirm(confirmMs);

                if (userResponce) {
                    product.productCopyList.push(productCopy);
                    alert("Save Succecfully...!");
                    refreshPInnerFormTable();
                    divInnerMateialForm.style.display = "block"
                }

            } else {
                return (alert("You can't add anymore copies!"));
            }

        }
    } else {
        alert("You have following error in your form... \n" + errors);
    }

}

//inner form-inner tale-row button functions
const innerFormReFill = (innerob, rowind) => {


//     //    pCopypTbyPCategory = getServiceRequest("/paperTypes/list");
//     fillSelectFeild(cmbPcopypaperTypes, "Select Paper Types", pCopypTbyPCategory, "name", "");
// //    pCopypaperColors = getServiceRequest("/paperColors/list")
//     fillSelectFeild(cmbPcopypaperColors, "Select Paper Colors", pCopypaperColors, "name", "");
//     //  productCategory= getServiceRequest("/productCategory/list")
//     fillSelectFeild(cmbproductCategory, "Select product category", productcategories, 'name', '');

    buttonInnerUpdate.disabled = false;
    buttonInnerAdd.disabled = true;

}
const innerRowDelete = (innerob, rowind) => {


    let deleteInnerMsg = "Are you sure to delete following Product Copy Details..?" +
        "\n Paper Type: " + innerob.papertype_id.name;


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
    productHasMaterial = new Object();
    productHasMaterial.unit_cost = 0.00;
    oldproductHasMaterial = null;
    papertypeinktypes = getServiceRequest("/paperInkTypes/list")
    fillSelectFeild(cmbsubCategory, "Select Sub Category", papertypeinktypes, "name", "");


    getMaterial = getServiceRequest("/material/list")
    fillSelectFeild(cmbMaterial, "Select Materials", getMaterial, "name", "",true);

    // if (cmbMaterial.value != "") {
    //     materialsByP = getServiceRequest("/material/listbysupplier/" + JSON.parse(cmbSupplier.value).id);
    //     fillSelectFeild2(cmbMaterial, "Select Material", materialsByQR, "code", "name", "");
    //     cmbMaterial.disabled = false;
    // } else {
    //     fillSelectFeild2(cmbMaterial, "Select Material", materials, "code", "name", "");
    //     cmbMaterial.disabled = true;
    // }

    txtQty.value = "";
    txtQty.style.borderBottom = "1px solid #cacfe7";
    cmbMaterial.style.borderBottom = "1px solid #cacfe7";
    cmbsubCategory.style.borderBottom = "1px solid #cacfe7";

//   Innere Table
    let displayPropList = ['material_id.name', 'quantity'];
    let disPPDTypeList = ['object', 'text'];
    let innerlogedUserPrivilage = {sel: true, ins: true, upd: true, del: true};

    let productMprice = 0.00;
    for (const phm of product.productHasMaterialList) {
        productMprice = parseFloat(productMprice) + parseFloat(phm.unit_cost);
        console.log(productMprice);
    }

    fillDataIntoTable(tableMateiralQuantity, product.productHasMaterialList, displayPropList, disPPDTypeList, innerFormMReFill, innerMRowDelete, innerMRowView, true, innerlogedUserPrivilage);


    for (let index in product.productHasMaterialList) {
        tableMateiralQuantity.children[1].children[index].children[3].children[0].style.display = "none";
        tableMateiralQuantity.children[1].children[index].children[3].children[2].style.display = "none";

    }

    if (cmbproductCategory.value != "") {
        let productPrice = (parseFloat(productMprice) + (parseFloat(productMprice) * (parseFloat(product.product_category_id.profit_rate) / 100))).toFixed(2);
        console.log(productPrice);
        txtPrice.value = productPrice;
        product.price = productPrice;
    }

    buttonMInnerAdd.disabled = true;

}

//Material - Inner form
function selectMaterial() {

    // if(product.product_category_id.name !== "Bill Book"){

        if (cmbsubCategory.value != "") {
            cmbMaterial.disabled = false;
            materialsBySC = getServiceRequest("/material/listbySubCAtegory/" + JSON.parse(cmbsubCategory.value).id);
            fillSelectFeild(cmbMaterial, "Select Material", materialsBySC, "name", "");

        } else {
        getMaterial = getServiceRequest("/material/list")
        fillSelectFeild(cmbMaterial, "Select Materials", getMaterial, "name", "");
        cmbMaterial.disabled = true;
    }
    // }else {
    //     cmbsubCategory.disabled = false;
    //     materialsbyPC = getServiceRequest("material/listbyProductCategory/" + JSON.parse(cmbproductCategory.value).id);
    //     fillSelectFeild(cmbMaterial,"Select Material",materialsbyPC,"name","")
    // }
}


//Button disable on Inner forms  - Material
//enable quantity
function quantityEntry(){
    if(cmbMaterial.value != ""){
        txtQty.disabled = false;
    }else{
        txtQty.disabled = true;
    }

}
function buttondisabling() {
//^(([0][.][0][1-9])|([0][.][1-9][0-9])|([1-9][0-9]{0,2}[.][0-9]{2})|([1-9][0-9]{0,2}))?$'
    //99.99,
    if (txtQty.value != "") {

        buttonMInnerAdd.disabled = false;

    } else {
        buttonMInnerAdd.disabled = true;
    }


}
//inner form-inner tale-row button functions
const innerFormMReFill = (innerob, rowind) => {

    productHasMaterialList = JSON.parse(JSON.stringify(innerob));
    oldproductHasMaterialList = JSON.parse(JSON.stringify(innerob));


    //    pCopypTbyPCategory = getServiceRequest("/paperTypes/list");
    fillSelectFeild(cmbMaterial, "Select Materials", getMaterial, "name", productHasMaterialList.papertype_id.name);

    txtQty.value = productHasMaterialList.quantity;


    cmbMaterial.style.borderBottom = "2px dotted  green";
    txtQty.style.borderBottom = "2px dotted  green";
    cmbsubCategory.style.borderBottom = "2px dotted green"

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



//View
function buttonModalCloseMC() {
    buttonCloseModal("#modalProductForm", refreshProductForm);

}

function buttonModalCloseMMCVM() {
    buttonCloseVModal("#modalViewProductForm");

}

function printRowItemMC() {
    let newWindow = window.open();
    newWindow.document.write("<link rel='stylesheet' href= 'resources/bootstrap/css/bootstrap.min.css'>" + "<h2>Product Details</h2>" + "<div>" + tablePrintProduct.outerHTML + "</div>");

}

const rowView = (ob, rowind) => {

    $("#modalViewProductForm").modal("show");
//as  here all data i pased through the ob we use same ob but if it 's like emplyee every details are not brought tot hte table and so obj.we have  to use services for bring the obj every detils.
//    printproduct = getServiceRequest("/product/getbyid/"+ob.id) ;
    printproduct = ob;
    tdPCode.innerHTML = printproduct.product_code;
    tdCName.innerHTML = printproduct.customer_id.customer_name;
    tdPCategory.innerHTML = printproduct.product_category_id.name;
    tdPrice.innerHTML = printproduct.price;
    tdPSizeHeight.innerHTML = printproduct.product_size_id.height
    tdPSizeWidth.innerHTML = printproduct.product_size_id.width;

}

function buttonAddProductCategory() {
    window.location.href = "http://localhost:8080/productCategory";

}

function buttonAddCustomerP() {
    window.location.href = "http://localhost:8080/customer";
    setTimeout(function () {
        $("modalCustomerForm").modal('show');
    }, 3000);
}

// generating prodct Size according to the Category main form
function getP_SizeByPCategory() {
    cmbproductSize.disabled = false;
    productSizebyPCategory = getServiceRequest("/productsize/getByPCategory/" + JSON.parse(cmbproductCategory.value).id);
    fillSelectFeild(cmbproductSize, "Add sizes", productSizebyPCategory, "name", "");
    cmbproductSize.style.borderBottom = "1px solid green";

}

// txtPaperHeight.value = "";
// txtPaperWidth.value = "";
// txtPaperWidth.style.borderBottom = "1px solid #cacfe7";
// txtPaperHeight.style.borderBottom = "1px solid #cacfe7";

//block - show
//none - hide