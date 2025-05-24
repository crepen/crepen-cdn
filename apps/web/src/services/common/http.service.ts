import { headers } from "next/headers"

export class CrepenHttpService {
    static getPathname = async () : Promise<string | undefined> => {
        const header = await headers();

        return header.has('x-crepen-pathname') ? (header.get('x-crepen-pathname') ?? undefined) : undefined;
    }

    static getUrl = async () : Promise<string | undefined> => {
        const header = await headers();

        return header.has('x-crepen-url') ? (header.get('x-crepen-url') ?? undefined) : undefined;
    }
}