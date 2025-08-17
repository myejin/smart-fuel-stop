import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  async createNotification(dto: CreateNotificationDto) {
    // TODO
  }
}
