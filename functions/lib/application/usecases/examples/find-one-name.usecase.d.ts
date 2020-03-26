export interface FindOneNamePort {
    findOne(yourName: string): Promise<string>;
}
export declare class FindOneName<T extends FindOneNamePort> {
    private readonly port;
    constructor(port: T);
    findOne(yourName: string): Promise<string>;
}
