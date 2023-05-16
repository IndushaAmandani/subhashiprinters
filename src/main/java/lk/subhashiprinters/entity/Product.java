package lk.subhashiprinters.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert class into persistent class
@Table(name="product") //mapping table name
@Data//for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor

public class Product {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//as id is autoincrement 
    
@Column(name = "id")
private Integer id ;

@Column(name= "name")
private String name;



}
