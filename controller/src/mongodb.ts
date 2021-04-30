import { MongoClient, Db } from 'mongodb';
import { Application } from './declarations';

export default function (app: Application): void {
  const settings = app.get('mongodb');
  const connection = `mongodb://${settings.user}:${settings.password}@${settings.host}:${settings.port}/${settings.db}`;
  const database = connection.substr(connection.lastIndexOf('/') + 1);
  const mongodb: Promise<{ client: MongoClient, db: Db }> = MongoClient.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((client: MongoClient) => {
    return { db: client.db(database), client };
  });

  app.set('mongodb', mongodb);
}
