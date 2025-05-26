import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';


interface CrepenDirType extends Record<keyof typeof BootService.DIR_TYPE, string> {}


export class BootService {

    constructor() { }

    private readonly DATA_DIR_PATH_LINUX = '/etc/crepen/cdn';
    private readonly DATA_DIR_PATH_WIN = 'C:\\ProgramData\\Crepen\\CDN';
    private readonly DATA_DIR_PATH_MAC = '/Library/Application Support/Crepen/CDN';


    static instance = () => {
        const bootService = new BootService();

        return bootService;
    }


    public setInitConfig = () => {

        const rootFolder = this.getDataPath();

        const configPath = path.join(rootFolder, BootService.DIR_TYPE.CONFIG);


        if (!fs.existsSync(configPath)) {
            fs.mkdirSync(configPath, { recursive: true });
        } 

        if(!fs.existsSync(path.join(configPath , 'config.yaml'))){
            fs.copyFileSync(
                path.join(__dirname , '../../config.yaml') , 
                path.join(configPath , 'config.yaml')
            )
        }   

        // throw new Error('tt');
    }


    public getDataPath = (type? : keyof typeof BootService.DIR_TYPE) => {
        let rootFolder = '';

        if (os.type() === 'Linux') {
            rootFolder = this.DATA_DIR_PATH_LINUX;
        }
        else if (os.type() === 'Windows_NT') {
            rootFolder = this.DATA_DIR_PATH_WIN;
        }
        else if (os.type() === 'Darwin') {
            rootFolder = this.DATA_DIR_PATH_MAC;
        }

        if(type){
           rootFolder = path.join(rootFolder, BootService.DIR_TYPE[type] ) ;
        }

        return rootFolder;
    }


    static DIR_TYPE = {
        CONFIG: '/config',
        DATA : '/data'
    } 

    

}
