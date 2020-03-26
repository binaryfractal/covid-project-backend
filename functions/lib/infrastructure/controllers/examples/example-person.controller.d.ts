import { Response } from 'express';
import { ExamplePerson } from '../../../domain/models/example-person';
export declare class ExamplePersonController {
    private readonly findAllExamplePeopleUsecase;
    private readonly findOneExamplePersonUsecase;
    private readonly saveExamplePersonUsecase;
    constructor();
    findAll(res: Response): Promise<void>;
    findOne(id: string, res: Response): Promise<void>;
    save(person: ExamplePerson, res: Response): Promise<void>;
}
