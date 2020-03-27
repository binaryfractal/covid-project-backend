import { EventContext } from "firebase-functions";
import { auth } from "firebase-admin";
import { CreateProfileAuth } from "../../../application/usecases/authentication/create-profile-auth.usecase";
import { AuthenticationService } from "../../../infrastructure/services/authentication/authentication.service";


export class AuthenticationController {
    async createProfile(user: auth.UserRecord, context: EventContext) {
        const createProfileAuthUsecase: CreateProfileAuth<AuthenticationService> =
            new CreateProfileAuth(new AuthenticationService());
        try {
            await createProfileAuthUsecase.createProfile(user.uid, user.email);
        } catch(err) {
            console.error(err.message);
        }
    }
}

export const authenticationController: AuthenticationController = new AuthenticationController();