import { MessageStatus } from '../../enums/message.enum'

export interface Message {
	_id: string;
	messageStatus: MessageStatus;
	senderName: string;
	senderPhone: string;
	senderEmail: string;
	messageDesc: string;
	messageRefId: string;
	memberId: string;
	messageContent: string;
	createdAt: Date;
	updatedAt: Date;
}