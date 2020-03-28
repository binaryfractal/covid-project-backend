import { Base } from "./base";
import { Answer } from "./answer";

export interface Question extends Base {
    id: string;
    order: number;
    question: string;
    type: string;
    answer: string;
    answers: Array<Answer>;
}