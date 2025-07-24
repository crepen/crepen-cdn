import { IsDBPort } from "@crepen-nest/lib/decorator/valid/is-db-port.valid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";

export class SystemInstallCheckDatabaseRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBHOST_FAILED" })
    @Expose({ name: 'host' })
    dbHost: string;

    @ApiProperty()
    @IsDBPort({ message: 'api_system.VALIDATION_INSTALL_DBPORT_FAILED' })
    @Expose({ name: 'port' })
    dbPort: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBUSER_FAILED" })
    @Expose({ name: 'username' })
    dbUser: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBPASSWORD_FAILED" })
    @Expose({ name: 'password' })
    dbPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBNAME_FAILED" })
    @Expose({ name: 'database' })
    dbDatabase: string;
}

export class SystemInstallCheckDatabaseResponseDto {
    state : boolean
}   