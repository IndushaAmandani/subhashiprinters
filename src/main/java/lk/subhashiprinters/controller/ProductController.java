package lk.subhashiprinters.controller;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import lk.subhashiprinters.entity.*;
import lk.subhashiprinters.repository.ProductStatusRepository;
import lk.subhashiprinters.repository.ProductionStatusRepository;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.subhashiprinters.repository.ProductRepository;

import javax.transaction.Transactional;

@RestController
@RequestMapping(value = "/product") 
public class ProductController {
    

// added_user_id int 
// updated_user_id int 
// deleted_user_id int 
// product_status_id int 
// customer_id int 
// papercolors_id int 
// product_category_id int 
// printcolors_id int 
// papertype_id int 
// product_size_id int 
    @Autowired
    private ProductRepository productDao;
    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private ProductStatusRepository productStatusDao;
       // @Autowired 
   // private ProductRepository productDao;
       //create get mapping for get emplpyee ui ---> [ /employee]
       @GetMapping
       //create function for get employee UI
       public ModelAndView productUi(){
           //create ModelAndView object called employeeui
          ModelAndView productUi = new ModelAndView();
          //set employee html
          productUi.setViewName("product.html");
           return productUi;
       }

       //define findall data service['/product/findall']
    @GetMapping(value ="/findall",produces = "application/json")
    //create function
    public List<Product> productfindAll(){
        return productDao.findAll();
    }

    @GetMapping(value = "/listbyCustomer/{cid}", produces = "application/json")
    public List<Product> getListByCustomer(@PathVariable("cid")Integer cid){return productDao.getListByCustomer(cid);}

    @GetMapping(value = "/listbyCOrder/{coid}", produces = "application/json")
    public List<Product> getListByCOrder(@PathVariable("coid")Integer coid){return productDao.getListByCOrder(coid);}


    @GetMapping(value = "/list",produces = "application/json")
    public List<Product> productList(){return productDao.list();}

    @GetMapping(value ="/getbyid/{id}" ,produces = "application/json")
    public Product getProductByPVId(
            @PathVariable("id") Integer id
    ){
        return productDao.getReferenceById(id);
    }

    //get mapping service for get employee by given Query param id [ /employee/getbyid?id=1]
    @GetMapping(value = "/getbyid" ,params = {"id"},produces = "application/json")
    public Product getProductByQPId(
            @RequestParam("id") Integer id
    ){
        return productDao.getReferenceById(id);
    }
    //get object by given id using path variable [ /productCopy/getbyid/{id}]
//    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
//    public ProductCopy getByPathId(@PathVariable("id")Integer id){
//        return productCopyDao.getReferenceById(id);
//    }


//    @GetMapping(value = "/customerOrderProduct/bycp/{qid}/{mid}" ,produces = "application/json")
//    public QuotationHasMaterial getByQM(@PathVariable("qid") Integer qid, @PathVariable("mid") Integer mid){
//        return quotationMaterialDao.byQidMid(qid,mid);
    @PostMapping
    @Transactional
    public String AddProduct(@RequestBody Product product) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "Product");
        if (userPrive != null && userPrive.get("ins")) {
            System.out.println(logeduser);
            try {

                product.setAdded_date(LocalDateTime.now());
                product.setAdded_user_id(logeduser);
                product.setProduct_code(productDao.nextProductCodeNumber());


                for (ProductCopy pc : product.getProductCopyList()) {
                    pc.setProduct_id(product);
                }

                for (ProductHasMaterial pm : product.getProductHasMaterialList()) {
                    pm.setProduct_id(product);
                }
                productDao.save(product);

                return "0";
            } catch (Exception ex) {
                return "Insert Not Complete : " + ex.getMessage();
            }

        } else {
            return "Product insert is Not completed : You don't have permission";
        }

    }


    @DeleteMapping
    @Transactional
    public String deletePorder(@RequestBody Product product) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "Product");
        if (userPrive != null && userPrive.get("del")) {

            Product extproduct = productDao.getReferenceById(product.getId());

            if(extproduct == null){
                return "Quotation Delete Not completed : Purchase order doesn't exsites..!";
            }
            try {

                extproduct.setDeleted_date_(LocalDateTime.now());
                extproduct.setDeleted_user_id(logeduser);
                extproduct.setProduct_status_id(productStatusDao.getReferenceById(2));

                productDao.save(extproduct);

                return "0";
            } catch (Exception ex) {
                return "Product Delete Not Complete : " + ex.getMessage();
            }

        } else {
            return "Product Delete Not completed : You don't have permissing";
        }


    }
    @PutMapping
    public String updateProduct(@RequestBody Product product){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // customerDao.getReferenceById(customer.getId());
        // neeed to check logged user privilage

        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Product Update Not completed : You don't have permissing";
        }
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(logeduser.getUsername(), "Product");
        if (logeduser != null && userPrive.get("upd")) {

            Product extproduct = productDao.getReferenceById(product.getId());

            if (extproduct == null ) {
              return "Product Update Not completed : Product not available";
           }
            try {

                product.setUpdated_date(LocalDateTime.now());
                product.setUpdated_user_id(logeduser);


                for ( ProductCopy pc : product.getProductCopyList()) {
                    pc.setProduct_id(product);
                }


                for ( ProductHasMaterial phm : product.getProductHasMaterialList()) {
                    phm.setProduct_id(product);
                }

                productDao.save(product);

                return "0";
            } catch (Exception ex) {
                return "Product Update Not Complete : " + ex.getMessage();
            }

        } else {
            return "Product Update  Not completed : You don't have permissing";
        }




    }

}



