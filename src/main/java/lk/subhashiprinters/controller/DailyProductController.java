package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.*;
import lk.subhashiprinters.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController //as providing services
@RequestMapping(value = "/dailyProduct") //Class level mapping
public class DailyProductController {

    @Autowired
    private DailyProductRepository dailyProductDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;


    @Autowired
    private CustomerOrderRepository customerOrderRepository;

    @Autowired
    private ProductionStatusRepository productionStatusRepository;

    // get all itemstatus list [ /cpstatus/list]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<DailyProduct> findAll() {
        return dailyProductDao.findAll();
    }

    @GetMapping(value ="/qtylist/{pid}",produces ="application/json")
    public List<DailyProduct> getqtyByPid(@PathVariable("pid")Integer pid){return dailyProductDao.getBypid(pid);
    }
    @GetMapping
    public ModelAndView dailyPUI() {
        //create obj called customerUI
        ModelAndView dailyPUI = new ModelAndView();
        //set cusomer html
        dailyPUI.setViewName("dailyProduct.html");
        //returning customerUI
        return dailyPUI;

    }

    @PostMapping
    public String insertDailyP(@RequestBody DailyProduct dailyProduct) {
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Daily Product Insert Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "DailyProduct");

        if (loggedUser != null && userPiriv.get("ins")) {
            // user has privilage for insert item

            try {


                // set auto set value
                dailyProduct.setAdded_date_time(LocalDateTime.now());

                dailyProduct.setAdded_user_id(loggedUser);
                //do the requeired operation
                dailyProductDao.save(dailyProduct);

                CustomerOrder customerOrder = customerOrderRepository.getReferenceById(dailyProduct.getCustomer_order_id().getId());

                Boolean allCompleted = true;
                for(CustomerOrderHasProduct coh : customerOrder.getCustomerOrderHasProductList()){
                    coh.setCustomer_order_id(customerOrder);
                    if(coh.getProduct_id().getId() == dailyProduct.getProduct_id().getId())
                         coh.setCompletedqty(coh.getCompletedqty()+dailyProduct.getDailyqty());

                    if(coh.getOrder_qty().equals(coh.getCompletedqty()))
                         coh.setProduction_status_id(productionStatusRepository.getReferenceById(4));
                    else{
                        coh.setProduction_status_id(productionStatusRepository.getReferenceById(3));
                    }

                    if(coh.getProduction_status_id().getName().equals("In-Progress")){
                        allCompleted = false;
                    }
                }

                if(allCompleted)
                customerOrder.setProduction_status_id(productionStatusRepository.getReferenceById(4));
               else customerOrder.setProduction_status_id(productionStatusRepository.getReferenceById(3));

                for(CustomerOrderHasMaterial cohm : customerOrder.getCustomerOrderHasMaterialList()){
                    cohm.setCustomer_order_id(customerOrder);

                }

                customerOrderRepository.save(customerOrder);


                return "0";


            } catch (Exception ex) {
                return "Customer Payment Insert Not completed : " + ex.getMessage();
            }


        } else {
            return "Customer Payment Insert Not completed : You don't have permissing";
        }


    }



}
