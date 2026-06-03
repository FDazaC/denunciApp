import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [AuthModule, UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}
