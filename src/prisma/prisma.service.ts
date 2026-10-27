import { Injectable } from '@nestjs/common';

import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL || "",
        });

        super({ adapter });
}}

