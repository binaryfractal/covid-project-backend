import { Survey } from "../../../domain/models/survey";

export interface FindAllSurveysPort {
    findAll(): Promise<Array<Survey>>;
}

export class FindAllSurveys<T extends FindAllSurveysPort> {
    constructor(private readonly port: T) {}

    async findAll(): Promise<Array<Survey>> {
        return await this.port.findAll();
    }
}