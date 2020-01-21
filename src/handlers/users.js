const assert = require('http-assert');
const dynamoDbSrv = require('../services/dynamoDBSrv');
const { setOffline } = require('../services/helper');
const { CORS_HEADERS } = require('../services/constant');
const { errorHandler } = require('../services/error');

const createUser = errorHandler(async event => {
  const { fullname, age } = JSON.parse(event.body);
  assert(fullname && age, 400, 'Missing either fields fullname or age');
  await dynamoDbSrv.put(JSON.parse(event.body)).promise();
  const result = dynamoDbSrv.put(JSON.parse(event.body)).params.Item;
  const body = JSON.stringify({ success: 'ok', created: result });
  return {
    statusCode: 201,
    headers: CORS_HEADERS,
    body: body,
  };
});

const getUsers = errorHandler(async () => {
  const data = await dynamoDbSrv.scan().promise();
  const { Items, Count, ScannedCount} = data;
  const body = JSON.stringify({ 
    success: 'ok', 
    items: Items,
    count: Count, 
    ScannedCount: ScannedCount,
  });
  return {
    statusCode: 200,
    body: body,
  };
});

const getOneUser = errorHandler(async event => {
  const id = event.pathParameters.userId;
  const data = await dynamoDbSrv.getOne(id).promise();
  const item = data.Item;
  assert(item, 404, 'User no found');
  const body = JSON.stringify({ success: 'ok', item });
  return {
    statusCode: 200,
    body: body,
  };
});

const updateUser = errorHandler(async event => {
  const id = event.pathParameters.userId;
  const result = await dynamoDbSrv.update(JSON.parse(event.body), id).promise();
  const body = JSON.stringify({ success: 'ok', updated: result });
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: body,
  };
});

const deleteUser = errorHandler(async event => {
  const id = event.pathParameters.userId;
  await dynamoDbSrv.delete(id).promise();
  const body = JSON.stringify({ success: 'ok' });
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: body,
  };
});

module.exports = {
  createUser: setOffline(createUser),
  getUsers: setOffline(getUsers),
  getOneUser: setOffline(getOneUser),
  updateUser: setOffline(updateUser),
  deleteUser: setOffline(deleteUser),
};
