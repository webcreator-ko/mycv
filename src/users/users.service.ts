import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {
        this.repo = repo
    }

    @Post('/signup')
    createUser(email: string, password: string) {
        const user = this.repo.create({ email, password })

        return this.repo.save(user);
    }

    findOne(id: number) {
        // 1件だけ取得します。
        // 条件に一致するレコードが なければ null を返す。
        // 内部的には LIMIT 1 のような SQL になります。
        return this.repo.findOneBy({ id })
    }

    find(email: string) {
        // 複数件取得します（配列で返される）。
        // 条件に一致するレコードが なければ空配列 [] を返す。
        return this.repo.find({where: {email}})
    }

    async update(id: number, attrs: Partial<User>) {
        console.log('update', id)
        const user= await this.repo.findOneBy({ id })

        if(!user) {
            throw new NotFoundException('user not found')
        }

       // この Object.assign(user, attrs) は、attrs のプロパティを user に上書きコピーして、user オブジェクトを更新しています。
        Object.assign(user, attrs);
        //は次と同じ意味で
        // for (const key in attrs) {
        //   if (attrs.hasOwnProperty(key)) {
        //     user[key] = attrs[key];
        //   }
        // }
        // 例
        // const user = { id: 1, name: 'Taro', email: 'old@example.com' }
        // const attrs = { email: 'new@example.com' }

        // Object.assign(user, attrs)

        // // 結果:
        // user = { id: 1, name: 'Taro', email: 'new@example.com' }
        // つまりこの関数全体は「IDで特定されたユーザーを、指定された一部の値で更新して保存する」処理です。
        return this.repo.save(user)
    }

    async remove(id: number) {
        console.log('id',id)
        const user = await this.repo.findOneBy({id})
        if(!user) {
            throw new NotFoundException('user not found')
        }

        return this.repo.remove(user)
    }
}
