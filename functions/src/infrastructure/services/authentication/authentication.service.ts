import { CreateProfileAuthPort } from "../../../application/usecases/authentication/create-profile-auth.usecase";
import { WriteBatch, FieldValue } from "@google-cloud/firestore";
import { db } from "../../../config/app";

export class AuthenticationService implements CreateProfileAuthPort {
    async createProfile(uid: string, email: string): Promise<void> {
        const batch: WriteBatch = db.batch();
        const date = FieldValue.serverTimestamp();

        batch.create(db.collection('profiles').doc(uid), {
            email: email,
            firstUpdate: date, 
            lastUpdate: date
        });

        await batch.commit();
    }
}