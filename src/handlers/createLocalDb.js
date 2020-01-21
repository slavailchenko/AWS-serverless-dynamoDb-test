const AWS = require('aws-sdk');
const { setOffline, checkOffline } = require('../services/helper');
const { errorHandler } = require('../services/error');
const { db } = require('../config');

const createLocalDb = errorHandler(async (event, context) => {
  const dynamodb = new AWS.DynamoDB();
  const params = {
    TableName: db.tableName,
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: db.ReadCapacityUnits,
      WriteCapacityUnits: db.WriteCapacityUnits,
    }
  };
  
  const data = await dynamodb.createTable(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: 'ok',
      message: [
        'Created table. Table description JSON:',
        JSON.stringify(data, null, 2)
      ]
    })
  };
});

module.exports = {
  createLocalDb: checkOffline(setOffline(createLocalDb)),
}
