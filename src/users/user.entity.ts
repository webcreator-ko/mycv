import { Report } from 'src/reports/report.entity';
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    email: string

    @Column()
    // レスポンスにパスワードを含めないようにする
    password: string

    @Column({ default: true })
    admin: boolean;

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id)
    }

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

    @AfterUpdate()
    logUpdate() {
        console.log('update User with id', this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log('remove User with id', this.id)
    }
}
