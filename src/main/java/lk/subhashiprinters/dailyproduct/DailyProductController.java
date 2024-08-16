package lk.subhashiprinters.dailyproduct;


import ch.qos.logback.core.net.SyslogOutputStream;
import lk.subhashiprinters.corder.*;
import lk.subhashiprinters.cpayment.CustomerPayment;
import lk.subhashiprinters.cpayment.CustomerPaymentRepository;
import lk.subhashiprinters.dailyproduct.DailyProduct;
import lk.subhashiprinters.dailyproduct.DailyProductRepository;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
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
    private CustomerPaymentRepository customerPaymentDao;

    @Autowired
    private COrderStatusRepository customerFullOrderStatusDao;

    @Autowired
    private ProductionStatusRepository productionStatusRepository;

    // get all itemstatus list [ /cpstatus/list]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<DailyProduct> findAll() {
        return dailyProductDao.findAll();
    }

    @GetMapping(value = "/qtylist/{pid}", produces = "application/json")
    public List<DailyProduct> getqtyByPid(@PathVariable("pid") Integer pid) {
        return dailyProductDao.getBypid(pid);
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

                //Customer Order By Daily Product Customer Order ID
                CustomerOrder customerOrderDP = customerOrderRepository.getReferenceById(dailyProduct.getCustomer_order_id().getId());

                for (CustomerOrderHasProduct cohp : customerOrderDP.getCustomerOrderHasProductList()) {

                    if (cohp.getProduct_id().getId() == dailyProduct.getProduct_id().getId()) {
                        cohp.setCompletedqty(cohp.getCompletedqty() +dailyProduct.getDailyqty());
                        if (cohp.getOrder_qty().equals(cohp.getCompletedqty())) {
                            cohp.setProduction_status_id(productionStatusRepository.getReferenceById(4));
                            System.out.print(cohp.getCompletedqty());
                        }
                       else if (cohp.getOrder_qty() > cohp.getCompletedqty()) {
                            cohp.setProduction_status_id(productionStatusRepository.getReferenceById(3));
                            System.out.println("hi");
                            System.out.print(cohp.getCompletedqty());

                        }
                    }
                    cohp.setCustomer_order_id(customerOrderDP);
                }



                //considering whole corder production in the finished state
                Boolean allProductionCompleted = true;
                for (CustomerOrderHasProduct coh : customerOrderDP.getCustomerOrderHasProductList()) {
                    if (coh.getProduction_status_id().getId() != 4) {
                        allProductionCompleted = false;
                        break;
                    }
                }

                if (allProductionCompleted) {
                    //Order production status done
                    customerOrderDP.setProduction_status_id(productionStatusRepository.getReferenceById(4));
                    //check payment and order status set
                    if (customerOrderDP.getOrder_balance().equals(BigDecimal.ZERO)) {
                        //set into Full Order Status to completed state
                        customerOrderDP.setOrder_status_id(customerFullOrderStatusDao.getReferenceById(5));
                    } else {
                        //cannot set Full order State into Completed till payment made - currently at Finished state
                        customerOrderDP.setOrder_status_id(customerFullOrderStatusDao.getReferenceById(3));
                    }

                } else {
                    //set Customer order Production Status into In - progress
                    customerOrderDP.setOrder_status_id(customerFullOrderStatusDao.getReferenceById(2));
                    //set state In - Progress
                    customerOrderDP.setProduction_status_id(productionStatusRepository.getReferenceById(3));
                }

                for (CustomerOrderHasMaterial cohm : customerOrderDP.getCustomerOrderHasMaterialList()) {
                    cohm.setCustomer_order_id(customerOrderDP);

                }
                customerOrderRepository.save(customerOrderDP);

                return "0";


            } catch (Exception ex) {
                return "Customer Payment Insert Not completed : " + ex.getMessage();
            }


        } else {
            return "Customer Payment Insert Not completed : You don't have permission";
        }


    }


}
