package lk.subhashiprinters.sample;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lk.subhashiprinters.cutomer.Customer;
import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert class into persistent class
@Table(name = "product") // mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor

public class Product {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // as id is autoincrement
    @Column(name = "id")
    private Integer id;

    @Column(name = "p_name")
    private String p_name;

    @Column(name = "product_code ")
    private String product_code;

    @Column(name = "width")
    private BigDecimal width;

    @Column(name = "height")
    private BigDecimal height;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private byte[] image;

    @Column(name ="product_photo_name")
    private  String product_photo_name;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "single_or_double")
    private String single_or_double;

    @ManyToOne
    @JoinColumn(name = "added_user_id", referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "deleted_user_id", referencedColumnName = "id")
    private User deleted_user_id;

    @ManyToOne
    @JoinColumn(name = "updated_user_id", referencedColumnName = "id")
    private User updated_user_id;

    @ManyToOne
    @JoinColumn(name = "product_status_id", referencedColumnName = "id")
    private ProductStatus product_status_id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;


    @ManyToOne
    @JoinColumn(name = "product_category_id", referencedColumnName = "id")
    private ProductCategory product_category_id;

    @ManyToOne
    @JoinColumn(name = "product_size_id", referencedColumnName = "id")
    private ProductSize product_size_id;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "updated_date")
    private LocalDateTime updated_date;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date_;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "product_id" , orphanRemoval = true )
    private List<ProductCopy> productCopyList;

    @OneToMany(cascade = CascadeType.ALL,mappedBy ="product_id", orphanRemoval = true)
    private List<ProductHasMaterial> productHasMaterialList;



public Product(Integer id, String product_code, String p_name, BigDecimal price, String single_or_double, ProductStatus product_status_id, Customer customer_id, ProductCategory product_category_id, ProductSize product_size_id){
    this.id = id;
    this.product_code = product_code;
    this.customer_id = customer_id;
    this.p_name = p_name;
    this.product_size_id = product_size_id;
    this.single_or_double = single_or_double;
    this.product_category_id  = product_category_id;
    this.price = price;
    this.product_status_id = product_status_id;

}

public Product ( Integer id, String product_code, String p_name,BigDecimal price){
    this.id = id;
    this.product_code = product_code;
     this.p_name = p_name;
     this.price = price;
}


}


