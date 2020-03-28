import { Response } from 'express';
import { 
    Controller, 
    Get, 
    HttpStatus, 
    Res 
} from "@nestjs/common";
import { FindAllSurveys } from "../../../application/usecases/survey/find-all-surveys.usecase";
import { Survey } from "../../../domain/models/survey";
import { SurveyService } from "../../../infrastructure/services/survey/survey.service";

@Controller("surveys")
export class SurveyController {
    private readonly findAllSurveysUsecase: FindAllSurveys<SurveyService>;

    constructor() {
        this.findAllSurveysUsecase = new FindAllSurveys(new SurveyService());
    }

    @Get()
    async findAll(@Res() res: Response): Promise<void> {
        try {
            const surveys:Array<Survey> = await this.findAllSurveysUsecase.findAll();
            res.status(HttpStatus.OK).send(surveys);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
    
}