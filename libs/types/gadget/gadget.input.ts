import { Direction } from '../../enums/common.enum';
import { GadgetLocation, GadgetStatus, GadgetType } from '../../enums/gadget.enum'

export interface GadgetInput {
	gadgetType: GadgetType;
	gadgetLocation: GadgetLocation
	gadgetColor: string;
	gadgetTitle: string;
	gadgetPrice: number;
	// gadgetDisplaySquare: number;
	gadgetWeight: number;
	gadgetCapacity: number;
	gadgetImages: string[];
	gadgetDesc?: string;
	// gadgetUsed?: boolean;
	// gadgetNew?: boolean;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: GadgetLocation[];
	typeList?: GadgetType[];
	capacityList?: Number[];
	options?: string[];
	// bedsList?: Number[];
	pricesRange?: Range;
	// periodsRange?: PeriodsRange;
	// squaresRange?: Range;
	text?: string;
}

export interface GadgetsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

export interface GetNotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	gadgetStatus?: GadgetStatus;
}

export interface AgentGadgetsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	gadgetStatus?: GadgetStatus;
	gadgetLocationList?: GadgetLocation[];
}

export interface AllGadgetsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
