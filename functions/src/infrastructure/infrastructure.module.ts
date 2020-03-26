import { Module } from '@nestjs/common';
import { ExamplePersonController } from './controllers/examples/example-person.controller';
import { ExamplePersonService } from './services/examples/example-person.service';

@Module({
    controllers: [
        ExamplePersonController
    ],
    providers: [
        ExamplePersonService
    ]
})
export class InfrastructureModule {}