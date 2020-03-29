import { Module } from '@nestjs/common';
import { ExamplePersonController } from './controllers/examples/example-person.controller';
import { ExamplePersonService } from './services/examples/example-person.service';
import { ProfileService } from './services/profile/profile.service';
import { ProfileController } from './controllers/profile/profile.controller';
import { SurveyController } from './controllers/survey/survey.controller';
import { SurveyService } from './services/survey/survey.service';
import { SearchService } from './services/profile/search.service';
import { SearchController } from './controllers/profile/search.controller';
import { CountryService } from './services/country/country.service';
import { CountryController } from './controllers/country/country.controller';

@Module({
    controllers: [
        CountryController,
        ExamplePersonController,
        ProfileController,
        SearchController,
        SurveyController
    ],
    providers: [
        CountryService,
        ExamplePersonService,
        ProfileService,
        SearchService,
        SurveyService        
    ]
})
export class InfrastructureModule {}