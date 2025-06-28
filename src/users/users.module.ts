import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUSerMiddleware } from './middlewares/current-user.middleaware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, 
  //   {
  //   // どのコントローラーでもインターセプターが適用できる
  //   provide: APP_INTERCEPTOR,
  //   useClass: CurrentUserInterceptor
  // }
]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUSerMiddleware).forRoutes('*')
  }
}
