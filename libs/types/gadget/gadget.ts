import { GadgetLocation, GadgetStatus, GadgetType } from '../../enums/gadget.enum'
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Gadget {
	_id: string;
	gadgetType: GadgetType;
	gadgetStatus: GadgetStatus;
	gadgetLocation: GadgetLocation;
	gadgetColor: string;
	gadgetTitle: string;
	gadgetPrice: number;
	// gadgetDisplaySquare: number;
	gadgetWeight: number;
	gadgetCapacity: number;
	gadgetViews: number;
	gadgetLikes: number;
	gadgetComments: number;
	gadgetRank: number;
	gadgetImages: string[];
	gadgetDesc?: string;
	// gadgetUsed: boolean; //barter
	// gadgetNew: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Gadgets {
	list: Gadget[];
	metaCounter: TotalCounter[];
}
