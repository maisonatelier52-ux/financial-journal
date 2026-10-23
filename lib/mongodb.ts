import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb+srv://maisonatelier52_db_user:ItiE4hnycOWjJ741@cluster0.7tpjyhc.mongodb.net/financial_journal?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'financial_journal';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;
