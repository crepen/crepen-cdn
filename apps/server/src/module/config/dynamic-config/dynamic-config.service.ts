import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicConfigService {
    private variableList: { key: string, value?: string | object | number }[] = []

    set = (key: string, value?: string | object | number) => {
        if (!this.variableList.find(x => x.key === key)) {
            this.variableList.push({
                key: key,
                value: value
            })
        }
        else {
            this.variableList = [
                ...this.variableList.filter(x => x.key !== key),
                {
                    key: key,
                    value: value
                }
            ]
        }
    }

    get = <T>(key: string): T | undefined => {
        return this.variableList.find(x => x.key === key)?.value as T | undefined;
    }

    getAll = () => {
        return this.variableList;
    }

    isActive = true
}