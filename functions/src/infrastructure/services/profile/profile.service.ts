import { 
    DocumentReference,
    DocumentSnapshot, 
    FieldValue,
    QuerySnapshot, 
    Timestamp, 
    WriteBatch
} from "@google-cloud/firestore";
import { db } from "../../../config/app";
import { Answer } from "../../../domain/models/answer";
import { FindOneProfilePort } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { Question } from "../../../domain/models/question";
import { Survey } from "../../../domain/models/survey";
import { SaveProfilePort } from "../../../application/usecases/profile/save-profile.usecase";
import { 
    FREE, 
    UNIQUE, 
    MULTIPLE 
} from "../../../config/global";

export class ProfileService implements FindOneProfilePort, SaveProfilePort {
    
    async findOne(uid: string): Promise<Profile> {
        const profileSnapshot: DocumentSnapshot = 
            await db.collection('profiles').doc(uid).get();

        const profile: Profile = await this.fillOneProfile(profileSnapshot);
        return profile;
    }

    async save(profile: Profile): Promise<void> {
        const batch: WriteBatch = db.batch();

        const profileReference: DocumentReference = db.collection('profiles').doc(profile.uid); 
        await this.saveProfile(batch, profileReference, profile);

        await batch.commit();
    }

    private async fillOneProfile(snapshot: DocumentSnapshot): Promise<Profile> {
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
                
                if(question.type === FREE) {
                    question.answer = snapshot.get('answer');
                } else if(question.type === UNIQUE || question.type === MULTIPLE) {
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

    private async saveProfile(
        batch: WriteBatch, reference: DocumentReference, profile: Profile
    ): Promise<void> {
        batch.set(reference, {
            age: profile.age,
            country: profile.country,
            email: profile.email,
            gender: profile.gender,
            idCountry: profile.idCountry,
            idRisk: profile.idRisk,
            lastUpdate: FieldValue.serverTimestamp(),
            name: profile.name,
            risk: profile.risk,
            state: profile.state,
            town: profile.town,
            zip: profile.zip
        });
        
        await this.saveSurveys(batch, reference, profile.surveys);
    }

    private async saveSurveys(
        batch: WriteBatch, reference: DocumentReference, surveys: Array<Survey>
    ): Promise<void> {
        for(let survey of surveys) {
            await this.saveSurvey(batch, reference, survey);
        }
    }

    private async saveSurvey(
        batch: WriteBatch, reference: DocumentReference, survey: Survey
    ): Promise<void> {
        const surveyReference: DocumentReference = reference.collection('surveys').doc(survey.id);
        batch.set(surveyReference, {});

        await this.saveVersion(batch, surveyReference, survey);
    }

    private async saveVersion(
        batch: WriteBatch, reference: DocumentReference, survey: Survey
    ): Promise<void> {
        const versionReference: DocumentReference = reference.collection('versions').doc();
        batch.create(versionReference, {
            active: true,
            date: FieldValue.serverTimestamp(),
            name: survey.name
        });

        await this.saveQuestions(batch, versionReference, survey.questions);
    }

    private async saveQuestions(
        batch: WriteBatch, reference: DocumentReference, questions: Array<Question>
    ): Promise<void> {
        for(let question of questions) {
            await this.saveQuestion(batch, reference, question);
        }
    }

    private async saveQuestion(
        batch: WriteBatch, reference: DocumentReference, question: Question
    ): Promise<void> {
        if(question.type === FREE) {
            await this.saveQuestionFree(batch, reference, question);
        } else {
            batch.create(reference.collection('questions').doc(question.id), {
                order: question.order,
                question: question.question,
                type: question.type
            });

            const questionReference = reference.collection('questions').doc(question.id);
            await this.saveAnswers(batch, questionReference, question.answers);
        }
    }

    private async saveQuestionFree(
        batch: WriteBatch, reference: DocumentReference, question: Question
    ): Promise<void> {
        batch.create(reference.collection('questions').doc(question.id), {
            answer: question.answer,
            order: question.order,
            question: question.question,
            type: question.type
        });
    }

    private async saveAnswers(
        batch: WriteBatch, reference: DocumentReference, answers: Array<Answer>
    ): Promise<void> {
        for(let answer of answers) {
            await this.saveAnswer(batch, reference, answer);
        }
    }

    private async saveAnswer(
        batch:  WriteBatch, reference: DocumentReference, answer: Answer
    ): Promise<void> {
        batch.create(reference.collection('answers').doc(answer.id), {
            answer: answer.answer
        });
    }
}