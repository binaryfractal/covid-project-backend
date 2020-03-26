export interface FindAllNamesPort {
    findAll(): Promise<Array<string>>;
}
export declare class FindAllNames<T extends FindAllNamesPort> {
    private readonly port;
    constructor(port: T);
    findAll(): Promise<Array<string>>;
}
