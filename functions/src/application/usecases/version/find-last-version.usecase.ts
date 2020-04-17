
export interface FindLastVersionPort {
    findLast(): Promise<string>;
}

export class FindLastVersion<T extends FindLastVersionPort> {
    constructor(private readonly port: T) {}

    async findLast(): Promise<string> {
        return await this.port.findLast();
    }
}