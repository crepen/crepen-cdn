import { IsDBPort } from "@crepen-nest/lib/decorator/valid/is-db-port.valid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";


export class SystemInstallDatabaseRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBHOST_FAILED" })
    // @Expose({ name: 'host' })
    host: string;

    @ApiProperty()
    @IsDBPort({ message: 'api_system.VALIDATION_INSTALL_DBPORT_FAILED' })
    port: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBUSER_FAILED" })
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBPASSWORD_FAILED" })
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBNAME_FAILED" })
    database: string;
}


export class SystemInstallRequestDto {

    @ValidateNested()
    @Type(() => SystemInstallDatabaseRequestDto)
    database: SystemInstallDatabaseRequestDto;
}


export class SystemInstallResponseDto {
    @Expose({ name: 'install_state' })
    installState: boolean
}