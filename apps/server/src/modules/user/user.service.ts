import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ) {}


    findOne = async (id : string | undefined) : Promise<User | null> => {

        return this.userRepository.findOneBy({ id : id });
    }


}