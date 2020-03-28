import { 
    QuerySnapshot, 
    DocumentSnapshot, 
    Timestamp 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Answer } from "../../../domain/models/answer";
import { FindAllSurveysPort } from "../../../application/usecases/survey/find-all-surveys.usecase";
import { Question } from "../../../domain/models/question";
import { Survey } from "../../../domain/models/survey";
import { 
    UNIQUE, 
    MULTIPLE 
} from "../../../config/global";

export class SurveyService implements FindAllSurveysPort {

    async findAll(): Promise<Array<Survey>> {
        const querySnapshot: QuerySnapshot = await db.collection('surveys').where("active", "==", true).get();
        const surveys: Array<Survey> = await this.fillAllSurveys(querySnapshot);
        return surveys;
    }

    private async fillAllSurveys(querySnapshot: QuerySnapshot): Promise<Array<Survey>> {
        const surveys: Array<Survey> = new Array<Survey>();
        if(!querySnapshot.empty) {
            let survey: Survey = {} as Survey;
            for(let snapshot of querySnapshot.docs) {
                survey = await this.fillOneSurvey(snapshot);
                surveys.push(survey);
            }
        }
        return surveys;
    }

    private async fillOneSurvey(snapshot: DocumentSnapshot): Promise<Survey> {
        let survey: Survey = {} as Survey;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                survey.id = snapshot.id;
                survey.name = snapshot.get('name');
                survey.date = (<Timestamp>snapshot.get('date')).toDate();

                const questionsQuerySnapshot: QuerySnapshot =
                    await snapshot.ref.collection('questions').orderBy('order').get(); 
                survey.questions = await this.fillAllQuestions(questionsQuerySnapshot);
            }
        }
        return survey;
    }

    private async fillAllQuestions(querySnapshot: QuerySnapshot): Promise<Array<Question>> {
        const questions: Array<Question> = new Array<Question>();
        if(!querySnapshot.empty) {
            let question: Question = {} as Question;
            for(let snapshot of querySnapshot.docs) {
                question = await this.fillOneQuestion(snapshot);
                questions.push(question);
            }
        }
        return questions;
    }

    private async fillOneQuestion(snapshot: DocumentSnapshot): Promise<Question> {
        const question: Question = {} as Question;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                question.id = snapshot.id;
                question.question = snapshot.get('question');
                question.order = snapshot.get('order');
                question.type = snapshot.get('type');
                question.subQuestion = snapshot.get('subQuestion') ?? false;

                if(question.type === UNIQUE || question.type === MULTIPLE) {
                    const answersQuerySnapshot: QuerySnapshot =
                        await snapshot.ref.collection('answers').get();
                    question.answers = await this.fillAllAnswers(answersQuerySnapshot);
                }
            }
        }
        return question;
    }

    private async fillAllAnswers(querySnapshot: QuerySnapshot): Promise<Array<Answer>> {
        const answers: Array<Answer> = new Array<Answer>();
        if(!querySnapshot.empty) {
            let answer: Answer = {} as Answer;
            for(let snapshot of querySnapshot.docs) {
                answer = await this.fillOneAnswer(snapshot);
                answers.push(answer);
            }
        }
        return answers;
    }

    private async fillOneAnswer(snapshot: DocumentSnapshot): Promise<Answer> {
        const answer: Answer = {} as Answer;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                answer.id = snapshot.id;
                answer.answer = snapshot.get('answer');
                answer.order = snapshot.get('order');
                
                if(snapshot.get('idQuestion') !== null) 
                    answer.idQuestion = snapshot.get('idQuestion');
            }
        }
        return answer; 
    }
}