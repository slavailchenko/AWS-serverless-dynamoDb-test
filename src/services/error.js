const { CORS_HEADERS } = require('./constant');

module.exports.errorHandler = handler => {
  return async (event, ...params) => {
    try {
      console.log('errorHandler works');
      return await handler(event, ...params);
    } catch (err) {
      let statusCode = err.status || 500;
      let message = err.message || 'Unknown error';
      const body = JSON.stringify({ success: 'fail', message: message, code: err.code });

      return {
        statusCode,
        headers: CORS_HEADERS,
        body: body, 
      };
    }
  };
};
