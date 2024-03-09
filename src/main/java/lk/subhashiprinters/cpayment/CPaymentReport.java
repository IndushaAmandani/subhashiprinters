package lk.subhashiprinters.cpayment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CPaymentReport {

    private String date;

    private String totalamount;
    private String cpaymentcount ;



    
    
}
