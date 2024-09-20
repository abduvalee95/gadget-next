import { MessageStatus } from '../../enums/message.enum';

export interface MessageUpdate {
	_id: string;
	messageStatus: MessageStatus;
}