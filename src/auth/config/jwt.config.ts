
import { registerAs } from '@nestjs/config';

export default registerAs("jwt", ()=>{
return{
        secret: String(process.env.JWT_SECRET) as any,
        audience: String(process.env.JWT_TOKEN_AUDIENCE)  as any,
        issuer: String(process.env.JWT_ISSUER)  as any,
        ttl: String(process.env.JWT_TTL) as any
}})
