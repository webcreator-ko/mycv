import { Expose } from "class-transformer"

export class UserDto {
  @Expose()
  id: number

   @Expose()
   email: string
}

// Exposeとは
// 「出していい情報だけ明示的に選びたい」場合に便利。

// 注意点
// @Expose() を使うと、書いてないプロパティは自動で除外されるようになります（「排他的」な仕組み）。
// たとえば UserDto に他のプロパティ（例：password）があっても、@Expose() をつけてなければレスポンスに含まれません。