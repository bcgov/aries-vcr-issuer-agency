import { MongoClient, Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';

export class Issuer extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const mongodb = app.get('mongodb');

    mongodb.then((mongo: { client: MongoClient, db: Db }) => {
      this.Model = mongo.db.collection('issuer-profile');
    });
  }
}
