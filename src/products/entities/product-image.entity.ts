import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string

    //muchas imagenes pertenecen a un solo producto
    @ManyToOne(
        () => Product,
        (producto) => producto.images
    )
    product: Product

}