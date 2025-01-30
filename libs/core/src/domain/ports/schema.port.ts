import { IJSONObject, ISchema } from '../interfaces';

export interface IServiceSchema {
	validate(schema: ISchema, keys: string[], params: IJSONObject): boolean;
}
