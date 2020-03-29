import { Base } from "./base";
import { Profile } from "./profile";

export interface Country extends Base {
    id: string;
    name: string;
    confirmed: number;
    recovered: number;
    risk: number;
    riskFree: number;
    riskHigh: number;
    riskLow: number;
    total: number;

    profilesLastConfirmed: Array<Profile>;
}