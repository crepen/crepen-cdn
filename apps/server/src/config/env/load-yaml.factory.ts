import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const CONFIG_FILE = ['../../config.yaml'];

const LoadYamlConfigFactory = () => {

    CONFIG_FILE.push(
        process.env.NODE_ENV === 'production' ? '../../config.prod.yaml' : '../../config.dev.yaml')

    // return yaml.load(
    //     readFileSync(join(__dirname , '../../config.yaml'), 'utf-8')
    // ) as Record<string , any>;

    const config = CONFIG_FILE.reduce((acc, filename) => {
        const filePath = join(__dirname, filename);
        try {
            const yamlData = yaml.load(readFileSync(filePath, 'utf8')) as Record<string, any>;
            return { ...acc, ...yamlData };
        } catch (e) {
            console.warn(`Failed to load ${filename}: ${e.message}`);
            return acc;
        }
    }, {});

    return config;
}

export default LoadYamlConfigFactory;