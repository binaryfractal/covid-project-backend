import { Country } from "../../../domain/models/country";

export interface FindAllCountriesPort {
    findAll(): Promise<Array<Country>>;
}

export class FindAllCountries<T extends FindAllCountriesPort> {
    constructor(private readonly port: T) {}

    async findAll(): Promise<Array<Country>> {
        return await this.port.findAll();
    }
}