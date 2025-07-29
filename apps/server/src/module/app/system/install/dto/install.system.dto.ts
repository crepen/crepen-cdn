import { IsDBPort } from "@crepen-nest/lib/extensions/decorator/valid/is-db-port.valid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class SystemInstallRequestDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBHOST_FAILED" })
    @Expose({ name: 'db_host' })
    dbHost: string;

    @ApiProperty()
    @IsDBPort({ message: 'api_system.VALIDATION_INSTALL_DBPORT_FAILED' })
    @Expose({ name: 'db_port' })
    dbPort: number;
    

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBUSER_FAILED" })
    @Expose({ name: 'db_username' })
    dbUsername: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBPASSWORD_FAILED" })
    @Expose({ name: 'db_password' })
    dbPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "api_system.VALIDATION_INSTALL_DBNAME_FAILED" })
    @Expose({ name: 'db_database' })
    dbDatabase: string;
}


export class SystemInstallResponseDto {
    @Expose({ name: 'install_state' })
    installState: boolean
}