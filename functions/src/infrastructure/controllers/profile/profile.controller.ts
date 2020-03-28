import { Response } from "express";
import { 
    Controller, 
    Get, 
    Body, 
    Res, 
    HttpStatus 
} from "@nestjs/common";
import { FindOneProfile } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { ProfileService } from "../../../infrastructure/services/profile/profile.service";
import { UserRecord } from "firebase-functions/lib/providers/auth";

@Controller("profiles")
export class ProfileController {
    private readonly findOneProfileUsecase: FindOneProfile<ProfileService>;

    constructor() {
        this.findOneProfileUsecase = new FindOneProfile(new ProfileService());
    } 

    @Get()
    async findOne(@Body('user') user: UserRecord, @Res() res: Response): Promise<void> {
        try {
            const profile: Profile = await this.findOneProfileUsecase.findOne(user.uid);
            res.status(HttpStatus.OK).send(profile);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}