import { Country } from "../../../domain/models/country";

export interface FindOneCountryPort {
    findOne(id: string): Promise<Country>;
}

export class FindOneCountry<T extends FindOneCountryPort> {
    constructor(private readonly port: T) {}

    async findOne(uid: string): Promise<Country> {
        return await this.port.findOne(uid);
    }
}