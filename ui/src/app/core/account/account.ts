import { IZXCVBNResult } from "zxcvbn-typescript";

export interface Account {
	id: number;
	AccountUserName: string;
	AccountPassword: string;
	AccountUrl: string;
	validImgUrl?: string;
	showPassword?: boolean;
	passwordStrength?: IZXCVBNResult;
	editLoading?: boolean;
	editable?: boolean;
}