package lk.subhashiprinters.mrn;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/MrnHasMaterial")
public class MRNHasMaterialController {
    @Autowired
    private MRNHasMaterialRepository MRNhasMaterialDao;
//
//@GetMapping(value = "/list",produces = "application/json")
//    public List<MRNHasMaterial> list(){return MRNhasMaterialDao.list();};
}

