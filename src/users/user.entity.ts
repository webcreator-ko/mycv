import { Exclude } from "class-transformer"
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    email: string

    @Column()
    // レスポンスにパスワードを含めないようにする
    password: string

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log('update User with id', this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log('remove User with id', this.id)
    }
}