package lk.subhashiprinters.sample;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.sample.PaperColors;
import lk.subhashiprinters.sample.PaperColorsRepository;

@RestController
@RequestMapping(value = "/paperColors")
public class PaperColorsController {
    
    @Autowired
    private PaperColorsRepository paperColorsDao;

    // [customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
   public List<PaperColors> PaperColorsList(){
        return  paperColorsDao.findAll();
    }

//paperColors/getbyPType/
    @GetMapping(value = "/getbyPType/{ptid}",produces ="application/json")
    public List<PaperColors> getbyPType(
            @PathVariable("ptid") Integer ptid
    ){
        return paperColorsDao.getByPaperColorId(ptid);
    }
}
