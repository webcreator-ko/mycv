import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDto } from "../users/dto/user.dto";

// 厳密な型は宣言できないので、せめてclassである型であることを宣言する
interface ClassConstructor {
    new (...args: any[]): {}
}

// カスタムデコレータで記述を小さくする
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor (private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
     console.log('Running before the handler', context)

     return handler.handle().pipe(
            map((data: any) => {
                console.log('Running before the response is sent out', data)
                // プレーンオブジェクト → DTO に変換（@Expose などを適用）
                return plainToClass(this.dto, data, {
                    // DTOに @Expose() がついていないプロパティを除外
                    excludeExtraneousValues: true
                })
            })
        )
    }
}