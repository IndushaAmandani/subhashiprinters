//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=Product");
    $('[data-toggle="tooltip"]').tooltip();
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


    // need to add jquerty table
    $('#tableProduct').dataTable();
}

//define form refreshProductForm
refreshProductForm = () => {

    product = new Object();
    oldproduct = null;

    product.productCopyList = new Array();
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
    fillSelectFeild(cmbProductStatus, "Select Status", productStatuses, 'name', 'Active');
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


    refreshPInnerFormTable();


}

//Inner Form
refreshPInnerFormTable = () => {
    productCopy = new Object();
    oldprodctCopy = null;

    pCopypTbyPCategory = getServiceRequest("/paperTypes/list");
    fillSelectFeild(cmbPcopypaperTypes, "Select Paper Types", pCopypTbyPCategory, "name", "");
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
}

const buttonInnerAddMC = (value) => {
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

}

//inner form-inner tale-row button functions
const innerFormReFill = (innerob, rowind) => {
}
const innerRowDelete = (innerob, rowind) => {


    let deleteInnerMsg = "Are you sure to delete following Product Copy Details..?" +
        "\n Paper Typr: " + innerob.papertype_id.name
        + "\n Paper Colors : " + innerob.papercolors_id.name;

    let innserdeleteUserResponce = window.confirm(deleteInnerMsg);

    if (innserdeleteUserResponce) {

        product.productCopyList.splice(rowind, 1)
        alert("Remove Successfully...!");
        refreshPInnerFormTable();
    }
}
const innerRowView = () => {
}
const rowView = () => {
}
const rowDelete = (ob, row) => {
    let deleteMsg = "Are you surely want to delete following Product..? \n" + ob.p_name;

    let serverResponce = getHTTPRequestService("/product", "DELETE", ob);
    if (serverResponce == "0") {
        alert("Delete Successfully... !");
    } else {
        alert("Fail to Delete,You have folowing error .. \n" + serverResponce);
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

    // set value into  feilds


    // txtProductname
    // cmbproductCategory
    // cmbproductSize
    // txtHeight
    // txtWeight
    // txtSideType


    //Optional calue checking
    if (employee.land != undefined)
        txtLand.value = employee.land; else txtLand.value = "";

    if (product.description != undefined)
        txtDescription.value = product.description; else txtDescription.value = "";

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

    $('#modalEmployeeForm').modal("show");

    disabledButton(false, true);


}

//Cusotmize Sizes availablewhne p type is label
// function showCustomizedSizes() {
//
//     if (JSON.parse(cmbproductCategory.value).name == "Label") {
//         divcustomizedSizes.style.display = "block";
//     } else {
//         divcustomizedSizes.style.display = "none";
//     }
// }

//Inner Form available when category is bill book
function divInnerPCopyFormshow() {
    if (JSON.parse(cmbproductCategory.value).name == "Bill Book") {
        divInnerPCopyForm.style.display = "block";

    } else {
        divInnerPCopyForm.style.display = "none";


    }
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
}

//json.parse --> creating java object and filteering by id using .id
function selectpaperColors() {
    let paperColorsByPaperType = getServiceRequest("/paperColors/getbyPType/" + JSON.parse(cmbpaperTypes.value).id);
    fillSelectFeild(cmbpaperColors, "Select Paper Colors", paperColorsByPaperType, "name", "");
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
            if (productCopy.papertype_id == null) {
                errors = errors + "Paper Type is not selected \n";
            }
            if (productCopy.papercolors_id == null) {
                errors = errors + "Paper Colors are not selected\n";
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
    if (product.noofcopies == null) {
        errors = errors + "Product print copies is not entered\n";
    }
    if (product.price == null) {
        errors = errors + "Product print copies is not entered\n";
    }

    return errors;

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
                $("#modalProductForm").modal("hide");
            } else {
                alert("Fail to add, You have following error... \n" + serverResponce);
            }
        }

    } else {
        alert("You have following error in your form... \n" + errors);
    }

}

function buttonClearMC(){
    refreshProductForm;
}