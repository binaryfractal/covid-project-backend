import { FindOneExamplePersonPort } from '../../../application/usecases/examples/find-one-example-person.usecase';
import { FindAllExamplePeoplePort } from '../../../application/usecases/examples/find-all-example-people.usecase';
import { ExamplePerson } from '../../../domain/models/example-person';
import { SaveExamplePersonPort } from '../../../application/usecases/examples/save-example-person.usecase';
export declare class ExamplePersonService implements FindOneExamplePersonPort, FindAllExamplePeoplePort, SaveExamplePersonPort {
    findOne(id: string): Promise<ExamplePerson>;
    findAll(): Promise<Array<ExamplePerson>>;
    save(person: ExamplePerson): Promise<void>;
    private fillAll;
    private fillOne;
}
