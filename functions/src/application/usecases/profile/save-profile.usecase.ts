import { Profile } from "../../../domain/models/profile";

export interface SaveProfilePort {
    save(profile: Profile): Promise<void>;
}

export class SaveProfile<T extends SaveProfilePort> {
    private readonly port: T;

    constructor(port: T) {
        this.port = port;
    }

    async save(profile: Profile): Promise<void> {
        await this.port.save(profile);
    }
}