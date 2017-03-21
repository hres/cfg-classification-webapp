export class CfgRequest {

	source: number = 0;
	name: string;
	code: number;
	subGroupCode: number;
	cnfCode: number;
	cfgTier: number;
	rollUp: number;
	containsAdded: string[];
	missing: string[];
	commitDateBegin: Date;
	commitDateEnd: Date;
	comments: string;
	lastUpdateFilter: string[];
	lastUpdateDateBegin: Date;
	lastUpdateDateEnd: Date;
}
