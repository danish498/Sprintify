// prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // optional — makes injection available app-wide without importing, but importing explicitly is clearer
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <- critical
})
export class PrismaModule {}
