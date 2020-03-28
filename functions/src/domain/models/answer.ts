import { Base } from "./base";

export interface Answer extends Base {
    id: string;
    answer: string;
    order: number;
    idQuestion: string;
}