const AWS = require('aws-sdk');
const { optionsAWS } = require('../config');

const setOffline = handler => async (event, ...params) => {
  if (event.isOffline) {
    AWS.config.update(optionsAWS);
  }

  return await handler(event, ...params);
};

const checkOffline = handler => async (event, ...params) => {
  if (!event.isOffline) {
    return { statusCode: 401 };
  }

  return await handler(event, ...params);
};

const generateUpdate = (fields, id) => {
  const exp = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: { ':val': id.toString() },
  }
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  })
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
}


module.exports = {
  setOffline,
  checkOffline,
  generateUpdate,
};
