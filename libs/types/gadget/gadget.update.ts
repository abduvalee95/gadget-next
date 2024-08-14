import { GadgetLocation, GadgetStatus, GadgetType } from '../../enums/gadget.enum'


export interface GadgetUpdate {
	_id: string;
	gadgetType?: GadgetType;
	gadgetStatus?: GadgetStatus;
	gadgetLocation?: GadgetLocation;
	gadgetColor?: string;
	gadgetTitle?: string;
	gadgetPrice?: number;
	// gadgetSquare?: number;
	gadgetWeight?: number;
	gadgetCapacity?: number;
	gadgetImages?: string[];
	gadgetDesc?: string;
	// gadgetUsed?: boolean;
	// gadgetNew?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
