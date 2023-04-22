//esquema de la base de datos

import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
