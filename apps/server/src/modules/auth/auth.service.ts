import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService
        // private readonly userService: UserService,
        // private readonly jwtService: JwtService,
    ) {}


    tryLogin = async (id : string | undefined , password : string | undefined) : Promise<User | undefined> => {

        const findUser = await this.userService.findOne(id);

        console.log(findUser);




        return undefined;
    }


    // async register(registerDto: RegisterDto): Promise<any> {
    //     const { password, ...userData } = registerDto;
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = await this.userService.create({
    //         ...userData,
    //         password: hashedPassword,
    //     });
    //     return user;
    // }

    // async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    //     const { email, password } = loginDto;
    //     const user = await this.userService.findByEmail(email);

    //     if (!user || !(await bcrypt.compare(password, user.password))) {
    //         throw new Error('Invalid credentials');
    //     }

    //     const payload = { sub: user.id, email: user.email };
    //     const accessToken = this.jwtService.sign(payload);

    //     return { accessToken };
    // }

    // async validateUser(userId: string): Promise<any> {
    //     return this.userService.findById(userId);
    // }
}