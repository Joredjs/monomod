/* eslint-disable no-use-before-define */
// Se deshabilita esta regla por la dependencia que se genera al momento de la creación de las interfaces / types

export type TJSONValue = string | number | boolean | IJSONObject | TJSONArray;
export type TJSONArray = Array<TJSONValue>;
export type TJSONor = IJSONObject | undefined;

export interface IJSONObject {
	[x: string]: TJSONValue;
}

export interface IError {
	code: number;
	desc: string;
	text: string;
}

export type TErroresValues =
	| 'alreadyExists'
	| 'badInfo'
	| 'badUser'
	| 'forbidden'
	| 'gone'
	| 'headers'
	| 'invalid'
	| 'noInfo'
	| 'nocatch'
	| 'params'
	| 'session'
	| 'uncompleted';
export type TErrores = {
	[key in TErroresValues]: IError;
};
/* Export interface IDialogInfo {
     title?: string;
     text: string;
   } */

/* Export interface IDialogData {
     type:string;
     info:IDialogInfo
   } */
