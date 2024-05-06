import {
	DynamoDBClient,
	PutItemCommand,
	PutItemCommandInput,
	ScanCommand,
	ScanCommandInput,
	ScanCommandOutput,
	UpdateItemCommand,
	UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';

import { IDBPagination, IDatabases } from '@nxms/core-main/domain';
import { v4 as uuidv4 } from 'uuid';

export class DynamoDBAdapter implements IDatabases {
	private database: DynamoDBClient;

	constructor() {
		this.database = new DynamoDBClient({ region: 'us-east-1' });
	}

	private static instance: InstanceType<typeof this>;

	public static getInstance(): InstanceType<typeof this> {
		return this.instance || (this.instance = new this());
	}

	getById(table: string, uuid: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const input: ScanCommandInput = {
				ExpressionAttributeNames: {
					'#uuid': 'uuid',
				},
				ExpressionAttributeValues: {
					':uuid': { S: uuid },
				},
				FilterExpression: '#uuid = :uuid',
				Select: 'ALL_ATTRIBUTES',
				TableName: `${table}-table-${process.env.deployment_stage}`,
			};

			const command = new ScanCommand(input);
			this.database
				.send(command)
				.then((resultDB: ScanCommandOutput) => {
					if (resultDB.Count === 1 && resultDB.Items.length === 1) {
						resolve(resultDB.Items[0]);
						return;
					}
					resolve(null);
				})
				.catch((error) => {
					console.error('Error al consultar xID en BD', error);
					reject(error);
				});
		});
	}

	getAll(table: string, pagination: IDBPagination): Promise<any[]> {
		return new Promise((resolve) => {
			let result: any[] = [];

			const input: ScanCommandInput = {
				Limit: pagination.limit,
				Select: 'ALL_ATTRIBUTES',
				TableName: `${table}-table-${process.env.deployment_stage}`,
			};

			const command = new ScanCommand(input);
			this.database
				.send(command)
				.then((resultDB: ScanCommandOutput) => {
					if (resultDB.Count && resultDB.Items) {
						result = resultDB.Items;
					}

					resolve(result);
				})
				.catch((error) => {
					console.error('Error al consultar ALL en BD', error);
					resolve(result);
				});
		});
	}

	getByQuery(table: string, query: any, isSubTable = false): Promise<any[]> {
		return new Promise((resolve) => {
			let result: any[] = [];

			const input: ScanCommandInput = {
				ExpressionAttributeValues: query.values,
				FilterExpression: query.condition,
				Select: 'ALL_ATTRIBUTES',
				TableName: `${table}-table-${process.env.deployment_stage}`,
			};

			const command = new ScanCommand(input);
			this.database
				.send(command)
				.then((resultDB: ScanCommandOutput) => {
					if (resultDB.Count && resultDB.Items) {
						result = resultDB.Items;
					}
					resolve(result);
				})
				.catch((error) => {
					console.error('Error al consultar query en BD', error);
					resolve(result);
				});
		});
	}

	add(table: string, data: any): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const uuid = uuidv4();
				data.uuid = { S: uuid };

				const input: PutItemCommandInput = {
					Item: data,
					TableName: `${table}-table-${process.env.deployment_stage}`,
				};
				const command = new PutItemCommand(input);

				this.database
					.send(command)
					.then(() => {
						resolve(uuid);
					})
					.catch((error) => {
						console.error('Error al insertar el item', error);
						reject(error);
					});

				// Return data;
			} catch (error) {
				console.error('Error al insertar en BD', error);
				reject(error);
			}
		});
	}

	update(table: string, uuid: string, data: any): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const input: UpdateItemCommandInput = {
					ConditionExpression: data.condition,
					ExpressionAttributeValues: data.values,
					Key: {
						uuid: { S: uuid },
					},
					TableName: `${table}-table-${process.env.deployment_stage}`,
					UpdateExpression: data.update,
				};

				const command = new UpdateItemCommand(input);

				this.database
					.send(command)
					.then(() => {
						resolve(uuid);
					})
					.catch((error) => {
						console.error('Error al actualizar el item', error);
						reject(error);
					});

				// Return data;
			} catch (error) {
				console.error('Error al actualizar en BD', error);
				reject(error);
			}
		});
	}
}

