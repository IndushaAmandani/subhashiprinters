package lk.subhashiprinters.loggeduser;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoggedUser {

    private String username;
 
    private String role;

    private String photoname;
    private String photopath;
    private byte[] userphoto;


}
