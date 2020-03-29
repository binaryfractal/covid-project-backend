import { Profile } from "../../../domain/models/profile";
import { Filter } from "../../../domain/models/filter";

export interface FindAllProfilesPort {
    findAll(filters: Array<Filter>): Promise<Array<Profile>>;
}

export class FindAllProfiles<T extends FindAllProfilesPort> {
    constructor(private readonly port: T) {}

    async findAll(filters: Array<Filter>): Promise<Array<Profile>> {
        return await this.port.findAll(filters);
    }
}