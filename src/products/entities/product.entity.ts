//esquema de la base de datos

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

//se puede cambiar el nombre de la tabla de la base de datos
@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    title: string

    @Column('float', { default: 0 })
    price: number

    @Column({ type: 'text', nullable: true }) //puede aceptar null
    description: string

    @Column('text', { unique: true })
    slug: string

    @Column('int', { default: 0 })
    stock: number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    //images, un producto puede tener muchas imagenes
    @OneToMany(
        () => ProductImage, //el primer callback regresa un ProductImage
        (productoImages) => productoImages.product, //de la otra relacion que campo es el que quiero relacionar
        {
            cascade: true,
            eager: true // cada vez que hagamos un find carga las imagenes tambien sin especificar esa ralacion 
        }
    )
    images?: ProductImage[]

    /**
     * Muchas productos pueden ser creados por un usuario por eso manyToOne
     */
    @ManyToOne(
        () => User, //Debo decirle con que entidad va a relacionarse
        (userActual) => userActual.product, // de la entiendad debo decirle que item es el que se relaciona
        {
            eager: true//cada vez que consulte un producto tambien me dice que usuario fue el que creo dicho producto
        }
    )
    user: User

    //metodo que se ejecuta antes de insertar los datos en la entidad
    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug.toLocaleUpperCase().replaceAll(' ', '_').replaceAll("'", '')

    }
    //metodo que se ejecuta antes de actualizar los datos en la entidad
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLocaleUpperCase().replaceAll(' ', '_').replaceAll("'", '')
    }

}
