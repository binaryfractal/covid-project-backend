import * as functions from 'firebase-functions';

import { server } from './config/api';
import { authenticationController } from './infrastructure/controllers/authetication/authentication.controller';
import { caseController } from './infrastructure/controllers/country/case.controller';

export const api = functions.https.onRequest(server);

exports.createProfile = functions.auth.user().onCreate(authenticationController.createProfile);
exports.updateCases = functions.firestore.document('/profiles/{uid}').onUpdate(caseController.update);