import { AbstractHashService } from "./AbstractHashService.js";
import bcrypt from "bcrypt";

export class ConcreteHashService extends AbstractHashService{
    async hash(data: string): Promise<string>{
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(data, salt);
    }

    async verify(password: string, passwordHash: string): Promise<boolean>{
        const isMatch = await bcrypt.compare(password, passwordHash);
        return isMatch;
    }
}