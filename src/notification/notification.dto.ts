export class CreateNotificationDto {
  type: 'INFO' | 'WARNING' | 'EMERGENCY';
  message: string;

  constructor(partial: Partial<CreateNotificationDto>) {
    Object.assign(this, partial);
  }
}
