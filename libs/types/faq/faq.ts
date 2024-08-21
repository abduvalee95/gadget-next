import { FaqCategory, FaqStatus } from '../../enums/faq.enum'

export interface FaqType {
	_id: string;
	faqCategory: FaqCategory;
	faqStatus: FaqStatus;
	faqTitle: string;
	faqContent: string;
	faqViews: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}
