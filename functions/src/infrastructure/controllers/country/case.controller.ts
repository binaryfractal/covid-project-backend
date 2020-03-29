import { Change } from "firebase-functions";
import { DocumentSnapshot } from "@google-cloud/firestore";
import { CaseService } from "../../../infrastructure/services/country/case.service";
import { UpdateCases } from "../../../application/usecases/countries/update-cases.usecase";

export class CaseController {
    async update(change: Change<DocumentSnapshot>, context: any) {
        const updateCasesUsecase: UpdateCases<CaseService> =
            new UpdateCases(new CaseService());
        try {
            const newValue = change.after.data();
            const previousValue = change.before.data();

            await updateCasesUsecase.update(newValue.idCountry, newValue.idRisk, previousValue.idRisk);
        } catch(error) {
            console.error(error.message);
        }
    }
}

export const caseController: CaseController = new CaseController();