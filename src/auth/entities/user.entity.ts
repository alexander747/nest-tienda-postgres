import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users') //nombre de la tabla
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    fullName: string;

    @Column('text', {
        select: false //no va a seleccionar la columna con un find 
    })
    password: string;

    @Column('bool', { default: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    //antes de agregar o actualizar pasamos el correo minusculas y quitamos espacios
    @BeforeInsert()
    checkIfBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkIfBeforeUpdate() {
        this.email = this.email.toLowerCase().trim()
    }
}
