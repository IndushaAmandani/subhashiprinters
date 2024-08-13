package lk.subhashiprinters.sample;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

import lk.subhashiprinters.corder.CustomerOrder;
import lk.subhashiprinters.corder.CustomerOrderHasMaterial;
import lk.subhashiprinters.corder.CustomerOrderHasProduct;
import lk.subhashiprinters.material.MaterialInventory;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.persistence.*;


@RestController //make it available to front end 
@RequestMapping(value = "/productCategory")

public class ProductCategoryController {
    @Autowired
    // linked required repostiory
    private ProductCategoryRepository productCategoryDao;

    @Autowired
    private UserRepository userDao;
    @Autowired
    private PrivilageController privilegeController;
    @Autowired
    private ProductSizeRepository productSizeDao;

    @GetMapping
    public ModelAndView pcategoryUI() {
        ModelAndView pcategoryui = new ModelAndView();
        pcategoryui.setViewName("productCategory.html");
        return pcategoryui;
    }

    //productCategory/list
    @GetMapping(value = "/list", produces = "application/json")
    public List<ProductCategory> productCategoryList() {
        return productCategoryDao.findAll();
    }

    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public ProductCategory getByPathId(@PathVariable("id") Integer id) {
        return productCategoryDao.getReferenceById(id);
    }

    @PostMapping
    public String addpCategory(@RequestBody ProductCategory productCategory) {
        //checking logged user priviledge
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof AnonymousAuthenticationToken) {
            return "Product Category Insert Not completed : You don't have permission";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(auth.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "ProductCategory");

        if (loggedUser != null && userPiriv.get("ins")) {
            // user has privilage for insert item

            ProductCategory extProductCategoryName = productCategoryDao.getPCategorybyName(productCategory.getName());

            if (extProductCategoryName != null) {
                return "ProdutCategory inser Not completed : Given Product Category Already exist!";
            }

            try {

                productCategoryDao.save(productCategory);
                ProductCategory savedPC = productCategoryDao.getPCategorybyName(productCategory.getName());
                ProductSize productSize = new ProductSize();
                productSize.setName("Customized Size");
                productSize.setProduct_category_id(savedPC);
                productSizeDao.save(productSize);


                return "0";
            } catch (Exception ex) {
                return "Product Category Insert Not completed : " + ex.getMessage();
            }


        } else {
            return "Product Category Insert Insert Not completed : You don't have permission";
        }

    }


    @PutMapping
    public String updateCategory(@RequestBody ProductCategory productCategory) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof AnonymousAuthenticationToken) {
            return "Product Category Update Not completed : You don't have permission";
        }

        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriviledge = privilegeController.getPrivilageByUserModule(auth.getName(), "ProductCategory");


        if (userPriviledge != null && userPriviledge.get("upd")) {
            ProductCategory extProductCat = productCategoryDao.getReferenceById(productCategory.getId());

            if (extProductCat == null) {
                return "Product Category Update not completed : Doesn't Exist !";
            }
            try {
                productCategoryDao.save(productCategory);
                return "0";
            } catch (Exception e) {
                return "Product Category Update not completed " + e.getMessage();
            }

        } else {
            System.out.println(userPriviledge);
            return "Product Category Update not completed : You don't have permission ";
        }
    }

    @DeleteMapping
    public String deleteCategory(@RequestBody ProductCategory productCategory) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof AnonymousAuthenticationToken) {
            return "Product Category Delete Not completed : You don't have permission";
        }

        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriviledge = privilegeController.getPrivilageByUserModule(auth.getName(), "ProductCategory");


        if (loggedUser != null && userPriviledge.get("del")) {

            ProductCategory extPcategory = productCategoryDao.getReferenceById(productCategory.getId());

            if (extPcategory == null) {
                return "Product Category delete not completed : Doesn't Exist !";
            }
            try {
                productCategoryDao.delete(extPcategory);
                return "0";
            } catch (Exception e) {
                return "Product Category delete not completed " + e.getMessage();
            }

        } else {
            return "Product Category delete not completed : You don't have permission ";
        }
    }


}

