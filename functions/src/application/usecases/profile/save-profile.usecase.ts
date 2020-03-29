import { Profile } from "../../../domain/models/profile";
import { Risk } from "../../../domain/models/risk";

export interface SaveProfilePort {
    save(profile: Profile): Promise<Risk>;
}

export class SaveProfile<T extends SaveProfilePort> {
    private readonly port: T;

    constructor(port: T) {
        this.port = port;
    }

    async save(profile: Profile): Promise<Risk> {
        return await this.port.save(profile);
    }
}