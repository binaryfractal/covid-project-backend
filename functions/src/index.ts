import * as functions from 'firebase-functions';

import { server } from './config/api';
import { authenticationController } from './infrastructure/controllers/authetication/authentication.controller';

export const api = functions.https.onRequest(server);

exports.createProfile = functions.auth.user().onCreate(authenticationController.createProfile);