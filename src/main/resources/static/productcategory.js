//add funtion browser onload event
window.addEventListener('load', loadUI);

//define function called loadui
function loadUI() {

    lggeduserprivilage = getServiceRequest("/userprivilage/bymodule?modulename=ProductCategory");

    //lggeduserprivilage = {"sel": true , "ins":true , "upd":true , "del":true}

    //called refreshtable function
    refreshProductCategoryTable();

// called refreshproductForm function
    refreshProductCategoryForm();


}

function refreshProductCategoryTable() {


    //create array for product category
    pcategory = new Array();
    pcategory = getServiceRequest("/productCategory/list");

    //create display property list
    let dispalyPropertyList = ['name', 'profit_rate', 'production_cost'];
    //Property type list
    let dispalyPropertyDTList = ['text', 'decimal', 'decimal'];

    //called filldataintotable function for fill data
    fillDataIntoTable(tablePcategory, pcategory, dispalyPropertyList, dispalyPropertyDTList, formRefill, rowDelete, rowView, true, lggeduserprivilage);


    // need to add jquerty table
    $('#tablePcategory').dataTable();

}

function refreshProductCategoryForm() {
    document.getElementById("productCategoryModal").style.pointerEvents = "auto";

    productCategory = new Object();
    oldproductCategory = null;

    productCategory.assignedPIT = null;
    assignedPaperInkTypes = [];


    const idArray = [txtproductcategoryname, txtProfitRate, txtproductionCost,inputPaperInkTypes];
    setIDStyle(idArray, "1px solid #ced4da");

    txtproductcategoryname.value = "";
    txtProfitRate.value = 0.00;
    txtproductionCost.value = 0.00;


    papertypeinktypes = getServiceRequest("/paperInkTypes/list")
    fillSelectFeild(inputPaperInkTypes, "Select Sub Category", papertypeinktypes, "name", "");


    document.getElementById("buttonContainer").innerHTML = "";

}


function formRefill(ob) {

 //   console.log(ob);
    productCategory = getServiceRequest("/productCategory/getbyid/" + ob.id);
    oldproductCategory = getServiceRequest("/productCategory/getbyid/" + ob.id);

//console.log(refilPcat);
    txtproductcategoryname.value = productCategory.name;
    txtProfitRate.value = productCategory.profit_rate;
    txtproductionCost.value = productCategory.production_cost;

//refill for the
    if(productCategory.assignedPIT.length != null){

        assignedPaperInkTypes = (productCategory.assignedPIT);
        //Adding the object to the assignedPaperInkTypes Array list
        assignedPaperInkTypes.forEach(element => {

            // Create a new button into variable
            const newButton = document.createElement("button");
            newButton.innerText = element.name + " ";
            newButton.innerHTML = newButton.innerHTML + '<i class="fa-solid fa-xmark"></i>';
            newButton.value = element.name;
            newButton.style.margin = '2px';
            newButton.style.borderRadius = '5px';
            newButton.title = 'Click on Item to Remove'; //adding title to display on mouse hover
            newButton.id = element.name;
            newButton.addEventListener("click", function () {
                this.remove();
                assignedPaperInkTypes = assignedPaperInkTypes.filter(objEl =>
                    objEl.name !== (this.value)
                );
                inputPaperInkTypes.style.borderBottom = "1px solid green";
                //console.log(assignedPaperInkTypes);
                productCategory.assignedPIT = assignedPaperInkTypes;
            });
            // Append the new button to the container
            document.getElementById("buttonContainer").appendChild(newButton);
            fillSelectFeild(inputPaperInkTypes, "Select Sub Category", papertypeinktypes, "name", "");
            inputPaperInkTypes.style.borderBottom = "1px solid #cacfe7";

        })


    }else{

        document.getElementById("buttonContainer").innerText = "";
    }
    let productCatArray = [txtproductcategoryname,txtProfitRate,txtproductionCost]
    setIDStyle(productCatArray,"2px dotted green");

    btnAddNew.click();

    disabledButton(false, true);

}

function rowDelete(ob) {

    let deleteMsg = "Are you sure want to delete Product Category..?" +
        " \n Category Name : " + ob.name;

    let deleteResponce = window.confirm(deleteMsg);

    if (deleteResponce) {
        let serverResponse = getHTTPServiceRequest("/productCategory", "Delete", ob);

        if (serverResponse == "0") {
            alert("Delete Successfully");
            refreshProductCategoryTable();
        } else {
            alert("Fail to delete : You have following error... \n" + serverResponse);
        }
    }

}

const addSelectedValue = () => {
    // Get the selected value from the dropdown
    const selectedItemString = document.getElementById("inputPaperInkTypes").value;
    if (selectedItemString == 'Select Paper Ink Type') {
        inputPaperInkTypes.style.borderBottom = "1px solid red";
    } else {
        // Parse the JSON string to an object
        const selectedItem = JSON.parse(selectedItemString);
        inputPaperInkTypes.style.borderBottom = "1px solid green";

        //checking if the value in selected Item already in
        const isFound = assignedPaperInkTypes.some(element => {
            if (element.name === selectedItem.name) {
                return true;
            } else {
                return false;
            }
        });

        if (!isFound) {
            //Adding the object to the assignedPaperInkTypes Array list
            assignedPaperInkTypes.push(selectedItem);
            productCategory.assignedPIT = assignedPaperInkTypes;
            // Create a new button into variable
            const newButton = document.createElement("button");
            newButton.innerText = selectedItem.name + " ";
            newButton.innerHTML = newButton.innerHTML + '<i class="fa-solid fa-xmark"></i>';
            newButton.value = selectedItem.name;
            newButton.style.margin = '2px';
            newButton.style.borderRadius = '5px';
            newButton.title = 'Click on Item to Remove'; //adding title to display on mouse hover
            newButton.id = selectedItem.name;
            newButton.addEventListener("click", function () {
                this.remove();
                assignedPaperInkTypes = assignedPaperInkTypes.filter(objEl =>
                    objEl.name !== (this.value)
                );
                inputPaperInkTypes.style.borderBottom = "1px solid green";
                //console.log(assignedPaperInkTypes);
                productCategory.assignedPIT = assignedPaperInkTypes;
            });
            // Append the new button to the container
            document.getElementById("buttonContainer").appendChild(newButton);
            fillSelectFeild(inputPaperInkTypes, "Select Sub Category", papertypeinktypes, "name", "");
            inputPaperInkTypes.style.borderBottom = "1px solid #cacfe7";

        } else {
            inputPaperInkTypes.style.borderBottom = "1px solid red";
        }
    }
}


//Event listner to run on chage of roles select list
inputPaperInkTypes.addEventListener("change", function () {
    onChangePapetInkSelect();
});

const onChangePapetInkSelect = () => {
    //disabling firstElement 'Select a roll option'
    inputPaperInkTypes.firstElementChild.disabled = true;
    //taking value of the selected role that set as a ob converted into string
    const selectedItemString = document.getElementById("inputPaperInkTypes").value;
    //changing it back to an object
    const selectedListItem = JSON.parse(selectedItemString);
    //console.log(selectedItem)
    //searching that is selected object avalable in assignedRoles array as existing value.
    const isFounded = assignedPaperInkTypes.some(element => {
        if (element.name === selectedListItem.name) {
            //returns true if it founded
            return true;
        }//returns false if it not founded
        return false;
    });
    //checking the isFounded or not
    if (isFounded) {
        //changing the classList to appear as invalid

        inputPaperInkTypes.style.borderBottom = "1px solid red";

    } else {
        //Chaning the classList to appear as valid
        inputPaperInkTypes.style.borderBottom = "1px solid green";
    }
}


function rowView(ob) {
    formRefill(ob);
    document.getElementById("productCategoryModal").style.pointerEvents = "none";
    setIDStyle(idArray, "1px solid #ced4da");

}

let  profitRateEl = document.getElementById("txtProfitRate");
profitRateEl.addEventListener('keyup', () => {
    profitratevalidator();
});


//100.00,99.99,1.00,1.99
function profitratevalidator() {
    let regP = new RegExp("^(([1-9][0-9]{0,2}[.][0-9]{2})|([1-9][0-9]{0,2}))$");

    if (regP.test(txtProfitRate.value)) {
        txtProfitRate.style.borderBottom = "2px solid green"
        productCategory.profit_rate = parseFloat(txtProfitRate.value);

    } else {

        txtProfitRate.style.borderBottom = "2px solid red";
        productCategory.profit_rate = null;
    }
}

function buttonModalClosePCMC() {
    buttonCloseModal("#modalProductCategoryForm", refreshProductCategoryForm);
}


let submitbtn = document.getElementById("buttonAdd");
submitbtn.addEventListener('click', () => {
    let errors = checkPCategoryformErrors();
    if (errors != "") {
        window.alert("You have following errors " + errors);
    } else {

        let userConfrimation = "Are you sure to add add following Product category ?" +
            "\nProduct Category Name : " + productCategory.name +
            "\nProfit Rate : " + productCategory.profit_rate +
            "\nProduction Cost : " + productCategory.production_cost;

        let userResponse = window.confirm(userConfrimation);

        if (userResponse) {
            let serverResponse = getHTTPServiceRequest("/productCategory", "POST", productCategory);
            if (serverResponse == "0") {
                refreshProductCategoryForm();
                refreshProductCategoryTable();
                window.alert("Product Category insert Succesfully !");
                $("#modalProductCategoryForm").modal("hide");

            } else {
                window.alert("Product Category insert not successfull ; You have following errors \n" + serverResponse)
            }
        }


    }

})

function checkPCategoryformErrors() {

    let formerror = "";

    if (productCategory.name == null) {
        formerror = formerror + "Please enter Product Category name ..!\n";
    }
    if (productCategory.profit_rate == null) {
        formerror = formerror + "Please enter Profit Rate ..!\n";
    }
    if (productCategory.production_cost == null) {
        formerror = formerror + "Please enter Production Cost ..!\n"
    }

    return formerror;
}





let cancelbtn = document.getElementById("buttonUpdate");
cancelbtn.addEventListener('click', () => {
    refreshProductCategoryForm();
    $("#modalProductCategoryForm").modal("hide");
})

function buttonUpdateMC() {
                    //(updateObj,checkErrors,checkUpdate,url,obj,refreshTable,refreshUForm,modalformID)
    updatemodal("productCategory",checkPCategoryformErrors,checkUpdate,"/productCategory",productCategory,refreshProductCategoryTable,refreshProductCategoryForm,"#divAddButtonProductCategory")
   }

function checkUpdate() {

    let formupddate = "";

    if(productCategory.name != oldproductCategory.name){
        formupddate = formupddate + "Product Category Name has updated..!"
    }
    if(productCategory.profit_rate != oldproductCategory.profit_rate){
        formupddate = formupddate + "Product Category Profit rate is updated..!"
    }
    if(productCategory.production_cost != oldproductCategory.production_cost){
        formupddate = formupddate + "Production Cost is updated..!";
    }
    if (JSON.stringify(productCategory.assignedPIT) != JSON.stringify(oldproductCategory.assignedPIT)) {
        formupddate = formupddate + ("Paper and Ink Types have updated .. !");
    }
    return formupddate;
}

// function buttonUpdateMC(){
//  let errors =    checkPCategoryformErrors();
//     if(errors != ""){
//         window.alert("You have following errors ..!" + errors);
//     }else {
//         let checkUpdates = checkUpdate();
//         if(checkUpdates == ""){
//             window.alert("Nothing updated ..!")
//         }
//     }
//
// }

function buttonClearMC(){
    refreshProductCategoryForm();
    buttonContainer.innerHTML = "";
}


