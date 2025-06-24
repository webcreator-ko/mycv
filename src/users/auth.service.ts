import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { scrypt as _scrypt, randomBytes } from "crypto"
import { promisify } from "util";

const script = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {
        
    }

   async signup(email: string, password: string) {
        const users = await this.usersService.find(email)
        if(users.length) {
            throw new BadRequestException('email in use')
        }

        // hash the password
        // generate a salt
        const salt = randomBytes(8).toString('hex')
        console.log('salt : ', salt)

        // hash the salt the password together
        const hash = await script(password, salt, 32) as Buffer;

        // join the hashed result and the salt together
        const result = salt + "." + hash.toString('hex');

        // Create a new user and save it
        const user = await this.usersService.create(email, result)

        return user

    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email)
        if(!user) {
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await script(password, salt, 32)) as Buffer;

        if(storedHash === hash.toString('hex')) {
            return user
        } else {
            throw new BadRequestException('bad password')
        }
    }
}