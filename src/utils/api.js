import Promise from 'bluebird';
import HttpError from 'standard-http-error';
import {getConfiguration} from '../utils/configuration';
import EventEmitter from 'event-emitter';

const TIMEOUT = 6000;

export function xhrSentTopic(path) {
  return 'XHR-SENT-' + path;
}

export function xhrFinishedTopic(path) {
  return 'XHR-FINISHED-' + path;
}

/**
 * All HTTP errors are emitted on this channel for interested listeners
 */
export const errors = new EventEmitter();

/**
 * All HTTP XHR calls events will be emited on this channel for interested listeners
 */
export const xhrRequests = new EventEmitter();

/**
 * GET a path relative to API root url.
 * @param {String}  path Relative path to the configured API endpoint
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise} of response
 */
export async function get(path, suppressRedBox) {
  return request('get', path, null, suppressRedBox);
}

/**
 * POST JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response
 */
export async function post(path, body, suppressRedBox) {
  return request('post', path, body, suppressRedBox);
}

/**
 * PUT JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response
 */
export async function put(path, body, suppressRedBox) {
  return request('put', path, body, suppressRedBox);
}

/**
 * DELETE a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response
 */
export async function del(path, suppressRedBox) {
  return request('delete', path, null, suppressRedBox);
}

/**
 * Make arbitrary fetch request to a path relative to API root url
 * @param {String} method One of: get|post|put|delete
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning/error box is shown on failed request
 */
export async function request(method, path, body, suppressRedBox) {
  try {
    const response = await sendRequest(method, path, body, suppressRedBox);
    return handleResponse(path, response, method);
  }
  catch (error) {
    if (!suppressRedBox) {
      logError(error, url(path), method);
    }
    throw error;
  }
}

/**
 * Takes a relative path and makes it a full URL to API server
 */
export function url(path) {
  const apiRoot = getConfiguration('API_ROOT');
  return path.indexOf('/') === 0
      ? apiRoot + path
      : apiRoot + '/' + path;
}

/**
 * Constructs and fires a HTTP request
 */
async function sendRequest(method, path, body) {
  console.log(`Requesting ${method} - ${path}`);
  const endpoint = url(path);
  const headers = getRequestHeaders(body);
  const options = body
      ? {method, headers, body: JSON.stringify(body)}
      : {method, headers};

  xhrRequests.emit(xhrSentTopic(path), {path, method, body});

  return timeout(fetch(endpoint, options), TIMEOUT);
}

/**
 * Receives and reads a HTTP response
 */
async function handleResponse(path, response, method) {
  console.log(`Response ${response.status} - ${path}`);
  const status = response.status;

  // `fetch` promises resolve even if HTTP status indicates failure. Reroute
  // promise flow control to interpret error responses as failures
  if (status >= 400) {
    const message = await getErrorMessageSafely(response);
    const error = new HttpError(status, message);

    // emit events on error channel, one for status-specific errors and other for all errors
    const errorEventBody = {path, status, message: error.message};
    errors.emit(status.toString(), errorEventBody);
    errors.emit('*', errorEventBody, status);
    xhrRequests.emit(xhrFinishedTopic(path), errorEventBody);

    console.warn(`Request ${method} ${url(path)} - Status: ${status} - Error: ${JSON.stringify(errorEventBody)}`);

    return errorEventBody;
  }

  // parse response text
  const responseBody = await response.text();
  const result = {
    status: response.status,
    headers: response.headers,
    body: responseBody ? JSON.parse(responseBody) : null
  };

  xhrRequests.emit(xhrFinishedTopic(path), {path, status: result.status, body: result.body});

  return result;
}

function getRequestHeaders(body) {
  const headers = body
      ? {'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Origin': 'https://fusion-mobile.spac.com/',
         'X-Requested-With': 'fusion-mobile'
        } : {'Accept': 'application/json'};

  return headers;
}

// try to get the best possible error message out of a response
// without throwing errors while parsing
async function getErrorMessageSafely(response) {
  try {
    const body = await response.text();
    if (!body) {
      return '';
    }

    // Optimal case is JSON with a defined message property
    const payload = JSON.parse(body);
    if (payload && payload.message) {
      return payload.message;
    }

    // Should that fail, return the whole response body as text
    return body;

  } catch (e) {
    // Unreadable body, return whatever the server returned
    return response._bodyInit;
  }
}

/**
 * Rejects a promise after `ms` number of milliseconds, it is still pending
 */
function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise
        .then(response => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(reject);
  });
}

/**
 * Make best effort to turn a HTTP error or a runtime exception to meaningful error log message
 */
function logError(error, endpoint, method) {
  if (error.status) {
    const summary = `(${error.status} ${error.statusText}): ${error._bodyInit}`;
    console.error(`API request ${method.toUpperCase()} ${endpoint} responded with ${summary}`);
  }
  else {
    console.error(`API request ${method.toUpperCase()} ${endpoint} failed with message "${error.message}"`);
  }
}
