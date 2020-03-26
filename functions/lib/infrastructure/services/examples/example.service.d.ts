import { FindOneNamePort } from '../../../application/usecases/examples/find-one-name.usecase';
import { FindAllNamesPort } from '../../../application/usecases/examples/find-all-names.usecase';
export declare class ExampleService implements FindAllNamesPort, FindOneNamePort {
    findAll(): Promise<Array<string>>;
    findOne(yourName: string): Promise<string>;
}
