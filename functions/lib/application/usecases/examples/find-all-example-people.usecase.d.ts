import { ExamplePerson } from "../../../domain/models/example-person";
export interface FindAllExamplePeoplePort {
    findAll(): Promise<Array<ExamplePerson>>;
}
export declare class FindAllExamplePeople<T extends FindAllExamplePeoplePort> {
    private readonly port;
    constructor(port: T);
    findAll(): Promise<Array<ExamplePerson>>;
}
