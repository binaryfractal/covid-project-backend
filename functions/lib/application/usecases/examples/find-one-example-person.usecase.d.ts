import { ExamplePerson } from "../../../domain/models/example-person";
export interface FindOneExamplePersonPort {
    findOne(id: string): Promise<ExamplePerson>;
}
export declare class FindOneExamplePerson<T extends FindOneExamplePersonPort> {
    private readonly port;
    constructor(port: T);
    findOne(id: string): Promise<ExamplePerson>;
}
