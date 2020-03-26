// This file is an example

import { ExamplePerson } from "../../../domain/models/example-person";

export interface FindOneExamplePersonPort {
    findOne(id: string): Promise<ExamplePerson>;
}

export class FindOneExamplePerson<T extends FindOneExamplePersonPort> {
    constructor(private readonly port: T) {}

    async findOne(id: string): Promise<ExamplePerson> {
        return await this.port.findOne(id);
    }
}