import { Direction } from '../../enums/common.enum'
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum'
import { Member } from '../member/member'
import { Notices } from './notice'

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	noticeContent: string;
	memberId?: string;
	memberData?: Member;
}
interface NAISearch {
	noticeCategory: NoticeCategory;
	text?: string;
}


export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NAISearch;
	metaCounter: { total: number }[];
}


interface NBAISearch {
	noticeStatus?: NoticeStatus;
	noticeCategory?: NoticeCategory;
	text?: string;
}

export interface AllNoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NBAISearch;
}
