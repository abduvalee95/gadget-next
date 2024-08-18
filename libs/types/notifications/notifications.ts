import { NotificationGroup, NotificationStatus } from '../../enums/notification.enum'
import { Member } from '../member/member'

export interface MeNotificate {
	rreceiverId: string;
	authorId: string;
	unRead: boolean;
}

export interface TotalCounter {
	total: number;
}


export interface Notification {
	_id: string;
	notificationGroup: NotificationGroup;
	notificationStatus: NotificationStatus;
	notificationType: string;
	notificationTitle: string;
	notificationDesc: string;
	notificationRefId: string;
	receiverId: string;
	authorId: string;
	articleId:string;
	gadgetId:string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notifications {
	list: Notifications[];
	metaCounter: TotalCounter[];
}
