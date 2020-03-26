// This file is an example

import { ExamplePerson } from "../../../domain/models/example-person";

export interface SaveExamplePersonPort {
    save(person: ExamplePerson): Promise<void>;
}

export class SaveExamplePerson<T extends SaveExamplePersonPort> {
    private readonly port: T;

    constructor(port: T) {
        this.port = port;
    }

    async save(person: ExamplePerson): Promise<void> {
        await this.port.save(person);
    }
}