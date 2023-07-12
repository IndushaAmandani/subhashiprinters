package lk.subhashiprinters.controller;
//privilage- slect,insrt,updt,updt,deltt


import lk.subhashiprinters.entity.QuotationRequest;
import lk.subhashiprinters.entity.User;

import lk.subhashiprinters.repository.QuotationRequestRepository;
import lk.subhashiprinters.repository.QuotationRequestStatusRepository;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/quotationrequest") //Class level mapping
public class QuotationRequestController {

    @Autowired // for create instance
    private QuotationRequestRepository quotationrequestDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;

       @Autowired
    private QuotationRequestStatusRepository quotationrequestStatusDao;

    //get quotationrequest UI [/quotationrequest]
    @GetMapping
    public ModelAndView quotationrequestUI(){
        ModelAndView quotationrequestView = new ModelAndView();
        quotationrequestView.setViewName("quotationrequest.html");

        return quotationrequestView;
    }


    //get object by given id using path variable [ /quotationrequest/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
    public QuotationRequest getByPathId(@PathVariable("id")Integer id){
         return quotationrequestDao.getReferenceById(id);
    }

    //get list by given id using query variable [ /quotationrequest/getbysid/1]
    @GetMapping(value = "/listbysid/{sid}",produces = "application/json")
    public List<QuotationRequest> getBySupId(@PathVariable("sid")Integer sid){
        return quotationrequestDao.getListBySupplier(sid);
    }
    //get object by given id using query variable [ /quotationrequest/list]
    @GetMapping(value = "/list",produces = "application/json")
    public List<QuotationRequest> quotationRequestList(){
        return quotationrequestDao.list();
    }


    // get mapping for get quotationrequest selected columns details [/quotationrequest/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<QuotationRequest> quotationrequestFindAll(){
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");

        if(loggedUser != null && userPiriv.get("sel"))
            return quotationrequestDao.findAll();
        else{
            List<QuotationRequest> quotationRequestList = new ArrayList<>();
            return quotationRequestList;
        }

    }

    //privilage- slect,insrt,updt,updt,deltt
    //post mapping for insert item [/item - post]
    @PostMapping
    public String insertSuppler(@RequestBody QuotationRequest quotationrequest){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Quotationrequest Insert Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");

        if(loggedUser != null && userPiriv.get("ins")){
            // user has privilage for insert item

            try {
                // set auto set value
          quotationrequest.setAdded_date(LocalDateTime.now());
                // item.setItemcode("00003");
             quotationrequest.setRequest_number(quotationrequestDao.getNextQuotationrequestRegNo());
             quotationrequest.setAdded_user_id(loggedUser);

                //do the requeired operation
                quotationrequestDao.save(quotationrequest);

                return "0";
            }catch (Exception ex){
                return "Quotationrequest Insert Not completed : " + ex.getMessage();
            }


        }
        else {
            return "Quotationrequest Insert Not completed : You don't have permissing";
        }


    }

    //update mapping for update quotationrequest [/quotationrequest - update]
    @PutMapping
    @Transactional
    public String updateQuotationrequest(@RequestBody QuotationRequest quotationrequest){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Quotationrequest Update Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");

        if(loggedUser != null && userPiriv.get("upd")){

            QuotationRequest extqr = quotationrequestDao.getReferenceById(quotationrequest.getId());
            if(extqr == null && !extqr.getRequest_number().equals(quotationrequest.getRequest_number())){
                return "Quotationrequest Update Not completed : Quotationrequest not available";
            }

            try {

                quotationrequest.setUpdate_date(LocalDateTime.now());
                quotationrequestDao.save(quotationrequest);
                return "0";
            }catch (Exception exception){
                return "Quotationrequest Update Not completed : " + exception.getMessage();
            }
        }else {
            return "Quotationrequest Update Not completed : You don't have permissing";
        }
    }



    //delete mapping for delete quotationrequest [/quotationrequest - delete]
    @DeleteMapping
    public String deleteQuotationrequest(@RequestBody QuotationRequest quotationrequest){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Quotationrequest Delete Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");

        if(loggedUser != null && userPiriv.get("del")){

            QuotationRequest extQR = quotationrequestDao.getReferenceById(quotationrequest.getId());
            if(extQR == null ){
                return "Quotationrequest Delete Not completed : Quotationrequest not available";
            }

            try {
                extQR.setQuatation_req_status_id(quotationrequestStatusDao.getReferenceById(4));
             extQR.setDelete_date(LocalDateTime.now());
                quotationrequestDao.save(extQR);
                return "0";
            }catch (Exception exception){
                return "Quotationrequest Delete Not completed : " + exception.getMessage();
            }
        }else {
            return "Quotationrequest Delete Not completed : You don't have permissing";
        }
    }



}
