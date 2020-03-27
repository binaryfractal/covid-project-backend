import { CreateProfileAuthPort } from "../../../application/usecases/authentication/create-profile-auth.usecase";
import { WriteBatch } from "@google-cloud/firestore";
import { db } from "../../../config/app";

export class AuthenticationService implements CreateProfileAuthPort {
    async createProfile(uid: string, email: string): Promise<void> {
        const batch: WriteBatch = db.batch();

        batch.create(db.collection('profiles').doc(uid), {
            email: email
        });

        await batch.commit();
    }
}