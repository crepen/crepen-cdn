import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EncryptUtil } from 'src/util/encrypt.util';
import { TokenDto } from './dto/jwt.dto';
import { JwtUserPayload } from 'src/config/passport/interface/jwt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly encryptUtil: EncryptUtil,
        private readonly jwtService: JwtService
    ) { }






    tokenRefresh = async (payload: JwtUserPayload): Promise<TokenDto> => {

        if (payload.type !== 'ref') {
            throw new HttpException("Token is not refresh token.", HttpStatus.BAD_REQUEST);
        }

        const accPayload: JwtUserPayload = { ...payload, type: 'acc' };

        const acc = this.jwtService.sign(accPayload, { expiresIn: '300s' });
        const ref = this.jwtService.sign(payload, { expiresIn: '3600s' })

        const expireTime = (await this.jwtService.verify(ref))?.exp ?? undefined;

        return {
            accessToken: acc,
            refreshToken: ref,
            expireTime : expireTime
        }
    }


    getToken = async (id: string, password: string): Promise<TokenDto> => {
        const validateUser: UserEntity | undefined = await this.userService.validateUser(id, password);

        if (validateUser === undefined) {
            throw new HttpException("Match user not found.", HttpStatus.NOT_FOUND);
        }

        const accPayload: JwtUserPayload = { type: 'acc', uid: validateUser.uid };
        const refPayload: JwtUserPayload = { type: 'ref', uid: validateUser.uid };

        const accessToken = this.jwtService.sign(accPayload, { expiresIn: '5m' });
        const refreshToken = this.jwtService.sign(refPayload, { expiresIn: '1h' });

        const expireTime = (await this.jwtService.verify(refreshToken))?.exp ?? undefined;

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expireTime : expireTime
        }
    }




}