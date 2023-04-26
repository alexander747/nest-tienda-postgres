import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({ name: 'product_images' })
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string

    //muchas imagenes pertenecen a un solo producto
    @ManyToOne(
        () => Product,
        (producto) => producto.images,
        {
            onDelete: 'CASCADE' // si se borra un producto se eliminara la imagen tambien en cascada
        }
    )
    product: Product

}