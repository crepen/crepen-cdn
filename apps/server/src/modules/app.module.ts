import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ServerConfigModule } from '../config/config.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './file-control/group/group.module';


@Module({
  imports: [
    ServerConfigModule,
    AuthModule,
    UserModule,
    GroupModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
