import { Module } from '@nestjs/common';
import { ExamplePersonController } from './controllers/examples/example-person.controller';
import { ExamplePersonService } from './services/examples/example-person.service';
import { ProfileService } from './services/profile/profile.service';
import { ProfileController } from './controllers/profile/profile.controller';
import { SurveyController } from './controllers/survey/survey.controller';
import { SurveyService } from './services/survey/survey.service';

@Module({
    controllers: [
        ExamplePersonController,
        ProfileController,
        SurveyController
    ],
    providers: [
        ExamplePersonService,
        ProfileService,
        SurveyService
    ]
})
export class InfrastructureModule {}