import { IsDBPort } from "@crepen-nest/lib/decorator/valid/is-db-port.valid.decorator";
import { Expose, Type } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsNumber, IsNumberString, IsString, ValidateIf } from "class-validator";

export class SystemInstallRequestDto {

    @IsString()
    @IsNotEmpty({message : "api_system.VALIDATION_INSTALL_DBHOST_FAILED"})
    @Expose({ name: 'db_host' })
    dbHost: string;

    @IsDBPort({ message: 'api_system.VALIDATION_INSTALL_DBPORT_TYPE_NOT_ACCEPT' })
    @Expose({ name: 'db_port' })
    dbPort: number;

    @IsString()
    @IsNotEmpty({message : "api_system.VALIDATION_INSTALL_DBUSER_FAILED"})
    @Expose({ name: 'db_user' })
    dbUser: string;

    @IsString()
    @IsNotEmpty({message : "api_system.VALIDATION_INSTALL_DBPASSWORD_FAILED"})
    @Expose({ name: 'db_password' })
    dbPassword: string;

    @IsString()
    @IsNotEmpty({message : "api_system.VALIDATION_INSTALL_DBNAME_FAILED"})
    @Expose({ name: 'db_database' })
    dbDatabase: string;
}

export class SystemInstallResponseDto {
    @Expose({name : 'install_state'})
    installState : boolean
}