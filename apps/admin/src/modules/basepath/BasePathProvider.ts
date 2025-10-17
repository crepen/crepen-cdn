import { StringUtil } from "../../libs/util/StringUtil";

type HeaderGroup = Headers;


export class BasePathProvider {

    constructor(readHeader: HeaderGroup, writeHeader: HeaderGroup) {
        this._writeHeader = writeHeader ?? readHeader;
        this._readHeader = readHeader
    }

    private _writeHeader: HeaderGroup;
    private _readHeader: HeaderGroup;
    private _header_key = 'X-CP-BASEPATH';

    static instance = (header: HeaderGroup, writeHeader: HeaderGroup | undefined = undefined) => {
        return new BasePathProvider(header, writeHeader ?? header);
    }


    getBasePath = () => {
        return this._readHeader.get(this._header_key) ?? '/';
    }

    setBasePath = (basePath?: string) => {

        const baseBP = StringUtil.isEmpty(basePath ?? '')
            ? '/'
            : basePath!.startsWith('/')
                ? basePath!
                : '/' + basePath

        this._writeHeader.set(this._header_key, baseBP);
    }

}