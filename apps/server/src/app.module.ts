import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ServerConfigModule } from './config/module/config.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    ServerConfigModule,
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
