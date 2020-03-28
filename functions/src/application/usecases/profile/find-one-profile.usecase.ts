import { Profile } from "../../../domain/models/profile";

export interface FindOneProfilePort {
    findOne(uid: string): Promise<Profile>;
}

export class FindOneProfile<T extends FindOneProfilePort> {
    constructor(private readonly port: T) {}

    async findOne(uid: string): Promise<Profile> {
        return await this.port.findOne(uid);
    }
}