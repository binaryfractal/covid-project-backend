import { Base } from "./base";

export interface Risk extends Base {
    id: string;
    name: string;
    minRange: number;
    maxRange: number;
    message: string;
}