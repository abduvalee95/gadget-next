import { NoticeStatus } from '../../enums/notice.enum'

export interface NoticeUpdate {
	_id: string;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
}
