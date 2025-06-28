import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

// ポイント整理
// 認証（ログインしてるか）・認可（権限チェック）は Guard のままで正しい
// request.currentUser を作るための ユーザーデータのロード処理だけを Interceptor → Middleware に移す
// これで Guard が request.currentUser を必ず使える状態になる

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        if(!request.currentUser) {
            return false
        }

        return request.currentUser.admin
    }
}
