import { Response } from "express";
import { 
    Body, 
    Controller, 
    HttpStatus, 
    Post, 
    Res 
} from "@nestjs/common";
import { Filter } from "../../../domain/models/filter";
import { FindAllProfiles } from "../../../application/usecases/profile/find-all-profiles.usecase";
import { Profile } from "../../../domain/models/profile";
import { SearchService } from "../../../infrastructure/services/profile/search.service";

@Controller("searches")
export class SearchController {
    private readonly findAllProfilesUsecase: FindAllProfiles<SearchService>;

    constructor() {
        this.findAllProfilesUsecase = new FindAllProfiles(new SearchService());
    }

    @Post()
    async findAll(@Body('filters') filters: Array<Filter>, @Res() res: Response): Promise<void> {
        try {
            const profiles: Array<Profile> = await this.findAllProfilesUsecase.findAll(filters);
            res.status(HttpStatus.OK).send(profiles);
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}