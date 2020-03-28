import { 
    DocumentSnapshot, 
    Timestamp, 
    QuerySnapshot 
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Answer } from "../../../domain/models/answer";
import { FindOneProfilePort } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { Question } from "../../../domain/models/question";
import { Survey } from "../../../domain/models/survey";

export class ProfileService implements FindOneProfilePort {
    private FREE: string = 'FREE';
    private UNIQUE: string = 'UNIQUE';
    private MULTIPLE: string = 'MULTIPLE';

    async findOne(uid: string): Promise<Profile> {
        const profileSnapshot: DocumentSnapshot = 
            await db.collection('profiles').doc(uid).get();

        const profile: Profile = await this.fillOne(profileSnapshot);
        return profile;
    }

    private async fillOne(snapshot: DocumentSnapshot): Promise<Profile> {
        const profile: Profile = {} as Profile;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                profile.uid = snapshot.id;
                profile.age = snapshot.get('age');
                profile.country = snapshot.get('country');
                profile.email = snapshot.get('email');
                profile.firstUpdate = (<Timestamp>snapshot.get('firstUpdate')).toDate();
                profile.gender = snapshot.get('gender');
                profile.idCountry = snapshot.get('idCountry');
                profile.idRisk = snapshot.get('idRisk');
                profile.lastUpdate = (<Timestamp>snapshot.get('lastUpdate')).toDate();
                profile.name = snapshot.get('name');
                profile.risk = snapshot.get('risk');
                profile.state = snapshot.get('state');
                profile.town = snapshot.get('town');
                profile.zip = snapshot.get('zip');

                const surveysQuerySnapshot: QuerySnapshot =
                    await snapshot.ref.collection('surveys').get();
                profile.surveys = await this.fillAllSurveys(surveysQuerySnapshot);
            }
        }
        return profile;
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
                const versionsQuerySnapshot: QuerySnapshot =
                    await snapshot.ref.collection('versions').where("active", "==", true).get(); 
                const surveys: Array<Survey> = await this.fillAllVersions(versionsQuerySnapshot);
                
                if(surveys.length > 0) {
                    survey = surveys[0];
                    survey.id = snapshot.id;
                }
            }
        }
        return survey;
    }

    private async fillAllVersions(querySnapshot: QuerySnapshot): Promise<Array<Survey>> {
        const surveys: Array<Survey> = new Array<Survey>();
        if(!querySnapshot.empty) {
            let survey: Survey = {} as Survey;
            for(let snapshot of querySnapshot.docs) {
                survey = await this.fillOneVersion(snapshot);
                surveys.push(survey);
            }
        }
        return surveys;
    }

    private async fillOneVersion(snapshot: DocumentSnapshot): Promise<Survey> {
        const survey: Survey = {} as Survey;
        if(snapshot.exists) {
            if(snapshot.data() !== undefined) {
                survey.date = (<Timestamp>snapshot.get('date')).toDate();
                survey.name = snapshot.get('name');

                const questionsQuerySnapshot: QuerySnapshot =
                    await snapshot.ref.collection('questions').get();
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
                
                if(question.type === this.FREE) {
                    question.answer = snapshot.get('answer');
                } else if(question.type === this.UNIQUE || question.type === this.MULTIPLE) {
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
            }
        }
        return answer;
    }
}