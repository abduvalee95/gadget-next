import { Direction } from '../../enums/common.enum';
import { FaqCategory, FaqStatus } from '../../enums/faq.enum'

export interface FaqInput {
	faqCategory: FaqCategory;
	faqTitle: string;
	faqContent: string;
	memberId?: string;
}

export interface FaqInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	faqCategory?: FaqCategory;
}

export interface AFISearch {
	faqStatus?: FaqStatus;
	faqCategory?: FaqCategory;
	text?: string;
}

export interface AllFaqsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AFISearch;
}
