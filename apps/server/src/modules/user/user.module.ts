import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { EncryptUtil } from 'src/util/encrypt.util';
import { UtilModule } from 'src/util/util.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        UtilModule
    ],
    controllers: [UserController],
    providers: [UserService,UserRepository],
    exports : [UserService]
})
export class UserModule {}