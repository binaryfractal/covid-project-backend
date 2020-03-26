import { ExamplePerson } from "../../../domain/models/example-person";
export interface SaveExamplePersonPort {
    save(person: ExamplePerson): Promise<void>;
}
export declare class SaveExamplePerson<T extends SaveExamplePersonPort> {
    private readonly port;
    constructor(port: T);
    save(person: ExamplePerson): Promise<void>;
}
