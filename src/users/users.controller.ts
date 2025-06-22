import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService  } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serializer, SerializerInterceptor } from './interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Controller('auth')
// コントローラー内で共通して使えるようになる
@Serializer(UserDto)
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
       return this.userService.createUser(body.email, body.password)  
    }

    // 意味を明確にするために 全体更新＝@Put、部分更新＝@Patch を使い分ける。
    // @Put を使う場合 → UpdateUserDto は全プロパティが必須であるのが理想。
    // ※Putで一部更新でも全体が消える場合がある
    // @Patch を使う場合 → UpdateUserDto はすべて @IsOptional() で部分更新を想定すべき。
    @Patch('/:id')
    async updateUser(@Param('id') id:string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body)
    }


    // UserDto を渡すのは、レスポンスの整形ルール（@Expose）を指定するため。
    // これにより、パスワードなどを除外しつつ、必要な項目だけをレスポンスに含めることができる。
    // DTOを引数として渡すことで、インターセプターを再利用可能な汎用パーツにしている。
    
    // 例えば、このような使い方ができる
    // @UseInterceptors(new SerializerInterceptor(UserDto))
    // // → このエンドポイントのレスポンスは「UserDto」で整形される

    // 他のエンドポイントで別の DTO を使いたいならこう書けます
    // @UseInterceptors(new SerializerInterceptor(AdminUserDto))
    // インターセプターを汎用化して、任意の DTO を注入できる構成になっている、ということです。
    ///  @UseInterceptors(new SerializerInterceptor(UserDto))


  // 個別で使用する
  //  @Serializer(UserDto)
   @Get('/:id')
   async findUser(@Param('id') id:string) {
    const user =  await this.userService.findOne(parseInt(id))
    console.log('user',user)
//    if(!user) return new Error('user not fond')
        if(!user) return new NotFoundException('user not fond')

    return user
   }

   @Get()
   findAllUsers(@Query('email') email:string) {
    return this.userService.find(email)
   }

   @Delete('/:id')
   removeUser(@Param('id') id:string) {
    return this.userService.remove(parseInt(id))
   }
}
