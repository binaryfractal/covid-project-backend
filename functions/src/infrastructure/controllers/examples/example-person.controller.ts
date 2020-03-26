// This file is an example

import { Response } from 'express';
import { 
    Body,
    Controller, 
    Get, 
    HttpStatus,
    Param,
    Post,
    Res
} from "@nestjs/common";
import { ExamplePerson } from '../../../domain/models/example-person';
import { ExamplePersonService } from "../../services/examples/example-person.service";
import { FindAllExamplePeople } from "../../../application/usecases/examples/find-all-example-people.usecase";
import { FindOneExamplePerson } from "../../../application/usecases/examples/find-one-example-person.usecase";
import { SaveExamplePerson } from '../../../application/usecases/examples/save-example-person.usecase';

@Controller("example-people")
export class ExamplePersonController {
    private readonly findAllExamplePeopleUsecase: FindAllExamplePeople<ExamplePersonService>;
    private readonly findOneExamplePersonUsecase: FindOneExamplePerson<ExamplePersonService>;
    private readonly saveExamplePersonUsecase: SaveExamplePerson<ExamplePersonService>;

    constructor() { 
        this.findAllExamplePeopleUsecase = new FindAllExamplePeople(new ExamplePersonService());
        this.findOneExamplePersonUsecase = new FindOneExamplePerson(new ExamplePersonService());
        this.saveExamplePersonUsecase = new SaveExamplePerson(new ExamplePersonService());
    }

    @Get()
    async findAll(@Res() res: Response): Promise<void> {
        try {
            const people:Array<ExamplePerson> = await this.findAllExamplePeopleUsecase.findAll();
            res.status(HttpStatus.OK).send(people);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }

    @Get(":id")
    async findOne(@Param('id')id: string, @Res()res: Response): Promise<void> {
        try {
            const person: ExamplePerson = await this.findOneExamplePersonUsecase.findOne(id);
            res.status(HttpStatus.OK).send(person);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }

    @Post()
    async save(
        @Body('person') person: ExamplePerson, 
        @Res() res: Response
    ) : Promise<void> {
        try {
            await this.saveExamplePersonUsecase.save(person);
            res.status(HttpStatus.CREATED).send(true);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}