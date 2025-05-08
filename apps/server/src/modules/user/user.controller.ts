import { Controller, Post, Body, HttpCode, HttpStatus, UploadedFile, UseInterceptors, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class UserController {
    constructor(
        private readonly configEnv : ConfigService
    ) {}

    
}