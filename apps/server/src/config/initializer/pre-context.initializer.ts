import { ConsoleLogger, INestApplicationContext, Injectable, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

export class PreContextInitializer {

    constructor(private context: INestApplicationContext, isError?: boolean) {
        this.configService = context.get(ConfigService);
        this.isError = isError ?? false;
    }

    private configService: ConfigService;
    private isError: boolean = false;


    static apply = async () => {

        let context: INestApplicationContext;
        let isError = false;

        try {
            Logger.log("Load pre context - Config Service", "PRE_INIT");
            context = await NestFactory.createApplicationContext({
                module: PreAppModule,
                imports: [
                    ConfigModule.forRoot({
                        envFilePath : ['.env' , '.env.development']
                    })
                ]
            } , {
                logger : new InternalDisabledLogger()
            });
        }
        catch (e) {
            Logger.error("Failed load pre context", "PRE_INIT");
            Logger.error(e, "PRE_INIT");
            isError = true;
        }


        return new PreContextInitializer(context, isError);
    }


    configurePath = () => {
        Logger.log(process.env.CREPEN_CDN_NEST_PORT)
    }


    applyJwtConfig = async () => {
        try{
            Logger.log('Applying JWT configuration' , 'PRE_INIT');
            

        }
        catch(e){
            Logger.error("Failed to apply JWT configuration", "PRE_INIT");
            Logger.error(e, "PRE_INIT");
            this.isError = true;
        }

        return this;
    }



    destroy = async () => {
        await this.context.close();
    }



    getStatus = () => !this.isError;

}

@Module({})
export class PreAppModule { }





//#region IGNORE_LOGGER


class InternalDisabledLogger extends ConsoleLogger {
  static contextsToIgnore = [
    'InstanceLoader',
    'RoutesResolver',
    'RouterExplorer',
    'NestFactory', // I prefer not including this one
  ]

  log(_: any, context?: string): void {
    if (!InternalDisabledLogger.contextsToIgnore.includes(context)) {
      super.log.apply(this, arguments)
    }
  }
}

//#endregion IGNORE_LOGGER