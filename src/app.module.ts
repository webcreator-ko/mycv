import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [

    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    // TypeOrmModule.forRoot({
    //   type: "sqlite",
    //   database: "db.sqlite",
    //   entities: [User, Report],
    //   synchronize: true,
    // }), 
    TypeOrmModule.forRootAsync({
      // データベースの設定を ConfigService（環境変数）経由で読み込む
      // 非同期（forRootAsync）で設定することで、環境変数のロードに依存できる
      // sqlite を使用し、DB_NAME に書かれたファイル名の SQLite DB に接続
      // entities に指定された User, Report クラスが TypeORM のテーブル定義になる
      // synchronize: true により、エンティティの定義を元に自動でテーブルを作成・更新
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "sqlite",
          database: config.get('DB_NAME'),
          synchronize: true,
          entities: [User, Report]
        }
      }
    }),
    UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
