import { MongoClient, Db } from 'mongodb';
import logger from './logger';
import app from './app';

const port = app.get('port');
const mongodb = app.get('mongodb');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

process.on('SIGTERM', () => {
  logger.warn('SIGTERM received, closing server.');
  server.close(() => {
    logger.warn('Server closed, closing db connection.');
    mongodb.then((mongo: { client: MongoClient, db: Db }) => {
      mongo.client.close(false, () => {
        logger.warn('Db connection closed, exiting');
        process.exit(0);
      });
    });
  });
});

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
