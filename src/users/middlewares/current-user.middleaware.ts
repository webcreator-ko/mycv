import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUSerMiddleware implements NestMiddleware {
    constructor(
        private userService: UsersService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}

        if(userId) {
            const user = await this.userService.findOne(parseInt(userId));
            if(!user ) {
                return next()
            }

            req.currentUser = user
        }

        next()
    }
}
