export class CodePerformanceProvider {
    constructor(startTick : number) {
        this.startTick = startTick;
    }

    startTick : number;

    static start = () => {
        return new CodePerformanceProvider(new Date().getMilliseconds());
    }


    end = () : number => {
        return new Date().getMilliseconds() - this.startTick;
    }
}
