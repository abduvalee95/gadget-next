import { FaqCategory, FaqStatus } from '../../enums/faq.enum'

export interface FaqUpdate {
	_id: string;
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	faqTitle?: string;
	faqContent?: string;
}
