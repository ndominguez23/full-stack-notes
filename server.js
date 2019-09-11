const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookieparser');

// create the express application
const app = express();

// set up the bodyParser middleware for any request METHOD
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ================ ROUTE HANDLERS ==================
/* serve static files */
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, './client/index.html'))
})
/**
 * Q: what if we want to send many static files at once?
 * 
 * app.get('/', express.static('client'));
 */  


// ================= ERRORS AND 404 ===================

/**
 * global error handler
 * does not have a specified endpoint - it's used regardless of the endpoint
 * has 4 parameters => that's how express knows it's the global error handler
 * err is whatever gets passed into next()
 * 
 * The global error handler is meant to catch any errors thrown by async functions
 * and validators in your middleware. You need to manually pass in those
 * error objects into next() in order for them to get caught by the global error handler.
 */
app.use((err, req, res, next) => {
  // create a template for an error
  // this template gives us the leeway to only include those properties we want to
  // overwrite in our err object
  // we could even pass in an empty object to next({})!
  const defaultErr = {
    log: 'Uncaught server error',
    status: 400,
    message: {err: 'Unknown error occurred'}
  };
  // overwrite the default values with those of the err
  Object.assign(defaultErr, err)
  console.log(defaultErr.log);
  // since the message is an object, we want to send it as JSON
  return res.status(defaultErr.status).json(defaultErr.message);
})

// 404 handler
// does NOT catch errors
// if we don't have any custom 404 page or message, just send the status 404
app.use('*', (req, res) => res.sendStatus(404))

// start our server on port 3000
app.listen(3000, () => {
  console.log('Listening on port 3000');
})