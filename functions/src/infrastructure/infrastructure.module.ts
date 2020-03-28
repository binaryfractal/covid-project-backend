import { Module } from '@nestjs/common';
import { ExamplePersonController } from './controllers/examples/example-person.controller';
import { ExamplePersonService } from './services/examples/example-person.service';
import { ProfileService } from './services/profile/profile.service';
import { ProfileController } from './controllers/profile/profile.controller';

@Module({
    controllers: [
        ExamplePersonController,
        ProfileController
    ],
    providers: [
        ExamplePersonService,
        ProfileService
    ]
})
export class InfrastructureModule {}