const config = {
  db: {
    tableName: process.env.TABLE_NAME || 'Users',
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  optionsAWS: {
    endpoint: 'http://localhost:7955',
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'eu-west-3',
    apiVersion: '2012-08-10',
  },
};

module.exports = config;