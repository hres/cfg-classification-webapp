export class CfgRequest {

	source: string;
	name: string;
	code: number;
	subGroupCode: number;
	cnfCode: number;
	cfgTier: number;
	rollUp: number;
	containsAdded: string[];
	missing: string[];
	commitBeginDate: Date;
	commitEndDate: Date;
	comments: string;
	lastUpdateFilter: string[];
	lastUpdateDateBegin: Date;
	lastUpdateDateEnd: Date;
}
