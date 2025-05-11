import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ServerConfigModule } from '../config/config.module';
import { UserModule } from './user/user.module';
import { UtilModule } from 'src/util/util.module';


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
