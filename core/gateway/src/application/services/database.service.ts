// Import { FirebaseDB } from "../../infra/db/firebase.adapter";

import { DynamoDBAdapter } from "../../infra/db/dynamo.adapter";

export class AppServiceDatabase {
	aws = DynamoDBAdapter.getInstance();

	// Firebase = FirebaseDB.getInstance();
}
