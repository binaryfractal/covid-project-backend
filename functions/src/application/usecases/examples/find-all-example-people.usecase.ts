// This file is an example

import { ExamplePerson } from "../../../domain/models/example-person";

export interface FindAllExamplePeoplePort {
    findAll(): Promise<Array<ExamplePerson>>;
}

export class FindAllExamplePeople<T extends FindAllExamplePeoplePort> {
    constructor(private readonly port: T) {}

    async findAll(): Promise<Array<ExamplePerson>> {
        return await this.port.findAll();
    }
}