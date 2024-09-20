import { NotificationGroup, NotificationType } from '../../enums/notification.enum'

export interface NotificationInput {
	notificationType: NotificationType;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc: string;
	authorId: string;
	receiverId: string;
	messageId?: string;
	gadgetId?: string;
	articleId?: string;
}