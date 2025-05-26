import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as os from 'os';
import { BootService } from 'src/lib/services/boot.service';

const CONFIG_FILE = [join(__dirname, '../../config.yaml')];

const LoadYamlConfigFactory = () => {

    CONFIG_FILE.push(
        join(
            __dirname,
            process.env.NODE_ENV === 'production' ? '../../config.prod.yaml' : '../../config.dev.yaml'
        )
    )

    CONFIG_FILE.push(
        join(BootService.instance().getDataPath(), BootService.DIR_TYPE.CONFIG, 'config.yaml')
    );

    console.log("================================")
    console.log(CONFIG_FILE);
    console.log("================================")
    // if(os.type() === 'Linux'){
    //     CONFIG_FILE.push('/')
    // }
    // else if(os.type() === 'Windows_NT'){

    // }
    // return yaml.load(
    //     readFileSync(join(__dirname , '../../config.yaml'), 'utf-8')
    // ) as Record<string , any>;

    const config = CONFIG_FILE.reduce((acc, filename) => {
        const filePath = filename;
        try {
            const yamlData = yaml.load(readFileSync(filePath, 'utf8')) as Record<string, any>;
            return { ...acc, ...yamlData };
        } catch (e) {
            console.warn(`Failed to load ${filename}: ${e.message}`);
            return acc;
        }
    }, {});

    console.log('CONFIG', config);

    return config;
}

export default LoadYamlConfigFactory;