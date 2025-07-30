import { headers } from "next/headers";

type BasePathInitOptions = {
    readHeader?: Headers,
    writeHeader?: Headers
}

export class BasePathInitializer {

    private static basePathHeaderKey = 'x-cp-basepath';

    static set = async (value: string | undefined, options :BasePathInitOptions) => {

        (options.writeHeader?? await headers()).set(this.basePathHeaderKey, value ?? '/');
    }

    static get = async (options :BasePathInitOptions) => {
        return (options.readHeader?? await headers()).get(this.basePathHeaderKey) ?? '/';
    }
}