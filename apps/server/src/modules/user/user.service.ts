import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserSignUpDto } from './dto/signup.dto';
import { UserUpdateDto } from './dto/update.dto';
import { randomUUID } from 'crypto';
import { EncryptUtil } from 'src/lib/util/encrypt.util';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
    ) { }

    getUserDataById = async (id: string | undefined): Promise<UserEntity | undefined> => {
        return this.userRepo.findOneById(id) ?? undefined;
    };

    getMatchUserByUid = async (uid: string) => {
        return await this.userRepo.matchOne([{ uid: uid }]);
    }


    addUser = async (userData: UserSignUpDto) => {

        const userEntity = new UserEntity();
        userEntity.id = userData.id;
        userEntity.password = await EncryptUtil.hashPassword(userData.password);
        userEntity.email = userData.email;
        userEntity.uid = randomUUID();

        const findDuplicateUser: UserEntity[] = await this.userRepo.match([{ id: userEntity.id }, { email: userEntity.email }, { uid: userEntity.uid }])

        console.log('Duplicate : ', findDuplicateUser)

        if (findDuplicateUser.length > 0) {
            throw new HttpException("Duplicate", HttpStatus.BAD_REQUEST)
        }

        return await this.userRepo.addOne(userEntity);
    }

    updateUser = async (updateUserData: UserUpdateDto) => {
        const userEntity = new UserEntity();
        userEntity.id = updateUserData.id;
        userEntity.password = await EncryptUtil.hashPassword(updateUserData.password);

        return await this.userRepo
    }

    validateUser = async (id: string | undefined, password: string | undefined): Promise<UserEntity | undefined> => {

        const findUser: UserEntity | undefined = await this.getUserDataById(id);

        // if (findUser === undefined) {
        //     throw new HttpException("등록되지 않은 회원입니다.", HttpStatus.NOT_FOUND)
        // }

        const isMatch = await EncryptUtil.comparePassword(password, findUser?.password ?? '');


        if (isMatch === false) {
            // throw new HttpException('비밀번호가 잘못되었습니다.', HttpStatus.UNAUTHORIZED);
            return undefined;
        }



        return findUser;
    }
}
