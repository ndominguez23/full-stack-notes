const pg = require('pg');
const { Pool } = pg;

const uri = '';

const pool = new Pool({ connectionString: uri });

/**
 * even though queries must run sequentially on a client, they are still asynchronous
 * you should use promises, async/await or callbacks on these queries before calling client.release()
 * EG: client.query('create table if...').then(()=>client.release())
 * OR await client.query('create table if...'); client.release();
 * OR client.query('create table if...', (err, result) => {client.release()}) as ur last query
 */
const client = pool.connect();
client.query('create table if not exists users...');
client.query('create table if not exists ...')

// very important not to forget this step, as omitting it will cause you to not be able
// to connect to your db later on
client.release();

/**
 * Much better practice:
 */
// (async function() {
//   const client = await pool.connect()
//   await client.query('create table if not exists...')
//   client.release()
// })()

/**
 * The EASIEST way to interact with the pool is simply by querying it directly.
 * It will use the next available client to make queries. If you checkout a
 * client by calling pool.connect(), then you MUST ensure to release the client.
 * 
 * 
 * We force all queries to interact with this exported object to make debugging easier.
 * For example, if a query crashes our server or returns an error, we add a
 * console.log in this object and as a result, ALL of our queries will be logged
 * 
 * pg allows queries to be made as objects that look like this:
 * {
 *   text: 'insert into users(username, password) values ($1, $2)',
 *   values: ['student', 'ilovetesting'],
 * }
 * which IMO is better
 * 
 * All pg queries should be parameterized!
 * 
 * If absolutely necessary, you can add a connect method to this object that returns a
 * client.
 */
module.exports = {
  query: (queryObj) => pool.query(queryObj),
  // query: (queryObj) => {
  //   console.log('Last query text was: ', queryObj.text);
  //   console.log('Parameters were: ', queryObj.values);
  //   return pool.query(queryObj);
  // }
  // query: (text, params) => pool.query(text, params),
  // query: (text, params) => {
    //   console.log('Last query text was: ', text);
    //   console.log('Parameters were: ', params);
    //   return pool.query(text, params);
  // }
};
