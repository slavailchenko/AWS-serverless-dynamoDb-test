const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const { db } = require('../config');
const { generateUpdate } = require('./helper');
const configTable = { TableName: db.tableName };

module.exports = {
  put(user) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    const { fullname, ...extraValues } = user;
    const item = {
      userId: uuidv4(),
      fullname,
      created: new Date().getTime(),
      ...extraValues,
    };
    const model = { ...configTable, Item: item };
    return docClient.put(model);
  },

  scan() {
    let docClient = new AWS.DynamoDB.DocumentClient();
    return docClient.scan(configTable);
  },

  getOne(id) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    const model = {
      ...configTable,
      Key: { 'userId': id },
      ConditionExpression: 'userId = :val',
      ExpressionAttributeValues: { ':val': id.toString() },
    };
    return docClient.get(model);
  },

  update(user, id) {
    let expression = generateUpdate(user, id);
    let docClient = new AWS.DynamoDB.DocumentClient();
    const model = {
      ...configTable,
      Key: { 'userId': id },
      ...expression,
      ConditionExpression: 'userId = :val',
      ReturnValues: 'ALL_NEW',
    };
    return docClient.update(model);
  },

  delete(id) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    const model = {
      ...configTable,
      Key: { 'userId': id },
      ConditionExpression: 'userId = :val',
      ExpressionAttributeValues: { ':val': id.toString() },
    };
    return docClient.delete(model);
  },
};
