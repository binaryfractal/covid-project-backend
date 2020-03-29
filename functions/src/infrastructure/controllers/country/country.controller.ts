import { Response } from "express";
import { 
    Controller, 
    Get, 
    HttpStatus, 
    Param, 
    Res 
} from "@nestjs/common";
import { Country } from "../../../domain/models/country";
import { CountryService } from "../../../infrastructure/services/country/country.service";
import { FindOneCountry } from "../../../application/usecases/countries/find-one-country.usecase";

@Controller("countries")
export class CountryController {
    private findOneCountryUsecase: FindOneCountry<CountryService>;

    constructor() {
        this.findOneCountryUsecase = new FindOneCountry(new CountryService());
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response): Promise<void> {
        try {
            const country: Country = await this.findOneCountryUsecase.findOne(id);
            res.status(HttpStatus.OK).send(country);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}