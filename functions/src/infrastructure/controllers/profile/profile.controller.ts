import { Response } from "express";
import { 
    Controller, 
    Get, 
    Body,
    Res, 
    HttpStatus, 
    Post
} from "@nestjs/common";
import { FindOneProfile } from "../../../application/usecases/profile/find-one-profile.usecase";
import { Profile } from "../../../domain/models/profile";
import { ProfileService } from "../../../infrastructure/services/profile/profile.service";
import { Risk } from "../../../domain/models/risk";
import { SaveProfile } from "../../../application/usecases/profile/save-profile.usecase";
import { UserRecord } from "firebase-functions/lib/providers/auth";

@Controller("profiles")
export class ProfileController {
    private readonly findOneProfileUsecase: FindOneProfile<ProfileService>;
    private readonly saveProfileUsecase: SaveProfile<ProfileService>;
    
    constructor() {
        this.findOneProfileUsecase = new FindOneProfile(new ProfileService());
        this.saveProfileUsecase = new SaveProfile(new ProfileService());
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

    @Post()
    async save(@Body('profile') profile: Profile, @Body('user') user: UserRecord, @Res() res: Response): Promise<void> {
        try {
            profile.uid = user.uid;
            const risk: Risk = await this.saveProfileUsecase.save(profile);
            res.status(HttpStatus.CREATED).send(risk);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}