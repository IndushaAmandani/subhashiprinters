package lk.subhashiprinters.quotation;


import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import lk.subhashiprinters.purchaseorder.PurchaseOrderRepository;
import lk.subhashiprinters.quotationrequest.QuotationRequest;
import lk.subhashiprinters.quotationrequest.QuotationRequestRepository;
import lk.subhashiprinters.quotationrequest.QuotationRequestStatusRepository;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/quotation")
public class QuotationController {

    @Autowired
    private QuotationRepository quotationDao;

    @Autowired
    private QuotationStatusRepository quotationStatusDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private QuotationRequestRepository qrDao;

    @Autowired
    private QuotationRequestStatusRepository qrStatusDao;

    @Autowired
    private PurchaseOrderRepository porderDao;

    //
    @GetMapping
    public ModelAndView quotationUI() {
        ModelAndView quotationui = new ModelAndView();
        quotationui.setViewName("quotation.html");
        return quotationui;
    }

    //get object by given id using path variable [ /quotation/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Quotation getByPathId(@PathVariable("id") Integer id) {
        return quotationDao.getReferenceById(id);
    }

    //List returning list of status from repo
    @GetMapping(value = "/listall", produces = "application/json")
    public List<Quotation> quotationListByValid() {
        return quotationDao.listAll();
    }

    //List returning list of status from repo
    @GetMapping(value = "/listvalid/{sid}/{requireddate}", produces = "application/json")
    public List<Quotation> quotationListByValid(@PathVariable("sid") Integer sid, @PathVariable("requireddate") String requireddate) {
        //since require date retrieve as string have to convert into date type
        return quotationDao.validList(sid, LocalDate.parse(requireddate));
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Quotation> findAll() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Quotation");

        if (loggedUser != null && userPiriv.get("sel")) {
            List<Quotation> listofquatations = quotationDao.findAll();
            //Set invalid according to date
            for (Quotation oneofQuatation : listofquatations) {
                LocalDate validdate = oneofQuatation.getValid_period();
                String validdateStringArray = validdate.toString();
                String[] validdateString = validdateStringArray.split("-");
                String validdateStringvalue = validdateString[0] + validdateString[1] + validdateString[2];

                LocalDate todayy = LocalDate.now();
                String todayString = todayy.toString();
                String[] todayStringArray = todayString.split("-");
                String todayStringvalue = todayStringArray[0] + todayStringArray[1] + todayStringArray[2];
                Integer todayvalue = Integer.parseInt(todayStringvalue);
                Integer validdatevalue = Integer.parseInt(validdateStringvalue);
                if (validdatevalue <= (todayvalue)) {
                    oneofQuatation.setQuatation_status_id(quotationStatusDao.getReferenceById(2));
                    for(QuotationHasMaterial qhml    :  oneofQuatation.getQuotationHasMaterialList()){
                        qhml.setQuatation_id(oneofQuatation);
                    }
                    quotationDao.save(oneofQuatation);
                }
            }
            return quotationDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            List<Quotation> quotationList = new ArrayList<>();
            return quotationList;
        }
    }

    @PostMapping
    @Transactional
    public String inserPorder(@RequestBody Quotation quotation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "Quotation");
        if (userPrive != null && userPrive.get("ins")) {

            try {

                quotation.setAdded_date(LocalDateTime.now());
                quotation.setAdded_user_id(logeduser);
                quotation.setNumber(quotationDao.getNextQNo());


                for (QuotationHasMaterial qhm : quotation.getQuotationHasMaterialList()) {
                    qhm.setQuatation_id(quotation);
                }
                quotationDao.save(quotation);

                QuotationRequest qr = qrDao.getReferenceById(quotation.getQuatation_request_id().getId());
                qr.setQuatation_req_status_id(qrStatusDao.getReferenceById(2));
                qrDao.save(qr);

                return "0";
            } catch (Exception ex) {
                return "Quotation Insert Not Complete : " + ex.getMessage();
            }

        } else {
            return "Quotation insert Not completed : You don't have permission";
        }

    }

    @PutMapping
    @Transactional
    public String updatePorder(@RequestBody Quotation quotation) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "Quotation");
        if (userPrive != null && userPrive.get("upd")) {


            Quotation extQuotation = quotationDao.getReferenceById(quotation.getId());

            if (extQuotation == null) {
                return "Quotation Update Not completed : Quotation doesn't exists..!";
            }
            List<PurchaseOrder> porderListForQuotation = porderDao.getAllByQuatation(extQuotation.getId());
            if (porderListForQuotation.size() > 0) {
                return "Quotation Update Not completed : Purchase order do exist for this quotation..!";
            }
            try {

                quotation.setUpdated_date(LocalDateTime.now());
                quotation.setUpdateuser_id(logeduser);

                if (quotation.getQuatation_status_id().getId() == 2 || quotation.getQuatation_status_id().getId() == 3)
                    extQuotation.getQuatation_request_id().setQuatation_req_status_id(qrStatusDao.getReferenceById(4));

                // extQuotationqrStatusDao.getReferenceById(4));

                for (QuotationHasMaterial qhm : quotation.getQuotationHasMaterialList()) {
                    qhm.setQuatation_id(quotation);
                }
                quotationDao.save(quotation);

                return "0";
            } catch (Exception ex) {
                return "Update Not Complete : " + ex.getMessage();
            }

        } else {
            return "Quotation Update Not completed : You don't have permission";
        }


    }

    @DeleteMapping
    @Transactional
    public String deletePorder(@RequestBody Quotation porder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "Quotation");
        if (userPrive != null && userPrive.get("del")) {

            Quotation extQuotation = quotationDao.getReferenceById(porder.getId());

            if (extQuotation == null) {
                return "Quotation Delete Not completed : Purchase order doesn't exsits..!";
            }
            try {

                extQuotation.setDelete_date(LocalDateTime.now());
                extQuotation.setDeleteuser_id(logeduser);
                extQuotation.setQuatation_status_id(quotationStatusDao.getReferenceById(3));

                for (QuotationHasMaterial qhm : extQuotation.getQuotationHasMaterialList()) {
                    qhm.setQuatation_id(extQuotation);
                }
                quotationDao.save(extQuotation);

                return "0";
            } catch (Exception ex) {
                return "Quotation Delete Not Complete : " + ex.getMessage();
            }

        } else {
            return "Quotation Delete Not completed : You don't have permission";
        }


    }
}
