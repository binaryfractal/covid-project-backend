import { Response } from 'express';
export declare class ExampleController {
    private readonly findAllNamesUsecase;
    private readonly findOneNameUsecase;
    constructor();
    findAll(res: Response): Promise<void>;
    findOne(yourName: string, res: Response): Promise<void>;
}
