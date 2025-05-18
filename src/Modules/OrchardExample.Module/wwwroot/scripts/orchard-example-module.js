var OrchardExampleModule;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/AbortController.js":
/*!****************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/AbortController.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortController: () => (/* binding */ AbortController)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
// Not exported from index.
/** @private */
class AbortController {
    constructor() {
        this._isAborted = false;
        this.onabort = null;
    }
    abort() {
        if (!this._isAborted) {
            this._isAborted = true;
            if (this.onabort) {
                this.onabort();
            }
        }
    }
    get signal() {
        return this;
    }
    get aborted() {
        return this._isAborted;
    }
}
//# sourceMappingURL=AbortController.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js":
/*!**********************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessTokenHttpClient: () => (/* binding */ AccessTokenHttpClient)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HeaderNames */ "../../../node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class AccessTokenHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(innerClient, accessTokenFactory) {
        super();
        this._innerClient = innerClient;
        this._accessTokenFactory = accessTokenFactory;
    }
    async send(request) {
        let allowRetry = true;
        if (this._accessTokenFactory && (!this._accessToken || (request.url && request.url.indexOf("/negotiate?") > 0))) {
            // don't retry if the request is a negotiate or if we just got a potentially new token from the access token factory
            allowRetry = false;
            this._accessToken = await this._accessTokenFactory();
        }
        this._setAuthorizationHeader(request);
        const response = await this._innerClient.send(request);
        if (allowRetry && response.statusCode === 401 && this._accessTokenFactory) {
            this._accessToken = await this._accessTokenFactory();
            this._setAuthorizationHeader(request);
            return await this._innerClient.send(request);
        }
        return response;
    }
    _setAuthorizationHeader(request) {
        if (!request.headers) {
            request.headers = {};
        }
        if (this._accessToken) {
            request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization] = `Bearer ${this._accessToken}`;
        }
        // don't remove the header if there isn't an access token factory, the user manually added the header in this case
        else if (this._accessTokenFactory) {
            if (request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization]) {
                delete request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_1__.HeaderNames.Authorization];
            }
        }
    }
    getCookieString(url) {
        return this._innerClient.getCookieString(url);
    }
}
//# sourceMappingURL=AccessTokenHttpClient.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js":
/*!******************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultHttpClient: () => (/* binding */ DefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FetchHttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XhrHttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





/** Default implementation of {@link @microsoft/signalr.HttpClient}. */
class DefaultHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
    constructor(logger) {
        super();
        if (typeof fetch !== "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            this._httpClient = new _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__.FetchHttpClient(logger);
        }
        else if (typeof XMLHttpRequest !== "undefined") {
            this._httpClient = new _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__.XhrHttpClient(logger);
        }
        else {
            throw new Error("No usable HttpClient found.");
        }
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_4__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return this._httpClient.send(request);
    }
    getCookieString(url) {
        return this._httpClient.getCookieString(url);
    }
}
//# sourceMappingURL=DefaultHttpClient.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js":
/*!***********************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultReconnectPolicy: () => (/* binding */ DefaultReconnectPolicy)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// 0, 2, 10, 30 second delays before reconnect attempts.
const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
/** @private */
class DefaultReconnectPolicy {
    constructor(retryDelays) {
        this._retryDelays = retryDelays !== undefined ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
    }
    nextRetryDelayInMilliseconds(retryContext) {
        return this._retryDelays[retryContext.previousRetryCount];
    }
}
//# sourceMappingURL=DefaultReconnectPolicy.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js":
/*!*******************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/Errors.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   AggregateErrors: () => (/* binding */ AggregateErrors),
/* harmony export */   DisabledTransportError: () => (/* binding */ DisabledTransportError),
/* harmony export */   FailedToNegotiateWithServerError: () => (/* binding */ FailedToNegotiateWithServerError),
/* harmony export */   FailedToStartTransportError: () => (/* binding */ FailedToStartTransportError),
/* harmony export */   HttpError: () => (/* binding */ HttpError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   UnsupportedTransportError: () => (/* binding */ UnsupportedTransportError)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Error thrown when an HTTP request fails. */
class HttpError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
     *
     * @param {string} errorMessage A descriptive error message.
     * @param {number} statusCode The HTTP status code represented by this error.
     */
    constructor(errorMessage, statusCode) {
        const trueProto = new.target.prototype;
        super(`${errorMessage}: Status code '${statusCode}'`);
        this.statusCode = statusCode;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when a timeout elapses. */
class TimeoutError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "A timeout occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when an action is aborted. */
class AbortError extends Error {
    /** Constructs a new instance of {@link AbortError}.
     *
     * @param {string} errorMessage A descriptive error message.
     */
    constructor(errorMessage = "An abort occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is unsupported by the browser. */
/** @private */
class UnsupportedTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'UnsupportedTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport is disabled by the browser. */
/** @private */
class DisabledTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'DisabledTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the selected transport cannot be started. */
/** @private */
class FailedToStartTransportError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
     *
     * @param {string} message A descriptive error message.
     * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
     */
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'FailedToStartTransportError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when the negotiation with the server failed to complete. */
/** @private */
class FailedToNegotiateWithServerError extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
     *
     * @param {string} message A descriptive error message.
     */
    constructor(message) {
        const trueProto = new.target.prototype;
        super(message);
        this.errorType = 'FailedToNegotiateWithServerError';
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
/** Error thrown when multiple errors have occurred. */
/** @private */
class AggregateErrors extends Error {
    /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
     *
     * @param {string} message A descriptive error message.
     * @param {Error[]} innerErrors The collection of errors this error is aggregating.
     */
    constructor(message, innerErrors) {
        const trueProto = new.target.prototype;
        super(message);
        this.innerErrors = innerErrors;
        // Workaround issue in Typescript compiler
        // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
        this.__proto__ = trueProto;
    }
}
//# sourceMappingURL=Errors.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js":
/*!****************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FetchHttpClient: () => (/* binding */ FetchHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Errors */ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class FetchHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
        // Node added a fetch implementation to the global scope starting in v18.
        // We need to add a cookie jar in node to be able to share cookies with WebSocket
        if (typeof fetch === "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
            this._jar = new (requireFunc("tough-cookie")).CookieJar();
            if (typeof fetch === "undefined") {
                this._fetchType = requireFunc("node-fetch");
            }
            else {
                // Use fetch from Node if available
                this._fetchType = fetch;
            }
            // node-fetch doesn't have a nice API for getting and setting cookies
            // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
            this._fetchType = requireFunc("fetch-cookie")(this._fetchType, this._jar);
        }
        else {
            this._fetchType = fetch.bind((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)());
        }
        if (typeof AbortController === "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
            this._abortControllerType = requireFunc("abort-controller");
        }
        else {
            this._abortControllerType = AbortController;
        }
    }
    /** @inheritDoc */
    async send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
        }
        if (!request.method) {
            throw new Error("No method defined.");
        }
        if (!request.url) {
            throw new Error("No url defined.");
        }
        const abortController = new this._abortControllerType();
        let error;
        // Hook our abortSignal into the abort controller
        if (request.abortSignal) {
            request.abortSignal.onabort = () => {
                abortController.abort();
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.AbortError();
            };
        }
        // If a timeout has been passed in, setup a timeout to call abort
        // Type needs to be any to fit window.setTimeout and NodeJS.setTimeout
        let timeoutId = null;
        if (request.timeout) {
            const msTimeout = request.timeout;
            timeoutId = setTimeout(() => {
                abortController.abort();
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                error = new _Errors__WEBPACK_IMPORTED_MODULE_2__.TimeoutError();
            }, msTimeout);
        }
        if (request.content === "") {
            request.content = undefined;
        }
        if (request.content) {
            // Explicitly setting the Content-Type header for React Native on Android platform.
            request.headers = request.headers || {};
            if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(request.content)) {
                request.headers["Content-Type"] = "application/octet-stream";
            }
            else {
                request.headers["Content-Type"] = "text/plain;charset=UTF-8";
            }
        }
        let response;
        try {
            response = await this._fetchType(request.url, {
                body: request.content,
                cache: "no-cache",
                credentials: request.withCredentials === true ? "include" : "same-origin",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    ...request.headers,
                },
                method: request.method,
                mode: "cors",
                redirect: "follow",
                signal: abortController.signal,
            });
        }
        catch (e) {
            if (error) {
                throw error;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${e}.`);
            throw e;
        }
        finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = null;
            }
        }
        if (!response.ok) {
            const errorMessage = await deserializeContent(response, "text");
            throw new _Errors__WEBPACK_IMPORTED_MODULE_2__.HttpError(errorMessage || response.statusText, response.status);
        }
        const content = deserializeContent(response, request.responseType);
        const payload = await content;
        return new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(response.status, response.statusText, payload);
    }
    getCookieString(url) {
        let cookies = "";
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && this._jar) {
            // @ts-ignore: unused variable
            this._jar.getCookies(url, (e, c) => cookies = c.join("; "));
        }
        return cookies;
    }
}
function deserializeContent(response, responseType) {
    let content;
    switch (responseType) {
        case "arraybuffer":
            content = response.arrayBuffer();
            break;
        case "text":
            content = response.text();
            break;
        case "blob":
        case "document":
        case "json":
            throw new Error(`${responseType} is not supported.`);
        default:
            content = response.text();
            break;
    }
    return content;
}
//# sourceMappingURL=FetchHttpClient.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js":
/*!******************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandshakeProtocol: () => (/* binding */ HandshakeProtocol)
/* harmony export */ });
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextMessageFormat */ "../../../node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class HandshakeProtocol {
    // Handshake request is always JSON
    writeHandshakeRequest(handshakeRequest) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.write(JSON.stringify(handshakeRequest));
    }
    parseHandshakeResponse(data) {
        let messageData;
        let remainingData;
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(data)) {
            // Format is binary but still need to read JSON text from handshake response
            const binaryData = new Uint8Array(data);
            const separatorIndex = binaryData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparatorCode);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = String.fromCharCode.apply(null, Array.prototype.slice.call(binaryData.slice(0, responseLength)));
            remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
        }
        else {
            const textData = data;
            const separatorIndex = textData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparator);
            if (separatorIndex === -1) {
                throw new Error("Message is incomplete.");
            }
            // content before separator is handshake response
            // optional content after is additional messages
            const responseLength = separatorIndex + 1;
            messageData = textData.substring(0, responseLength);
            remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
        }
        // At this point we should have just the single handshake message
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.parse(messageData);
        const response = JSON.parse(messages[0]);
        if (response.type) {
            throw new Error("Expected a handshake response from the server.");
        }
        const responseMessage = response;
        // multiple messages could have arrived with handshake
        // return additional data to be parsed as usual, or null if all parsed
        return [remainingData, responseMessage];
    }
}
//# sourceMappingURL=HandshakeProtocol.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/HeaderNames.js":
/*!************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/HeaderNames.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderNames: () => (/* binding */ HeaderNames)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class HeaderNames {
}
HeaderNames.Authorization = "Authorization";
HeaderNames.Cookie = "Cookie";
//# sourceMappingURL=HeaderNames.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/HttpClient.js":
/*!***********************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/HttpClient.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpClient: () => (/* binding */ HttpClient),
/* harmony export */   HttpResponse: () => (/* binding */ HttpResponse)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Represents an HTTP response. */
class HttpResponse {
    constructor(statusCode, statusText, content) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.content = content;
    }
}
/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
class HttpClient {
    get(url, options) {
        return this.send({
            ...options,
            method: "GET",
            url,
        });
    }
    post(url, options) {
        return this.send({
            ...options,
            method: "POST",
            url,
        });
    }
    delete(url, options) {
        return this.send({
            ...options,
            method: "DELETE",
            url,
        });
    }
    /** Gets all cookies that apply to the specified URL.
     *
     * @param url The URL that the cookies are valid for.
     * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
     */
    // @ts-ignore
    getCookieString(url) {
        return "";
    }
}
//# sourceMappingURL=HttpClient.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/HttpConnection.js":
/*!***************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/HttpConnection.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpConnection: () => (/* binding */ HttpConnection),
/* harmony export */   TransportSendQueue: () => (/* binding */ TransportSendQueue)
/* harmony export */ });
/* harmony import */ var _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AccessTokenHttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js");
/* harmony import */ var _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultHttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Errors */ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ITransport */ "../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./LongPollingTransport */ "../../../node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js");
/* harmony import */ var _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ServerSentEventsTransport */ "../../../node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./WebSocketTransport */ "../../../node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.









const MAX_REDIRECTS = 100;
/** @private */
class HttpConnection {
    constructor(url, options = {}) {
        this._stopPromiseResolver = () => { };
        this.features = {};
        this._negotiateVersion = 1;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        this._logger = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.createLogger)(options.logger);
        this.baseUrl = this._resolveUrl(url);
        options = options || {};
        options.logMessageContent = options.logMessageContent === undefined ? false : options.logMessageContent;
        if (typeof options.withCredentials === "boolean" || options.withCredentials === undefined) {
            options.withCredentials = options.withCredentials === undefined ? true : options.withCredentials;
        }
        else {
            throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
        }
        options.timeout = options.timeout === undefined ? 100 * 1000 : options.timeout;
        let webSocketModule = null;
        let eventSourceModule = null;
        if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && "function" !== "undefined") {
            // In order to ignore the dynamic require in webpack builds we need to do this magic
            // @ts-ignore: TS doesn't know about these names
            const requireFunc =  true ? require : 0;
            webSocketModule = requireFunc("ws");
            eventSourceModule = requireFunc("eventsource");
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
            options.WebSocket = WebSocket;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.WebSocket) {
            if (webSocketModule) {
                options.WebSocket = webSocketModule;
            }
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
            options.EventSource = EventSource;
        }
        else if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode && !options.EventSource) {
            if (typeof eventSourceModule !== "undefined") {
                options.EventSource = eventSourceModule;
            }
        }
        this._httpClient = new _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_1__.AccessTokenHttpClient(options.httpClient || new _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_2__.DefaultHttpClient(this._logger), options.accessTokenFactory);
        this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        this._connectionStarted = false;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async start(transferFormat) {
        transferFormat = transferFormat || _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat.Binary;
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Starting connection with transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[transferFormat]}'.`);
        if (this._connectionState !== "Disconnected" /* ConnectionState.Disconnected */) {
            return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = "Connecting" /* ConnectionState.Connecting */;
        this._startInternalPromise = this._startInternal(transferFormat);
        await this._startInternalPromise;
        // The TypeScript compiler thinks that connectionState must be Connecting here. The TypeScript compiler is wrong.
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "Failed to start the HttpConnection before stop() was called.";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, message);
            // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
            await this._stopPromise;
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
        }
        else if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
            // stop() was called and transitioned the client into the Disconnecting state.
            const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, message);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
        }
        this._connectionStarted = true;
    }
    send(data) {
        if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
            return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
        }
        if (!this._sendQueue) {
            this._sendQueue = new TransportSendQueue(this.transport);
        }
        // Transport will not be null if state is connected
        return this._sendQueue.send(data);
    }
    async stop(error) {
        if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        this._connectionState = "Disconnecting" /* ConnectionState.Disconnecting */;
        this._stopPromise = new Promise((resolve) => {
            // Don't complete stop() until stopConnection() completes.
            this._stopPromiseResolver = resolve;
        });
        // stopInternal should never throw so just observe it.
        await this._stopInternal(error);
        await this._stopPromise;
    }
    async _stopInternal(error) {
        // Set error as soon as possible otherwise there is a race between
        // the transport closing and providing an error and the error from a close message
        // We would prefer the close message error.
        this._stopError = error;
        try {
            await this._startInternalPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
        // The transport's onclose will trigger stopConnection which will run our onclose event.
        // The transport should always be set if currently connected. If it wasn't set, it's likely because
        // stop was called during start() and start() failed.
        if (this.transport) {
            try {
                await this.transport.stop();
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
                this._stopConnection();
            }
            this.transport = undefined;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
        }
    }
    async _startInternal(transferFormat) {
        // Store the original base url and the access token factory since they may change
        // as part of negotiating
        let url = this.baseUrl;
        this._accessTokenFactory = this._options.accessTokenFactory;
        this._httpClient._accessTokenFactory = this._accessTokenFactory;
        try {
            if (this._options.skipNegotiation) {
                if (this._options.transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets) {
                    // No need to add a connection ID in this case
                    this.transport = this._constructTransport(_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets);
                    // We should just call connect directly in this case.
                    // No fallback or negotiate in this case.
                    await this._startTransport(url, transferFormat);
                }
                else {
                    throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                }
            }
            else {
                let negotiateResponse = null;
                let redirects = 0;
                do {
                    negotiateResponse = await this._getNegotiationResponse(url);
                    // the user tries to stop the connection when it is being started
                    if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */ || this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
                        throw new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The connection was stopped during negotiation.");
                    }
                    if (negotiateResponse.error) {
                        throw new Error(negotiateResponse.error);
                    }
                    if (negotiateResponse.ProtocolVersion) {
                        throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
                    }
                    if (negotiateResponse.url) {
                        url = negotiateResponse.url;
                    }
                    if (negotiateResponse.accessToken) {
                        // Replace the current access token factory with one that uses
                        // the returned access token
                        const accessToken = negotiateResponse.accessToken;
                        this._accessTokenFactory = () => accessToken;
                        // set the factory to undefined so the AccessTokenHttpClient won't retry with the same token, since we know it won't change until a connection restart
                        this._httpClient._accessToken = accessToken;
                        this._httpClient._accessTokenFactory = undefined;
                    }
                    redirects++;
                } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
                if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
                    throw new Error("Negotiate redirection limit exceeded.");
                }
                await this._createTransport(url, this._options.transport, negotiateResponse, transferFormat);
            }
            if (this.transport instanceof _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__.LongPollingTransport) {
                this.features.inherentKeepAlive = true;
            }
            if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
                // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
                // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "The HttpConnection connected successfully.");
                this._connectionState = "Connected" /* ConnectionState.Connected */;
            }
            // stop() is waiting on us via this.startInternalPromise so keep this.transport around so it can clean up.
            // This is the only case startInternal can exit in neither the connected nor disconnected state because stopConnection()
            // will transition to the disconnected state. start() will wait for the transition using the stopPromise.
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, "Failed to start the connection: " + e);
            this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
            this.transport = undefined;
            // if start fails, any active calls to stop assume that start will complete the stop promise
            this._stopPromiseResolver();
            return Promise.reject(e);
        }
    }
    async _getNegotiationResponse(url) {
        const headers = {};
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
        headers[name] = value;
        const negotiateUrl = this._resolveNegotiateUrl(url);
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
        try {
            const response = await this._httpClient.post(negotiateUrl, {
                content: "",
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            });
            if (response.statusCode !== 200) {
                return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
            }
            const negotiateResponse = JSON.parse(response.content);
            if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
                // Negotiate version 0 doesn't use connectionToken
                // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
                negotiateResponse.connectionToken = negotiateResponse.connectionId;
            }
            if (negotiateResponse.useStatefulReconnect && this._options._useStatefulReconnect !== true) {
                return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToNegotiateWithServerError("Client didn't negotiate Stateful Reconnect but the server did."));
            }
            return negotiateResponse;
        }
        catch (e) {
            let errorMessage = "Failed to complete negotiation with the server: " + e;
            if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_5__.HttpError) {
                if (e.statusCode === 404) {
                    errorMessage = errorMessage + " Either this is not a SignalR endpoint or there is a proxy blocking the connection.";
                }
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, errorMessage);
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToNegotiateWithServerError(errorMessage));
        }
    }
    _createConnectUrl(url, connectionToken) {
        if (!connectionToken) {
            return url;
        }
        return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
    }
    async _createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
        let connectUrl = this._createConnectUrl(url, negotiateResponse.connectionToken);
        if (this._isITransport(requestedTransport)) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
            this.transport = requestedTransport;
            await this._startTransport(connectUrl, requestedTransferFormat);
            this.connectionId = negotiateResponse.connectionId;
            return;
        }
        const transportExceptions = [];
        const transports = negotiateResponse.availableTransports || [];
        let negotiate = negotiateResponse;
        for (const endpoint of transports) {
            const transportOrError = this._resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, (negotiate === null || negotiate === void 0 ? void 0 : negotiate.useStatefulReconnect) === true);
            if (transportOrError instanceof Error) {
                // Store the error and continue, we don't want to cause a re-negotiate in these cases
                transportExceptions.push(`${endpoint.transport} failed:`);
                transportExceptions.push(transportOrError);
            }
            else if (this._isITransport(transportOrError)) {
                this.transport = transportOrError;
                if (!negotiate) {
                    try {
                        negotiate = await this._getNegotiationResponse(url);
                    }
                    catch (ex) {
                        return Promise.reject(ex);
                    }
                    connectUrl = this._createConnectUrl(url, negotiate.connectionToken);
                }
                try {
                    await this._startTransport(connectUrl, requestedTransferFormat);
                    this.connectionId = negotiate.connectionId;
                    return;
                }
                catch (ex) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
                    negotiate = undefined;
                    transportExceptions.push(new _Errors__WEBPACK_IMPORTED_MODULE_5__.FailedToStartTransportError(`${endpoint.transport} failed: ${ex}`, _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[endpoint.transport]));
                    if (this._connectionState !== "Connecting" /* ConnectionState.Connecting */) {
                        const message = "Failed to select transport before stop() was called.";
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, message);
                        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError(message));
                    }
                }
            }
        }
        if (transportExceptions.length > 0) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_5__.AggregateErrors(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`, transportExceptions));
        }
        return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
    }
    _constructTransport(transport) {
        switch (transport) {
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets:
                if (!this._options.WebSocket) {
                    throw new Error("'WebSocket' is not supported in your environment.");
                }
                return new _WebSocketTransport__WEBPACK_IMPORTED_MODULE_7__.WebSocketTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.ServerSentEvents:
                if (!this._options.EventSource) {
                    throw new Error("'EventSource' is not supported in your environment.");
                }
                return new _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_8__.ServerSentEventsTransport(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
            case _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.LongPolling:
                return new _LongPollingTransport__WEBPACK_IMPORTED_MODULE_6__.LongPollingTransport(this._httpClient, this._logger, this._options);
            default:
                throw new Error(`Unknown transport: ${transport}.`);
        }
    }
    _startTransport(url, transferFormat) {
        this.transport.onreceive = this.onreceive;
        if (this.features.reconnect) {
            this.transport.onclose = async (e) => {
                let callStop = false;
                if (this.features.reconnect) {
                    try {
                        this.features.disconnected();
                        await this.transport.connect(url, transferFormat);
                        await this.features.resend();
                    }
                    catch {
                        callStop = true;
                    }
                }
                else {
                    this._stopConnection(e);
                    return;
                }
                if (callStop) {
                    this._stopConnection(e);
                }
            };
        }
        else {
            this.transport.onclose = (e) => this._stopConnection(e);
        }
        return this.transport.connect(url, transferFormat);
    }
    _resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, useStatefulReconnect) {
        const transport = _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[endpoint.transport];
        if (transport === null || transport === undefined) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
            return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
        }
        else {
            if (transportMatches(requestedTransport, transport)) {
                const transferFormats = endpoint.transferFormats.map((s) => _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[s]);
                if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                    if ((transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets && !this._options.WebSocket) ||
                        (transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.ServerSentEvents && !this._options.EventSource)) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it is not supported in your environment.'`);
                        return new _Errors__WEBPACK_IMPORTED_MODULE_5__.UnsupportedTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' is not supported in your environment.`, transport);
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Selecting transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}'.`);
                        try {
                            this.features.reconnect = transport === _ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType.WebSockets ? useStatefulReconnect : undefined;
                            return this._constructTransport(transport);
                        }
                        catch (ex) {
                            return ex;
                        }
                    }
                }
                else {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it does not support the requested transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[requestedTransferFormat]}'.`);
                    return new Error(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' does not support ${_ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat[requestedTransferFormat]}.`);
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' because it was disabled by the client.`);
                return new _Errors__WEBPACK_IMPORTED_MODULE_5__.DisabledTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_3__.HttpTransportType[transport]}' is disabled by the client.`, transport);
            }
        }
    }
    _isITransport(transport) {
        return transport && typeof (transport) === "object" && "connect" in transport;
    }
    _stopConnection(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this._connectionState}.`);
        this.transport = undefined;
        // If we have a stopError, it takes precedence over the error from the transport
        error = this._stopError || error;
        this._stopError = undefined;
        if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
            return;
        }
        if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
            throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
        }
        if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
            // A call to stop() induced this call to stopConnection and needs to be completed.
            // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
            this._stopPromiseResolver();
        }
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `Connection disconnected with error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Connection disconnected.");
        }
        if (this._sendQueue) {
            this._sendQueue.stop().catch((e) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
            });
            this._sendQueue = undefined;
        }
        this.connectionId = undefined;
        this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        if (this._connectionStarted) {
            this._connectionStarted = false;
            try {
                if (this.onclose) {
                    this.onclose(error);
                }
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
            }
        }
    }
    _resolveUrl(url) {
        // startsWith is not supported in IE
        if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
            return url;
        }
        if (!_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser) {
            throw new Error(`Cannot resolve '${url}'.`);
        }
        // Setting the url to the href propery of an anchor tag handles normalization
        // for us. There are 3 main cases.
        // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
        // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
        // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
        const aTag = window.document.createElement("a");
        aTag.href = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
        return aTag.href;
    }
    _resolveNegotiateUrl(url) {
        const negotiateUrl = new URL(url);
        if (negotiateUrl.pathname.endsWith('/')) {
            negotiateUrl.pathname += "negotiate";
        }
        else {
            negotiateUrl.pathname += "/negotiate";
        }
        const searchParams = new URLSearchParams(negotiateUrl.searchParams);
        if (!searchParams.has("negotiateVersion")) {
            searchParams.append("negotiateVersion", this._negotiateVersion.toString());
        }
        if (searchParams.has("useStatefulReconnect")) {
            if (searchParams.get("useStatefulReconnect") === "true") {
                this._options._useStatefulReconnect = true;
            }
        }
        else if (this._options._useStatefulReconnect === true) {
            searchParams.append("useStatefulReconnect", "true");
        }
        negotiateUrl.search = searchParams.toString();
        return negotiateUrl.toString();
    }
}
function transportMatches(requestedTransport, actualTransport) {
    return !requestedTransport || ((actualTransport & requestedTransport) !== 0);
}
/** @private */
class TransportSendQueue {
    constructor(_transport) {
        this._transport = _transport;
        this._buffer = [];
        this._executing = true;
        this._sendBufferedData = new PromiseSource();
        this._transportResult = new PromiseSource();
        this._sendLoopPromise = this._sendLoop();
    }
    send(data) {
        this._bufferData(data);
        if (!this._transportResult) {
            this._transportResult = new PromiseSource();
        }
        return this._transportResult.promise;
    }
    stop() {
        this._executing = false;
        this._sendBufferedData.resolve();
        return this._sendLoopPromise;
    }
    _bufferData(data) {
        if (this._buffer.length && typeof (this._buffer[0]) !== typeof (data)) {
            throw new Error(`Expected data to be of type ${typeof (this._buffer)} but was of type ${typeof (data)}`);
        }
        this._buffer.push(data);
        this._sendBufferedData.resolve();
    }
    async _sendLoop() {
        while (true) {
            await this._sendBufferedData.promise;
            if (!this._executing) {
                if (this._transportResult) {
                    this._transportResult.reject("Connection stopped.");
                }
                break;
            }
            this._sendBufferedData = new PromiseSource();
            const transportResult = this._transportResult;
            this._transportResult = undefined;
            const data = typeof (this._buffer[0]) === "string" ?
                this._buffer.join("") :
                TransportSendQueue._concatBuffers(this._buffer);
            this._buffer.length = 0;
            try {
                await this._transport.send(data);
                transportResult.resolve();
            }
            catch (error) {
                transportResult.reject(error);
            }
        }
    }
    static _concatBuffers(arrayBuffers) {
        const totalLength = arrayBuffers.map((b) => b.byteLength).reduce((a, b) => a + b);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const item of arrayBuffers) {
            result.set(new Uint8Array(item), offset);
            offset += item.byteLength;
        }
        return result.buffer;
    }
}
class PromiseSource {
    constructor() {
        this.promise = new Promise((resolve, reject) => [this._resolver, this._rejecter] = [resolve, reject]);
    }
    resolve() {
        this._resolver();
    }
    reject(reason) {
        this._rejecter(reason);
    }
}
//# sourceMappingURL=HttpConnection.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/HubConnection.js":
/*!**************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/HubConnection.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnection: () => (/* binding */ HubConnection),
/* harmony export */   HubConnectionState: () => (/* binding */ HubConnectionState)
/* harmony export */ });
/* harmony import */ var _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HandshakeProtocol */ "../../../node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Errors */ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ "../../../node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Subject */ "../../../node_modules/@microsoft/signalr/dist/esm/Subject.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
/* harmony import */ var _MessageBuffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MessageBuffer */ "../../../node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
const DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE = 100000;
/** Describes the current state of the {@link HubConnection} to the server. */
var HubConnectionState;
(function (HubConnectionState) {
    /** The hub connection is disconnected. */
    HubConnectionState["Disconnected"] = "Disconnected";
    /** The hub connection is connecting. */
    HubConnectionState["Connecting"] = "Connecting";
    /** The hub connection is connected. */
    HubConnectionState["Connected"] = "Connected";
    /** The hub connection is disconnecting. */
    HubConnectionState["Disconnecting"] = "Disconnecting";
    /** The hub connection is reconnecting. */
    HubConnectionState["Reconnecting"] = "Reconnecting";
})(HubConnectionState || (HubConnectionState = {}));
/** Represents a connection to a SignalR Hub. */
class HubConnection {
    /** @internal */
    // Using a public static factory method means we can have a private constructor and an _internal_
    // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
    // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
    // public parameter-less constructor.
    static create(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
        return new HubConnection(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize);
    }
    constructor(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
        this._nextKeepAlive = 0;
        this._freezeEventListener = () => {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
        };
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(connection, "connection");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logger, "logger");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds !== null && serverTimeoutInMilliseconds !== void 0 ? serverTimeoutInMilliseconds : DEFAULT_TIMEOUT_IN_MS;
        this.keepAliveIntervalInMilliseconds = keepAliveIntervalInMilliseconds !== null && keepAliveIntervalInMilliseconds !== void 0 ? keepAliveIntervalInMilliseconds : DEFAULT_PING_INTERVAL_IN_MS;
        this._statefulReconnectBufferSize = statefulReconnectBufferSize !== null && statefulReconnectBufferSize !== void 0 ? statefulReconnectBufferSize : DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE;
        this._logger = logger;
        this._protocol = protocol;
        this.connection = connection;
        this._reconnectPolicy = reconnectPolicy;
        this._handshakeProtocol = new _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_2__.HandshakeProtocol();
        this.connection.onreceive = (data) => this._processIncomingData(data);
        this.connection.onclose = (error) => this._connectionClosed(error);
        this._callbacks = {};
        this._methods = {};
        this._closedCallbacks = [];
        this._reconnectingCallbacks = [];
        this._reconnectedCallbacks = [];
        this._invocationId = 0;
        this._receivedHandshakeResponse = false;
        this._connectionState = HubConnectionState.Disconnected;
        this._connectionStarted = false;
        this._cachedPingMessage = this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping });
    }
    /** Indicates the state of the {@link HubConnection} to the server. */
    get state() {
        return this._connectionState;
    }
    /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
     *  in the disconnected state or if the negotiation step was skipped.
     */
    get connectionId() {
        return this.connection ? (this.connection.connectionId || null) : null;
    }
    /** Indicates the url of the {@link HubConnection} to the server. */
    get baseUrl() {
        return this.connection.baseUrl || "";
    }
    /**
     * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
     * Reconnecting states.
     * @param {string} url The url to connect to.
     */
    set baseUrl(url) {
        if (this._connectionState !== HubConnectionState.Disconnected && this._connectionState !== HubConnectionState.Reconnecting) {
            throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
        }
        if (!url) {
            throw new Error("The HubConnection url must be a valid url.");
        }
        this.connection.baseUrl = url;
    }
    /** Starts the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
     */
    start() {
        this._startPromise = this._startWithStateTransitions();
        return this._startPromise;
    }
    async _startWithStateTransitions() {
        if (this._connectionState !== HubConnectionState.Disconnected) {
            return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
        }
        this._connectionState = HubConnectionState.Connecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Starting HubConnection.");
        try {
            await this._startInternal();
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                // Log when the browser freezes the tab so users know why their connection unexpectedly stopped working
                window.document.addEventListener("freeze", this._freezeEventListener);
            }
            this._connectionState = HubConnectionState.Connected;
            this._connectionStarted = true;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "HubConnection connected successfully.");
        }
        catch (e) {
            this._connectionState = HubConnectionState.Disconnected;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
            return Promise.reject(e);
        }
    }
    async _startInternal() {
        this._stopDuringStartError = undefined;
        this._receivedHandshakeResponse = false;
        // Set up the promise before any connection is (re)started otherwise it could race with received messages
        const handshakePromise = new Promise((resolve, reject) => {
            this._handshakeResolver = resolve;
            this._handshakeRejecter = reject;
        });
        await this.connection.start(this._protocol.transferFormat);
        try {
            let version = this._protocol.version;
            if (!this.connection.features.reconnect) {
                // Stateful Reconnect starts with HubProtocol version 2, newer clients connecting to older servers will fail to connect due to
                // the handshake only supporting version 1, so we will try to send version 1 during the handshake to keep old servers working.
                version = 1;
            }
            const handshakeRequest = {
                protocol: this._protocol.name,
                version,
            };
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Sending handshake request.");
            await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(handshakeRequest));
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Using HubProtocol '${this._protocol.name}'.`);
            // defensively cleanup timeout in case we receive a message from the server before we finish start
            this._cleanupTimeout();
            this._resetTimeoutPeriod();
            this._resetKeepAliveInterval();
            await handshakePromise;
            // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
            // being rejected on close, because this continuation can run after both the handshake completed successfully
            // and the connection was closed.
            if (this._stopDuringStartError) {
                // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                // will cause the calling continuation to get scheduled to run later.
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw this._stopDuringStartError;
            }
            const useStatefulReconnect = this.connection.features.reconnect || false;
            if (useStatefulReconnect) {
                this._messageBuffer = new _MessageBuffer__WEBPACK_IMPORTED_MODULE_4__.MessageBuffer(this._protocol, this.connection, this._statefulReconnectBufferSize);
                this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer);
                this.connection.features.resend = () => {
                    if (this._messageBuffer) {
                        return this._messageBuffer._resend();
                    }
                };
            }
            if (!this.connection.features.inherentKeepAlive) {
                await this._sendMessage(this._cachedPingMessage);
            }
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
            this._cleanupTimeout();
            this._cleanupPingTimer();
            // HttpConnection.stop() should not complete until after the onclose callback is invoked.
            // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
            await this.connection.stop(e);
            throw e;
        }
    }
    /** Stops the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
     */
    async stop() {
        // Capture the start promise before the connection might be restarted in an onclose callback.
        const startPromise = this._startPromise;
        this.connection.features.reconnect = false;
        this._stopPromise = this._stopInternal();
        await this._stopPromise;
        try {
            // Awaiting undefined continues immediately
            await startPromise;
        }
        catch (e) {
            // This exception is returned to the user as a rejected Promise from the start method.
        }
    }
    _stopInternal(error) {
        if (this._connectionState === HubConnectionState.Disconnected) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
            return Promise.resolve();
        }
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
            return this._stopPromise;
        }
        const state = this._connectionState;
        this._connectionState = HubConnectionState.Disconnecting;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Stopping HubConnection.");
        if (this._reconnectDelayHandle) {
            // We're in a reconnect delay which means the underlying connection is currently already stopped.
            // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
            // fire the onclose callbacks.
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
            clearTimeout(this._reconnectDelayHandle);
            this._reconnectDelayHandle = undefined;
            this._completeClose();
            return Promise.resolve();
        }
        if (state === HubConnectionState.Connected) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._sendCloseMessage();
        }
        this._cleanupTimeout();
        this._cleanupPingTimer();
        this._stopDuringStartError = error || new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The connection was stopped before the hub handshake could complete.");
        // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
        // or the onclose callback is invoked. The onclose callback will transition the HubConnection
        // to the disconnected state if need be before HttpConnection.stop() completes.
        return this.connection.stop(error);
    }
    async _sendCloseMessage() {
        try {
            await this._sendWithProtocol(this._createCloseMessage());
        }
        catch {
            // Ignore, this is a best effort attempt to let the server know the client closed gracefully.
        }
    }
    /** Invokes a streaming hub method on the server using the specified name and arguments.
     *
     * @typeparam T The type of the items returned by the server.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
     */
    stream(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createStreamInvocation(methodName, args, streamIds);
        // eslint-disable-next-line prefer-const
        let promiseQueue;
        const subject = new _Subject__WEBPACK_IMPORTED_MODULE_6__.Subject();
        subject.cancelCallback = () => {
            const cancelInvocation = this._createCancelInvocation(invocationDescriptor.invocationId);
            delete this._callbacks[invocationDescriptor.invocationId];
            return promiseQueue.then(() => {
                return this._sendWithProtocol(cancelInvocation);
            });
        };
        this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
            if (error) {
                subject.error(error);
                return;
            }
            else if (invocationEvent) {
                // invocationEvent will not be null when an error is not passed to the callback
                if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                    if (invocationEvent.error) {
                        subject.error(new Error(invocationEvent.error));
                    }
                    else {
                        subject.complete();
                    }
                }
                else {
                    subject.next((invocationEvent.item));
                }
            }
        };
        promiseQueue = this._sendWithProtocol(invocationDescriptor)
            .catch((e) => {
            subject.error(e);
            delete this._callbacks[invocationDescriptor.invocationId];
        });
        this._launchStreams(streams, promiseQueue);
        return subject;
    }
    _sendMessage(message) {
        this._resetKeepAliveInterval();
        return this.connection.send(message);
    }
    /**
     * Sends a js object to the server.
     * @param message The js object to serialize and send.
     */
    _sendWithProtocol(message) {
        if (this._messageBuffer) {
            return this._messageBuffer._send(message);
        }
        else {
            return this._sendMessage(this._protocol.writeMessage(message));
        }
    }
    /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
     *
     * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
     * be processing the invocation.
     *
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
     */
    send(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const sendPromise = this._sendWithProtocol(this._createInvocation(methodName, args, true, streamIds));
        this._launchStreams(streams, sendPromise);
        return sendPromise;
    }
    /** Invokes a hub method on the server using the specified name and arguments.
     *
     * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
     * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
     * resolving the Promise.
     *
     * @typeparam T The expected return type.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
     */
    invoke(methodName, ...args) {
        const [streams, streamIds] = this._replaceStreamingParams(args);
        const invocationDescriptor = this._createInvocation(methodName, args, false, streamIds);
        const p = new Promise((resolve, reject) => {
            // invocationId will always have a value for a non-blocking invocation
            this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if (invocationEvent) {
                    // invocationEvent will not be null when an error is not passed to the callback
                    if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                        if (invocationEvent.error) {
                            reject(new Error(invocationEvent.error));
                        }
                        else {
                            resolve(invocationEvent.result);
                        }
                    }
                    else {
                        reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
                    }
                }
            };
            const promiseQueue = this._sendWithProtocol(invocationDescriptor)
                .catch((e) => {
                reject(e);
                // invocationId will always have a value for a non-blocking invocation
                delete this._callbacks[invocationDescriptor.invocationId];
            });
            this._launchStreams(streams, promiseQueue);
        });
        return p;
    }
    on(methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }
        methodName = methodName.toLowerCase();
        if (!this._methods[methodName]) {
            this._methods[methodName] = [];
        }
        // Preventing adding the same handler multiple times.
        if (this._methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }
        this._methods[methodName].push(newMethod);
    }
    off(methodName, method) {
        if (!methodName) {
            return;
        }
        methodName = methodName.toLowerCase();
        const handlers = this._methods[methodName];
        if (!handlers) {
            return;
        }
        if (method) {
            const removeIdx = handlers.indexOf(method);
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);
                if (handlers.length === 0) {
                    delete this._methods[methodName];
                }
            }
        }
        else {
            delete this._methods[methodName];
        }
    }
    /** Registers a handler that will be invoked when the connection is closed.
     *
     * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
     */
    onclose(callback) {
        if (callback) {
            this._closedCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection starts reconnecting.
     *
     * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
     */
    onreconnecting(callback) {
        if (callback) {
            this._reconnectingCallbacks.push(callback);
        }
    }
    /** Registers a handler that will be invoked when the connection successfully reconnects.
     *
     * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
     */
    onreconnected(callback) {
        if (callback) {
            this._reconnectedCallbacks.push(callback);
        }
    }
    _processIncomingData(data) {
        this._cleanupTimeout();
        if (!this._receivedHandshakeResponse) {
            data = this._processHandshakeResponse(data);
            this._receivedHandshakeResponse = true;
        }
        // Data may have all been read when processing handshake response
        if (data) {
            // Parse the messages
            const messages = this._protocol.parseMessages(data, this._logger);
            for (const message of messages) {
                if (this._messageBuffer && !this._messageBuffer._shouldProcessMessage(message)) {
                    // Don't process the message, we are either waiting for a SequenceMessage or received a duplicate message
                    continue;
                }
                switch (message.type) {
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                        this._invokeClientMethod(message)
                            .catch((e) => {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Invoke client method threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                        });
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion: {
                        const callback = this._callbacks[message.invocationId];
                        if (callback) {
                            if (message.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion) {
                                delete this._callbacks[message.invocationId];
                            }
                            try {
                                callback(message);
                            }
                            catch (e) {
                                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream callback threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
                            }
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                        // Don't care about pings
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close: {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Close message received from server.");
                        const error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
                        if (message.allowReconnect === true) {
                            // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                            // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            this.connection.stop(error);
                        }
                        else {
                            // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                            this._stopPromise = this._stopInternal(error);
                        }
                        break;
                    }
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
                        if (this._messageBuffer) {
                            this._messageBuffer._ack(message);
                        }
                        break;
                    case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
                        if (this._messageBuffer) {
                            this._messageBuffer._resetSequence(message);
                        }
                        break;
                    default:
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `Invalid message type: ${message.type}.`);
                        break;
                }
            }
        }
        this._resetTimeoutPeriod();
    }
    _processHandshakeResponse(data) {
        let responseMessage;
        let remainingData;
        try {
            [remainingData, responseMessage] = this._handshakeProtocol.parseHandshakeResponse(data);
        }
        catch (e) {
            const message = "Error parsing handshake response: " + e;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        if (responseMessage.error) {
            const message = "Server returned handshake error: " + responseMessage.error;
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, message);
            const error = new Error(message);
            this._handshakeRejecter(error);
            throw error;
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Server handshake complete.");
        }
        this._handshakeResolver();
        return remainingData;
    }
    _resetKeepAliveInterval() {
        if (this.connection.features.inherentKeepAlive) {
            return;
        }
        // Set the time we want the next keep alive to be sent
        // Timer will be setup on next message receive
        this._nextKeepAlive = new Date().getTime() + this.keepAliveIntervalInMilliseconds;
        this._cleanupPingTimer();
    }
    _resetTimeoutPeriod() {
        if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
            // Set the timeout timer
            this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
            // Set keepAlive timer if there isn't one
            if (this._pingServerHandle === undefined) {
                let nextPing = this._nextKeepAlive - new Date().getTime();
                if (nextPing < 0) {
                    nextPing = 0;
                }
                // The timer needs to be set from a networking callback to avoid Chrome timer throttling from causing timers to run once a minute
                this._pingServerHandle = setTimeout(async () => {
                    if (this._connectionState === HubConnectionState.Connected) {
                        try {
                            await this._sendMessage(this._cachedPingMessage);
                        }
                        catch {
                            // We don't care about the error. It should be seen elsewhere in the client.
                            // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                            this._cleanupPingTimer();
                        }
                    }
                }, nextPing);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    serverTimeout() {
        // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
        // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
    }
    async _invokeClientMethod(invocationMessage) {
        const methodName = invocationMessage.target.toLowerCase();
        const methods = this._methods[methodName];
        if (!methods) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No client method with the name '${methodName}' found.`);
            // No handlers provided by client but the server is expecting a response still, so we send an error
            if (invocationMessage.invocationId) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
                await this._sendWithProtocol(this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null));
            }
            return;
        }
        // Avoid issues with handlers removing themselves thus modifying the list while iterating through it
        const methodsCopy = methods.slice();
        // Server expects a response
        const expectsResponse = invocationMessage.invocationId ? true : false;
        // We preserve the last result or exception but still call all handlers
        let res;
        let exception;
        let completionMessage;
        for (const m of methodsCopy) {
            try {
                const prevRes = res;
                res = await m.apply(this, invocationMessage.arguments);
                if (expectsResponse && res && prevRes) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Multiple results provided for '${methodName}'. Sending error to server.`);
                    completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `Client provided multiple results.`, null);
                }
                // Ignore exception if we got a result after, the exception will be logged
                exception = undefined;
            }
            catch (e) {
                exception = e;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `A callback for the method '${methodName}' threw error '${e}'.`);
            }
        }
        if (completionMessage) {
            await this._sendWithProtocol(completionMessage);
        }
        else if (expectsResponse) {
            // If there is an exception that means either no result was given or a handler after a result threw
            if (exception) {
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `${exception}`, null);
            }
            else if (res !== undefined) {
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, null, res);
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
                // Client didn't provide a result or throw from a handler, server expects a response so we send an error
                completionMessage = this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null);
            }
            await this._sendWithProtocol(completionMessage);
        }
        else {
            if (res) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Result given for '${methodName}' method but server is not expecting a result.`);
            }
        }
    }
    _connectionClosed(error) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this._connectionState}.`);
        // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
        this._stopDuringStartError = this._stopDuringStartError || error || new _Errors__WEBPACK_IMPORTED_MODULE_5__.AbortError("The underlying connection was closed before the hub handshake could complete.");
        // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
        // If it has already completed, this should just noop.
        if (this._handshakeResolver) {
            this._handshakeResolver();
        }
        this._cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
        this._cleanupTimeout();
        this._cleanupPingTimer();
        if (this._connectionState === HubConnectionState.Disconnecting) {
            this._completeClose(error);
        }
        else if (this._connectionState === HubConnectionState.Connected && this._reconnectPolicy) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._reconnect(error);
        }
        else if (this._connectionState === HubConnectionState.Connected) {
            this._completeClose(error);
        }
        // If none of the above if conditions were true were called the HubConnection must be in either:
        // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
        // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
        //    and potentially continue the reconnect() loop.
        // 3. The Disconnected state in which case we're already done.
    }
    _completeClose(error) {
        if (this._connectionStarted) {
            this._connectionState = HubConnectionState.Disconnected;
            this._connectionStarted = false;
            if (this._messageBuffer) {
                this._messageBuffer._dispose(error !== null && error !== void 0 ? error : new Error("Connection closed."));
                this._messageBuffer = undefined;
            }
            if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
                window.document.removeEventListener("freeze", this._freezeEventListener);
            }
            try {
                this._closedCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
            }
        }
    }
    async _reconnect(error) {
        const reconnectStartTime = Date.now();
        let previousReconnectAttempts = 0;
        let retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
        let nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
        if (nextRetryDelay === null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
            this._completeClose(error);
            return;
        }
        this._connectionState = HubConnectionState.Reconnecting;
        if (error) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
        }
        else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "Connection reconnecting.");
        }
        if (this._reconnectingCallbacks.length !== 0) {
            try {
                this._reconnectingCallbacks.forEach((c) => c.apply(this, [error]));
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
            }
            // Exit early if an onreconnecting callback called connection.stop().
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                return;
            }
        }
        while (nextRetryDelay !== null) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts} will start in ${nextRetryDelay} ms.`);
            await new Promise((resolve) => {
                this._reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
            });
            this._reconnectDelayHandle = undefined;
            if (this._connectionState !== HubConnectionState.Reconnecting) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                return;
            }
            try {
                await this._startInternal();
                this._connectionState = HubConnectionState.Connected;
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, "HubConnection reconnected successfully.");
                if (this._reconnectedCallbacks.length !== 0) {
                    try {
                        this._reconnectedCallbacks.forEach((c) => c.apply(this, [this.connection.connectionId]));
                    }
                    catch (e) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
                    }
                }
                return;
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
                if (this._connectionState !== HubConnectionState.Reconnecting) {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`);
                    // The TypeScript compiler thinks that connectionState must be Connected here. The TypeScript compiler is wrong.
                    if (this._connectionState === HubConnectionState.Disconnecting) {
                        this._completeClose();
                    }
                    return;
                }
                retryError = e instanceof Error ? e : new Error(e.toString());
                nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
            }
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
        this._completeClose();
    }
    _getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
        try {
            return this._reconnectPolicy.nextRetryDelayInMilliseconds({
                elapsedMilliseconds,
                previousRetryCount,
                retryReason,
            });
        }
        catch (e) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
            return null;
        }
    }
    _cancelCallbacksWithError(error) {
        const callbacks = this._callbacks;
        this._callbacks = {};
        Object.keys(callbacks)
            .forEach((key) => {
            const callback = callbacks[key];
            try {
                callback(null, error);
            }
            catch (e) {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error, `Stream 'error' callback called with '${error}' threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getErrorString)(e)}`);
            }
        });
    }
    _cleanupPingTimer() {
        if (this._pingServerHandle) {
            clearTimeout(this._pingServerHandle);
            this._pingServerHandle = undefined;
        }
    }
    _cleanupTimeout() {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
        }
    }
    _createInvocation(methodName, args, nonblocking, streamIds) {
        if (nonblocking) {
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
        else {
            const invocationId = this._invocationId;
            this._invocationId++;
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    streamIds,
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
            else {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    target: methodName,
                    type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation,
                };
            }
        }
    }
    _launchStreams(streams, promiseQueue) {
        if (streams.length === 0) {
            return;
        }
        // Synchronize stream data so they arrive in-order on the server
        if (!promiseQueue) {
            promiseQueue = Promise.resolve();
        }
        // We want to iterate over the keys, since the keys are the stream ids
        // eslint-disable-next-line guard-for-in
        for (const streamId in streams) {
            streams[streamId].subscribe({
                complete: () => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId)));
                },
                error: (err) => {
                    let message;
                    if (err instanceof Error) {
                        message = err.message;
                    }
                    else if (err && err.toString) {
                        message = err.toString();
                    }
                    else {
                        message = "Unknown error";
                    }
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId, message)));
                },
                next: (item) => {
                    promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createStreamItemMessage(streamId, item)));
                },
            });
        }
    }
    _replaceStreamingParams(args) {
        const streams = [];
        const streamIds = [];
        for (let i = 0; i < args.length; i++) {
            const argument = args[i];
            if (this._isObservable(argument)) {
                const streamId = this._invocationId;
                this._invocationId++;
                // Store the stream for later use
                streams[streamId] = argument;
                streamIds.push(streamId.toString());
                // remove stream from args
                args.splice(i, 1);
            }
        }
        return [streams, streamIds];
    }
    _isObservable(arg) {
        // This allows other stream implementations to just work (like rxjs)
        return arg && arg.subscribe && typeof arg.subscribe === "function";
    }
    _createStreamInvocation(methodName, args, streamIds) {
        const invocationId = this._invocationId;
        this._invocationId++;
        if (streamIds.length !== 0) {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                streamIds,
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
        else {
            return {
                arguments: args,
                invocationId: invocationId.toString(),
                target: methodName,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamInvocation,
            };
        }
    }
    _createCancelInvocation(id) {
        return {
            invocationId: id,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.CancelInvocation,
        };
    }
    _createStreamItemMessage(id, item) {
        return {
            invocationId: id,
            item,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem,
        };
    }
    _createCompletionMessage(id, error, result) {
        if (error) {
            return {
                error,
                invocationId: id,
                type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
            };
        }
        return {
            invocationId: id,
            result,
            type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion,
        };
    }
    _createCloseMessage() {
        return { type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close };
    }
}
//# sourceMappingURL=HubConnection.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js":
/*!*********************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnectionBuilder: () => (/* binding */ HubConnectionBuilder)
/* harmony export */ });
/* harmony import */ var _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultReconnectPolicy */ "../../../node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js");
/* harmony import */ var _HttpConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HttpConnection */ "../../../node_modules/@microsoft/signalr/dist/esm/HttpConnection.js");
/* harmony import */ var _HubConnection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HubConnection */ "../../../node_modules/@microsoft/signalr/dist/esm/HubConnection.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./JsonHubProtocol */ "../../../node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Loggers */ "../../../node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const LogLevelNameMapping = {
    trace: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace,
    debug: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug,
    info: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    information: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
    warn: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    warning: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
    error: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error,
    critical: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical,
    none: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.None,
};
function parseLogLevel(name) {
    // Case-insensitive matching via lower-casing
    // Yes, I know case-folding is a complicated problem in Unicode, but we only support
    // the ASCII strings defined in LogLevelNameMapping anyway, so it's fine -anurse.
    const mapping = LogLevelNameMapping[name.toLowerCase()];
    if (typeof mapping !== "undefined") {
        return mapping;
    }
    else {
        throw new Error(`Unknown log level: ${name}`);
    }
}
/** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
class HubConnectionBuilder {
    configureLogging(logging) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logging, "logging");
        if (isLogger(logging)) {
            this.logger = logging;
        }
        else if (typeof logging === "string") {
            const logLevel = parseLogLevel(logging);
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logLevel);
        }
        else {
            this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logging);
        }
        return this;
    }
    withUrl(url, transportTypeOrOptions) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isNotEmpty(url, "url");
        this.url = url;
        // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
        // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
        if (typeof transportTypeOrOptions === "object") {
            this.httpConnectionOptions = { ...this.httpConnectionOptions, ...transportTypeOrOptions };
        }
        else {
            this.httpConnectionOptions = {
                ...this.httpConnectionOptions,
                transport: transportTypeOrOptions,
            };
        }
        return this;
    }
    /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
     *
     * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
     */
    withHubProtocol(protocol) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
        this.protocol = protocol;
        return this;
    }
    withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
        if (this.reconnectPolicy) {
            throw new Error("A reconnectPolicy has already been set.");
        }
        if (!retryDelaysOrReconnectPolicy) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy();
        }
        else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
            this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
        }
        else {
            this.reconnectPolicy = retryDelaysOrReconnectPolicy;
        }
        return this;
    }
    /** Configures {@link @microsoft/signalr.HubConnection.serverTimeoutInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withServerTimeout(milliseconds) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
        this._serverTimeoutInMilliseconds = milliseconds;
        return this;
    }
    /** Configures {@link @microsoft/signalr.HubConnection.keepAliveIntervalInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withKeepAliveInterval(milliseconds) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
        this._keepAliveIntervalInMilliseconds = milliseconds;
        return this;
    }
    /** Enables and configures options for the Stateful Reconnect feature.
     *
     * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
     */
    withStatefulReconnect(options) {
        if (this.httpConnectionOptions === undefined) {
            this.httpConnectionOptions = {};
        }
        this.httpConnectionOptions._useStatefulReconnect = true;
        this._statefulReconnectBufferSize = options === null || options === void 0 ? void 0 : options.bufferSize;
        return this;
    }
    /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
     *
     * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
     */
    build() {
        // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
        // provided to configureLogger
        const httpConnectionOptions = this.httpConnectionOptions || {};
        // If it's 'null', the user **explicitly** asked for null, don't mess with it.
        if (httpConnectionOptions.logger === undefined) {
            // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
            httpConnectionOptions.logger = this.logger;
        }
        // Now create the connection
        if (!this.url) {
            throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
        }
        const connection = new _HttpConnection__WEBPACK_IMPORTED_MODULE_3__.HttpConnection(this.url, httpConnectionOptions);
        return _HubConnection__WEBPACK_IMPORTED_MODULE_4__.HubConnection.create(connection, this.logger || _Loggers__WEBPACK_IMPORTED_MODULE_5__.NullLogger.instance, this.protocol || new _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__.JsonHubProtocol(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
    }
}
function isLogger(logger) {
    return logger.log !== undefined;
}
//# sourceMappingURL=HubConnectionBuilder.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js":
/*!*************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageType: () => (/* binding */ MessageType)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Defines the type of a Hub Message. */
var MessageType;
(function (MessageType) {
    /** Indicates the message is an Invocation message and implements the {@link @microsoft/signalr.InvocationMessage} interface. */
    MessageType[MessageType["Invocation"] = 1] = "Invocation";
    /** Indicates the message is a StreamItem message and implements the {@link @microsoft/signalr.StreamItemMessage} interface. */
    MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
    /** Indicates the message is a Completion message and implements the {@link @microsoft/signalr.CompletionMessage} interface. */
    MessageType[MessageType["Completion"] = 3] = "Completion";
    /** Indicates the message is a Stream Invocation message and implements the {@link @microsoft/signalr.StreamInvocationMessage} interface. */
    MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
    /** Indicates the message is a Cancel Invocation message and implements the {@link @microsoft/signalr.CancelInvocationMessage} interface. */
    MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
    /** Indicates the message is a Ping message and implements the {@link @microsoft/signalr.PingMessage} interface. */
    MessageType[MessageType["Ping"] = 6] = "Ping";
    /** Indicates the message is a Close message and implements the {@link @microsoft/signalr.CloseMessage} interface. */
    MessageType[MessageType["Close"] = 7] = "Close";
    MessageType[MessageType["Ack"] = 8] = "Ack";
    MessageType[MessageType["Sequence"] = 9] = "Sequence";
})(MessageType || (MessageType = {}));
//# sourceMappingURL=IHubProtocol.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js":
/*!********************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: () => (/* binding */ LogLevel)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
/** Indicates the severity of a log message.
 *
 * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
 */
var LogLevel;
(function (LogLevel) {
    /** Log level for very low severity diagnostic messages. */
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    /** Log level for low severity diagnostic messages. */
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    /** Log level for informational diagnostic messages. */
    LogLevel[LogLevel["Information"] = 2] = "Information";
    /** Log level for diagnostic messages that indicate a non-fatal problem. */
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    /** Log level for diagnostic messages that indicate a failure in the current operation. */
    LogLevel[LogLevel["Error"] = 4] = "Error";
    /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
    LogLevel[LogLevel["Critical"] = 5] = "Critical";
    /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
    LogLevel[LogLevel["None"] = 6] = "None";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=ILogger.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js":
/*!***********************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpTransportType: () => (/* binding */ HttpTransportType),
/* harmony export */   TransferFormat: () => (/* binding */ TransferFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// This will be treated as a bit flag in the future, so we keep it using power-of-two values.
/** Specifies a specific HTTP transport type. */
var HttpTransportType;
(function (HttpTransportType) {
    /** Specifies no transport preference. */
    HttpTransportType[HttpTransportType["None"] = 0] = "None";
    /** Specifies the WebSockets transport. */
    HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
    /** Specifies the Server-Sent Events transport. */
    HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
    /** Specifies the Long Polling transport. */
    HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (HttpTransportType = {}));
/** Specifies the transfer format for a connection. */
var TransferFormat;
(function (TransferFormat) {
    /** Specifies that only text data will be transmitted over the connection. */
    TransferFormat[TransferFormat["Text"] = 1] = "Text";
    /** Specifies that binary data will be transmitted over the connection. */
    TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat || (TransferFormat = {}));
//# sourceMappingURL=ITransport.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js":
/*!****************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JsonHubProtocol: () => (/* binding */ JsonHubProtocol)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ "../../../node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ITransport */ "../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ "../../../node_modules/@microsoft/signalr/dist/esm/Loggers.js");
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextMessageFormat */ "../../../node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





const JSON_HUB_PROTOCOL_NAME = "json";
/** Implements the JSON Hub Protocol. */
class JsonHubProtocol {
    constructor() {
        /** @inheritDoc */
        this.name = JSON_HUB_PROTOCOL_NAME;
        /** @inheritDoc */
        this.version = 2;
        /** @inheritDoc */
        this.transferFormat = _ITransport__WEBPACK_IMPORTED_MODULE_0__.TransferFormat.Text;
    }
    /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
     *
     * @param {string} input A string containing the serialized representation.
     * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
     */
    parseMessages(input, logger) {
        // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
        if (typeof input !== "string") {
            throw new Error("Invalid input for JSON hub protocol. Expected a string.");
        }
        if (!input) {
            return [];
        }
        if (logger === null) {
            logger = _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
        }
        // Parse the messages
        const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.parse(input);
        const hubMessages = [];
        for (const message of messages) {
            const parsedMessage = JSON.parse(message);
            if (typeof parsedMessage.type !== "number") {
                throw new Error("Invalid payload.");
            }
            switch (parsedMessage.type) {
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
                    this._isInvocationMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
                    this._isStreamItemMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion:
                    this._isCompletionMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
                    // Single value, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close:
                    // All optional values, no need to validate
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
                    this._isAckMessage(parsedMessage);
                    break;
                case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
                    this._isSequenceMessage(parsedMessage);
                    break;
                default:
                    // Future protocol changes can add message types, old clients can ignore them
                    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
                    continue;
            }
            hubMessages.push(parsedMessage);
        }
        return hubMessages;
    }
    /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
     *
     * @param {HubMessage} message The message to write.
     * @returns {string} A string containing the serialized representation of the message.
     */
    writeMessage(message) {
        return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.write(JSON.stringify(message));
    }
    _isInvocationMessage(message) {
        this._assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
        if (message.invocationId !== undefined) {
            this._assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
        }
    }
    _isStreamItemMessage(message) {
        this._assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
        if (message.item === undefined) {
            throw new Error("Invalid payload for StreamItem message.");
        }
    }
    _isCompletionMessage(message) {
        if (message.result && message.error) {
            throw new Error("Invalid payload for Completion message.");
        }
        if (!message.result && message.error) {
            this._assertNotEmptyString(message.error, "Invalid payload for Completion message.");
        }
        this._assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
    }
    _isAckMessage(message) {
        if (typeof message.sequenceId !== 'number') {
            throw new Error("Invalid SequenceId for Ack message.");
        }
    }
    _isSequenceMessage(message) {
        if (typeof message.sequenceId !== 'number') {
            throw new Error("Invalid SequenceId for Sequence message.");
        }
    }
    _assertNotEmptyString(value, errorMessage) {
        if (typeof value !== "string" || value === "") {
            throw new Error(errorMessage);
        }
    }
}
//# sourceMappingURL=JsonHubProtocol.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/Loggers.js":
/*!********************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/Loggers.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NullLogger: () => (/* binding */ NullLogger)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** A logger that does nothing when log messages are sent to it. */
class NullLogger {
    constructor() { }
    /** @inheritDoc */
    // eslint-disable-next-line
    log(_logLevel, _message) {
    }
}
/** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
NullLogger.instance = new NullLogger();
//# sourceMappingURL=Loggers.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js":
/*!*********************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LongPollingTransport: () => (/* binding */ LongPollingTransport)
/* harmony export */ });
/* harmony import */ var _AbortController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbortController */ "../../../node_modules/@microsoft/signalr/dist/esm/AbortController.js");
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ITransport */ "../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





// Not exported from 'index', this type is internal.
/** @private */
class LongPollingTransport {
    // This is an internal type, not exported from 'index' so this is really just internal.
    get pollAborted() {
        return this._pollAbort.aborted;
    }
    constructor(httpClient, logger, options) {
        this._httpClient = httpClient;
        this._logger = logger;
        this._pollAbort = new _AbortController__WEBPACK_IMPORTED_MODULE_0__.AbortController();
        this._options = options;
        this._running = false;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
        this._url = url;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Connecting.");
        // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary &&
            (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
            throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
        }
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
        const headers = { [name]: value, ...this._options.headers };
        const pollOptions = {
            abortSignal: this._pollAbort.signal,
            headers,
            timeout: 100000,
            withCredentials: this._options.withCredentials,
        };
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary) {
            pollOptions.responseType = "arraybuffer";
        }
        // Make initial long polling request
        // Server uses first long polling request to finish initializing connection and it returns without data
        const pollUrl = `${url}&_=${Date.now()}`;
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
        const response = await this._httpClient.get(pollUrl, pollOptions);
        if (response.statusCode !== 200) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
            // Mark running as false so that the poll immediately ends and runs the close logic
            this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
            this._running = false;
        }
        else {
            this._running = true;
        }
        this._receiving = this._poll(this._url, pollOptions);
    }
    async _poll(url, pollOptions) {
        try {
            while (this._running) {
                try {
                    const pollUrl = `${url}&_=${Date.now()}`;
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
                    const response = await this._httpClient.get(pollUrl, pollOptions);
                    if (response.statusCode === 204) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                        this._running = false;
                    }
                    else if (response.statusCode !== 200) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
                        // Unexpected status code
                        this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError(response.statusText || "", response.statusCode);
                        this._running = false;
                    }
                    else {
                        // Process the response
                        if (response.content) {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(response.content, this._options.logMessageContent)}.`);
                            if (this.onreceive) {
                                this.onreceive(response.content);
                            }
                        }
                        else {
                            // This is another way timeout manifest.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                    }
                }
                catch (e) {
                    if (!this._running) {
                        // Log but disregard errors that occur after stopping
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
                    }
                    else {
                        if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.TimeoutError) {
                            // Ignore timeouts and reissue the poll.
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                        }
                        else {
                            // Close the connection with the error as the result.
                            this._closeError = e;
                            this._running = false;
                        }
                    }
                }
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Polling complete.");
            // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
            // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
            if (!this.pollAborted) {
                this._raiseOnClose();
            }
        }
    }
    async send(data) {
        if (!this._running) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.sendMessage)(this._logger, "LongPolling", this._httpClient, this._url, data, this._options);
    }
    async stop() {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stopping polling.");
        // Tell receiving loop to stop, abort any current request, and then wait for it to finish
        this._running = false;
        this._pollAbort.abort();
        try {
            await this._receiving;
            // Send DELETE to clean up long polling on the server
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
            const headers = {};
            const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
            headers[name] = value;
            const deleteOptions = {
                headers: { ...headers, ...this._options.headers },
                timeout: this._options.timeout,
                withCredentials: this._options.withCredentials,
            };
            let error;
            try {
                await this._httpClient.delete(this._url, deleteOptions);
            }
            catch (err) {
                error = err;
            }
            if (error) {
                if (error instanceof _Errors__WEBPACK_IMPORTED_MODULE_4__.HttpError) {
                    if (error.statusCode === 404) {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.");
                    }
                    else {
                        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(LongPolling transport) Error sending a DELETE request: ${error}`);
                    }
                }
            }
            else {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) DELETE request accepted.");
            }
        }
        finally {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(LongPolling transport) Stop finished.");
            // Raise close event here instead of in polling
            // It needs to happen after the DELETE request is sent
            this._raiseOnClose();
        }
    }
    _raiseOnClose() {
        if (this.onclose) {
            let logMessage = "(LongPolling transport) Firing onclose event.";
            if (this._closeError) {
                logMessage += " Error: " + this._closeError;
            }
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, logMessage);
            this.onclose(this._closeError);
        }
    }
}
//# sourceMappingURL=LongPollingTransport.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js":
/*!**************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageBuffer: () => (/* binding */ MessageBuffer)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IHubProtocol */ "../../../node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class MessageBuffer {
    constructor(protocol, connection, bufferSize) {
        this._bufferSize = 100000;
        this._messages = [];
        this._totalMessageCount = 0;
        this._waitForSequenceMessage = false;
        // Message IDs start at 1 and always increment by 1
        this._nextReceivingSequenceId = 1;
        this._latestReceivedSequenceId = 0;
        this._bufferedByteCount = 0;
        this._reconnectInProgress = false;
        this._protocol = protocol;
        this._connection = connection;
        this._bufferSize = bufferSize;
    }
    async _send(message) {
        const serializedMessage = this._protocol.writeMessage(message);
        let backpressurePromise = Promise.resolve();
        // Only count invocation messages. Acks, pings, etc. don't need to be resent on reconnect
        if (this._isInvocationMessage(message)) {
            this._totalMessageCount++;
            let backpressurePromiseResolver = () => { };
            let backpressurePromiseRejector = () => { };
            if ((0,_Utils__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(serializedMessage)) {
                this._bufferedByteCount += serializedMessage.byteLength;
            }
            else {
                this._bufferedByteCount += serializedMessage.length;
            }
            if (this._bufferedByteCount >= this._bufferSize) {
                backpressurePromise = new Promise((resolve, reject) => {
                    backpressurePromiseResolver = resolve;
                    backpressurePromiseRejector = reject;
                });
            }
            this._messages.push(new BufferedItem(serializedMessage, this._totalMessageCount, backpressurePromiseResolver, backpressurePromiseRejector));
        }
        try {
            // If this is set it means we are reconnecting or resending
            // We don't want to send on a disconnected connection
            // And we don't want to send if resend is running since that would mean sending
            // this message twice
            if (!this._reconnectInProgress) {
                await this._connection.send(serializedMessage);
            }
        }
        catch {
            this._disconnected();
        }
        await backpressurePromise;
    }
    _ack(ackMessage) {
        let newestAckedMessage = -1;
        // Find index of newest message being acked
        for (let index = 0; index < this._messages.length; index++) {
            const element = this._messages[index];
            if (element._id <= ackMessage.sequenceId) {
                newestAckedMessage = index;
                if ((0,_Utils__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(element._message)) {
                    this._bufferedByteCount -= element._message.byteLength;
                }
                else {
                    this._bufferedByteCount -= element._message.length;
                }
                // resolve items that have already been sent and acked
                element._resolver();
            }
            else if (this._bufferedByteCount < this._bufferSize) {
                // resolve items that now fall under the buffer limit but haven't been acked
                element._resolver();
            }
            else {
                break;
            }
        }
        if (newestAckedMessage !== -1) {
            // We're removing everything including the message pointed to, so add 1
            this._messages = this._messages.slice(newestAckedMessage + 1);
        }
    }
    _shouldProcessMessage(message) {
        if (this._waitForSequenceMessage) {
            if (message.type !== _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence) {
                return false;
            }
            else {
                this._waitForSequenceMessage = false;
                return true;
            }
        }
        // No special processing for acks, pings, etc.
        if (!this._isInvocationMessage(message)) {
            return true;
        }
        const currentId = this._nextReceivingSequenceId;
        this._nextReceivingSequenceId++;
        if (currentId <= this._latestReceivedSequenceId) {
            if (currentId === this._latestReceivedSequenceId) {
                // Should only hit this if we just reconnected and the server is sending
                // Messages it has buffered, which would mean it hasn't seen an Ack for these messages
                this._ackTimer();
            }
            // Ignore, this is a duplicate message
            return false;
        }
        this._latestReceivedSequenceId = currentId;
        // Only start the timer for sending an Ack message when we have a message to ack. This also conveniently solves
        // timer throttling by not having a recursive timer, and by starting the timer via a network call (recv)
        this._ackTimer();
        return true;
    }
    _resetSequence(message) {
        if (message.sequenceId > this._nextReceivingSequenceId) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));
            return;
        }
        this._nextReceivingSequenceId = message.sequenceId;
    }
    _disconnected() {
        this._reconnectInProgress = true;
        this._waitForSequenceMessage = true;
    }
    async _resend() {
        const sequenceId = this._messages.length !== 0
            ? this._messages[0]._id
            : this._totalMessageCount + 1;
        await this._connection.send(this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence, sequenceId }));
        // Get a local variable to the _messages, just in case messages are acked while resending
        // Which would slice the _messages array (which creates a new copy)
        const messages = this._messages;
        for (const element of messages) {
            await this._connection.send(element._message);
        }
        this._reconnectInProgress = false;
    }
    _dispose(error) {
        error !== null && error !== void 0 ? error : (error = new Error("Unable to reconnect to server."));
        // Unblock backpressure if any
        for (const element of this._messages) {
            element._rejector(error);
        }
    }
    _isInvocationMessage(message) {
        // There is no way to check if something implements an interface.
        // So we individually check the messages in a switch statement.
        // To make sure we don't miss any message types we rely on the compiler
        // seeing the function returns a value and it will do the
        // exhaustive check for us on the switch statement, since we don't use 'case default'
        switch (message.type) {
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Invocation:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.StreamItem:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Completion:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.StreamInvocation:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.CancelInvocation:
                return true;
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Close:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Sequence:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ping:
            case _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ack:
                return false;
        }
    }
    _ackTimer() {
        if (this._ackTimerHandle === undefined) {
            this._ackTimerHandle = setTimeout(async () => {
                try {
                    if (!this._reconnectInProgress) {
                        await this._connection.send(this._protocol.writeMessage({ type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_1__.MessageType.Ack, sequenceId: this._latestReceivedSequenceId }));
                    }
                    // Ignore errors, that means the connection is closed and we don't care about the Ack message anymore.
                }
                catch { }
                clearTimeout(this._ackTimerHandle);
                this._ackTimerHandle = undefined;
                // 1 second delay so we don't spam Ack messages if there are many messages being received at once.
            }, 1000);
        }
    }
}
class BufferedItem {
    constructor(message, id, resolver, rejector) {
        this._message = message;
        this._id = id;
        this._resolver = resolver;
        this._rejector = rejector;
    }
}
//# sourceMappingURL=MessageBuffer.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js":
/*!**************************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerSentEventsTransport: () => (/* binding */ ServerSentEventsTransport)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ITransport */ "../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



/** @private */
class ServerSentEventsTransport {
    constructor(httpClient, accessToken, logger, options) {
        this._httpClient = httpClient;
        this._accessToken = accessToken;
        this._logger = logger;
        this._options = options;
        this.onreceive = null;
        this.onclose = null;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(SSE transport) Connecting.");
        // set url before accessTokenFactory because this._url is only for send and we set the auth header instead of the query string for send
        this._url = url;
        if (this._accessToken) {
            url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`;
        }
        return new Promise((resolve, reject) => {
            let opened = false;
            if (transferFormat !== _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Text) {
                reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                return;
            }
            let eventSource;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isBrowser || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isWebWorker) {
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials });
            }
            else {
                // Non-browser passes cookies via the dictionary
                const cookies = this._httpClient.getCookieString(url);
                const headers = {};
                headers.Cookie = cookies;
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials, headers: { ...headers, ...this._options.headers } });
            }
            try {
                eventSource.onmessage = (e) => {
                    if (this.onreceive) {
                        try {
                            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(SSE transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(e.data, this._options.logMessageContent)}.`);
                            this.onreceive(e.data);
                        }
                        catch (error) {
                            this._close(error);
                            return;
                        }
                    }
                };
                // @ts-ignore: not using event on purpose
                eventSource.onerror = (e) => {
                    // EventSource doesn't give any useful information about server side closes.
                    if (opened) {
                        this._close();
                    }
                    else {
                        reject(new Error("EventSource failed to connect. The connection could not be found on the server,"
                            + " either the connection ID is not present on the server, or a proxy is refusing/buffering the connection."
                            + " If you have multiple servers check that sticky sessions are enabled."));
                    }
                };
                eventSource.onopen = () => {
                    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `SSE connected to ${this._url}`);
                    this._eventSource = eventSource;
                    opened = true;
                    resolve();
                };
            }
            catch (e) {
                reject(e);
                return;
            }
        });
    }
    async send(data) {
        if (!this._eventSource) {
            return Promise.reject(new Error("Cannot send until the transport is connected"));
        }
        return (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.sendMessage)(this._logger, "SSE", this._httpClient, this._url, data, this._options);
    }
    stop() {
        this._close();
        return Promise.resolve();
    }
    _close(e) {
        if (this._eventSource) {
            this._eventSource.close();
            this._eventSource = undefined;
            if (this.onclose) {
                this.onclose(e);
            }
        }
    }
}
//# sourceMappingURL=ServerSentEventsTransport.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/Subject.js":
/*!********************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/Subject.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subject: () => (/* binding */ Subject)
/* harmony export */ });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/** Stream implementation to stream items to the server. */
class Subject {
    constructor() {
        this.observers = [];
    }
    next(item) {
        for (const observer of this.observers) {
            observer.next(item);
        }
    }
    error(err) {
        for (const observer of this.observers) {
            if (observer.error) {
                observer.error(err);
            }
        }
    }
    complete() {
        for (const observer of this.observers) {
            if (observer.complete) {
                observer.complete();
            }
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
        return new _Utils__WEBPACK_IMPORTED_MODULE_0__.SubjectSubscription(this, observer);
    }
}
//# sourceMappingURL=Subject.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js":
/*!******************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextMessageFormat: () => (/* binding */ TextMessageFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Not exported from index
/** @private */
class TextMessageFormat {
    static write(output) {
        return `${output}${TextMessageFormat.RecordSeparator}`;
    }
    static parse(input) {
        if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
            throw new Error("Message is incomplete.");
        }
        const messages = input.split(TextMessageFormat.RecordSeparator);
        messages.pop();
        return messages;
    }
}
TextMessageFormat.RecordSeparatorCode = 0x1e;
TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
//# sourceMappingURL=TextMessageFormat.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js":
/*!******************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/Utils.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Arg: () => (/* binding */ Arg),
/* harmony export */   ConsoleLogger: () => (/* binding */ ConsoleLogger),
/* harmony export */   Platform: () => (/* binding */ Platform),
/* harmony export */   SubjectSubscription: () => (/* binding */ SubjectSubscription),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   constructUserAgent: () => (/* binding */ constructUserAgent),
/* harmony export */   createLogger: () => (/* binding */ createLogger),
/* harmony export */   formatArrayBuffer: () => (/* binding */ formatArrayBuffer),
/* harmony export */   getDataDetail: () => (/* binding */ getDataDetail),
/* harmony export */   getErrorString: () => (/* binding */ getErrorString),
/* harmony export */   getGlobalThis: () => (/* binding */ getGlobalThis),
/* harmony export */   getUserAgentHeader: () => (/* binding */ getUserAgentHeader),
/* harmony export */   isArrayBuffer: () => (/* binding */ isArrayBuffer),
/* harmony export */   sendMessage: () => (/* binding */ sendMessage)
/* harmony export */ });
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ "../../../node_modules/@microsoft/signalr/dist/esm/Loggers.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


// Version token that will be replaced by the prepack command
/** The version of the SignalR client. */
const VERSION = "8.0.7";
/** @private */
class Arg {
    static isRequired(val, name) {
        if (val === null || val === undefined) {
            throw new Error(`The '${name}' argument is required.`);
        }
    }
    static isNotEmpty(val, name) {
        if (!val || val.match(/^\s*$/)) {
            throw new Error(`The '${name}' argument should not be empty.`);
        }
    }
    static isIn(val, values, name) {
        // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
        if (!(val in values)) {
            throw new Error(`Unknown ${name} value: ${val}.`);
        }
    }
}
/** @private */
class Platform {
    // react-native has a window but no document so we should check both
    static get isBrowser() {
        return !Platform.isNode && typeof window === "object" && typeof window.document === "object";
    }
    // WebWorkers don't have a window object so the isBrowser check would fail
    static get isWebWorker() {
        return !Platform.isNode && typeof self === "object" && "importScripts" in self;
    }
    // react-native has a window but no document
    static get isReactNative() {
        return !Platform.isNode && typeof window === "object" && typeof window.document === "undefined";
    }
    // Node apps shouldn't have a window object, but WebWorkers don't either
    // so we need to check for both WebWorker and window
    static get isNode() {
        return typeof process !== "undefined" && process.release && process.release.name === "node";
    }
}
/** @private */
function getDataDetail(data, includeContent) {
    let detail = "";
    if (isArrayBuffer(data)) {
        detail = `Binary data of length ${data.byteLength}`;
        if (includeContent) {
            detail += `. Content: '${formatArrayBuffer(data)}'`;
        }
    }
    else if (typeof data === "string") {
        detail = `String data of length ${data.length}`;
        if (includeContent) {
            detail += `. Content: '${data}'`;
        }
    }
    return detail;
}
/** @private */
function formatArrayBuffer(data) {
    const view = new Uint8Array(data);
    // Uint8Array.map only supports returning another Uint8Array?
    let str = "";
    view.forEach((num) => {
        const pad = num < 16 ? "0" : "";
        str += `0x${pad}${num.toString(16)} `;
    });
    // Trim of trailing space.
    return str.substr(0, str.length - 1);
}
// Also in signalr-protocol-msgpack/Utils.ts
/** @private */
function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}
/** @private */
async function sendMessage(logger, transportName, httpClient, url, content, options) {
    const headers = {};
    const [name, value] = getUserAgentHeader();
    headers[name] = value;
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, options.logMessageContent)}.`);
    const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
    const response = await httpClient.post(url, {
        content,
        headers: { ...headers, ...options.headers },
        responseType,
        timeout: options.timeout,
        withCredentials: options.withCredentials,
    });
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
}
/** @private */
function createLogger(logger) {
    if (logger === undefined) {
        return new ConsoleLogger(_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information);
    }
    if (logger === null) {
        return _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
    }
    if (logger.log !== undefined) {
        return logger;
    }
    return new ConsoleLogger(logger);
}
/** @private */
class SubjectSubscription {
    constructor(subject, observer) {
        this._subject = subject;
        this._observer = observer;
    }
    dispose() {
        const index = this._subject.observers.indexOf(this._observer);
        if (index > -1) {
            this._subject.observers.splice(index, 1);
        }
        if (this._subject.observers.length === 0 && this._subject.cancelCallback) {
            this._subject.cancelCallback().catch((_) => { });
        }
    }
}
/** @private */
class ConsoleLogger {
    constructor(minimumLogLevel) {
        this._minLevel = minimumLogLevel;
        this.out = console;
    }
    log(logLevel, message) {
        if (logLevel >= this._minLevel) {
            const msg = `[${new Date().toISOString()}] ${_ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel[logLevel]}: ${message}`;
            switch (logLevel) {
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical:
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error:
                    this.out.error(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning:
                    this.out.warn(msg);
                    break;
                case _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information:
                    this.out.info(msg);
                    break;
                default:
                    // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                    this.out.log(msg);
                    break;
            }
        }
    }
}
/** @private */
function getUserAgentHeader() {
    let userAgentHeaderName = "X-SignalR-User-Agent";
    if (Platform.isNode) {
        userAgentHeaderName = "User-Agent";
    }
    return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
/** @private */
function constructUserAgent(version, os, runtime, runtimeVersion) {
    // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
    let userAgent = "Microsoft SignalR/";
    const majorAndMinor = version.split(".");
    userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
    userAgent += ` (${version}; `;
    if (os && os !== "") {
        userAgent += `${os}; `;
    }
    else {
        userAgent += "Unknown OS; ";
    }
    userAgent += `${runtime}`;
    if (runtimeVersion) {
        userAgent += `; ${runtimeVersion}`;
    }
    else {
        userAgent += "; Unknown Runtime Version";
    }
    userAgent += ")";
    return userAgent;
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getOsName() {
    if (Platform.isNode) {
        switch (process.platform) {
            case "win32":
                return "Windows NT";
            case "darwin":
                return "macOS";
            case "linux":
                return "Linux";
            default:
                return process.platform;
        }
    }
    else {
        return "";
    }
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/ function getRuntimeVersion() {
    if (Platform.isNode) {
        return process.versions.node;
    }
    return undefined;
}
function getRuntime() {
    if (Platform.isNode) {
        return "NodeJS";
    }
    else {
        return "Browser";
    }
}
/** @private */
function getErrorString(e) {
    if (e.stack) {
        return e.stack;
    }
    else if (e.message) {
        return e.message;
    }
    return `${e}`;
}
/** @private */
function getGlobalThis() {
    // globalThis is semi-new and not available in Node until v12
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        return __webpack_require__.g;
    }
    throw new Error("could not find global");
}
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js":
/*!*******************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebSocketTransport: () => (/* binding */ WebSocketTransport)
/* harmony export */ });
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HeaderNames */ "../../../node_modules/@microsoft/signalr/dist/esm/HeaderNames.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ITransport */ "../../../node_modules/@microsoft/signalr/dist/esm/ITransport.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




/** @private */
class WebSocketTransport {
    constructor(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
        this._logger = logger;
        this._accessTokenFactory = accessTokenFactory;
        this._logMessageContent = logMessageContent;
        this._webSocketConstructor = webSocketConstructor;
        this._httpClient = httpClient;
        this.onreceive = null;
        this.onclose = null;
        this._headers = headers;
    }
    async connect(url, transferFormat) {
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(url, "url");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isRequired(transferFormat, "transferFormat");
        _Utils__WEBPACK_IMPORTED_MODULE_0__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat, "transferFormat");
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) Connecting.");
        let token;
        if (this._accessTokenFactory) {
            token = await this._accessTokenFactory();
        }
        return new Promise((resolve, reject) => {
            url = url.replace(/^http/, "ws");
            let webSocket;
            const cookies = this._httpClient.getCookieString(url);
            let opened = false;
            if (_Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isNode || _Utils__WEBPACK_IMPORTED_MODULE_0__.Platform.isReactNative) {
                const headers = {};
                const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getUserAgentHeader)();
                headers[name] = value;
                if (token) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Authorization] = `Bearer ${token}`;
                }
                if (cookies) {
                    headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_3__.HeaderNames.Cookie] = cookies;
                }
                // Only pass headers when in non-browser environments
                webSocket = new this._webSocketConstructor(url, undefined, {
                    headers: { ...headers, ...this._headers },
                });
            }
            else {
                if (token) {
                    url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
                }
            }
            if (!webSocket) {
                // Chrome is not happy with passing 'undefined' as protocol
                webSocket = new this._webSocketConstructor(url);
            }
            if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_1__.TransferFormat.Binary) {
                webSocket.binaryType = "arraybuffer";
            }
            webSocket.onopen = (_event) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `WebSocket connected to ${url}.`);
                this._webSocket = webSocket;
                opened = true;
                resolve();
            };
            webSocket.onerror = (event) => {
                let error = null;
                // ErrorEvent is a browser only type we need to check if the type exists before using it
                if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                    error = event.error;
                }
                else {
                    error = "There was an error with the transport";
                }
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information, `(WebSockets transport) ${error}.`);
            };
            webSocket.onmessage = (message) => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(message.data, this._logMessageContent)}.`);
                if (this.onreceive) {
                    try {
                        this.onreceive(message.data);
                    }
                    catch (error) {
                        this._close(error);
                        return;
                    }
                }
            };
            webSocket.onclose = (event) => {
                // Don't call close handler if connection was never established
                // We'll reject the connect call instead
                if (opened) {
                    this._close(event);
                }
                else {
                    let error = null;
                    // ErrorEvent is a browser only type we need to check if the type exists before using it
                    if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                        error = event.error;
                    }
                    else {
                        error = "WebSocket failed to connect. The connection could not be found on the server,"
                            + " either the endpoint may not be a SignalR endpoint,"
                            + " the connection ID is not present on the server, or there is a proxy blocking WebSockets."
                            + " If you have multiple servers check that sticky sessions are enabled.";
                    }
                    reject(new Error(error));
                }
            };
        });
    }
    send(data) {
        if (this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(WebSockets transport) sending data. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_0__.getDataDetail)(data, this._logMessageContent)}.`);
            this._webSocket.send(data);
            return Promise.resolve();
        }
        return Promise.reject("WebSocket is not in the OPEN state");
    }
    stop() {
        if (this._webSocket) {
            // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
            // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
            this._close(undefined);
        }
        return Promise.resolve();
    }
    _close(event) {
        // webSocket will be null if the transport did not start successfully
        if (this._webSocket) {
            // Clear websocket handlers because we are considering the socket closed now
            this._webSocket.onclose = () => { };
            this._webSocket.onmessage = () => { };
            this._webSocket.onerror = () => { };
            this._webSocket.close();
            this._webSocket = undefined;
        }
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, "(WebSockets transport) socket closed.");
        if (this.onclose) {
            if (this._isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
                this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason || "no reason given"}).`));
            }
            else if (event instanceof Error) {
                this.onclose(event);
            }
            else {
                this.onclose();
            }
        }
    }
    _isCloseEvent(event) {
        return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
    }
}
//# sourceMappingURL=WebSocketTransport.js.map

/***/ }),

/***/ "../../../node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js":
/*!**************************************************************************!*\
  !*** ../../../node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XhrHttpClient: () => (/* binding */ XhrHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Errors */ "../../../node_modules/@microsoft/signalr/dist/esm/Errors.js");
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ "../../../node_modules/@microsoft/signalr/dist/esm/HttpClient.js");
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ "../../../node_modules/@microsoft/signalr/dist/esm/ILogger.js");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ "../../../node_modules/@microsoft/signalr/dist/esm/Utils.js");
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class XhrHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
    constructor(logger) {
        super();
        this._logger = logger;
    }
    /** @inheritDoc */
    send(request) {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (request.content === "") {
                request.content = undefined;
            }
            if (request.content) {
                // Explicitly setting the Content-Type header for React Native on Android platform.
                if ((0,_Utils__WEBPACK_IMPORTED_MODULE_2__.isArrayBuffer)(request.content)) {
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                }
                else {
                    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                }
            }
            const headers = request.headers;
            if (headers) {
                Object.keys(headers)
                    .forEach((header) => {
                    xhr.setRequestHeader(header, headers[header]);
                });
            }
            if (request.responseType) {
                xhr.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = () => {
                    xhr.abort();
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
                };
            }
            if (request.timeout) {
                xhr.timeout = request.timeout;
            }
            xhr.onload = () => {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                }
                else {
                    reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.response || xhr.responseText || xhr.statusText, xhr.status));
                }
            };
            xhr.onerror = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.statusText, xhr.status));
            };
            xhr.ontimeout = () => {
                this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
                reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.TimeoutError());
            };
            xhr.send(request.content);
        });
    }
}
//# sourceMappingURL=XhrHttpClient.js.map

/***/ }),

/***/ "./src/components/Ping.ts":
/*!********************************!*\
  !*** ./src/components/Ping.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ping)
/* harmony export */ });
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/signalr */ "../../../node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }

var connection = new _microsoft_signalr__WEBPACK_IMPORTED_MODULE_0__.HubConnectionBuilder().withUrl('/ping-hub', {}).withAutomaticReconnect().build();
connection.on('pong', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(message) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("Got a response message as ".concat(message));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
function startConnection() {
  return _startConnection.apply(this, arguments);
}
function _startConnection() {
  _startConnection = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return connection.start();
        case 2:
          console.log('connected');
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _startConnection.apply(this, arguments);
}
startConnection();
function Ping() {
  console.log('calling ping');
}

/***/ }),

/***/ "./src/components/index.ts":
/*!*********************************!*\
  !*** ./src/components/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ping: () => (/* reexport safe */ _Ping__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _Ping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ping */ "./src/components/Ping.ts");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ "./src/components/index.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_components__WEBPACK_IMPORTED_MODULE_0__);
})();

OrchardExampleModule = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3d3cm9vdC9zY3JpcHRzL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUM0QztBQUNGO0FBQzFDO0FBQ08sb0NBQW9DLG1EQUFVO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIscURBQVcsNEJBQTRCLGtCQUFrQjtBQUNyRjtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MscURBQVc7QUFDM0MsdUNBQXVDLHFEQUFXO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7QUFDQTtBQUNzQztBQUNjO0FBQ1Y7QUFDUDtBQUNhO0FBQ2hELCtCQUErQixvQ0FBb0M7QUFDNUQsZ0NBQWdDLG1EQUFVO0FBQ2pELHVDQUF1QywyQ0FBMkMsc0JBQXNCLGtDQUFrQztBQUMxSTtBQUNBO0FBQ0EsNENBQTRDLDRDQUFRO0FBQ3BELG1DQUFtQyw2REFBZTtBQUNsRDtBQUNBO0FBQ0EsbUNBQW1DLHlEQUFhO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQywrQ0FBVTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7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QUF6RCxJQUFBO1VBQUEsT0FDUXNDLFVBQVUsQ0FBQ29CLEtBQUssQ0FBQyxDQUFDO1FBQUE7VUFDeEJULE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQztRQUFDO1FBQUE7VUFBQSxPQUFBTyxTQUFBLENBQUFoQyxJQUFBO01BQUE7SUFBQSxHQUFBOEIsUUFBQTtFQUFBLENBQzFCO0VBQUEsT0FBQUQsZ0JBQUEsQ0FBQXBCLEtBQUEsT0FBQUQsU0FBQTtBQUFBO0FBR0RvQixlQUFlLENBQUMsQ0FBQztBQUVGLFNBQVNNLElBQUlBLENBQUEsRUFBRztFQUM3QlYsT0FBTyxDQUFDQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQzdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUVyQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ04yQztBQUMzQyxpRUFBZVksd0NBQVUsRSIsInNvdXJjZXMiOlsid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9BYm9ydENvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0FjY2Vzc1Rva2VuSHR0cENsaWVudC5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vRGVmYXVsdEh0dHBDbGllbnQuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0RlZmF1bHRSZWNvbm5lY3RQb2xpY3kuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0Vycm9ycy5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vRmV0Y2hIdHRwQ2xpZW50LmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9IYW5kc2hha2VQcm90b2NvbC5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vSGVhZGVyTmFtZXMuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0h0dHBDbGllbnQuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0h0dHBDb25uZWN0aW9uLmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9IdWJDb25uZWN0aW9uLmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9IdWJDb25uZWN0aW9uQnVpbGRlci5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vSUh1YlByb3RvY29sLmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9JTG9nZ2VyLmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9JVHJhbnNwb3J0LmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9Kc29uSHViUHJvdG9jb2wuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0xvZ2dlcnMuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL0xvbmdQb2xsaW5nVHJhbnNwb3J0LmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9NZXNzYWdlQnVmZmVyLmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9TZXJ2ZXJTZW50RXZlbnRzVHJhbnNwb3J0LmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9TdWJqZWN0LmpzIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvc2lnbmFsci9kaXN0L2VzbS9UZXh0TWVzc2FnZUZvcm1hdC5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vVXRpbHMuanMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9zaWduYWxyL2Rpc3QvZXNtL1dlYlNvY2tldFRyYW5zcG9ydC5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L3NpZ25hbHIvZGlzdC9lc20vWGhySHR0cENsaWVudC5qcyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4vc3JjL2NvbXBvbmVudHMvUGluZy50cyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vb3JjaGFyZC1leGFtcGxlLW1vZHVsZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29yY2hhcmQtZXhhbXBsZS1tb2R1bGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vcmNoYXJkLWV4YW1wbGUtbW9kdWxlLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuLy8gUm91Z2ggcG9seWZpbGwgb2YgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Fib3J0Q29udHJvbGxlclxyXG4vLyBXZSBkb24ndCBhY3R1YWxseSBldmVyIHVzZSB0aGUgQVBJIGJlaW5nIHBvbHlmaWxsZWQsIHdlIGFsd2F5cyB1c2UgdGhlIHBvbHlmaWxsIGJlY2F1c2VcclxuLy8gaXQncyBhIHZlcnkgbmV3IEFQSSByaWdodCBub3cuXHJcbi8vIE5vdCBleHBvcnRlZCBmcm9tIGluZGV4LlxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIEFib3J0Q29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9pc0Fib3J0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uYWJvcnQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYWJvcnQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0Fib3J0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNBYm9ydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25hYm9ydCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbmFib3J0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgc2lnbmFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0IGFib3J0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQWJvcnRlZDtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1BYm9ydENvbnRyb2xsZXIuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBIZWFkZXJOYW1lcyB9IGZyb20gXCIuL0hlYWRlck5hbWVzXCI7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tIFwiLi9IdHRwQ2xpZW50XCI7XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgQWNjZXNzVG9rZW5IdHRwQ2xpZW50IGV4dGVuZHMgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihpbm5lckNsaWVudCwgYWNjZXNzVG9rZW5GYWN0b3J5KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9pbm5lckNsaWVudCA9IGlubmVyQ2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSA9IGFjY2Vzc1Rva2VuRmFjdG9yeTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNlbmQocmVxdWVzdCkge1xyXG4gICAgICAgIGxldCBhbGxvd1JldHJ5ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5ICYmICghdGhpcy5fYWNjZXNzVG9rZW4gfHwgKHJlcXVlc3QudXJsICYmIHJlcXVlc3QudXJsLmluZGV4T2YoXCIvbmVnb3RpYXRlP1wiKSA+IDApKSkge1xyXG4gICAgICAgICAgICAvLyBkb24ndCByZXRyeSBpZiB0aGUgcmVxdWVzdCBpcyBhIG5lZ290aWF0ZSBvciBpZiB3ZSBqdXN0IGdvdCBhIHBvdGVudGlhbGx5IG5ldyB0b2tlbiBmcm9tIHRoZSBhY2Nlc3MgdG9rZW4gZmFjdG9yeVxyXG4gICAgICAgICAgICBhbGxvd1JldHJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NldEF1dGhvcml6YXRpb25IZWFkZXIocmVxdWVzdCk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9pbm5lckNsaWVudC5zZW5kKHJlcXVlc3QpO1xyXG4gICAgICAgIGlmIChhbGxvd1JldHJ5ICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDQwMSAmJiB0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkoKTtcclxuICAgICAgICAgICAgdGhpcy5fc2V0QXV0aG9yaXphdGlvbkhlYWRlcihyZXF1ZXN0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2lubmVyQ2xpZW50LnNlbmQocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuICAgIF9zZXRBdXRob3JpemF0aW9uSGVhZGVyKHJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIXJlcXVlc3QuaGVhZGVycykge1xyXG4gICAgICAgICAgICByZXF1ZXN0LmhlYWRlcnMgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjY2Vzc1Rva2VuKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuaGVhZGVyc1tIZWFkZXJOYW1lcy5BdXRob3JpemF0aW9uXSA9IGBCZWFyZXIgJHt0aGlzLl9hY2Nlc3NUb2tlbn1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkb24ndCByZW1vdmUgdGhlIGhlYWRlciBpZiB0aGVyZSBpc24ndCBhbiBhY2Nlc3MgdG9rZW4gZmFjdG9yeSwgdGhlIHVzZXIgbWFudWFsbHkgYWRkZWQgdGhlIGhlYWRlciBpbiB0aGlzIGNhc2VcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9hY2Nlc3NUb2tlbkZhY3RvcnkpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3QuaGVhZGVyc1tIZWFkZXJOYW1lcy5BdXRob3JpemF0aW9uXSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlcXVlc3QuaGVhZGVyc1tIZWFkZXJOYW1lcy5BdXRob3JpemF0aW9uXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldENvb2tpZVN0cmluZyh1cmwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5uZXJDbGllbnQuZ2V0Q29va2llU3RyaW5nKHVybCk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QWNjZXNzVG9rZW5IdHRwQ2xpZW50LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgQWJvcnRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5pbXBvcnQgeyBGZXRjaEh0dHBDbGllbnQgfSBmcm9tIFwiLi9GZXRjaEh0dHBDbGllbnRcIjtcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gXCIuL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG5pbXBvcnQgeyBYaHJIdHRwQ2xpZW50IH0gZnJvbSBcIi4vWGhySHR0cENsaWVudFwiO1xyXG4vKiogRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh0dHBDbGllbnR9LiAqL1xyXG5leHBvcnQgY2xhc3MgRGVmYXVsdEh0dHBDbGllbnQgZXh0ZW5kcyBIdHRwQ2xpZW50IHtcclxuICAgIC8qKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkRlZmF1bHRIdHRwQ2xpZW50fSwgdXNpbmcgdGhlIHByb3ZpZGVkIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSUxvZ2dlcn0gdG8gbG9nIG1lc3NhZ2VzLiAqL1xyXG4gICAgY29uc3RydWN0b3IobG9nZ2VyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAodHlwZW9mIGZldGNoICE9PSBcInVuZGVmaW5lZFwiIHx8IFBsYXRmb3JtLmlzTm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9odHRwQ2xpZW50ID0gbmV3IEZldGNoSHR0cENsaWVudChsb2dnZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5faHR0cENsaWVudCA9IG5ldyBYaHJIdHRwQ2xpZW50KGxvZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB1c2FibGUgSHR0cENsaWVudCBmb3VuZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIEBpbmhlcml0RG9jICovXHJcbiAgICBzZW5kKHJlcXVlc3QpIHtcclxuICAgICAgICAvLyBDaGVjayB0aGF0IGFib3J0IHdhcyBub3Qgc2lnbmFsZWQgYmVmb3JlIGNhbGxpbmcgc2VuZFxyXG4gICAgICAgIGlmIChyZXF1ZXN0LmFib3J0U2lnbmFsICYmIHJlcXVlc3QuYWJvcnRTaWduYWwuYWJvcnRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFib3J0RXJyb3IoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVxdWVzdC5tZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk5vIG1ldGhvZCBkZWZpbmVkLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVxdWVzdC51cmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk5vIHVybCBkZWZpbmVkLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwQ2xpZW50LnNlbmQocmVxdWVzdCk7XHJcbiAgICB9XHJcbiAgICBnZXRDb29raWVTdHJpbmcodXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHBDbGllbnQuZ2V0Q29va2llU3RyaW5nKHVybCk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGVmYXVsdEh0dHBDbGllbnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4vLyAwLCAyLCAxMCwgMzAgc2Vjb25kIGRlbGF5cyBiZWZvcmUgcmVjb25uZWN0IGF0dGVtcHRzLlxyXG5jb25zdCBERUZBVUxUX1JFVFJZX0RFTEFZU19JTl9NSUxMSVNFQ09ORFMgPSBbMCwgMjAwMCwgMTAwMDAsIDMwMDAwLCBudWxsXTtcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0UmVjb25uZWN0UG9saWN5IHtcclxuICAgIGNvbnN0cnVjdG9yKHJldHJ5RGVsYXlzKSB7XHJcbiAgICAgICAgdGhpcy5fcmV0cnlEZWxheXMgPSByZXRyeURlbGF5cyAhPT0gdW5kZWZpbmVkID8gWy4uLnJldHJ5RGVsYXlzLCBudWxsXSA6IERFRkFVTFRfUkVUUllfREVMQVlTX0lOX01JTExJU0VDT05EUztcclxuICAgIH1cclxuICAgIG5leHRSZXRyeURlbGF5SW5NaWxsaXNlY29uZHMocmV0cnlDb250ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JldHJ5RGVsYXlzW3JldHJ5Q29udGV4dC5wcmV2aW91c1JldHJ5Q291bnRdO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURlZmF1bHRSZWNvbm5lY3RQb2xpY3kuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gYW4gSFRUUCByZXF1ZXN0IGZhaWxzLiAqL1xyXG5leHBvcnQgY2xhc3MgSHR0cEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgLyoqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2Yge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdHRwRXJyb3J9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2UgQSBkZXNjcmlwdGl2ZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1c0NvZGUgVGhlIEhUVFAgc3RhdHVzIGNvZGUgcmVwcmVzZW50ZWQgYnkgdGhpcyBlcnJvci5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZXJyb3JNZXNzYWdlLCBzdGF0dXNDb2RlKSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIoYCR7ZXJyb3JNZXNzYWdlfTogU3RhdHVzIGNvZGUgJyR7c3RhdHVzQ29kZX0nYCk7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gYSB0aW1lb3V0IGVsYXBzZXMuICovXHJcbmV4cG9ydCBjbGFzcyBUaW1lb3V0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLlRpbWVvdXRFcnJvcn0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yTWVzc2FnZSBBIGRlc2NyaXB0aXZlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGVycm9yTWVzc2FnZSA9IFwiQSB0aW1lb3V0IG9jY3VycmVkLlwiKSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gYW4gYWN0aW9uIGlzIGFib3J0ZWQuICovXHJcbmV4cG9ydCBjbGFzcyBBYm9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgLyoqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2Yge0BsaW5rIEFib3J0RXJyb3J9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2UgQSBkZXNjcmlwdGl2ZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihlcnJvck1lc3NhZ2UgPSBcIkFuIGFib3J0IG9jY3VycmVkLlwiKSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gdGhlIHNlbGVjdGVkIHRyYW5zcG9ydCBpcyB1bnN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci4gKi9cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBVbnN1cHBvcnRlZFRyYW5zcG9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgLyoqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2Yge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5VbnN1cHBvcnRlZFRyYW5zcG9ydEVycm9yfS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBBIGRlc2NyaXB0aXZlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgKiBAcGFyYW0ge0h0dHBUcmFuc3BvcnRUeXBlfSB0cmFuc3BvcnQgVGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHR0cFRyYW5zcG9ydFR5cGV9IHRoaXMgZXJyb3Igb2NjdXJyZWQgb24uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHRyYW5zcG9ydCkge1xyXG4gICAgICAgIGNvbnN0IHRydWVQcm90byA9IG5ldy50YXJnZXQucHJvdG90eXBlO1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xyXG4gICAgICAgIHRoaXMuZXJyb3JUeXBlID0gJ1Vuc3VwcG9ydGVkVHJhbnNwb3J0RXJyb3InO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgaXNzdWUgaW4gVHlwZXNjcmlwdCBjb21waWxlclxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTM5NjUjaXNzdWVjb21tZW50LTI3ODU3MDIwMFxyXG4gICAgICAgIHRoaXMuX19wcm90b19fID0gdHJ1ZVByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8qKiBFcnJvciB0aHJvd24gd2hlbiB0aGUgc2VsZWN0ZWQgdHJhbnNwb3J0IGlzIGRpc2FibGVkIGJ5IHRoZSBicm93c2VyLiAqL1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIERpc2FibGVkVHJhbnNwb3J0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkRpc2FibGVkVHJhbnNwb3J0RXJyb3J9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIEEgZGVzY3JpcHRpdmUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqIEBwYXJhbSB7SHR0cFRyYW5zcG9ydFR5cGV9IHRyYW5zcG9ydCBUaGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdHRwVHJhbnNwb3J0VHlwZX0gdGhpcyBlcnJvciBvY2N1cnJlZCBvbi5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgdHJhbnNwb3J0KSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XHJcbiAgICAgICAgdGhpcy5lcnJvclR5cGUgPSAnRGlzYWJsZWRUcmFuc3BvcnRFcnJvcic7XHJcbiAgICAgICAgLy8gV29ya2Fyb3VuZCBpc3N1ZSBpbiBUeXBlc2NyaXB0IGNvbXBpbGVyXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xMzk2NSNpc3N1ZWNvbW1lbnQtMjc4NTcwMjAwXHJcbiAgICAgICAgdGhpcy5fX3Byb3RvX18gPSB0cnVlUHJvdG87XHJcbiAgICB9XHJcbn1cclxuLyoqIEVycm9yIHRocm93biB3aGVuIHRoZSBzZWxlY3RlZCB0cmFuc3BvcnQgY2Fubm90IGJlIHN0YXJ0ZWQuICovXHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgRmFpbGVkVG9TdGFydFRyYW5zcG9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgLyoqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2Yge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5GYWlsZWRUb1N0YXJ0VHJhbnNwb3J0RXJyb3J9LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIEEgZGVzY3JpcHRpdmUgZXJyb3IgbWVzc2FnZS5cclxuICAgICAqIEBwYXJhbSB7SHR0cFRyYW5zcG9ydFR5cGV9IHRyYW5zcG9ydCBUaGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdHRwVHJhbnNwb3J0VHlwZX0gdGhpcyBlcnJvciBvY2N1cnJlZCBvbi5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgdHJhbnNwb3J0KSB7XHJcbiAgICAgICAgY29uc3QgdHJ1ZVByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XHJcbiAgICAgICAgdGhpcy5lcnJvclR5cGUgPSAnRmFpbGVkVG9TdGFydFRyYW5zcG9ydEVycm9yJztcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vKiogRXJyb3IgdGhyb3duIHdoZW4gdGhlIG5lZ290aWF0aW9uIHdpdGggdGhlIHNlcnZlciBmYWlsZWQgdG8gY29tcGxldGUuICovXHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgRmFpbGVkVG9OZWdvdGlhdGVXaXRoU2VydmVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAvKiogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkZhaWxlZFRvTmVnb3RpYXRlV2l0aFNlcnZlckVycm9yfS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBBIGRlc2NyaXB0aXZlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zdCB0cnVlUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmVycm9yVHlwZSA9ICdGYWlsZWRUb05lZ290aWF0ZVdpdGhTZXJ2ZXJFcnJvcic7XHJcbiAgICAgICAgLy8gV29ya2Fyb3VuZCBpc3N1ZSBpbiBUeXBlc2NyaXB0IGNvbXBpbGVyXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xMzk2NSNpc3N1ZWNvbW1lbnQtMjc4NTcwMjAwXHJcbiAgICAgICAgdGhpcy5fX3Byb3RvX18gPSB0cnVlUHJvdG87XHJcbiAgICB9XHJcbn1cclxuLyoqIEVycm9yIHRocm93biB3aGVuIG11bHRpcGxlIGVycm9ycyBoYXZlIG9jY3VycmVkLiAqL1xyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0ZUVycm9ycyBleHRlbmRzIEVycm9yIHtcclxuICAgIC8qKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuQWdncmVnYXRlRXJyb3JzfS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBBIGRlc2NyaXB0aXZlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICAgKiBAcGFyYW0ge0Vycm9yW119IGlubmVyRXJyb3JzIFRoZSBjb2xsZWN0aW9uIG9mIGVycm9ycyB0aGlzIGVycm9yIGlzIGFnZ3JlZ2F0aW5nLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBpbm5lckVycm9ycykge1xyXG4gICAgICAgIGNvbnN0IHRydWVQcm90byA9IG5ldy50YXJnZXQucHJvdG90eXBlO1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuaW5uZXJFcnJvcnMgPSBpbm5lckVycm9ycztcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGlzc3VlIGluIFR5cGVzY3JpcHQgY29tcGlsZXJcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzEzOTY1I2lzc3VlY29tbWVudC0yNzg1NzAyMDBcclxuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IHRydWVQcm90bztcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1FcnJvcnMuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBBYm9ydEVycm9yLCBIdHRwRXJyb3IsIFRpbWVvdXRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiLi9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBQbGF0Zm9ybSwgZ2V0R2xvYmFsVGhpcywgaXNBcnJheUJ1ZmZlciB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbmV4cG9ydCBjbGFzcyBGZXRjaEh0dHBDbGllbnQgZXh0ZW5kcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgICAgIC8vIE5vZGUgYWRkZWQgYSBmZXRjaCBpbXBsZW1lbnRhdGlvbiB0byB0aGUgZ2xvYmFsIHNjb3BlIHN0YXJ0aW5nIGluIHYxOC5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGFkZCBhIGNvb2tpZSBqYXIgaW4gbm9kZSB0byBiZSBhYmxlIHRvIHNoYXJlIGNvb2tpZXMgd2l0aCBXZWJTb2NrZXRcclxuICAgICAgICBpZiAodHlwZW9mIGZldGNoID09PSBcInVuZGVmaW5lZFwiIHx8IFBsYXRmb3JtLmlzTm9kZSkge1xyXG4gICAgICAgICAgICAvLyBJbiBvcmRlciB0byBpZ25vcmUgdGhlIGR5bmFtaWMgcmVxdWlyZSBpbiB3ZWJwYWNrIGJ1aWxkcyB3ZSBuZWVkIHRvIGRvIHRoaXMgbWFnaWNcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZTogVFMgZG9lc24ndCBrbm93IGFib3V0IHRoZXNlIG5hbWVzXHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmVGdW5jID0gdHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gPT09IFwiZnVuY3Rpb25cIiA/IF9fbm9uX3dlYnBhY2tfcmVxdWlyZV9fIDogcmVxdWlyZTtcclxuICAgICAgICAgICAgLy8gQ29va2llcyBhcmVuJ3QgYXV0b21hdGljYWxseSBoYW5kbGVkIGluIE5vZGUgc28gd2UgbmVlZCB0byBhZGQgYSBDb29raWVKYXIgdG8gcHJlc2VydmUgY29va2llcyBhY3Jvc3MgcmVxdWVzdHNcclxuICAgICAgICAgICAgdGhpcy5famFyID0gbmV3IChyZXF1aXJlRnVuYyhcInRvdWdoLWNvb2tpZVwiKSkuQ29va2llSmFyKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmV0Y2ggPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZldGNoVHlwZSA9IHJlcXVpcmVGdW5jKFwibm9kZS1mZXRjaFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZSBmZXRjaCBmcm9tIE5vZGUgaWYgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mZXRjaFR5cGUgPSBmZXRjaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBub2RlLWZldGNoIGRvZXNuJ3QgaGF2ZSBhIG5pY2UgQVBJIGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIGNvb2tpZXNcclxuICAgICAgICAgICAgLy8gZmV0Y2gtY29va2llIHdpbGwgd3JhcCBhIGZldGNoIGltcGxlbWVudGF0aW9uIHdpdGggYSBkZWZhdWx0IENvb2tpZUphciBvciBhIHByb3ZpZGVkIG9uZVxyXG4gICAgICAgICAgICB0aGlzLl9mZXRjaFR5cGUgPSByZXF1aXJlRnVuYyhcImZldGNoLWNvb2tpZVwiKSh0aGlzLl9mZXRjaFR5cGUsIHRoaXMuX2phcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9mZXRjaFR5cGUgPSBmZXRjaC5iaW5kKGdldEdsb2JhbFRoaXMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgQWJvcnRDb250cm9sbGVyID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGlnbm9yZSB0aGUgZHluYW1pYyByZXF1aXJlIGluIHdlYnBhY2sgYnVpbGRzIHdlIG5lZWQgdG8gZG8gdGhpcyBtYWdpY1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlOiBUUyBkb2Vzbid0IGtub3cgYWJvdXQgdGhlc2UgbmFtZXNcclxuICAgICAgICAgICAgY29uc3QgcmVxdWlyZUZ1bmMgPSB0eXBlb2YgX193ZWJwYWNrX3JlcXVpcmVfXyA9PT0gXCJmdW5jdGlvblwiID8gX19ub25fd2VicGFja19yZXF1aXJlX18gOiByZXF1aXJlO1xyXG4gICAgICAgICAgICAvLyBOb2RlIG5lZWRzIEV2ZW50TGlzdGVuZXIgbWV0aG9kcyBvbiBBYm9ydENvbnRyb2xsZXIgd2hpY2ggb3VyIGN1c3RvbSBwb2x5ZmlsbCBkb2Vzbid0IHByb3ZpZGVcclxuICAgICAgICAgICAgdGhpcy5fYWJvcnRDb250cm9sbGVyVHlwZSA9IHJlcXVpcmVGdW5jKFwiYWJvcnQtY29udHJvbGxlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlclR5cGUgPSBBYm9ydENvbnRyb2xsZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIEBpbmhlcml0RG9jICovXHJcbiAgICBhc3luYyBzZW5kKHJlcXVlc3QpIHtcclxuICAgICAgICAvLyBDaGVjayB0aGF0IGFib3J0IHdhcyBub3Qgc2lnbmFsZWQgYmVmb3JlIGNhbGxpbmcgc2VuZFxyXG4gICAgICAgIGlmIChyZXF1ZXN0LmFib3J0U2lnbmFsICYmIHJlcXVlc3QuYWJvcnRTaWduYWwuYWJvcnRlZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQWJvcnRFcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJlcXVlc3QubWV0aG9kKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIG1ldGhvZCBkZWZpbmVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXF1ZXN0LnVybCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB1cmwgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyB0aGlzLl9hYm9ydENvbnRyb2xsZXJUeXBlKCk7XHJcbiAgICAgICAgbGV0IGVycm9yO1xyXG4gICAgICAgIC8vIEhvb2sgb3VyIGFib3J0U2lnbmFsIGludG8gdGhlIGFib3J0IGNvbnRyb2xsZXJcclxuICAgICAgICBpZiAocmVxdWVzdC5hYm9ydFNpZ25hbCkge1xyXG4gICAgICAgICAgICByZXF1ZXN0LmFib3J0U2lnbmFsLm9uYWJvcnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhYm9ydENvbnRyb2xsZXIuYWJvcnQoKTtcclxuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEFib3J0RXJyb3IoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgYSB0aW1lb3V0IGhhcyBiZWVuIHBhc3NlZCBpbiwgc2V0dXAgYSB0aW1lb3V0IHRvIGNhbGwgYWJvcnRcclxuICAgICAgICAvLyBUeXBlIG5lZWRzIHRvIGJlIGFueSB0byBmaXQgd2luZG93LnNldFRpbWVvdXQgYW5kIE5vZGVKUy5zZXRUaW1lb3V0XHJcbiAgICAgICAgbGV0IHRpbWVvdXRJZCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHJlcXVlc3QudGltZW91dCkge1xyXG4gICAgICAgICAgICBjb25zdCBtc1RpbWVvdXQgPSByZXF1ZXN0LnRpbWVvdXQ7XHJcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLldhcm5pbmcsIGBUaW1lb3V0IGZyb20gSFRUUCByZXF1ZXN0LmApO1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgVGltZW91dEVycm9yKCk7XHJcbiAgICAgICAgICAgIH0sIG1zVGltZW91dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0LmNvbnRlbnQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmVxdWVzdC5jb250ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdC5jb250ZW50KSB7XHJcbiAgICAgICAgICAgIC8vIEV4cGxpY2l0bHkgc2V0dGluZyB0aGUgQ29udGVudC1UeXBlIGhlYWRlciBmb3IgUmVhY3QgTmF0aXZlIG9uIEFuZHJvaWQgcGxhdGZvcm0uXHJcbiAgICAgICAgICAgIHJlcXVlc3QuaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKGlzQXJyYXlCdWZmZXIocmVxdWVzdC5jb250ZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5oZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5fZmV0Y2hUeXBlKHJlcXVlc3QudXJsLCB7XHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogXCJuby1jYWNoZVwiLFxyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID09PSB0cnVlID8gXCJpbmNsdWRlXCIgOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJYLVJlcXVlc3RlZC1XaXRoXCI6IFwiWE1MSHR0cFJlcXVlc3RcIixcclxuICAgICAgICAgICAgICAgICAgICAuLi5yZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcclxuICAgICAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLFxyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3Q6IFwiZm9sbG93XCIsXHJcbiAgICAgICAgICAgICAgICBzaWduYWw6IGFib3J0Q29udHJvbGxlci5zaWduYWwsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYEVycm9yIGZyb20gSFRUUCByZXF1ZXN0LiAke2V9LmApO1xyXG4gICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgaWYgKHRpbWVvdXRJZCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlcXVlc3QuYWJvcnRTaWduYWwpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuYWJvcnRTaWduYWwub25hYm9ydCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBhd2FpdCBkZXNlcmlhbGl6ZUNvbnRlbnQocmVzcG9uc2UsIFwidGV4dFwiKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEh0dHBFcnJvcihlcnJvck1lc3NhZ2UgfHwgcmVzcG9uc2Uuc3RhdHVzVGV4dCwgcmVzcG9uc2Uuc3RhdHVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IGRlc2VyaWFsaXplQ29udGVudChyZXNwb25zZSwgcmVxdWVzdC5yZXNwb25zZVR5cGUpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCBjb250ZW50O1xyXG4gICAgICAgIHJldHVybiBuZXcgSHR0cFJlc3BvbnNlKHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2Uuc3RhdHVzVGV4dCwgcGF5bG9hZCk7XHJcbiAgICB9XHJcbiAgICBnZXRDb29raWVTdHJpbmcodXJsKSB7XHJcbiAgICAgICAgbGV0IGNvb2tpZXMgPSBcIlwiO1xyXG4gICAgICAgIGlmIChQbGF0Zm9ybS5pc05vZGUgJiYgdGhpcy5famFyKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IHVudXNlZCB2YXJpYWJsZVxyXG4gICAgICAgICAgICB0aGlzLl9qYXIuZ2V0Q29va2llcyh1cmwsIChlLCBjKSA9PiBjb29raWVzID0gYy5qb2luKFwiOyBcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29va2llcztcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUNvbnRlbnQocmVzcG9uc2UsIHJlc3BvbnNlVHlwZSkge1xyXG4gICAgbGV0IGNvbnRlbnQ7XHJcbiAgICBzd2l0Y2ggKHJlc3BvbnNlVHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJhcnJheWJ1ZmZlclwiOlxyXG4gICAgICAgICAgICBjb250ZW50ID0gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInRleHRcIjpcclxuICAgICAgICAgICAgY29udGVudCA9IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJsb2JcIjpcclxuICAgICAgICBjYXNlIFwiZG9jdW1lbnRcIjpcclxuICAgICAgICBjYXNlIFwianNvblwiOlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7cmVzcG9uc2VUeXBlfSBpcyBub3Qgc3VwcG9ydGVkLmApO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbnRlbnQ7XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RmV0Y2hIdHRwQ2xpZW50LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgVGV4dE1lc3NhZ2VGb3JtYXQgfSBmcm9tIFwiLi9UZXh0TWVzc2FnZUZvcm1hdFwiO1xyXG5pbXBvcnQgeyBpc0FycmF5QnVmZmVyIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBIYW5kc2hha2VQcm90b2NvbCB7XHJcbiAgICAvLyBIYW5kc2hha2UgcmVxdWVzdCBpcyBhbHdheXMgSlNPTlxyXG4gICAgd3JpdGVIYW5kc2hha2VSZXF1ZXN0KGhhbmRzaGFrZVJlcXVlc3QpIHtcclxuICAgICAgICByZXR1cm4gVGV4dE1lc3NhZ2VGb3JtYXQud3JpdGUoSlNPTi5zdHJpbmdpZnkoaGFuZHNoYWtlUmVxdWVzdCkpO1xyXG4gICAgfVxyXG4gICAgcGFyc2VIYW5kc2hha2VSZXNwb25zZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VEYXRhO1xyXG4gICAgICAgIGxldCByZW1haW5pbmdEYXRhO1xyXG4gICAgICAgIGlmIChpc0FycmF5QnVmZmVyKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIC8vIEZvcm1hdCBpcyBiaW5hcnkgYnV0IHN0aWxsIG5lZWQgdG8gcmVhZCBKU09OIHRleHQgZnJvbSBoYW5kc2hha2UgcmVzcG9uc2VcclxuICAgICAgICAgICAgY29uc3QgYmluYXJ5RGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IGJpbmFyeURhdGEuaW5kZXhPZihUZXh0TWVzc2FnZUZvcm1hdC5SZWNvcmRTZXBhcmF0b3JDb2RlKTtcclxuICAgICAgICAgICAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWVzc2FnZSBpcyBpbmNvbXBsZXRlLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb250ZW50IGJlZm9yZSBzZXBhcmF0b3IgaXMgaGFuZHNoYWtlIHJlc3BvbnNlXHJcbiAgICAgICAgICAgIC8vIG9wdGlvbmFsIGNvbnRlbnQgYWZ0ZXIgaXMgYWRkaXRpb25hbCBtZXNzYWdlc1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZUxlbmd0aCA9IHNlcGFyYXRvckluZGV4ICsgMTtcclxuICAgICAgICAgICAgbWVzc2FnZURhdGEgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJpbmFyeURhdGEuc2xpY2UoMCwgcmVzcG9uc2VMZW5ndGgpKSk7XHJcbiAgICAgICAgICAgIHJlbWFpbmluZ0RhdGEgPSAoYmluYXJ5RGF0YS5ieXRlTGVuZ3RoID4gcmVzcG9uc2VMZW5ndGgpID8gYmluYXJ5RGF0YS5zbGljZShyZXNwb25zZUxlbmd0aCkuYnVmZmVyIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHREYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSB0ZXh0RGF0YS5pbmRleE9mKFRleHRNZXNzYWdlRm9ybWF0LlJlY29yZFNlcGFyYXRvcik7XHJcbiAgICAgICAgICAgIGlmIChzZXBhcmF0b3JJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1lc3NhZ2UgaXMgaW5jb21wbGV0ZS5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29udGVudCBiZWZvcmUgc2VwYXJhdG9yIGlzIGhhbmRzaGFrZSByZXNwb25zZVxyXG4gICAgICAgICAgICAvLyBvcHRpb25hbCBjb250ZW50IGFmdGVyIGlzIGFkZGl0aW9uYWwgbWVzc2FnZXNcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VMZW5ndGggPSBzZXBhcmF0b3JJbmRleCArIDE7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VEYXRhID0gdGV4dERhdGEuc3Vic3RyaW5nKDAsIHJlc3BvbnNlTGVuZ3RoKTtcclxuICAgICAgICAgICAgcmVtYWluaW5nRGF0YSA9ICh0ZXh0RGF0YS5sZW5ndGggPiByZXNwb25zZUxlbmd0aCkgPyB0ZXh0RGF0YS5zdWJzdHJpbmcocmVzcG9uc2VMZW5ndGgpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBzaG91bGQgaGF2ZSBqdXN0IHRoZSBzaW5nbGUgaGFuZHNoYWtlIG1lc3NhZ2VcclxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFRleHRNZXNzYWdlRm9ybWF0LnBhcnNlKG1lc3NhZ2VEYXRhKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IEpTT04ucGFyc2UobWVzc2FnZXNbMF0pO1xyXG4gICAgICAgIGlmIChyZXNwb25zZS50eXBlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGEgaGFuZHNoYWtlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlci5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlTWVzc2FnZSA9IHJlc3BvbnNlO1xyXG4gICAgICAgIC8vIG11bHRpcGxlIG1lc3NhZ2VzIGNvdWxkIGhhdmUgYXJyaXZlZCB3aXRoIGhhbmRzaGFrZVxyXG4gICAgICAgIC8vIHJldHVybiBhZGRpdGlvbmFsIGRhdGEgdG8gYmUgcGFyc2VkIGFzIHVzdWFsLCBvciBudWxsIGlmIGFsbCBwYXJzZWRcclxuICAgICAgICByZXR1cm4gW3JlbWFpbmluZ0RhdGEsIHJlc3BvbnNlTWVzc2FnZV07XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SGFuZHNoYWtlUHJvdG9jb2wuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5leHBvcnQgY2xhc3MgSGVhZGVyTmFtZXMge1xyXG59XHJcbkhlYWRlck5hbWVzLkF1dGhvcml6YXRpb24gPSBcIkF1dGhvcml6YXRpb25cIjtcclxuSGVhZGVyTmFtZXMuQ29va2llID0gXCJDb29raWVcIjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SGVhZGVyTmFtZXMuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4vKiogUmVwcmVzZW50cyBhbiBIVFRQIHJlc3BvbnNlLiAqL1xyXG5leHBvcnQgY2xhc3MgSHR0cFJlc3BvbnNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXR1c0NvZGUsIHN0YXR1c1RleHQsIGNvbnRlbnQpIHtcclxuICAgICAgICB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzVGV4dCA9IHN0YXR1c1RleHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcclxuICAgIH1cclxufVxyXG4vKiogQWJzdHJhY3Rpb24gb3ZlciBhbiBIVFRQIGNsaWVudC5cclxuICpcclxuICogVGhpcyBjbGFzcyBwcm92aWRlcyBhbiBhYnN0cmFjdGlvbiBvdmVyIGFuIEhUVFAgY2xpZW50IHNvIHRoYXQgYSBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb24gY2FuIGJlIHByb3ZpZGVkIG9uIGRpZmZlcmVudCBwbGF0Zm9ybXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBnZXQodXJsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCh7XHJcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcG9zdCh1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZW5kKHtcclxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlbmQoe1xyXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKiBHZXRzIGFsbCBjb29raWVzIHRoYXQgYXBwbHkgdG8gdGhlIHNwZWNpZmllZCBVUkwuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgVVJMIHRoYXQgdGhlIGNvb2tpZXMgYXJlIHZhbGlkIGZvci5cclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIGNvbnRhaW5pbmcgYWxsIHRoZSBrZXktdmFsdWUgY29va2llIHBhaXJzIGZvciB0aGUgc3BlY2lmaWVkIFVSTC5cclxuICAgICAqL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgZ2V0Q29va2llU3RyaW5nKHVybCkge1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUh0dHBDbGllbnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBBY2Nlc3NUb2tlbkh0dHBDbGllbnQgfSBmcm9tIFwiLi9BY2Nlc3NUb2tlbkh0dHBDbGllbnRcIjtcclxuaW1wb3J0IHsgRGVmYXVsdEh0dHBDbGllbnQgfSBmcm9tIFwiLi9EZWZhdWx0SHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBBZ2dyZWdhdGVFcnJvcnMsIERpc2FibGVkVHJhbnNwb3J0RXJyb3IsIEZhaWxlZFRvTmVnb3RpYXRlV2l0aFNlcnZlckVycm9yLCBGYWlsZWRUb1N0YXJ0VHJhbnNwb3J0RXJyb3IsIEh0dHBFcnJvciwgVW5zdXBwb3J0ZWRUcmFuc3BvcnRFcnJvciwgQWJvcnRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgSHR0cFRyYW5zcG9ydFR5cGUsIFRyYW5zZmVyRm9ybWF0IH0gZnJvbSBcIi4vSVRyYW5zcG9ydFwiO1xyXG5pbXBvcnQgeyBMb25nUG9sbGluZ1RyYW5zcG9ydCB9IGZyb20gXCIuL0xvbmdQb2xsaW5nVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IFNlcnZlclNlbnRFdmVudHNUcmFuc3BvcnQgfSBmcm9tIFwiLi9TZXJ2ZXJTZW50RXZlbnRzVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IEFyZywgY3JlYXRlTG9nZ2VyLCBnZXRVc2VyQWdlbnRIZWFkZXIsIFBsYXRmb3JtIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuaW1wb3J0IHsgV2ViU29ja2V0VHJhbnNwb3J0IH0gZnJvbSBcIi4vV2ViU29ja2V0VHJhbnNwb3J0XCI7XHJcbmNvbnN0IE1BWF9SRURJUkVDVFMgPSAxMDA7XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgSHR0cENvbm5lY3Rpb24ge1xyXG4gICAgY29uc3RydWN0b3IodXJsLCBvcHRpb25zID0ge30pIHtcclxuICAgICAgICB0aGlzLl9zdG9wUHJvbWlzZVJlc29sdmVyID0gKCkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB7fTtcclxuICAgICAgICB0aGlzLl9uZWdvdGlhdGVWZXJzaW9uID0gMTtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZCh1cmwsIFwidXJsXCIpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGNyZWF0ZUxvZ2dlcihvcHRpb25zLmxvZ2dlcik7XHJcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gdGhpcy5fcmVzb2x2ZVVybCh1cmwpO1xyXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIG9wdGlvbnMubG9nTWVzc2FnZUNvbnRlbnQgPSBvcHRpb25zLmxvZ01lc3NhZ2VDb250ZW50ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IG9wdGlvbnMubG9nTWVzc2FnZUNvbnRlbnQ7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLndpdGhDcmVkZW50aWFscyA9PT0gXCJib29sZWFuXCIgfHwgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHRpb25zLndpdGhDcmVkZW50aWFscyA9IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzID09PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ3aXRoQ3JlZGVudGlhbHMgb3B0aW9uIHdhcyBub3QgYSAnYm9vbGVhbicgb3IgJ3VuZGVmaW5lZCcgdmFsdWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wdGlvbnMudGltZW91dCA9IG9wdGlvbnMudGltZW91dCA9PT0gdW5kZWZpbmVkID8gMTAwICogMTAwMCA6IG9wdGlvbnMudGltZW91dDtcclxuICAgICAgICBsZXQgd2ViU29ja2V0TW9kdWxlID0gbnVsbDtcclxuICAgICAgICBsZXQgZXZlbnRTb3VyY2VNb2R1bGUgPSBudWxsO1xyXG4gICAgICAgIGlmIChQbGF0Zm9ybS5pc05vZGUgJiYgdHlwZW9mIHJlcXVpcmUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgLy8gSW4gb3JkZXIgdG8gaWdub3JlIHRoZSBkeW5hbWljIHJlcXVpcmUgaW4gd2VicGFjayBidWlsZHMgd2UgbmVlZCB0byBkbyB0aGlzIG1hZ2ljXHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IFRTIGRvZXNuJ3Qga25vdyBhYm91dCB0aGVzZSBuYW1lc1xyXG4gICAgICAgICAgICBjb25zdCByZXF1aXJlRnVuYyA9IHR5cGVvZiBfX3dlYnBhY2tfcmVxdWlyZV9fID09PSBcImZ1bmN0aW9uXCIgPyBfX25vbl93ZWJwYWNrX3JlcXVpcmVfXyA6IHJlcXVpcmU7XHJcbiAgICAgICAgICAgIHdlYlNvY2tldE1vZHVsZSA9IHJlcXVpcmVGdW5jKFwid3NcIik7XHJcbiAgICAgICAgICAgIGV2ZW50U291cmNlTW9kdWxlID0gcmVxdWlyZUZ1bmMoXCJldmVudHNvdXJjZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFQbGF0Zm9ybS5pc05vZGUgJiYgdHlwZW9mIFdlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhb3B0aW9ucy5XZWJTb2NrZXQpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5XZWJTb2NrZXQgPSBXZWJTb2NrZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFBsYXRmb3JtLmlzTm9kZSAmJiAhb3B0aW9ucy5XZWJTb2NrZXQpIHtcclxuICAgICAgICAgICAgaWYgKHdlYlNvY2tldE1vZHVsZSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5XZWJTb2NrZXQgPSB3ZWJTb2NrZXRNb2R1bGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFQbGF0Zm9ybS5pc05vZGUgJiYgdHlwZW9mIEV2ZW50U291cmNlICE9PSBcInVuZGVmaW5lZFwiICYmICFvcHRpb25zLkV2ZW50U291cmNlKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuRXZlbnRTb3VyY2UgPSBFdmVudFNvdXJjZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoUGxhdGZvcm0uaXNOb2RlICYmICFvcHRpb25zLkV2ZW50U291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRTb3VyY2VNb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuRXZlbnRTb3VyY2UgPSBldmVudFNvdXJjZU1vZHVsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9odHRwQ2xpZW50ID0gbmV3IEFjY2Vzc1Rva2VuSHR0cENsaWVudChvcHRpb25zLmh0dHBDbGllbnQgfHwgbmV3IERlZmF1bHRIdHRwQ2xpZW50KHRoaXMuX2xvZ2dlciksIG9wdGlvbnMuYWNjZXNzVG9rZW5GYWN0b3J5KTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBcIkRpc2Nvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQgKi87XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB0aGlzLm9ucmVjZWl2ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbmNsb3NlID0gbnVsbDtcclxuICAgIH1cclxuICAgIGFzeW5jIHN0YXJ0KHRyYW5zZmVyRm9ybWF0KSB7XHJcbiAgICAgICAgdHJhbnNmZXJGb3JtYXQgPSB0cmFuc2ZlckZvcm1hdCB8fCBUcmFuc2ZlckZvcm1hdC5CaW5hcnk7XHJcbiAgICAgICAgQXJnLmlzSW4odHJhbnNmZXJGb3JtYXQsIFRyYW5zZmVyRm9ybWF0LCBcInRyYW5zZmVyRm9ybWF0XCIpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBTdGFydGluZyBjb25uZWN0aW9uIHdpdGggdHJhbnNmZXIgZm9ybWF0ICcke1RyYW5zZmVyRm9ybWF0W3RyYW5zZmVyRm9ybWF0XX0nLmApO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IFwiRGlzY29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCAqLykge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHN0YXJ0IGFuIEh0dHBDb25uZWN0aW9uIHRoYXQgaXMgbm90IGluIHRoZSAnRGlzY29ubmVjdGVkJyBzdGF0ZS5cIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBcIkNvbm5lY3RpbmdcIiAvKiBDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGluZyAqLztcclxuICAgICAgICB0aGlzLl9zdGFydEludGVybmFsUHJvbWlzZSA9IHRoaXMuX3N0YXJ0SW50ZXJuYWwodHJhbnNmZXJGb3JtYXQpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuX3N0YXJ0SW50ZXJuYWxQcm9taXNlO1xyXG4gICAgICAgIC8vIFRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyIHRoaW5rcyB0aGF0IGNvbm5lY3Rpb25TdGF0ZSBtdXN0IGJlIENvbm5lY3RpbmcgaGVyZS4gVGhlIFR5cGVTY3JpcHQgY29tcGlsZXIgaXMgd3JvbmcuXHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gXCJEaXNjb25uZWN0aW5nXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcgKi8pIHtcclxuICAgICAgICAgICAgLy8gc3RvcCgpIHdhcyBjYWxsZWQgYW5kIHRyYW5zaXRpb25lZCB0aGUgY2xpZW50IGludG8gdGhlIERpc2Nvbm5lY3Rpbmcgc3RhdGUuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIkZhaWxlZCB0byBzdGFydCB0aGUgSHR0cENvbm5lY3Rpb24gYmVmb3JlIHN0b3AoKSB3YXMgY2FsbGVkLlwiO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgLy8gV2UgY2Fubm90IGF3YWl0IHN0b3BQcm9taXNlIGluc2lkZSBzdGFydEludGVybmFsIHNpbmNlIHN0b3BJbnRlcm5hbCBhd2FpdHMgdGhlIHN0YXJ0SW50ZXJuYWxQcm9taXNlLlxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zdG9wUHJvbWlzZTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBYm9ydEVycm9yKG1lc3NhZ2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlICE9PSBcIkNvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgLy8gc3RvcCgpIHdhcyBjYWxsZWQgYW5kIHRyYW5zaXRpb25lZCB0aGUgY2xpZW50IGludG8gdGhlIERpc2Nvbm5lY3Rpbmcgc3RhdGUuXHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIkh0dHBDb25uZWN0aW9uLnN0YXJ0SW50ZXJuYWwgY29tcGxldGVkIGdyYWNlZnVsbHkgYnV0IGRpZG4ndCBlbnRlciB0aGUgY29ubmVjdGlvbiBpbnRvIHRoZSBjb25uZWN0ZWQgc3RhdGUhXCI7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFib3J0RXJyb3IobWVzc2FnZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhcnRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBzZW5kKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlICE9PSBcIkNvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBzZW5kIGRhdGEgaWYgdGhlIGNvbm5lY3Rpb24gaXMgbm90IGluIHRoZSAnQ29ubmVjdGVkJyBTdGF0ZS5cIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX3NlbmRRdWV1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZW5kUXVldWUgPSBuZXcgVHJhbnNwb3J0U2VuZFF1ZXVlKHRoaXMudHJhbnNwb3J0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVHJhbnNwb3J0IHdpbGwgbm90IGJlIG51bGwgaWYgc3RhdGUgaXMgY29ubmVjdGVkXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmRRdWV1ZS5zZW5kKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RvcChlcnJvcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiRGlzY29ubmVjdGVkXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCAqLykge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgQ2FsbCB0byBIdHRwQ29ubmVjdGlvbi5zdG9wKCR7ZXJyb3J9KSBpZ25vcmVkIGJlY2F1c2UgdGhlIGNvbm5lY3Rpb24gaXMgYWxyZWFkeSBpbiB0aGUgZGlzY29ubmVjdGVkIHN0YXRlLmApO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiRGlzY29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0aW5nICovKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBDYWxsIHRvIEh0dHBDb25uZWN0aW9uLnN0b3AoJHtlcnJvcn0pIGlnbm9yZWQgYmVjYXVzZSB0aGUgY29ubmVjdGlvbiBpcyBhbHJlYWR5IGluIHRoZSBkaXNjb25uZWN0aW5nIHN0YXRlLmApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcFByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IFwiRGlzY29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0aW5nICovO1xyXG4gICAgICAgIHRoaXMuX3N0b3BQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgLy8gRG9uJ3QgY29tcGxldGUgc3RvcCgpIHVudGlsIHN0b3BDb25uZWN0aW9uKCkgY29tcGxldGVzLlxyXG4gICAgICAgICAgICB0aGlzLl9zdG9wUHJvbWlzZVJlc29sdmVyID0gcmVzb2x2ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzdG9wSW50ZXJuYWwgc2hvdWxkIG5ldmVyIHRocm93IHNvIGp1c3Qgb2JzZXJ2ZSBpdC5cclxuICAgICAgICBhd2FpdCB0aGlzLl9zdG9wSW50ZXJuYWwoZXJyb3IpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuX3N0b3BQcm9taXNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX3N0b3BJbnRlcm5hbChlcnJvcikge1xyXG4gICAgICAgIC8vIFNldCBlcnJvciBhcyBzb29uIGFzIHBvc3NpYmxlIG90aGVyd2lzZSB0aGVyZSBpcyBhIHJhY2UgYmV0d2VlblxyXG4gICAgICAgIC8vIHRoZSB0cmFuc3BvcnQgY2xvc2luZyBhbmQgcHJvdmlkaW5nIGFuIGVycm9yIGFuZCB0aGUgZXJyb3IgZnJvbSBhIGNsb3NlIG1lc3NhZ2VcclxuICAgICAgICAvLyBXZSB3b3VsZCBwcmVmZXIgdGhlIGNsb3NlIG1lc3NhZ2UgZXJyb3IuXHJcbiAgICAgICAgdGhpcy5fc3RvcEVycm9yID0gZXJyb3I7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRJbnRlcm5hbFByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgZXhjZXB0aW9uIGlzIHJldHVybmVkIHRvIHRoZSB1c2VyIGFzIGEgcmVqZWN0ZWQgUHJvbWlzZSBmcm9tIHRoZSBzdGFydCBtZXRob2QuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFRoZSB0cmFuc3BvcnQncyBvbmNsb3NlIHdpbGwgdHJpZ2dlciBzdG9wQ29ubmVjdGlvbiB3aGljaCB3aWxsIHJ1biBvdXIgb25jbG9zZSBldmVudC5cclxuICAgICAgICAvLyBUaGUgdHJhbnNwb3J0IHNob3VsZCBhbHdheXMgYmUgc2V0IGlmIGN1cnJlbnRseSBjb25uZWN0ZWQuIElmIGl0IHdhc24ndCBzZXQsIGl0J3MgbGlrZWx5IGJlY2F1c2VcclxuICAgICAgICAvLyBzdG9wIHdhcyBjYWxsZWQgZHVyaW5nIHN0YXJ0KCkgYW5kIHN0YXJ0KCkgZmFpbGVkLlxyXG4gICAgICAgIGlmICh0aGlzLnRyYW5zcG9ydCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy50cmFuc3BvcnQuc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgSHR0cENvbm5lY3Rpb24udHJhbnNwb3J0LnN0b3AoKSB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdG9wQ29ubmVjdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJIdHRwQ29ubmVjdGlvbi50cmFuc3BvcnQgaXMgdW5kZWZpbmVkIGluIEh0dHBDb25uZWN0aW9uLnN0b3AoKSBiZWNhdXNlIHN0YXJ0KCkgZmFpbGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBfc3RhcnRJbnRlcm5hbCh0cmFuc2ZlckZvcm1hdCkge1xyXG4gICAgICAgIC8vIFN0b3JlIHRoZSBvcmlnaW5hbCBiYXNlIHVybCBhbmQgdGhlIGFjY2VzcyB0b2tlbiBmYWN0b3J5IHNpbmNlIHRoZXkgbWF5IGNoYW5nZVxyXG4gICAgICAgIC8vIGFzIHBhcnQgb2YgbmVnb3RpYXRpbmdcclxuICAgICAgICBsZXQgdXJsID0gdGhpcy5iYXNlVXJsO1xyXG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSA9IHRoaXMuX29wdGlvbnMuYWNjZXNzVG9rZW5GYWN0b3J5O1xyXG4gICAgICAgIHRoaXMuX2h0dHBDbGllbnQuX2FjY2Vzc1Rva2VuRmFjdG9yeSA9IHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5za2lwTmVnb3RpYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9ydCA9PT0gSHR0cFRyYW5zcG9ydFR5cGUuV2ViU29ja2V0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gYWRkIGEgY29ubmVjdGlvbiBJRCBpbiB0aGlzIGNhc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydCA9IHRoaXMuX2NvbnN0cnVjdFRyYW5zcG9ydChIdHRwVHJhbnNwb3J0VHlwZS5XZWJTb2NrZXRzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBzaG91bGQganVzdCBjYWxsIGNvbm5lY3QgZGlyZWN0bHkgaW4gdGhpcyBjYXNlLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGZhbGxiYWNrIG9yIG5lZ290aWF0ZSBpbiB0aGlzIGNhc2UuXHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRUcmFuc3BvcnQodXJsLCB0cmFuc2ZlckZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZWdvdGlhdGlvbiBjYW4gb25seSBiZSBza2lwcGVkIHdoZW4gdXNpbmcgdGhlIFdlYlNvY2tldCB0cmFuc3BvcnQgZGlyZWN0bHkuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5lZ290aWF0ZVJlc3BvbnNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGxldCByZWRpcmVjdHMgPSAwO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5lZ290aWF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5fZ2V0TmVnb3RpYXRpb25SZXNwb25zZSh1cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSB1c2VyIHRyaWVzIHRvIHN0b3AgdGhlIGNvbm5lY3Rpb24gd2hlbiBpdCBpcyBiZWluZyBzdGFydGVkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gXCJEaXNjb25uZWN0aW5nXCIgLyogQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcgKi8gfHwgdGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBcIkRpc2Nvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFib3J0RXJyb3IoXCJUaGUgY29ubmVjdGlvbiB3YXMgc3RvcHBlZCBkdXJpbmcgbmVnb3RpYXRpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmVnb3RpYXRlUmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5lZ290aWF0ZVJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZ290aWF0ZVJlc3BvbnNlLlByb3RvY29sVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXRlY3RlZCBhIGNvbm5lY3Rpb24gYXR0ZW1wdCB0byBhbiBBU1AuTkVUIFNpZ25hbFIgU2VydmVyLiBUaGlzIGNsaWVudCBvbmx5IHN1cHBvcnRzIGNvbm5lY3RpbmcgdG8gYW4gQVNQLk5FVCBDb3JlIFNpZ25hbFIgU2VydmVyLiBTZWUgaHR0cHM6Ly9ha2EubXMvc2lnbmFsci1jb3JlLWRpZmZlcmVuY2VzIGZvciBkZXRhaWxzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZ290aWF0ZVJlc3BvbnNlLnVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBuZWdvdGlhdGVSZXNwb25zZS51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZWdvdGlhdGVSZXNwb25zZS5hY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBjdXJyZW50IGFjY2VzcyB0b2tlbiBmYWN0b3J5IHdpdGggb25lIHRoYXQgdXNlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmV0dXJuZWQgYWNjZXNzIHRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gbmVnb3RpYXRlUmVzcG9uc2UuYWNjZXNzVG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSA9ICgpID0+IGFjY2Vzc1Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIGZhY3RvcnkgdG8gdW5kZWZpbmVkIHNvIHRoZSBBY2Nlc3NUb2tlbkh0dHBDbGllbnQgd29uJ3QgcmV0cnkgd2l0aCB0aGUgc2FtZSB0b2tlbiwgc2luY2Ugd2Uga25vdyBpdCB3b24ndCBjaGFuZ2UgdW50aWwgYSBjb25uZWN0aW9uIHJlc3RhcnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faHR0cENsaWVudC5fYWNjZXNzVG9rZW4gPSBhY2Nlc3NUb2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faHR0cENsaWVudC5fYWNjZXNzVG9rZW5GYWN0b3J5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdHMrKztcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKG5lZ290aWF0ZVJlc3BvbnNlLnVybCAmJiByZWRpcmVjdHMgPCBNQVhfUkVESVJFQ1RTKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWRpcmVjdHMgPT09IE1BWF9SRURJUkVDVFMgJiYgbmVnb3RpYXRlUmVzcG9uc2UudXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVnb3RpYXRlIHJlZGlyZWN0aW9uIGxpbWl0IGV4Y2VlZGVkLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2NyZWF0ZVRyYW5zcG9ydCh1cmwsIHRoaXMuX29wdGlvbnMudHJhbnNwb3J0LCBuZWdvdGlhdGVSZXNwb25zZSwgdHJhbnNmZXJGb3JtYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zcG9ydCBpbnN0YW5jZW9mIExvbmdQb2xsaW5nVHJhbnNwb3J0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZlYXR1cmVzLmluaGVyZW50S2VlcEFsaXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBcIkNvbm5lY3RpbmdcIiAvKiBDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGluZyAqLykge1xyXG4gICAgICAgICAgICAgICAgLy8gRW5zdXJlIHRoZSBjb25uZWN0aW9uIHRyYW5zaXRpb25zIHRvIHRoZSBjb25uZWN0ZWQgc3RhdGUgcHJpb3IgdG8gY29tcGxldGluZyB0aGlzLnN0YXJ0SW50ZXJuYWxQcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgLy8gc3RhcnQoKSB3aWxsIGhhbmRsZSB0aGUgY2FzZSB3aGVuIHN0b3Agd2FzIGNhbGxlZCBhbmQgc3RhcnRJbnRlcm5hbCBleGl0cyBzdGlsbCBpbiB0aGUgZGlzY29ubmVjdGluZyBzdGF0ZS5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIFwiVGhlIEh0dHBDb25uZWN0aW9uIGNvbm5lY3RlZCBzdWNjZXNzZnVsbHkuXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gXCJDb25uZWN0ZWRcIiAvKiBDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkICovO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHN0b3AoKSBpcyB3YWl0aW5nIG9uIHVzIHZpYSB0aGlzLnN0YXJ0SW50ZXJuYWxQcm9taXNlIHNvIGtlZXAgdGhpcy50cmFuc3BvcnQgYXJvdW5kIHNvIGl0IGNhbiBjbGVhbiB1cC5cclxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgb25seSBjYXNlIHN0YXJ0SW50ZXJuYWwgY2FuIGV4aXQgaW4gbmVpdGhlciB0aGUgY29ubmVjdGVkIG5vciBkaXNjb25uZWN0ZWQgc3RhdGUgYmVjYXVzZSBzdG9wQ29ubmVjdGlvbigpXHJcbiAgICAgICAgICAgIC8vIHdpbGwgdHJhbnNpdGlvbiB0byB0aGUgZGlzY29ubmVjdGVkIHN0YXRlLiBzdGFydCgpIHdpbGwgd2FpdCBmb3IgdGhlIHRyYW5zaXRpb24gdXNpbmcgdGhlIHN0b3BQcm9taXNlLlxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBcIkZhaWxlZCB0byBzdGFydCB0aGUgY29ubmVjdGlvbjogXCIgKyBlKTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gXCJEaXNjb25uZWN0ZWRcIiAvKiBDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkICovO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zcG9ydCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgLy8gaWYgc3RhcnQgZmFpbHMsIGFueSBhY3RpdmUgY2FsbHMgdG8gc3RvcCBhc3N1bWUgdGhhdCBzdGFydCB3aWxsIGNvbXBsZXRlIHRoZSBzdG9wIHByb21pc2VcclxuICAgICAgICAgICAgdGhpcy5fc3RvcFByb21pc2VSZXNvbHZlcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgX2dldE5lZ290aWF0aW9uUmVzcG9uc2UodXJsKSB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHt9O1xyXG4gICAgICAgIGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSBnZXRVc2VyQWdlbnRIZWFkZXIoKTtcclxuICAgICAgICBoZWFkZXJzW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgY29uc3QgbmVnb3RpYXRlVXJsID0gdGhpcy5fcmVzb2x2ZU5lZ290aWF0ZVVybCh1cmwpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBTZW5kaW5nIG5lZ290aWF0aW9uIHJlcXVlc3Q6ICR7bmVnb3RpYXRlVXJsfS5gKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2h0dHBDbGllbnQucG9zdChuZWdvdGlhdGVVcmwsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IC4uLmhlYWRlcnMsIC4uLnRoaXMuX29wdGlvbnMuaGVhZGVycyB9LFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogdGhpcy5fb3B0aW9ucy50aW1lb3V0LFxyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlICE9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgc3RhdHVzIGNvZGUgcmV0dXJuZWQgZnJvbSBuZWdvdGlhdGUgJyR7cmVzcG9uc2Uuc3RhdHVzQ29kZX0nYCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG5lZ290aWF0ZVJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZS5jb250ZW50KTtcclxuICAgICAgICAgICAgaWYgKCFuZWdvdGlhdGVSZXNwb25zZS5uZWdvdGlhdGVWZXJzaW9uIHx8IG5lZ290aWF0ZVJlc3BvbnNlLm5lZ290aWF0ZVZlcnNpb24gPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBOZWdvdGlhdGUgdmVyc2lvbiAwIGRvZXNuJ3QgdXNlIGNvbm5lY3Rpb25Ub2tlblxyXG4gICAgICAgICAgICAgICAgLy8gU28gd2Ugc2V0IGl0IGVxdWFsIHRvIGNvbm5lY3Rpb25JZCBzbyBhbGwgb3VyIGxvZ2ljIGNhbiB1c2UgY29ubmVjdGlvblRva2VuIHdpdGhvdXQgYmVpbmcgYXdhcmUgb2YgdGhlIG5lZ290aWF0ZSB2ZXJzaW9uXHJcbiAgICAgICAgICAgICAgICBuZWdvdGlhdGVSZXNwb25zZS5jb25uZWN0aW9uVG9rZW4gPSBuZWdvdGlhdGVSZXNwb25zZS5jb25uZWN0aW9uSWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5lZ290aWF0ZVJlc3BvbnNlLnVzZVN0YXRlZnVsUmVjb25uZWN0ICYmIHRoaXMuX29wdGlvbnMuX3VzZVN0YXRlZnVsUmVjb25uZWN0ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEZhaWxlZFRvTmVnb3RpYXRlV2l0aFNlcnZlckVycm9yKFwiQ2xpZW50IGRpZG4ndCBuZWdvdGlhdGUgU3RhdGVmdWwgUmVjb25uZWN0IGJ1dCB0aGUgc2VydmVyIGRpZC5cIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZWdvdGlhdGVSZXNwb25zZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9IFwiRmFpbGVkIHRvIGNvbXBsZXRlIG5lZ290aWF0aW9uIHdpdGggdGhlIHNlcnZlcjogXCIgKyBlO1xyXG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEh0dHBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuc3RhdHVzQ29kZSA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlICsgXCIgRWl0aGVyIHRoaXMgaXMgbm90IGEgU2lnbmFsUiBlbmRwb2ludCBvciB0aGVyZSBpcyBhIHByb3h5IGJsb2NraW5nIHRoZSBjb25uZWN0aW9uLlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRmFpbGVkVG9OZWdvdGlhdGVXaXRoU2VydmVyRXJyb3IoZXJyb3JNZXNzYWdlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2NyZWF0ZUNvbm5lY3RVcmwodXJsLCBjb25uZWN0aW9uVG9rZW4pIHtcclxuICAgICAgICBpZiAoIWNvbm5lY3Rpb25Ub2tlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsICsgKHVybC5pbmRleE9mKFwiP1wiKSA9PT0gLTEgPyBcIj9cIiA6IFwiJlwiKSArIGBpZD0ke2Nvbm5lY3Rpb25Ub2tlbn1gO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX2NyZWF0ZVRyYW5zcG9ydCh1cmwsIHJlcXVlc3RlZFRyYW5zcG9ydCwgbmVnb3RpYXRlUmVzcG9uc2UsIHJlcXVlc3RlZFRyYW5zZmVyRm9ybWF0KSB7XHJcbiAgICAgICAgbGV0IGNvbm5lY3RVcmwgPSB0aGlzLl9jcmVhdGVDb25uZWN0VXJsKHVybCwgbmVnb3RpYXRlUmVzcG9uc2UuY29ubmVjdGlvblRva2VuKTtcclxuICAgICAgICBpZiAodGhpcy5faXNJVHJhbnNwb3J0KHJlcXVlc3RlZFRyYW5zcG9ydCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJDb25uZWN0aW9uIHdhcyBwcm92aWRlZCBhbiBpbnN0YW5jZSBvZiBJVHJhbnNwb3J0LCB1c2luZyB0aGF0IGRpcmVjdGx5LlwiKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQgPSByZXF1ZXN0ZWRUcmFuc3BvcnQ7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0YXJ0VHJhbnNwb3J0KGNvbm5lY3RVcmwsIHJlcXVlc3RlZFRyYW5zZmVyRm9ybWF0KTtcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uSWQgPSBuZWdvdGlhdGVSZXNwb25zZS5jb25uZWN0aW9uSWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdHJhbnNwb3J0RXhjZXB0aW9ucyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zcG9ydHMgPSBuZWdvdGlhdGVSZXNwb25zZS5hdmFpbGFibGVUcmFuc3BvcnRzIHx8IFtdO1xyXG4gICAgICAgIGxldCBuZWdvdGlhdGUgPSBuZWdvdGlhdGVSZXNwb25zZTtcclxuICAgICAgICBmb3IgKGNvbnN0IGVuZHBvaW50IG9mIHRyYW5zcG9ydHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNwb3J0T3JFcnJvciA9IHRoaXMuX3Jlc29sdmVUcmFuc3BvcnRPckVycm9yKGVuZHBvaW50LCByZXF1ZXN0ZWRUcmFuc3BvcnQsIHJlcXVlc3RlZFRyYW5zZmVyRm9ybWF0LCAobmVnb3RpYXRlID09PSBudWxsIHx8IG5lZ290aWF0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmVnb3RpYXRlLnVzZVN0YXRlZnVsUmVjb25uZWN0KSA9PT0gdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc3BvcnRPckVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBlcnJvciBhbmQgY29udGludWUsIHdlIGRvbid0IHdhbnQgdG8gY2F1c2UgYSByZS1uZWdvdGlhdGUgaW4gdGhlc2UgY2FzZXNcclxuICAgICAgICAgICAgICAgIHRyYW5zcG9ydEV4Y2VwdGlvbnMucHVzaChgJHtlbmRwb2ludC50cmFuc3BvcnR9IGZhaWxlZDpgKTtcclxuICAgICAgICAgICAgICAgIHRyYW5zcG9ydEV4Y2VwdGlvbnMucHVzaCh0cmFuc3BvcnRPckVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9pc0lUcmFuc3BvcnQodHJhbnNwb3J0T3JFcnJvcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0T3JFcnJvcjtcclxuICAgICAgICAgICAgICAgIGlmICghbmVnb3RpYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmVnb3RpYXRlID0gYXdhaXQgdGhpcy5fZ2V0TmVnb3RpYXRpb25SZXNwb25zZSh1cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdFVybCA9IHRoaXMuX2NyZWF0ZUNvbm5lY3RVcmwodXJsLCBuZWdvdGlhdGUuY29ubmVjdGlvblRva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRUcmFuc3BvcnQoY29ubmVjdFVybCwgcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbklkID0gbmVnb3RpYXRlLmNvbm5lY3Rpb25JZDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgRmFpbGVkIHRvIHN0YXJ0IHRoZSB0cmFuc3BvcnQgJyR7ZW5kcG9pbnQudHJhbnNwb3J0fSc6ICR7ZXh9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmVnb3RpYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydEV4Y2VwdGlvbnMucHVzaChuZXcgRmFpbGVkVG9TdGFydFRyYW5zcG9ydEVycm9yKGAke2VuZHBvaW50LnRyYW5zcG9ydH0gZmFpbGVkOiAke2V4fWAsIEh0dHBUcmFuc3BvcnRUeXBlW2VuZHBvaW50LnRyYW5zcG9ydF0pKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlICE9PSBcIkNvbm5lY3RpbmdcIiAvKiBDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGluZyAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gXCJGYWlsZWQgdG8gc2VsZWN0IHRyYW5zcG9ydCBiZWZvcmUgc3RvcCgpIHdhcyBjYWxsZWQuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFib3J0RXJyb3IobWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHJhbnNwb3J0RXhjZXB0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQWdncmVnYXRlRXJyb3JzKGBVbmFibGUgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyIHdpdGggYW55IG9mIHRoZSBhdmFpbGFibGUgdHJhbnNwb3J0cy4gJHt0cmFuc3BvcnRFeGNlcHRpb25zLmpvaW4oXCIgXCIpfWAsIHRyYW5zcG9ydEV4Y2VwdGlvbnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk5vbmUgb2YgdGhlIHRyYW5zcG9ydHMgc3VwcG9ydGVkIGJ5IHRoZSBjbGllbnQgYXJlIHN1cHBvcnRlZCBieSB0aGUgc2VydmVyLlwiKSk7XHJcbiAgICB9XHJcbiAgICBfY29uc3RydWN0VHJhbnNwb3J0KHRyYW5zcG9ydCkge1xyXG4gICAgICAgIHN3aXRjaCAodHJhbnNwb3J0KSB7XHJcbiAgICAgICAgICAgIGNhc2UgSHR0cFRyYW5zcG9ydFR5cGUuV2ViU29ja2V0czpcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fb3B0aW9ucy5XZWJTb2NrZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInV2ViU29ja2V0JyBpcyBub3Qgc3VwcG9ydGVkIGluIHlvdXIgZW52aXJvbm1lbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBXZWJTb2NrZXRUcmFuc3BvcnQodGhpcy5faHR0cENsaWVudCwgdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5LCB0aGlzLl9sb2dnZXIsIHRoaXMuX29wdGlvbnMubG9nTWVzc2FnZUNvbnRlbnQsIHRoaXMuX29wdGlvbnMuV2ViU29ja2V0LCB0aGlzLl9vcHRpb25zLmhlYWRlcnMgfHwge30pO1xyXG4gICAgICAgICAgICBjYXNlIEh0dHBUcmFuc3BvcnRUeXBlLlNlcnZlclNlbnRFdmVudHM6XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnMuRXZlbnRTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInRXZlbnRTb3VyY2UnIGlzIG5vdCBzdXBwb3J0ZWQgaW4geW91ciBlbnZpcm9ubWVudC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNlcnZlclNlbnRFdmVudHNUcmFuc3BvcnQodGhpcy5faHR0cENsaWVudCwgdGhpcy5faHR0cENsaWVudC5fYWNjZXNzVG9rZW4sIHRoaXMuX2xvZ2dlciwgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNhc2UgSHR0cFRyYW5zcG9ydFR5cGUuTG9uZ1BvbGxpbmc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExvbmdQb2xsaW5nVHJhbnNwb3J0KHRoaXMuX2h0dHBDbGllbnQsIHRoaXMuX2xvZ2dlciwgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHJhbnNwb3J0OiAke3RyYW5zcG9ydH0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX3N0YXJ0VHJhbnNwb3J0KHVybCwgdHJhbnNmZXJGb3JtYXQpIHtcclxuICAgICAgICB0aGlzLnRyYW5zcG9ydC5vbnJlY2VpdmUgPSB0aGlzLm9ucmVjZWl2ZTtcclxuICAgICAgICBpZiAodGhpcy5mZWF0dXJlcy5yZWNvbm5lY3QpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQub25jbG9zZSA9IGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FsbFN0b3AgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZlYXR1cmVzLnJlY29ubmVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmVhdHVyZXMuZGlzY29ubmVjdGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudHJhbnNwb3J0LmNvbm5lY3QodXJsLCB0cmFuc2ZlckZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmVhdHVyZXMucmVzZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFN0b3AgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BDb25uZWN0aW9uKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjYWxsU3RvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BDb25uZWN0aW9uKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQub25jbG9zZSA9IChlKSA9PiB0aGlzLl9zdG9wQ29ubmVjdGlvbihlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LmNvbm5lY3QodXJsLCB0cmFuc2ZlckZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICBfcmVzb2x2ZVRyYW5zcG9ydE9yRXJyb3IoZW5kcG9pbnQsIHJlcXVlc3RlZFRyYW5zcG9ydCwgcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXQsIHVzZVN0YXRlZnVsUmVjb25uZWN0KSB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNwb3J0ID0gSHR0cFRyYW5zcG9ydFR5cGVbZW5kcG9pbnQudHJhbnNwb3J0XTtcclxuICAgICAgICBpZiAodHJhbnNwb3J0ID09PSBudWxsIHx8IHRyYW5zcG9ydCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBTa2lwcGluZyB0cmFuc3BvcnQgJyR7ZW5kcG9pbnQudHJhbnNwb3J0fScgYmVjYXVzZSBpdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgY2xpZW50LmApO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKGBTa2lwcGluZyB0cmFuc3BvcnQgJyR7ZW5kcG9pbnQudHJhbnNwb3J0fScgYmVjYXVzZSBpdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgY2xpZW50LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRyYW5zcG9ydE1hdGNoZXMocmVxdWVzdGVkVHJhbnNwb3J0LCB0cmFuc3BvcnQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2ZlckZvcm1hdHMgPSBlbmRwb2ludC50cmFuc2ZlckZvcm1hdHMubWFwKChzKSA9PiBUcmFuc2ZlckZvcm1hdFtzXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNmZXJGb3JtYXRzLmluZGV4T2YocmVxdWVzdGVkVHJhbnNmZXJGb3JtYXQpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHRyYW5zcG9ydCA9PT0gSHR0cFRyYW5zcG9ydFR5cGUuV2ViU29ja2V0cyAmJiAhdGhpcy5fb3B0aW9ucy5XZWJTb2NrZXQpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0cmFuc3BvcnQgPT09IEh0dHBUcmFuc3BvcnRUeXBlLlNlcnZlclNlbnRFdmVudHMgJiYgIXRoaXMuX29wdGlvbnMuRXZlbnRTb3VyY2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBTa2lwcGluZyB0cmFuc3BvcnQgJyR7SHR0cFRyYW5zcG9ydFR5cGVbdHJhbnNwb3J0XX0nIGJlY2F1c2UgaXQgaXMgbm90IHN1cHBvcnRlZCBpbiB5b3VyIGVudmlyb25tZW50LidgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVbnN1cHBvcnRlZFRyYW5zcG9ydEVycm9yKGAnJHtIdHRwVHJhbnNwb3J0VHlwZVt0cmFuc3BvcnRdfScgaXMgbm90IHN1cHBvcnRlZCBpbiB5b3VyIGVudmlyb25tZW50LmAsIHRyYW5zcG9ydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgU2VsZWN0aW5nIHRyYW5zcG9ydCAnJHtIdHRwVHJhbnNwb3J0VHlwZVt0cmFuc3BvcnRdfScuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZlYXR1cmVzLnJlY29ubmVjdCA9IHRyYW5zcG9ydCA9PT0gSHR0cFRyYW5zcG9ydFR5cGUuV2ViU29ja2V0cyA/IHVzZVN0YXRlZnVsUmVjb25uZWN0IDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0cnVjdFRyYW5zcG9ydCh0cmFuc3BvcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYFNraXBwaW5nIHRyYW5zcG9ydCAnJHtIdHRwVHJhbnNwb3J0VHlwZVt0cmFuc3BvcnRdfScgYmVjYXVzZSBpdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSByZXF1ZXN0ZWQgdHJhbnNmZXIgZm9ybWF0ICcke1RyYW5zZmVyRm9ybWF0W3JlcXVlc3RlZFRyYW5zZmVyRm9ybWF0XX0nLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoYCcke0h0dHBUcmFuc3BvcnRUeXBlW3RyYW5zcG9ydF19JyBkb2VzIG5vdCBzdXBwb3J0ICR7VHJhbnNmZXJGb3JtYXRbcmVxdWVzdGVkVHJhbnNmZXJGb3JtYXRdfS5gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBTa2lwcGluZyB0cmFuc3BvcnQgJyR7SHR0cFRyYW5zcG9ydFR5cGVbdHJhbnNwb3J0XX0nIGJlY2F1c2UgaXQgd2FzIGRpc2FibGVkIGJ5IHRoZSBjbGllbnQuYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERpc2FibGVkVHJhbnNwb3J0RXJyb3IoYCcke0h0dHBUcmFuc3BvcnRUeXBlW3RyYW5zcG9ydF19JyBpcyBkaXNhYmxlZCBieSB0aGUgY2xpZW50LmAsIHRyYW5zcG9ydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaXNJVHJhbnNwb3J0KHRyYW5zcG9ydCkge1xyXG4gICAgICAgIHJldHVybiB0cmFuc3BvcnQgJiYgdHlwZW9mICh0cmFuc3BvcnQpID09PSBcIm9iamVjdFwiICYmIFwiY29ubmVjdFwiIGluIHRyYW5zcG9ydDtcclxuICAgIH1cclxuICAgIF9zdG9wQ29ubmVjdGlvbihlcnJvcikge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBIdHRwQ29ubmVjdGlvbi5zdG9wQ29ubmVjdGlvbigke2Vycm9yfSkgY2FsbGVkIHdoaWxlIGluIHN0YXRlICR7dGhpcy5fY29ubmVjdGlvblN0YXRlfS5gKTtcclxuICAgICAgICB0aGlzLnRyYW5zcG9ydCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgc3RvcEVycm9yLCBpdCB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgdGhlIGVycm9yIGZyb20gdGhlIHRyYW5zcG9ydFxyXG4gICAgICAgIGVycm9yID0gdGhpcy5fc3RvcEVycm9yIHx8IGVycm9yO1xyXG4gICAgICAgIHRoaXMuX3N0b3BFcnJvciA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBcIkRpc2Nvbm5lY3RlZFwiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYENhbGwgdG8gSHR0cENvbm5lY3Rpb24uc3RvcENvbm5lY3Rpb24oJHtlcnJvcn0pIHdhcyBpZ25vcmVkIGJlY2F1c2UgdGhlIGNvbm5lY3Rpb24gaXMgYWxyZWFkeSBpbiB0aGUgZGlzY29ubmVjdGVkIHN0YXRlLmApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiQ29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5Db25uZWN0aW5nICovKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYENhbGwgdG8gSHR0cENvbm5lY3Rpb24uc3RvcENvbm5lY3Rpb24oJHtlcnJvcn0pIHdhcyBpZ25vcmVkIGJlY2F1c2UgdGhlIGNvbm5lY3Rpb24gaXMgc3RpbGwgaW4gdGhlIGNvbm5lY3Rpbmcgc3RhdGUuYCk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSHR0cENvbm5lY3Rpb24uc3RvcENvbm5lY3Rpb24oJHtlcnJvcn0pIHdhcyBjYWxsZWQgd2hpbGUgdGhlIGNvbm5lY3Rpb24gaXMgc3RpbGwgaW4gdGhlIGNvbm5lY3Rpbmcgc3RhdGUuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IFwiRGlzY29ubmVjdGluZ1wiIC8qIENvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0aW5nICovKSB7XHJcbiAgICAgICAgICAgIC8vIEEgY2FsbCB0byBzdG9wKCkgaW5kdWNlZCB0aGlzIGNhbGwgdG8gc3RvcENvbm5lY3Rpb24gYW5kIG5lZWRzIHRvIGJlIGNvbXBsZXRlZC5cclxuICAgICAgICAgICAgLy8gQW55IHN0b3AoKSBhd2FpdGVycyB3aWxsIGJlIHNjaGVkdWxlZCB0byBjb250aW51ZSBhZnRlciB0aGUgb25jbG9zZSBjYWxsYmFjayBmaXJlcy5cclxuICAgICAgICAgICAgdGhpcy5fc3RvcFByb21pc2VSZXNvbHZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYENvbm5lY3Rpb24gZGlzY29ubmVjdGVkIHdpdGggZXJyb3IgJyR7ZXJyb3J9Jy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIFwiQ29ubmVjdGlvbiBkaXNjb25uZWN0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fc2VuZFF1ZXVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbmRRdWV1ZS5zdG9wKCkuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBUcmFuc3BvcnRTZW5kUXVldWUuc3RvcCgpIHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbmRRdWV1ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uSWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gXCJEaXNjb25uZWN0ZWRcIiAvKiBDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkICovO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25jbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25jbG9zZShlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBIdHRwQ29ubmVjdGlvbi5vbmNsb3NlKCR7ZXJyb3J9KSB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfcmVzb2x2ZVVybCh1cmwpIHtcclxuICAgICAgICAvLyBzdGFydHNXaXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gSUVcclxuICAgICAgICBpZiAodXJsLmxhc3RJbmRleE9mKFwiaHR0cHM6Ly9cIiwgMCkgPT09IDAgfHwgdXJsLmxhc3RJbmRleE9mKFwiaHR0cDovL1wiLCAwKSA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIVBsYXRmb3JtLmlzQnJvd3Nlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXNvbHZlICcke3VybH0nLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZXR0aW5nIHRoZSB1cmwgdG8gdGhlIGhyZWYgcHJvcGVyeSBvZiBhbiBhbmNob3IgdGFnIGhhbmRsZXMgbm9ybWFsaXphdGlvblxyXG4gICAgICAgIC8vIGZvciB1cy4gVGhlcmUgYXJlIDMgbWFpbiBjYXNlcy5cclxuICAgICAgICAvLyAxLiBSZWxhdGl2ZSBwYXRoIG5vcm1hbGl6YXRpb24gZS5nIFwiYlwiIC0+IFwiaHR0cDovL2xvY2FsaG9zdDo1MDAwL2EvYlwiXHJcbiAgICAgICAgLy8gMi4gQWJzb2x1dGUgcGF0aCBub3JtYWxpemF0aW9uIGUuZyBcIi9hL2JcIiAtPiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9hL2JcIlxyXG4gICAgICAgIC8vIDMuIE5ldHdvcmtwYXRoIHJlZmVyZW5jZSBub3JtYWxpemF0aW9uIGUuZyBcIi8vbG9jYWxob3N0OjUwMDAvYS9iXCIgLT4gXCJodHRwOi8vbG9jYWxob3N0OjUwMDAvYS9iXCJcclxuICAgICAgICBjb25zdCBhVGFnID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgIGFUYWcuaHJlZiA9IHVybDtcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgTm9ybWFsaXppbmcgJyR7dXJsfScgdG8gJyR7YVRhZy5ocmVmfScuYCk7XHJcbiAgICAgICAgcmV0dXJuIGFUYWcuaHJlZjtcclxuICAgIH1cclxuICAgIF9yZXNvbHZlTmVnb3RpYXRlVXJsKHVybCkge1xyXG4gICAgICAgIGNvbnN0IG5lZ290aWF0ZVVybCA9IG5ldyBVUkwodXJsKTtcclxuICAgICAgICBpZiAobmVnb3RpYXRlVXJsLnBhdGhuYW1lLmVuZHNXaXRoKCcvJykpIHtcclxuICAgICAgICAgICAgbmVnb3RpYXRlVXJsLnBhdGhuYW1lICs9IFwibmVnb3RpYXRlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuZWdvdGlhdGVVcmwucGF0aG5hbWUgKz0gXCIvbmVnb3RpYXRlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobmVnb3RpYXRlVXJsLnNlYXJjaFBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFzZWFyY2hQYXJhbXMuaGFzKFwibmVnb3RpYXRlVmVyc2lvblwiKSkge1xyXG4gICAgICAgICAgICBzZWFyY2hQYXJhbXMuYXBwZW5kKFwibmVnb3RpYXRlVmVyc2lvblwiLCB0aGlzLl9uZWdvdGlhdGVWZXJzaW9uLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VhcmNoUGFyYW1zLmhhcyhcInVzZVN0YXRlZnVsUmVjb25uZWN0XCIpKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hQYXJhbXMuZ2V0KFwidXNlU3RhdGVmdWxSZWNvbm5lY3RcIikgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zLl91c2VTdGF0ZWZ1bFJlY29ubmVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fb3B0aW9ucy5fdXNlU3RhdGVmdWxSZWNvbm5lY3QgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGFyYW1zLmFwcGVuZChcInVzZVN0YXRlZnVsUmVjb25uZWN0XCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmVnb3RpYXRlVXJsLnNlYXJjaCA9IHNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xyXG4gICAgICAgIHJldHVybiBuZWdvdGlhdGVVcmwudG9TdHJpbmcoKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB0cmFuc3BvcnRNYXRjaGVzKHJlcXVlc3RlZFRyYW5zcG9ydCwgYWN0dWFsVHJhbnNwb3J0KSB7XHJcbiAgICByZXR1cm4gIXJlcXVlc3RlZFRyYW5zcG9ydCB8fCAoKGFjdHVhbFRyYW5zcG9ydCAmIHJlcXVlc3RlZFRyYW5zcG9ydCkgIT09IDApO1xyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgVHJhbnNwb3J0U2VuZFF1ZXVlIHtcclxuICAgIGNvbnN0cnVjdG9yKF90cmFuc3BvcnQpIHtcclxuICAgICAgICB0aGlzLl90cmFuc3BvcnQgPSBfdHJhbnNwb3J0O1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fc2VuZEJ1ZmZlcmVkRGF0YSA9IG5ldyBQcm9taXNlU291cmNlKCk7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNwb3J0UmVzdWx0ID0gbmV3IFByb21pc2VTb3VyY2UoKTtcclxuICAgICAgICB0aGlzLl9zZW5kTG9vcFByb21pc2UgPSB0aGlzLl9zZW5kTG9vcCgpO1xyXG4gICAgfVxyXG4gICAgc2VuZChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVyRGF0YShkYXRhKTtcclxuICAgICAgICBpZiAoIXRoaXMuX3RyYW5zcG9ydFJlc3VsdCkge1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc3BvcnRSZXN1bHQgPSBuZXcgUHJvbWlzZVNvdXJjZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNwb3J0UmVzdWx0LnByb21pc2U7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NlbmRCdWZmZXJlZERhdGEucmVzb2x2ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZW5kTG9vcFByb21pc2U7XHJcbiAgICB9XHJcbiAgICBfYnVmZmVyRGF0YShkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2J1ZmZlci5sZW5ndGggJiYgdHlwZW9mICh0aGlzLl9idWZmZXJbMF0pICE9PSB0eXBlb2YgKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgZGF0YSB0byBiZSBvZiB0eXBlICR7dHlwZW9mICh0aGlzLl9idWZmZXIpfSBidXQgd2FzIG9mIHR5cGUgJHt0eXBlb2YgKGRhdGEpfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9idWZmZXIucHVzaChkYXRhKTtcclxuICAgICAgICB0aGlzLl9zZW5kQnVmZmVyZWREYXRhLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGFzeW5jIF9zZW5kTG9vcCgpIHtcclxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kQnVmZmVyZWREYXRhLnByb21pc2U7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fZXhlY3V0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNwb3J0UmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJhbnNwb3J0UmVzdWx0LnJlamVjdChcIkNvbm5lY3Rpb24gc3RvcHBlZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zZW5kQnVmZmVyZWREYXRhID0gbmV3IFByb21pc2VTb3VyY2UoKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNwb3J0UmVzdWx0ID0gdGhpcy5fdHJhbnNwb3J0UmVzdWx0O1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc3BvcnRSZXN1bHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YgKHRoaXMuX2J1ZmZlclswXSkgPT09IFwic3RyaW5nXCIgP1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyLmpvaW4oXCJcIikgOlxyXG4gICAgICAgICAgICAgICAgVHJhbnNwb3J0U2VuZFF1ZXVlLl9jb25jYXRCdWZmZXJzKHRoaXMuX2J1ZmZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fdHJhbnNwb3J0LnNlbmQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnRSZXN1bHQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0UmVzdWx0LnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2NvbmNhdEJ1ZmZlcnMoYXJyYXlCdWZmZXJzKSB7XHJcbiAgICAgICAgY29uc3QgdG90YWxMZW5ndGggPSBhcnJheUJ1ZmZlcnMubWFwKChiKSA9PiBiLmJ5dGVMZW5ndGgpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KHRvdGFsTGVuZ3RoKTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyYXlCdWZmZXJzKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5zZXQobmV3IFVpbnQ4QXJyYXkoaXRlbSksIG9mZnNldCk7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSBpdGVtLmJ5dGVMZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQuYnVmZmVyO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFByb21pc2VTb3VyY2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gW3RoaXMuX3Jlc29sdmVyLCB0aGlzLl9yZWplY3Rlcl0gPSBbcmVzb2x2ZSwgcmVqZWN0XSk7XHJcbiAgICB9XHJcbiAgICByZXNvbHZlKCkge1xyXG4gICAgICAgIHRoaXMuX3Jlc29sdmVyKCk7XHJcbiAgICB9XHJcbiAgICByZWplY3QocmVhc29uKSB7XHJcbiAgICAgICAgdGhpcy5fcmVqZWN0ZXIocmVhc29uKTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1IdHRwQ29ubmVjdGlvbi5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IEhhbmRzaGFrZVByb3RvY29sIH0gZnJvbSBcIi4vSGFuZHNoYWtlUHJvdG9jb2xcIjtcclxuaW1wb3J0IHsgQWJvcnRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCIuL0lIdWJQcm90b2NvbFwiO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gXCIuL1N1YmplY3RcIjtcclxuaW1wb3J0IHsgQXJnLCBnZXRFcnJvclN0cmluZywgUGxhdGZvcm0gfSBmcm9tIFwiLi9VdGlsc1wiO1xyXG5pbXBvcnQgeyBNZXNzYWdlQnVmZmVyIH0gZnJvbSBcIi4vTWVzc2FnZUJ1ZmZlclwiO1xyXG5jb25zdCBERUZBVUxUX1RJTUVPVVRfSU5fTVMgPSAzMCAqIDEwMDA7XHJcbmNvbnN0IERFRkFVTFRfUElOR19JTlRFUlZBTF9JTl9NUyA9IDE1ICogMTAwMDtcclxuY29uc3QgREVGQVVMVF9TVEFURUZVTF9SRUNPTk5FQ1RfQlVGRkVSX1NJWkUgPSAxMDAwMDA7XHJcbi8qKiBEZXNjcmliZXMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHtAbGluayBIdWJDb25uZWN0aW9ufSB0byB0aGUgc2VydmVyLiAqL1xyXG5leHBvcnQgdmFyIEh1YkNvbm5lY3Rpb25TdGF0ZTtcclxuKGZ1bmN0aW9uIChIdWJDb25uZWN0aW9uU3RhdGUpIHtcclxuICAgIC8qKiBUaGUgaHViIGNvbm5lY3Rpb24gaXMgZGlzY29ubmVjdGVkLiAqL1xyXG4gICAgSHViQ29ubmVjdGlvblN0YXRlW1wiRGlzY29ubmVjdGVkXCJdID0gXCJEaXNjb25uZWN0ZWRcIjtcclxuICAgIC8qKiBUaGUgaHViIGNvbm5lY3Rpb24gaXMgY29ubmVjdGluZy4gKi9cclxuICAgIEh1YkNvbm5lY3Rpb25TdGF0ZVtcIkNvbm5lY3RpbmdcIl0gPSBcIkNvbm5lY3RpbmdcIjtcclxuICAgIC8qKiBUaGUgaHViIGNvbm5lY3Rpb24gaXMgY29ubmVjdGVkLiAqL1xyXG4gICAgSHViQ29ubmVjdGlvblN0YXRlW1wiQ29ubmVjdGVkXCJdID0gXCJDb25uZWN0ZWRcIjtcclxuICAgIC8qKiBUaGUgaHViIGNvbm5lY3Rpb24gaXMgZGlzY29ubmVjdGluZy4gKi9cclxuICAgIEh1YkNvbm5lY3Rpb25TdGF0ZVtcIkRpc2Nvbm5lY3RpbmdcIl0gPSBcIkRpc2Nvbm5lY3RpbmdcIjtcclxuICAgIC8qKiBUaGUgaHViIGNvbm5lY3Rpb24gaXMgcmVjb25uZWN0aW5nLiAqL1xyXG4gICAgSHViQ29ubmVjdGlvblN0YXRlW1wiUmVjb25uZWN0aW5nXCJdID0gXCJSZWNvbm5lY3RpbmdcIjtcclxufSkoSHViQ29ubmVjdGlvblN0YXRlIHx8IChIdWJDb25uZWN0aW9uU3RhdGUgPSB7fSkpO1xyXG4vKiogUmVwcmVzZW50cyBhIGNvbm5lY3Rpb24gdG8gYSBTaWduYWxSIEh1Yi4gKi9cclxuZXhwb3J0IGNsYXNzIEh1YkNvbm5lY3Rpb24ge1xyXG4gICAgLyoqIEBpbnRlcm5hbCAqL1xyXG4gICAgLy8gVXNpbmcgYSBwdWJsaWMgc3RhdGljIGZhY3RvcnkgbWV0aG9kIG1lYW5zIHdlIGNhbiBoYXZlIGEgcHJpdmF0ZSBjb25zdHJ1Y3RvciBhbmQgYW4gX2ludGVybmFsX1xyXG4gICAgLy8gY3JlYXRlIG1ldGhvZCB0aGF0IGNhbiBiZSB1c2VkIGJ5IEh1YkNvbm5lY3Rpb25CdWlsZGVyLiBBbiBcImludGVybmFsXCIgY29uc3RydWN0b3Igd291bGQganVzdFxyXG4gICAgLy8gYmUgc3RyaXBwZWQgYXdheSBhbmQgdGhlICcuZC50cycgZmlsZSB3b3VsZCBoYXZlIG5vIGNvbnN0cnVjdG9yLCB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyBhXHJcbiAgICAvLyBwdWJsaWMgcGFyYW1ldGVyLWxlc3MgY29uc3RydWN0b3IuXHJcbiAgICBzdGF0aWMgY3JlYXRlKGNvbm5lY3Rpb24sIGxvZ2dlciwgcHJvdG9jb2wsIHJlY29ubmVjdFBvbGljeSwgc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzLCBrZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzLCBzdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEh1YkNvbm5lY3Rpb24oY29ubmVjdGlvbiwgbG9nZ2VyLCBwcm90b2NvbCwgcmVjb25uZWN0UG9saWN5LCBzZXJ2ZXJUaW1lb3V0SW5NaWxsaXNlY29uZHMsIGtlZXBBbGl2ZUludGVydmFsSW5NaWxsaXNlY29uZHMsIHN0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSk7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0aW9uLCBsb2dnZXIsIHByb3RvY29sLCByZWNvbm5lY3RQb2xpY3ksIHNlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kcywga2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcywgc3RhdGVmdWxSZWNvbm5lY3RCdWZmZXJTaXplKSB7XHJcbiAgICAgICAgdGhpcy5fbmV4dEtlZXBBbGl2ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5fZnJlZXplRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5XYXJuaW5nLCBcIlRoZSBwYWdlIGlzIGJlaW5nIGZyb3plbiwgdGhpcyB3aWxsIGxpa2VseSBsZWFkIHRvIHRoZSBjb25uZWN0aW9uIGJlaW5nIGNsb3NlZCBhbmQgbWVzc2FnZXMgYmVpbmcgbG9zdC4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBkb2NzIGF0IGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9hc3BuZXQvY29yZS9zaWduYWxyL2phdmFzY3JpcHQtY2xpZW50I2JzbGVlcFwiKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKGNvbm5lY3Rpb24sIFwiY29ubmVjdGlvblwiKTtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZChsb2dnZXIsIFwibG9nZ2VyXCIpO1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHByb3RvY29sLCBcInByb3RvY29sXCIpO1xyXG4gICAgICAgIHRoaXMuc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzID0gc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzICE9PSBudWxsICYmIHNlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kcyAhPT0gdm9pZCAwID8gc2VydmVyVGltZW91dEluTWlsbGlzZWNvbmRzIDogREVGQVVMVF9USU1FT1VUX0lOX01TO1xyXG4gICAgICAgIHRoaXMua2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcyA9IGtlZXBBbGl2ZUludGVydmFsSW5NaWxsaXNlY29uZHMgIT09IG51bGwgJiYga2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcyAhPT0gdm9pZCAwID8ga2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcyA6IERFRkFVTFRfUElOR19JTlRFUlZBTF9JTl9NUztcclxuICAgICAgICB0aGlzLl9zdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUgPSBzdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUgIT09IG51bGwgJiYgc3RhdGVmdWxSZWNvbm5lY3RCdWZmZXJTaXplICE9PSB2b2lkIDAgPyBzdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUgOiBERUZBVUxUX1NUQVRFRlVMX1JFQ09OTkVDVF9CVUZGRVJfU0laRTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5fcHJvdG9jb2wgPSBwcm90b2NvbDtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdFBvbGljeSA9IHJlY29ubmVjdFBvbGljeTtcclxuICAgICAgICB0aGlzLl9oYW5kc2hha2VQcm90b2NvbCA9IG5ldyBIYW5kc2hha2VQcm90b2NvbCgpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbnJlY2VpdmUgPSAoZGF0YSkgPT4gdGhpcy5fcHJvY2Vzc0luY29taW5nRGF0YShkYXRhKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25jbG9zZSA9IChlcnJvcikgPT4gdGhpcy5fY29ubmVjdGlvbkNsb3NlZChlcnJvcik7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICAgICAgdGhpcy5fbWV0aG9kcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2Nsb3NlZENhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdGluZ0NhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdGVkQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5faW52b2NhdGlvbklkID0gMDtcclxuICAgICAgICB0aGlzLl9yZWNlaXZlZEhhbmRzaGFrZVJlc3BvbnNlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZDtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZFBpbmdNZXNzYWdlID0gdGhpcy5fcHJvdG9jb2wud3JpdGVNZXNzYWdlKHsgdHlwZTogTWVzc2FnZVR5cGUuUGluZyB9KTtcclxuICAgIH1cclxuICAgIC8qKiBJbmRpY2F0ZXMgdGhlIHN0YXRlIG9mIHRoZSB7QGxpbmsgSHViQ29ubmVjdGlvbn0gdG8gdGhlIHNlcnZlci4gKi9cclxuICAgIGdldCBzdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvblN0YXRlO1xyXG4gICAgfVxyXG4gICAgLyoqIFJlcHJlc2VudHMgdGhlIGNvbm5lY3Rpb24gaWQgb2YgdGhlIHtAbGluayBIdWJDb25uZWN0aW9ufSBvbiB0aGUgc2VydmVyLiBUaGUgY29ubmVjdGlvbiBpZCB3aWxsIGJlIG51bGwgd2hlbiB0aGUgY29ubmVjdGlvbiBpcyBlaXRoZXJcclxuICAgICAqICBpbiB0aGUgZGlzY29ubmVjdGVkIHN0YXRlIG9yIGlmIHRoZSBuZWdvdGlhdGlvbiBzdGVwIHdhcyBza2lwcGVkLlxyXG4gICAgICovXHJcbiAgICBnZXQgY29ubmVjdGlvbklkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gPyAodGhpcy5jb25uZWN0aW9uLmNvbm5lY3Rpb25JZCB8fCBudWxsKSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICAvKiogSW5kaWNhdGVzIHRoZSB1cmwgb2YgdGhlIHtAbGluayBIdWJDb25uZWN0aW9ufSB0byB0aGUgc2VydmVyLiAqL1xyXG4gICAgZ2V0IGJhc2VVcmwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5iYXNlVXJsIHx8IFwiXCI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYSBuZXcgdXJsIGZvciB0aGUgSHViQ29ubmVjdGlvbi4gTm90ZSB0aGF0IHRoZSB1cmwgY2FuIG9ubHkgYmUgY2hhbmdlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIGluIGVpdGhlciB0aGUgRGlzY29ubmVjdGVkIG9yXHJcbiAgICAgKiBSZWNvbm5lY3Rpbmcgc3RhdGVzLlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgdXJsIHRvIGNvbm5lY3QgdG8uXHJcbiAgICAgKi9cclxuICAgIHNldCBiYXNlVXJsKHVybCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQgJiYgdGhpcy5fY29ubmVjdGlvblN0YXRlICE9PSBIdWJDb25uZWN0aW9uU3RhdGUuUmVjb25uZWN0aW5nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBIdWJDb25uZWN0aW9uIG11c3QgYmUgaW4gdGhlIERpc2Nvbm5lY3RlZCBvciBSZWNvbm5lY3Rpbmcgc3RhdGUgdG8gY2hhbmdlIHRoZSB1cmwuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXVybCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgSHViQ29ubmVjdGlvbiB1cmwgbXVzdCBiZSBhIHZhbGlkIHVybC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5iYXNlVXJsID0gdXJsO1xyXG4gICAgfVxyXG4gICAgLyoqIFN0YXJ0cyB0aGUgY29ubmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgY29ubmVjdGlvbiBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgZXN0YWJsaXNoZWQsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvci5cclxuICAgICAqL1xyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQcm9taXNlID0gdGhpcy5fc3RhcnRXaXRoU3RhdGVUcmFuc2l0aW9ucygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydFByb21pc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBfc3RhcnRXaXRoU3RhdGVUcmFuc2l0aW9ucygpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlICE9PSBIdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJDYW5ub3Qgc3RhcnQgYSBIdWJDb25uZWN0aW9uIHRoYXQgaXMgbm90IGluIHRoZSAnRGlzY29ubmVjdGVkJyBzdGF0ZS5cIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBIdWJDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGluZztcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIlN0YXJ0aW5nIEh1YkNvbm5lY3Rpb24uXCIpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0YXJ0SW50ZXJuYWwoKTtcclxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtLmlzQnJvd3Nlcikge1xyXG4gICAgICAgICAgICAgICAgLy8gTG9nIHdoZW4gdGhlIGJyb3dzZXIgZnJlZXplcyB0aGUgdGFiIHNvIHVzZXJzIGtub3cgd2h5IHRoZWlyIGNvbm5lY3Rpb24gdW5leHBlY3RlZGx5IHN0b3BwZWQgd29ya2luZ1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmcmVlemVcIiwgdGhpcy5fZnJlZXplRXZlbnRMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gSHViQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZDtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBcIkh1YkNvbm5lY3Rpb24gY29ubmVjdGVkIHN1Y2Nlc3NmdWxseS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IEh1YkNvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBIdWJDb25uZWN0aW9uIGZhaWxlZCB0byBzdGFydCBzdWNjZXNzZnVsbHkgYmVjYXVzZSBvZiBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBfc3RhcnRJbnRlcm5hbCgpIHtcclxuICAgICAgICB0aGlzLl9zdG9wRHVyaW5nU3RhcnRFcnJvciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9yZWNlaXZlZEhhbmRzaGFrZVJlc3BvbnNlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gU2V0IHVwIHRoZSBwcm9taXNlIGJlZm9yZSBhbnkgY29ubmVjdGlvbiBpcyAocmUpc3RhcnRlZCBvdGhlcndpc2UgaXQgY291bGQgcmFjZSB3aXRoIHJlY2VpdmVkIG1lc3NhZ2VzXHJcbiAgICAgICAgY29uc3QgaGFuZHNoYWtlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5faGFuZHNoYWtlUmVzb2x2ZXIgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kc2hha2VSZWplY3RlciA9IHJlamVjdDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RhcnQodGhpcy5fcHJvdG9jb2wudHJhbnNmZXJGb3JtYXQpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCB2ZXJzaW9uID0gdGhpcy5fcHJvdG9jb2wudmVyc2lvbjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMucmVjb25uZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdGF0ZWZ1bCBSZWNvbm5lY3Qgc3RhcnRzIHdpdGggSHViUHJvdG9jb2wgdmVyc2lvbiAyLCBuZXdlciBjbGllbnRzIGNvbm5lY3RpbmcgdG8gb2xkZXIgc2VydmVycyB3aWxsIGZhaWwgdG8gY29ubmVjdCBkdWUgdG9cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBoYW5kc2hha2Ugb25seSBzdXBwb3J0aW5nIHZlcnNpb24gMSwgc28gd2Ugd2lsbCB0cnkgdG8gc2VuZCB2ZXJzaW9uIDEgZHVyaW5nIHRoZSBoYW5kc2hha2UgdG8ga2VlcCBvbGQgc2VydmVycyB3b3JraW5nLlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaGFuZHNoYWtlUmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIHByb3RvY29sOiB0aGlzLl9wcm90b2NvbC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJTZW5kaW5nIGhhbmRzaGFrZSByZXF1ZXN0LlwiKTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2VuZE1lc3NhZ2UodGhpcy5faGFuZHNoYWtlUHJvdG9jb2wud3JpdGVIYW5kc2hha2VSZXF1ZXN0KGhhbmRzaGFrZVJlcXVlc3QpKTtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgYFVzaW5nIEh1YlByb3RvY29sICcke3RoaXMuX3Byb3RvY29sLm5hbWV9Jy5gKTtcclxuICAgICAgICAgICAgLy8gZGVmZW5zaXZlbHkgY2xlYW51cCB0aW1lb3V0IGluIGNhc2Ugd2UgcmVjZWl2ZSBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyIGJlZm9yZSB3ZSBmaW5pc2ggc3RhcnRcclxuICAgICAgICAgICAgdGhpcy5fY2xlYW51cFRpbWVvdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzZXRUaW1lb3V0UGVyaW9kKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0S2VlcEFsaXZlSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgYXdhaXQgaGFuZHNoYWtlUHJvbWlzZTtcclxuICAgICAgICAgICAgLy8gSXQncyBpbXBvcnRhbnQgdG8gY2hlY2sgdGhlIHN0b3BEdXJpbmdTdGFydEVycm9yIGluc3RlYWQgb2YganVzdCByZWx5aW5nIG9uIHRoZSBoYW5kc2hha2VQcm9taXNlXHJcbiAgICAgICAgICAgIC8vIGJlaW5nIHJlamVjdGVkIG9uIGNsb3NlLCBiZWNhdXNlIHRoaXMgY29udGludWF0aW9uIGNhbiBydW4gYWZ0ZXIgYm90aCB0aGUgaGFuZHNoYWtlIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHlcclxuICAgICAgICAgICAgLy8gYW5kIHRoZSBjb25uZWN0aW9uIHdhcyBjbG9zZWQuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdG9wRHVyaW5nU3RhcnRFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8gSXQncyBpbXBvcnRhbnQgdG8gdGhyb3cgaW5zdGVhZCBvZiByZXR1cm5pbmcgYSByZWplY3RlZCBwcm9taXNlLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gYWxsb3cgYW55IHN0YXRlXHJcbiAgICAgICAgICAgICAgICAvLyB0cmFuc2l0aW9ucyB0byBvY2N1ciBiZXR3ZWVuIG5vdyBhbmQgdGhlIGNhbGxpbmcgY29kZSBvYnNlcnZpbmcgdGhlIGV4Y2VwdGlvbnMuIFJldHVybmluZyBhIHJlamVjdGVkIHByb21pc2VcclxuICAgICAgICAgICAgICAgIC8vIHdpbGwgY2F1c2UgdGhlIGNhbGxpbmcgY29udGludWF0aW9uIHRvIGdldCBzY2hlZHVsZWQgdG8gcnVuIGxhdGVyLlxyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aHJvdy1saXRlcmFsXHJcbiAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLl9zdG9wRHVyaW5nU3RhcnRFcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB1c2VTdGF0ZWZ1bFJlY29ubmVjdCA9IHRoaXMuY29ubmVjdGlvbi5mZWF0dXJlcy5yZWNvbm5lY3QgfHwgZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh1c2VTdGF0ZWZ1bFJlY29ubmVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZUJ1ZmZlciA9IG5ldyBNZXNzYWdlQnVmZmVyKHRoaXMuX3Byb3RvY29sLCB0aGlzLmNvbm5lY3Rpb24sIHRoaXMuX3N0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMuZGlzY29ubmVjdGVkID0gdGhpcy5fbWVzc2FnZUJ1ZmZlci5fZGlzY29ubmVjdGVkLmJpbmQodGhpcy5fbWVzc2FnZUJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMucmVzZW5kID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tZXNzYWdlQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlQnVmZmVyLl9yZXNlbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uLmZlYXR1cmVzLmluaGVyZW50S2VlcEFsaXZlKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kTWVzc2FnZSh0aGlzLl9jYWNoZWRQaW5nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYEh1YiBoYW5kc2hha2UgZmFpbGVkIHdpdGggZXJyb3IgJyR7ZX0nIGR1cmluZyBzdGFydCgpLiBTdG9wcGluZyBIdWJDb25uZWN0aW9uLmApO1xyXG4gICAgICAgICAgICB0aGlzLl9jbGVhbnVwVGltZW91dCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jbGVhbnVwUGluZ1RpbWVyKCk7XHJcbiAgICAgICAgICAgIC8vIEh0dHBDb25uZWN0aW9uLnN0b3AoKSBzaG91bGQgbm90IGNvbXBsZXRlIHVudGlsIGFmdGVyIHRoZSBvbmNsb3NlIGNhbGxiYWNrIGlzIGludm9rZWQuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgd2lsbCB0cmFuc2l0aW9uIHRoZSBIdWJDb25uZWN0aW9uIHRvIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUgYmVmb3JlIEh0dHBDb25uZWN0aW9uLnN0b3AoKSBjb21wbGV0ZXMuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zdG9wKGUpO1xyXG4gICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiBTdG9wcyB0aGUgY29ubmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgY29ubmVjdGlvbiBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgdGVybWluYXRlZCwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBzdG9wKCkge1xyXG4gICAgICAgIC8vIENhcHR1cmUgdGhlIHN0YXJ0IHByb21pc2UgYmVmb3JlIHRoZSBjb25uZWN0aW9uIG1pZ2h0IGJlIHJlc3RhcnRlZCBpbiBhbiBvbmNsb3NlIGNhbGxiYWNrLlxyXG4gICAgICAgIGNvbnN0IHN0YXJ0UHJvbWlzZSA9IHRoaXMuX3N0YXJ0UHJvbWlzZTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMucmVjb25uZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3RvcFByb21pc2UgPSB0aGlzLl9zdG9wSW50ZXJuYWwoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLl9zdG9wUHJvbWlzZTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBBd2FpdGluZyB1bmRlZmluZWQgY29udGludWVzIGltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIGF3YWl0IHN0YXJ0UHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gVGhpcyBleGNlcHRpb24gaXMgcmV0dXJuZWQgdG8gdGhlIHVzZXIgYXMgYSByZWplY3RlZCBQcm9taXNlIGZyb20gdGhlIHN0YXJ0IG1ldGhvZC5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfc3RvcEludGVybmFsKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkRlYnVnLCBgQ2FsbCB0byBIdWJDb25uZWN0aW9uLnN0b3AoJHtlcnJvcn0pIGlnbm9yZWQgYmVjYXVzZSBpdCBpcyBhbHJlYWR5IGluIHRoZSBkaXNjb25uZWN0ZWQgc3RhdGUuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgYENhbGwgdG8gSHR0cENvbm5lY3Rpb24uc3RvcCgke2Vycm9yfSkgaWdub3JlZCBiZWNhdXNlIHRoZSBjb25uZWN0aW9uIGlzIGFscmVhZHkgaW4gdGhlIGRpc2Nvbm5lY3Rpbmcgc3RhdGUuYCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9jb25uZWN0aW9uU3RhdGU7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3Rpbmc7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJTdG9wcGluZyBIdWJDb25uZWN0aW9uLlwiKTtcclxuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0RGVsYXlIYW5kbGUpIHtcclxuICAgICAgICAgICAgLy8gV2UncmUgaW4gYSByZWNvbm5lY3QgZGVsYXkgd2hpY2ggbWVhbnMgdGhlIHVuZGVybHlpbmcgY29ubmVjdGlvbiBpcyBjdXJyZW50bHkgYWxyZWFkeSBzdG9wcGVkLlxyXG4gICAgICAgICAgICAvLyBKdXN0IGNsZWFyIHRoZSBoYW5kbGUgdG8gc3RvcCB0aGUgcmVjb25uZWN0IGxvb3AgKHdoaWNoIG5vIG9uZSBpcyB3YWl0aW5nIG9uIHRoYW5rZnVsbHkpIGFuZFxyXG4gICAgICAgICAgICAvLyBmaXJlIHRoZSBvbmNsb3NlIGNhbGxiYWNrcy5cclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJDb25uZWN0aW9uIHN0b3BwZWQgZHVyaW5nIHJlY29ubmVjdCBkZWxheS4gRG9uZSByZWNvbm5lY3RpbmcuXCIpO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVjb25uZWN0RGVsYXlIYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3REZWxheUhhbmRsZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGVDbG9zZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gSHViQ29ubmVjdGlvblN0YXRlLkNvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgICAgIHRoaXMuX3NlbmRDbG9zZU1lc3NhZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2xlYW51cFRpbWVvdXQoKTtcclxuICAgICAgICB0aGlzLl9jbGVhbnVwUGluZ1RpbWVyKCk7XHJcbiAgICAgICAgdGhpcy5fc3RvcER1cmluZ1N0YXJ0RXJyb3IgPSBlcnJvciB8fCBuZXcgQWJvcnRFcnJvcihcIlRoZSBjb25uZWN0aW9uIHdhcyBzdG9wcGVkIGJlZm9yZSB0aGUgaHViIGhhbmRzaGFrZSBjb3VsZCBjb21wbGV0ZS5cIik7XHJcbiAgICAgICAgLy8gSHR0cENvbm5lY3Rpb24uc3RvcCgpIHNob3VsZCBub3QgY29tcGxldGUgdW50aWwgYWZ0ZXIgZWl0aGVyIEh0dHBDb25uZWN0aW9uLnN0YXJ0KCkgZmFpbHNcclxuICAgICAgICAvLyBvciB0aGUgb25jbG9zZSBjYWxsYmFjayBpcyBpbnZva2VkLiBUaGUgb25jbG9zZSBjYWxsYmFjayB3aWxsIHRyYW5zaXRpb24gdGhlIEh1YkNvbm5lY3Rpb25cclxuICAgICAgICAvLyB0byB0aGUgZGlzY29ubmVjdGVkIHN0YXRlIGlmIG5lZWQgYmUgYmVmb3JlIEh0dHBDb25uZWN0aW9uLnN0b3AoKSBjb21wbGV0ZXMuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zdG9wKGVycm9yKTtcclxuICAgIH1cclxuICAgIGFzeW5jIF9zZW5kQ2xvc2VNZXNzYWdlKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2wodGhpcy5fY3JlYXRlQ2xvc2VNZXNzYWdlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgIC8vIElnbm9yZSwgdGhpcyBpcyBhIGJlc3QgZWZmb3J0IGF0dGVtcHQgdG8gbGV0IHRoZSBzZXJ2ZXIga25vdyB0aGUgY2xpZW50IGNsb3NlZCBncmFjZWZ1bGx5LlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiBJbnZva2VzIGEgc3RyZWFtaW5nIGh1YiBtZXRob2Qgb24gdGhlIHNlcnZlciB1c2luZyB0aGUgc3BlY2lmaWVkIG5hbWUgYW5kIGFyZ3VtZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBAdHlwZXBhcmFtIFQgVGhlIHR5cGUgb2YgdGhlIGl0ZW1zIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSBUaGUgbmFtZSBvZiB0aGUgc2VydmVyIG1ldGhvZCB0byBpbnZva2UuXHJcbiAgICAgKiBAcGFyYW0ge2FueVtdfSBhcmdzIFRoZSBhcmd1bWVudHMgdXNlZCB0byBpbnZva2UgdGhlIHNlcnZlciBtZXRob2QuXHJcbiAgICAgKiBAcmV0dXJucyB7SVN0cmVhbVJlc3VsdDxUPn0gQW4gb2JqZWN0IHRoYXQgeWllbGRzIHJlc3VsdHMgZnJvbSB0aGUgc2VydmVyIGFzIHRoZXkgYXJlIHJlY2VpdmVkLlxyXG4gICAgICovXHJcbiAgICBzdHJlYW0obWV0aG9kTmFtZSwgLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IFtzdHJlYW1zLCBzdHJlYW1JZHNdID0gdGhpcy5fcmVwbGFjZVN0cmVhbWluZ1BhcmFtcyhhcmdzKTtcclxuICAgICAgICBjb25zdCBpbnZvY2F0aW9uRGVzY3JpcHRvciA9IHRoaXMuX2NyZWF0ZVN0cmVhbUludm9jYXRpb24obWV0aG9kTmFtZSwgYXJncywgc3RyZWFtSWRzKTtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XHJcbiAgICAgICAgbGV0IHByb21pc2VRdWV1ZTtcclxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcclxuICAgICAgICBzdWJqZWN0LmNhbmNlbENhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWxJbnZvY2F0aW9uID0gdGhpcy5fY3JlYXRlQ2FuY2VsSW52b2NhdGlvbihpbnZvY2F0aW9uRGVzY3JpcHRvci5pbnZvY2F0aW9uSWQpO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2ludm9jYXRpb25EZXNjcmlwdG9yLmludm9jYXRpb25JZF07XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlUXVldWUudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VuZFdpdGhQcm90b2NvbChjYW5jZWxJbnZvY2F0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja3NbaW52b2NhdGlvbkRlc2NyaXB0b3IuaW52b2NhdGlvbklkXSA9IChpbnZvY2F0aW9uRXZlbnQsIGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW52b2NhdGlvbkV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnZvY2F0aW9uRXZlbnQgd2lsbCBub3QgYmUgbnVsbCB3aGVuIGFuIGVycm9yIGlzIG5vdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICBpZiAoaW52b2NhdGlvbkV2ZW50LnR5cGUgPT09IE1lc3NhZ2VUeXBlLkNvbXBsZXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW52b2NhdGlvbkV2ZW50LmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IobmV3IEVycm9yKGludm9jYXRpb25FdmVudC5lcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YmplY3QubmV4dCgoaW52b2NhdGlvbkV2ZW50Lml0ZW0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJvbWlzZVF1ZXVlID0gdGhpcy5fc2VuZFdpdGhQcm90b2NvbChpbnZvY2F0aW9uRGVzY3JpcHRvcilcclxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbaW52b2NhdGlvbkRlc2NyaXB0b3IuaW52b2NhdGlvbklkXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9sYXVuY2hTdHJlYW1zKHN0cmVhbXMsIHByb21pc2VRdWV1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XHJcbiAgICB9XHJcbiAgICBfc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgICAgIHRoaXMuX3Jlc2V0S2VlcEFsaXZlSW50ZXJ2YWwoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmQobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNlbmRzIGEganMgb2JqZWN0IHRvIHRoZSBzZXJ2ZXIuXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUganMgb2JqZWN0IHRvIHNlcmlhbGl6ZSBhbmQgc2VuZC5cclxuICAgICAqL1xyXG4gICAgX3NlbmRXaXRoUHJvdG9jb2wobWVzc2FnZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tZXNzYWdlQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlQnVmZmVyLl9zZW5kKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmRNZXNzYWdlKHRoaXMuX3Byb3RvY29sLndyaXRlTWVzc2FnZShtZXNzYWdlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIEludm9rZXMgYSBodWIgbWV0aG9kIG9uIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIHNwZWNpZmllZCBuYW1lIGFuZCBhcmd1bWVudHMuIERvZXMgbm90IHdhaXQgZm9yIGEgcmVzcG9uc2UgZnJvbSB0aGUgcmVjZWl2ZXIuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIFByb21pc2UgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgcmVzb2x2ZXMgd2hlbiB0aGUgY2xpZW50IGhhcyBzZW50IHRoZSBpbnZvY2F0aW9uIHRvIHRoZSBzZXJ2ZXIuIFRoZSBzZXJ2ZXIgbWF5IHN0aWxsXHJcbiAgICAgKiBiZSBwcm9jZXNzaW5nIHRoZSBpbnZvY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBzZXJ2ZXIgbWV0aG9kIHRvIGludm9rZS5cclxuICAgICAqIEBwYXJhbSB7YW55W119IGFyZ3MgVGhlIGFyZ3VtZW50cyB1c2VkIHRvIGludm9rZSB0aGUgc2VydmVyIG1ldGhvZC5cclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBpbnZvY2F0aW9uIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBzZW50LCBvciByZWplY3RzIHdpdGggYW4gZXJyb3IuXHJcbiAgICAgKi9cclxuICAgIHNlbmQobWV0aG9kTmFtZSwgLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IFtzdHJlYW1zLCBzdHJlYW1JZHNdID0gdGhpcy5fcmVwbGFjZVN0cmVhbWluZ1BhcmFtcyhhcmdzKTtcclxuICAgICAgICBjb25zdCBzZW5kUHJvbWlzZSA9IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2wodGhpcy5fY3JlYXRlSW52b2NhdGlvbihtZXRob2ROYW1lLCBhcmdzLCB0cnVlLCBzdHJlYW1JZHMpKTtcclxuICAgICAgICB0aGlzLl9sYXVuY2hTdHJlYW1zKHN0cmVhbXMsIHNlbmRQcm9taXNlKTtcclxuICAgICAgICByZXR1cm4gc2VuZFByb21pc2U7XHJcbiAgICB9XHJcbiAgICAvKiogSW52b2tlcyBhIGh1YiBtZXRob2Qgb24gdGhlIHNlcnZlciB1c2luZyB0aGUgc3BlY2lmaWVkIG5hbWUgYW5kIGFyZ3VtZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgUHJvbWlzZSByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCByZXNvbHZlcyB3aGVuIHRoZSBzZXJ2ZXIgaW5kaWNhdGVzIGl0IGhhcyBmaW5pc2hlZCBpbnZva2luZyB0aGUgbWV0aG9kLiBXaGVuIHRoZSBwcm9taXNlXHJcbiAgICAgKiByZXNvbHZlcywgdGhlIHNlcnZlciBoYXMgZmluaXNoZWQgaW52b2tpbmcgdGhlIG1ldGhvZC4gSWYgdGhlIHNlcnZlciBtZXRob2QgcmV0dXJucyBhIHJlc3VsdCwgaXQgaXMgcHJvZHVjZWQgYXMgdGhlIHJlc3VsdCBvZlxyXG4gICAgICogcmVzb2x2aW5nIHRoZSBQcm9taXNlLlxyXG4gICAgICpcclxuICAgICAqIEB0eXBlcGFyYW0gVCBUaGUgZXhwZWN0ZWQgcmV0dXJuIHR5cGUuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSBUaGUgbmFtZSBvZiB0aGUgc2VydmVyIG1ldGhvZCB0byBpbnZva2UuXHJcbiAgICAgKiBAcGFyYW0ge2FueVtdfSBhcmdzIFRoZSBhcmd1bWVudHMgdXNlZCB0byBpbnZva2UgdGhlIHNlcnZlciBtZXRob2QuXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn0gQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZSBzZXJ2ZXIgbWV0aG9kIChpZiBhbnkpLCBvciByZWplY3RzIHdpdGggYW4gZXJyb3IuXHJcbiAgICAgKi9cclxuICAgIGludm9rZShtZXRob2ROYW1lLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgW3N0cmVhbXMsIHN0cmVhbUlkc10gPSB0aGlzLl9yZXBsYWNlU3RyZWFtaW5nUGFyYW1zKGFyZ3MpO1xyXG4gICAgICAgIGNvbnN0IGludm9jYXRpb25EZXNjcmlwdG9yID0gdGhpcy5fY3JlYXRlSW52b2NhdGlvbihtZXRob2ROYW1lLCBhcmdzLCBmYWxzZSwgc3RyZWFtSWRzKTtcclxuICAgICAgICBjb25zdCBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBpbnZvY2F0aW9uSWQgd2lsbCBhbHdheXMgaGF2ZSBhIHZhbHVlIGZvciBhIG5vbi1ibG9ja2luZyBpbnZvY2F0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrc1tpbnZvY2F0aW9uRGVzY3JpcHRvci5pbnZvY2F0aW9uSWRdID0gKGludm9jYXRpb25FdmVudCwgZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaW52b2NhdGlvbkV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaW52b2NhdGlvbkV2ZW50IHdpbGwgbm90IGJlIG51bGwgd2hlbiBhbiBlcnJvciBpcyBub3QgcGFzc2VkIHRvIHRoZSBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZvY2F0aW9uRXZlbnQudHlwZSA9PT0gTWVzc2FnZVR5cGUuQ29tcGxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW52b2NhdGlvbkV2ZW50LmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGludm9jYXRpb25FdmVudC5lcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbnZvY2F0aW9uRXZlbnQucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgVW5leHBlY3RlZCBtZXNzYWdlIHR5cGU6ICR7aW52b2NhdGlvbkV2ZW50LnR5cGV9YCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZVF1ZXVlID0gdGhpcy5fc2VuZFdpdGhQcm90b2NvbChpbnZvY2F0aW9uRGVzY3JpcHRvcilcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gaW52b2NhdGlvbklkIHdpbGwgYWx3YXlzIGhhdmUgYSB2YWx1ZSBmb3IgYSBub24tYmxvY2tpbmcgaW52b2NhdGlvblxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tpbnZvY2F0aW9uRGVzY3JpcHRvci5pbnZvY2F0aW9uSWRdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fbGF1bmNoU3RyZWFtcyhzdHJlYW1zLCBwcm9taXNlUXVldWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwO1xyXG4gICAgfVxyXG4gICAgb24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lIHx8ICFuZXdNZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRob2ROYW1lID0gbWV0aG9kTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICghdGhpcy5fbWV0aG9kc1ttZXRob2ROYW1lXSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRob2RzW21ldGhvZE5hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFByZXZlbnRpbmcgYWRkaW5nIHRoZSBzYW1lIGhhbmRsZXIgbXVsdGlwbGUgdGltZXMuXHJcbiAgICAgICAgaWYgKHRoaXMuX21ldGhvZHNbbWV0aG9kTmFtZV0uaW5kZXhPZihuZXdNZXRob2QpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21ldGhvZHNbbWV0aG9kTmFtZV0ucHVzaChuZXdNZXRob2QpO1xyXG4gICAgfVxyXG4gICAgb2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xyXG4gICAgICAgIGlmICghbWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLl9tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIGlmICghaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZUlkeCA9IGhhbmRsZXJzLmluZGV4T2YobWV0aG9kKTtcclxuICAgICAgICAgICAgaWYgKHJlbW92ZUlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShyZW1vdmVJZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbWV0aG9kc1ttZXRob2ROYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogUmVnaXN0ZXJzIGEgaGFuZGxlciB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIGNsb3NlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgaGFuZGxlciB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIGNsb3NlZC4gT3B0aW9uYWxseSByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudCBjb250YWluaW5nIHRoZSBlcnJvciB0aGF0IGNhdXNlZCB0aGUgY29ubmVjdGlvbiB0byBjbG9zZSAoaWYgYW55KS5cclxuICAgICAqL1xyXG4gICAgb25jbG9zZShjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLl9jbG9zZWRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIFJlZ2lzdGVycyBhIGhhbmRsZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgY29ubmVjdGlvbiBzdGFydHMgcmVjb25uZWN0aW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBoYW5kbGVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGNvbm5lY3Rpb24gc3RhcnRzIHJlY29ubmVjdGluZy4gT3B0aW9uYWxseSByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudCBjb250YWluaW5nIHRoZSBlcnJvciB0aGF0IGNhdXNlZCB0aGUgY29ubmVjdGlvbiB0byBzdGFydCByZWNvbm5lY3RpbmcgKGlmIGFueSkuXHJcbiAgICAgKi9cclxuICAgIG9ucmVjb25uZWN0aW5nKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdGluZ0NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogUmVnaXN0ZXJzIGEgaGFuZGxlciB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBjb25uZWN0aW9uIHN1Y2Nlc3NmdWxseSByZWNvbm5lY3RzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBoYW5kbGVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGNvbm5lY3Rpb24gc3VjY2Vzc2Z1bGx5IHJlY29ubmVjdHMuXHJcbiAgICAgKi9cclxuICAgIG9ucmVjb25uZWN0ZWQoY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0ZWRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX3Byb2Nlc3NJbmNvbWluZ0RhdGEoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuX2NsZWFudXBUaW1lb3V0KCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZWNlaXZlZEhhbmRzaGFrZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9wcm9jZXNzSGFuZHNoYWtlUmVzcG9uc2UoZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY2VpdmVkSGFuZHNoYWtlUmVzcG9uc2UgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEYXRhIG1heSBoYXZlIGFsbCBiZWVuIHJlYWQgd2hlbiBwcm9jZXNzaW5nIGhhbmRzaGFrZSByZXNwb25zZVxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBtZXNzYWdlc1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlcyA9IHRoaXMuX3Byb3RvY29sLnBhcnNlTWVzc2FnZXMoZGF0YSwgdGhpcy5fbG9nZ2VyKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWVzc2FnZUJ1ZmZlciAmJiAhdGhpcy5fbWVzc2FnZUJ1ZmZlci5fc2hvdWxkUHJvY2Vzc01lc3NhZ2UobWVzc2FnZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBwcm9jZXNzIHRoZSBtZXNzYWdlLCB3ZSBhcmUgZWl0aGVyIHdhaXRpbmcgZm9yIGEgU2VxdWVuY2VNZXNzYWdlIG9yIHJlY2VpdmVkIGEgZHVwbGljYXRlIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5JbnZvY2F0aW9uOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnZva2VDbGllbnRNZXRob2QobWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYEludm9rZSBjbGllbnQgbWV0aG9kIHRocmV3IGVycm9yOiAke2dldEVycm9yU3RyaW5nKGUpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5TdHJlYW1JdGVtOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ29tcGxldGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX2NhbGxiYWNrc1ttZXNzYWdlLmludm9jYXRpb25JZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gTWVzc2FnZVR5cGUuQ29tcGxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbbWVzc2FnZS5pbnZvY2F0aW9uSWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYFN0cmVhbSBjYWxsYmFjayB0aHJldyBlcnJvcjogJHtnZXRFcnJvclN0cmluZyhlKX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5QaW5nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBjYXJlIGFib3V0IHBpbmdzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ2xvc2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgXCJDbG9zZSBtZXNzYWdlIHJlY2VpdmVkIGZyb20gc2VydmVyLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBtZXNzYWdlLmVycm9yID8gbmV3IEVycm9yKFwiU2VydmVyIHJldHVybmVkIGFuIGVycm9yIG9uIGNsb3NlOiBcIiArIG1lc3NhZ2UuZXJyb3IpIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS5hbGxvd1JlY29ubmVjdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgZmVlbHMgd3Jvbmcgbm90IHRvIGF3YWl0IGNvbm5lY3Rpb24uc3RvcCgpIGhlcmUsIGJ1dCBwcm9jZXNzSW5jb21pbmdEYXRhIGlzIGNhbGxlZCBhcyBwYXJ0IG9mIGFuIG9ucmVjZWl2ZSBjYWxsYmFjayB3aGljaCBpcyBub3QgYXN5bmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFscmVhZHkgdGhlIGJlaGF2aW9yIGZvciBzZXJ2ZXJUaW1lb3V0KCksIGFuZCBIdHRwQ29ubmVjdGlvbi5TdG9wKCkgc2hvdWxkIGNhdGNoIGFuZCBsb2cgYWxsIHBvc3NpYmxlIGV4Y2VwdGlvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uc3RvcChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW5ub3QgYXdhaXQgc3RvcEludGVybmFsKCkgaGVyZSwgYnV0IHN1YnNlcXVlbnQgY2FsbHMgdG8gc3RvcCgpIHdpbGwgYXdhaXQgdGhpcyBpZiBzdG9wSW50ZXJuYWwoKSBpcyBzdGlsbCBvbmdvaW5nLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RvcFByb21pc2UgPSB0aGlzLl9zdG9wSW50ZXJuYWwoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkFjazpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VCdWZmZXIuX2FjayhtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlNlcXVlbmNlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWVzc2FnZUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZUJ1ZmZlci5fcmVzZXRTZXF1ZW5jZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLldhcm5pbmcsIGBJbnZhbGlkIG1lc3NhZ2UgdHlwZTogJHttZXNzYWdlLnR5cGV9LmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZXNldFRpbWVvdXRQZXJpb2QoKTtcclxuICAgIH1cclxuICAgIF9wcm9jZXNzSGFuZHNoYWtlUmVzcG9uc2UoZGF0YSkge1xyXG4gICAgICAgIGxldCByZXNwb25zZU1lc3NhZ2U7XHJcbiAgICAgICAgbGV0IHJlbWFpbmluZ0RhdGE7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgW3JlbWFpbmluZ0RhdGEsIHJlc3BvbnNlTWVzc2FnZV0gPSB0aGlzLl9oYW5kc2hha2VQcm90b2NvbC5wYXJzZUhhbmRzaGFrZVJlc3BvbnNlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gXCJFcnJvciBwYXJzaW5nIGhhbmRzaGFrZSByZXNwb25zZTogXCIgKyBlO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRzaGFrZVJlamVjdGVyKGVycm9yKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNwb25zZU1lc3NhZ2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IFwiU2VydmVyIHJldHVybmVkIGhhbmRzaGFrZSBlcnJvcjogXCIgKyByZXNwb25zZU1lc3NhZ2UuZXJyb3I7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZHNoYWtlUmVqZWN0ZXIoZXJyb3IpO1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIFwiU2VydmVyIGhhbmRzaGFrZSBjb21wbGV0ZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2hhbmRzaGFrZVJlc29sdmVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlbWFpbmluZ0RhdGE7XHJcbiAgICB9XHJcbiAgICBfcmVzZXRLZWVwQWxpdmVJbnRlcnZhbCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uLmZlYXR1cmVzLmluaGVyZW50S2VlcEFsaXZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2V0IHRoZSB0aW1lIHdlIHdhbnQgdGhlIG5leHQga2VlcCBhbGl2ZSB0byBiZSBzZW50XHJcbiAgICAgICAgLy8gVGltZXIgd2lsbCBiZSBzZXR1cCBvbiBuZXh0IG1lc3NhZ2UgcmVjZWl2ZVxyXG4gICAgICAgIHRoaXMuX25leHRLZWVwQWxpdmUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIHRoaXMua2VlcEFsaXZlSW50ZXJ2YWxJbk1pbGxpc2Vjb25kcztcclxuICAgICAgICB0aGlzLl9jbGVhbnVwUGluZ1RpbWVyKCk7XHJcbiAgICB9XHJcbiAgICBfcmVzZXRUaW1lb3V0UGVyaW9kKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uLmZlYXR1cmVzIHx8ICF0aGlzLmNvbm5lY3Rpb24uZmVhdHVyZXMuaW5oZXJlbnRLZWVwQWxpdmUpIHtcclxuICAgICAgICAgICAgLy8gU2V0IHRoZSB0aW1lb3V0IHRpbWVyXHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VydmVyVGltZW91dCgpLCB0aGlzLnNlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgICAgIC8vIFNldCBrZWVwQWxpdmUgdGltZXIgaWYgdGhlcmUgaXNuJ3Qgb25lXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9waW5nU2VydmVySGFuZGxlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXh0UGluZyA9IHRoaXMuX25leHRLZWVwQWxpdmUgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0UGluZyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0UGluZyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGltZXIgbmVlZHMgdG8gYmUgc2V0IGZyb20gYSBuZXR3b3JraW5nIGNhbGxiYWNrIHRvIGF2b2lkIENocm9tZSB0aW1lciB0aHJvdHRsaW5nIGZyb20gY2F1c2luZyB0aW1lcnMgdG8gcnVuIG9uY2UgYSBtaW51dGVcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BpbmdTZXJ2ZXJIYW5kbGUgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBIdWJDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kTWVzc2FnZSh0aGlzLl9jYWNoZWRQaW5nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgY2FyZSBhYm91dCB0aGUgZXJyb3IuIEl0IHNob3VsZCBiZSBzZWVuIGVsc2V3aGVyZSBpbiB0aGUgY2xpZW50LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGNvbm5lY3Rpb24gaXMgcHJvYmFibHkgaW4gYSBiYWQgb3IgY2xvc2VkIHN0YXRlIG5vdywgY2xlYW51cCB0aGUgdGltZXIgc28gaXQgc3RvcHMgdHJpZ2dlcmluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xlYW51cFBpbmdUaW1lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgbmV4dFBpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxyXG4gICAgc2VydmVyVGltZW91dCgpIHtcclxuICAgICAgICAvLyBUaGUgc2VydmVyIGhhc24ndCB0YWxrZWQgdG8gdXMgaW4gYSB3aGlsZS4gSXQgZG9lc24ndCBsaWtlIHVzIGFueW1vcmUgLi4uIDooXHJcbiAgICAgICAgLy8gVGVybWluYXRlIHRoZSBjb25uZWN0aW9uLCBidXQgd2UgZG9uJ3QgbmVlZCB0byB3YWl0IG9uIHRoZSBwcm9taXNlLiBUaGlzIGNvdWxkIHRyaWdnZXIgcmVjb25uZWN0aW5nLlxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uc3RvcChuZXcgRXJyb3IoXCJTZXJ2ZXIgdGltZW91dCBlbGFwc2VkIHdpdGhvdXQgcmVjZWl2aW5nIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXCIpKTtcclxuICAgIH1cclxuICAgIGFzeW5jIF9pbnZva2VDbGllbnRNZXRob2QoaW52b2NhdGlvbk1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gaW52b2NhdGlvbk1lc3NhZ2UudGFyZ2V0LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuX21ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKCFtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYE5vIGNsaWVudCBtZXRob2Qgd2l0aCB0aGUgbmFtZSAnJHttZXRob2ROYW1lfScgZm91bmQuYCk7XHJcbiAgICAgICAgICAgIC8vIE5vIGhhbmRsZXJzIHByb3ZpZGVkIGJ5IGNsaWVudCBidXQgdGhlIHNlcnZlciBpcyBleHBlY3RpbmcgYSByZXNwb25zZSBzdGlsbCwgc28gd2Ugc2VuZCBhbiBlcnJvclxyXG4gICAgICAgICAgICBpZiAoaW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLldhcm5pbmcsIGBObyByZXN1bHQgZ2l2ZW4gZm9yICcke21ldGhvZE5hbWV9JyBtZXRob2QgYW5kIGludm9jYXRpb24gSUQgJyR7aW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkfScuYCk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kV2l0aFByb3RvY29sKHRoaXMuX2NyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKGludm9jYXRpb25NZXNzYWdlLmludm9jYXRpb25JZCwgXCJDbGllbnQgZGlkbid0IHByb3ZpZGUgYSByZXN1bHQuXCIsIG51bGwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEF2b2lkIGlzc3VlcyB3aXRoIGhhbmRsZXJzIHJlbW92aW5nIHRoZW1zZWx2ZXMgdGh1cyBtb2RpZnlpbmcgdGhlIGxpc3Qgd2hpbGUgaXRlcmF0aW5nIHRocm91Z2ggaXRcclxuICAgICAgICBjb25zdCBtZXRob2RzQ29weSA9IG1ldGhvZHMuc2xpY2UoKTtcclxuICAgICAgICAvLyBTZXJ2ZXIgZXhwZWN0cyBhIHJlc3BvbnNlXHJcbiAgICAgICAgY29uc3QgZXhwZWN0c1Jlc3BvbnNlID0gaW52b2NhdGlvbk1lc3NhZ2UuaW52b2NhdGlvbklkID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIC8vIFdlIHByZXNlcnZlIHRoZSBsYXN0IHJlc3VsdCBvciBleGNlcHRpb24gYnV0IHN0aWxsIGNhbGwgYWxsIGhhbmRsZXJzXHJcbiAgICAgICAgbGV0IHJlcztcclxuICAgICAgICBsZXQgZXhjZXB0aW9uO1xyXG4gICAgICAgIGxldCBjb21wbGV0aW9uTWVzc2FnZTtcclxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWV0aG9kc0NvcHkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZSZXMgPSByZXM7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBhd2FpdCBtLmFwcGx5KHRoaXMsIGludm9jYXRpb25NZXNzYWdlLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXhwZWN0c1Jlc3BvbnNlICYmIHJlcyAmJiBwcmV2UmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYE11bHRpcGxlIHJlc3VsdHMgcHJvdmlkZWQgZm9yICcke21ldGhvZE5hbWV9Jy4gU2VuZGluZyBlcnJvciB0byBzZXJ2ZXIuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbk1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVDb21wbGV0aW9uTWVzc2FnZShpbnZvY2F0aW9uTWVzc2FnZS5pbnZvY2F0aW9uSWQsIGBDbGllbnQgcHJvdmlkZWQgbXVsdGlwbGUgcmVzdWx0cy5gLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb24gaWYgd2UgZ290IGEgcmVzdWx0IGFmdGVyLCB0aGUgZXhjZXB0aW9uIHdpbGwgYmUgbG9nZ2VkXHJcbiAgICAgICAgICAgICAgICBleGNlcHRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgQSBjYWxsYmFjayBmb3IgdGhlIG1ldGhvZCAnJHttZXRob2ROYW1lfScgdGhyZXcgZXJyb3IgJyR7ZX0nLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wbGV0aW9uTWVzc2FnZSkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zZW5kV2l0aFByb3RvY29sKGNvbXBsZXRpb25NZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXhwZWN0c1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGFuIGV4Y2VwdGlvbiB0aGF0IG1lYW5zIGVpdGhlciBubyByZXN1bHQgd2FzIGdpdmVuIG9yIGEgaGFuZGxlciBhZnRlciBhIHJlc3VsdCB0aHJld1xyXG4gICAgICAgICAgICBpZiAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9uTWVzc2FnZSA9IHRoaXMuX2NyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKGludm9jYXRpb25NZXNzYWdlLmludm9jYXRpb25JZCwgYCR7ZXhjZXB0aW9ufWAsIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9uTWVzc2FnZSA9IHRoaXMuX2NyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKGludm9jYXRpb25NZXNzYWdlLmludm9jYXRpb25JZCwgbnVsbCwgcmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYE5vIHJlc3VsdCBnaXZlbiBmb3IgJyR7bWV0aG9kTmFtZX0nIG1ldGhvZCBhbmQgaW52b2NhdGlvbiBJRCAnJHtpbnZvY2F0aW9uTWVzc2FnZS5pbnZvY2F0aW9uSWR9Jy5gKTtcclxuICAgICAgICAgICAgICAgIC8vIENsaWVudCBkaWRuJ3QgcHJvdmlkZSBhIHJlc3VsdCBvciB0aHJvdyBmcm9tIGEgaGFuZGxlciwgc2VydmVyIGV4cGVjdHMgYSByZXNwb25zZSBzbyB3ZSBzZW5kIGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9uTWVzc2FnZSA9IHRoaXMuX2NyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKGludm9jYXRpb25NZXNzYWdlLmludm9jYXRpb25JZCwgXCJDbGllbnQgZGlkbid0IHByb3ZpZGUgYSByZXN1bHQuXCIsIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2woY29tcGxldGlvbk1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYFJlc3VsdCBnaXZlbiBmb3IgJyR7bWV0aG9kTmFtZX0nIG1ldGhvZCBidXQgc2VydmVyIGlzIG5vdCBleHBlY3RpbmcgYSByZXN1bHQuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY29ubmVjdGlvbkNsb3NlZChlcnJvcikge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBIdWJDb25uZWN0aW9uLmNvbm5lY3Rpb25DbG9zZWQoJHtlcnJvcn0pIGNhbGxlZCB3aGlsZSBpbiBzdGF0ZSAke3RoaXMuX2Nvbm5lY3Rpb25TdGF0ZX0uYCk7XHJcbiAgICAgICAgLy8gVHJpZ2dlcmluZyB0aGlzLmhhbmRzaGFrZVJlamVjdGVyIGlzIGluc3VmZmljaWVudCBiZWNhdXNlIGl0IGNvdWxkIGFscmVhZHkgYmUgcmVzb2x2ZWQgd2l0aG91dCB0aGUgY29udGludWF0aW9uIGhhdmluZyBydW4geWV0LlxyXG4gICAgICAgIHRoaXMuX3N0b3BEdXJpbmdTdGFydEVycm9yID0gdGhpcy5fc3RvcER1cmluZ1N0YXJ0RXJyb3IgfHwgZXJyb3IgfHwgbmV3IEFib3J0RXJyb3IoXCJUaGUgdW5kZXJseWluZyBjb25uZWN0aW9uIHdhcyBjbG9zZWQgYmVmb3JlIHRoZSBodWIgaGFuZHNoYWtlIGNvdWxkIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICAvLyBJZiB0aGUgaGFuZHNoYWtlIGlzIGluIHByb2dyZXNzLCBzdGFydCB3aWxsIGJlIHdhaXRpbmcgZm9yIHRoZSBoYW5kc2hha2UgcHJvbWlzZSwgc28gd2UgY29tcGxldGUgaXQuXHJcbiAgICAgICAgLy8gSWYgaXQgaGFzIGFscmVhZHkgY29tcGxldGVkLCB0aGlzIHNob3VsZCBqdXN0IG5vb3AuXHJcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRzaGFrZVJlc29sdmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRzaGFrZVJlc29sdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbmNlbENhbGxiYWNrc1dpdGhFcnJvcihlcnJvciB8fCBuZXcgRXJyb3IoXCJJbnZvY2F0aW9uIGNhbmNlbGVkIGR1ZSB0byB0aGUgdW5kZXJseWluZyBjb25uZWN0aW9uIGJlaW5nIGNsb3NlZC5cIikpO1xyXG4gICAgICAgIHRoaXMuX2NsZWFudXBUaW1lb3V0KCk7XHJcbiAgICAgICAgdGhpcy5fY2xlYW51cFBpbmdUaW1lcigpO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlQ2xvc2UoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgPT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5Db25uZWN0ZWQgJiYgdGhpcy5fcmVjb25uZWN0UG9saWN5KSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0KGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fY29ubmVjdGlvblN0YXRlID09PSBIdWJDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlQ2xvc2UoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBub25lIG9mIHRoZSBhYm92ZSBpZiBjb25kaXRpb25zIHdlcmUgdHJ1ZSB3ZXJlIGNhbGxlZCB0aGUgSHViQ29ubmVjdGlvbiBtdXN0IGJlIGluIGVpdGhlcjpcclxuICAgICAgICAvLyAxLiBUaGUgQ29ubmVjdGluZyBzdGF0ZSBpbiB3aGljaCBjYXNlIHRoZSBoYW5kc2hha2VSZXNvbHZlciB3aWxsIGNvbXBsZXRlIGl0IGFuZCBzdG9wRHVyaW5nU3RhcnRFcnJvciB3aWxsIGZhaWwgaXQuXHJcbiAgICAgICAgLy8gMi4gVGhlIFJlY29ubmVjdGluZyBzdGF0ZSBpbiB3aGljaCBjYXNlIHRoZSBoYW5kc2hha2VSZXNvbHZlciB3aWxsIGNvbXBsZXRlIGl0IGFuZCBzdG9wRHVyaW5nU3RhcnRFcnJvciB3aWxsIGZhaWwgdGhlIGN1cnJlbnQgcmVjb25uZWN0IGF0dGVtcHRcclxuICAgICAgICAvLyAgICBhbmQgcG90ZW50aWFsbHkgY29udGludWUgdGhlIHJlY29ubmVjdCgpIGxvb3AuXHJcbiAgICAgICAgLy8gMy4gVGhlIERpc2Nvbm5lY3RlZCBzdGF0ZSBpbiB3aGljaCBjYXNlIHdlJ3JlIGFscmVhZHkgZG9uZS5cclxuICAgIH1cclxuICAgIF9jb21wbGV0ZUNsb3NlKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9IEh1YkNvbm5lY3Rpb25TdGF0ZS5EaXNjb25uZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25TdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tZXNzYWdlQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlQnVmZmVyLl9kaXNwb3NlKGVycm9yICE9PSBudWxsICYmIGVycm9yICE9PSB2b2lkIDAgPyBlcnJvciA6IG5ldyBFcnJvcihcIkNvbm5lY3Rpb24gY2xvc2VkLlwiKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlQnVmZmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZnJlZXplXCIsIHRoaXMuX2ZyZWV6ZUV2ZW50TGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZWRDYWxsYmFja3MuZm9yRWFjaCgoYykgPT4gYy5hcHBseSh0aGlzLCBbZXJyb3JdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGBBbiBvbmNsb3NlIGNhbGxiYWNrIGNhbGxlZCB3aXRoIGVycm9yICcke2Vycm9yfScgdGhyZXcgZXJyb3IgJyR7ZX0nLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXN5bmMgX3JlY29ubmVjdChlcnJvcikge1xyXG4gICAgICAgIGNvbnN0IHJlY29ubmVjdFN0YXJ0VGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgbGV0IHByZXZpb3VzUmVjb25uZWN0QXR0ZW1wdHMgPSAwO1xyXG4gICAgICAgIGxldCByZXRyeUVycm9yID0gZXJyb3IgIT09IHVuZGVmaW5lZCA/IGVycm9yIDogbmV3IEVycm9yKFwiQXR0ZW1wdGluZyB0byByZWNvbm5lY3QgZHVlIHRvIGEgdW5rbm93biBlcnJvci5cIik7XHJcbiAgICAgICAgbGV0IG5leHRSZXRyeURlbGF5ID0gdGhpcy5fZ2V0TmV4dFJldHJ5RGVsYXkocHJldmlvdXNSZWNvbm5lY3RBdHRlbXB0cysrLCAwLCByZXRyeUVycm9yKTtcclxuICAgICAgICBpZiAobmV4dFJldHJ5RGVsYXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5EZWJ1ZywgXCJDb25uZWN0aW9uIG5vdCByZWNvbm5lY3RpbmcgYmVjYXVzZSB0aGUgSVJldHJ5UG9saWN5IHJldHVybmVkIG51bGwgb24gdGhlIGZpcnN0IHJlY29ubmVjdCBhdHRlbXB0LlwiKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGVDbG9zZShlcnJvcik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvblN0YXRlID0gSHViQ29ubmVjdGlvblN0YXRlLlJlY29ubmVjdGluZztcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgYENvbm5lY3Rpb24gcmVjb25uZWN0aW5nIGJlY2F1c2Ugb2YgZXJyb3IgJyR7ZXJyb3J9Jy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIFwiQ29ubmVjdGlvbiByZWNvbm5lY3RpbmcuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0aW5nQ2FsbGJhY2tzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0aW5nQ2FsbGJhY2tzLmZvckVhY2goKGMpID0+IGMuYXBwbHkodGhpcywgW2Vycm9yXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgQW4gb25yZWNvbm5lY3RpbmcgY2FsbGJhY2sgY2FsbGVkIHdpdGggZXJyb3IgJyR7ZXJyb3J9JyB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gRXhpdCBlYXJseSBpZiBhbiBvbnJlY29ubmVjdGluZyBjYWxsYmFjayBjYWxsZWQgY29ubmVjdGlvbi5zdG9wKCkuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5SZWNvbm5lY3RpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIFwiQ29ubmVjdGlvbiBsZWZ0IHRoZSByZWNvbm5lY3Rpbmcgc3RhdGUgaW4gb25yZWNvbm5lY3RpbmcgY2FsbGJhY2suIERvbmUgcmVjb25uZWN0aW5nLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAobmV4dFJldHJ5RGVsYXkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgYFJlY29ubmVjdCBhdHRlbXB0IG51bWJlciAke3ByZXZpb3VzUmVjb25uZWN0QXR0ZW1wdHN9IHdpbGwgc3RhcnQgaW4gJHtuZXh0UmV0cnlEZWxheX0gbXMuYCk7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3REZWxheUhhbmRsZSA9IHNldFRpbWVvdXQocmVzb2x2ZSwgbmV4dFJldHJ5RGVsYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0RGVsYXlIYW5kbGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uU3RhdGUgIT09IEh1YkNvbm5lY3Rpb25TdGF0ZS5SZWNvbm5lY3RpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIFwiQ29ubmVjdGlvbiBsZWZ0IHRoZSByZWNvbm5lY3Rpbmcgc3RhdGUgZHVyaW5nIHJlY29ubmVjdCBkZWxheS4gRG9uZSByZWNvbm5lY3RpbmcuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zdGFydEludGVybmFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uU3RhdGUgPSBIdWJDb25uZWN0aW9uU3RhdGUuQ29ubmVjdGVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5JbmZvcm1hdGlvbiwgXCJIdWJDb25uZWN0aW9uIHJlY29ubmVjdGVkIHN1Y2Nlc3NmdWxseS5cIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0ZWRDYWxsYmFja3MubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0ZWRDYWxsYmFja3MuZm9yRWFjaCgoYykgPT4gYy5hcHBseSh0aGlzLCBbdGhpcy5jb25uZWN0aW9uLmNvbm5lY3Rpb25JZF0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYEFuIG9ucmVjb25uZWN0ZWQgY2FsbGJhY2sgY2FsbGVkIHdpdGggY29ubmVjdGlvbklkICcke3RoaXMuY29ubmVjdGlvbi5jb25uZWN0aW9uSWR9OyB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgUmVjb25uZWN0IGF0dGVtcHQgZmFpbGVkIGJlY2F1c2Ugb2YgZXJyb3IgJyR7ZX0nLmApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSAhPT0gSHViQ29ubmVjdGlvblN0YXRlLlJlY29ubmVjdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRGVidWcsIGBDb25uZWN0aW9uIG1vdmVkIHRvIHRoZSAnJHt0aGlzLl9jb25uZWN0aW9uU3RhdGV9JyBmcm9tIHRoZSByZWNvbm5lY3Rpbmcgc3RhdGUgZHVyaW5nIHJlY29ubmVjdCBhdHRlbXB0LiBEb25lIHJlY29ubmVjdGluZy5gKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgVHlwZVNjcmlwdCBjb21waWxlciB0aGlua3MgdGhhdCBjb25uZWN0aW9uU3RhdGUgbXVzdCBiZSBDb25uZWN0ZWQgaGVyZS4gVGhlIFR5cGVTY3JpcHQgY29tcGlsZXIgaXMgd3JvbmcuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Nvbm5lY3Rpb25TdGF0ZSA9PT0gSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29tcGxldGVDbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXRyeUVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZSA6IG5ldyBFcnJvcihlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgbmV4dFJldHJ5RGVsYXkgPSB0aGlzLl9nZXROZXh0UmV0cnlEZWxheShwcmV2aW91c1JlY29ubmVjdEF0dGVtcHRzKyssIERhdGUubm93KCkgLSByZWNvbm5lY3RTdGFydFRpbWUsIHJldHJ5RXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIGBSZWNvbm5lY3QgcmV0cmllcyBoYXZlIGJlZW4gZXhoYXVzdGVkIGFmdGVyICR7RGF0ZS5ub3coKSAtIHJlY29ubmVjdFN0YXJ0VGltZX0gbXMgYW5kICR7cHJldmlvdXNSZWNvbm5lY3RBdHRlbXB0c30gZmFpbGVkIGF0dGVtcHRzLiBDb25uZWN0aW9uIGRpc2Nvbm5lY3RpbmcuYCk7XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGVDbG9zZSgpO1xyXG4gICAgfVxyXG4gICAgX2dldE5leHRSZXRyeURlbGF5KHByZXZpb3VzUmV0cnlDb3VudCwgZWxhcHNlZE1pbGxpc2Vjb25kcywgcmV0cnlSZWFzb24pIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVjb25uZWN0UG9saWN5Lm5leHRSZXRyeURlbGF5SW5NaWxsaXNlY29uZHMoe1xyXG4gICAgICAgICAgICAgICAgZWxhcHNlZE1pbGxpc2Vjb25kcyxcclxuICAgICAgICAgICAgICAgIHByZXZpb3VzUmV0cnlDb3VudCxcclxuICAgICAgICAgICAgICAgIHJldHJ5UmVhc29uLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYElSZXRyeVBvbGljeS5uZXh0UmV0cnlEZWxheUluTWlsbGlzZWNvbmRzKCR7cHJldmlvdXNSZXRyeUNvdW50fSwgJHtlbGFwc2VkTWlsbGlzZWNvbmRzfSkgdGhyZXcgZXJyb3IgJyR7ZX0nLmApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY2FuY2VsQ2FsbGJhY2tzV2l0aEVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGNhbGxiYWNrcylcclxuICAgICAgICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrc1trZXldO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkVycm9yLCBgU3RyZWFtICdlcnJvcicgY2FsbGJhY2sgY2FsbGVkIHdpdGggJyR7ZXJyb3J9JyB0aHJldyBlcnJvcjogJHtnZXRFcnJvclN0cmluZyhlKX1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX2NsZWFudXBQaW5nVGltZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BpbmdTZXJ2ZXJIYW5kbGUpIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3BpbmdTZXJ2ZXJIYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9waW5nU2VydmVySGFuZGxlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9jbGVhbnVwVGltZW91dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGltZW91dEhhbmRsZSkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dEhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2NyZWF0ZUludm9jYXRpb24obWV0aG9kTmFtZSwgYXJncywgbm9uYmxvY2tpbmcsIHN0cmVhbUlkcykge1xyXG4gICAgICAgIGlmIChub25ibG9ja2luZykge1xyXG4gICAgICAgICAgICBpZiAoc3RyZWFtSWRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtSWRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogbWV0aG9kTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZS5JbnZvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogbWV0aG9kTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZS5JbnZvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaW52b2NhdGlvbklkID0gdGhpcy5faW52b2NhdGlvbklkO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnZvY2F0aW9uSWQrKztcclxuICAgICAgICAgICAgaWYgKHN0cmVhbUlkcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxyXG4gICAgICAgICAgICAgICAgICAgIGludm9jYXRpb25JZDogaW52b2NhdGlvbklkLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtSWRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogbWV0aG9kTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZS5JbnZvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxyXG4gICAgICAgICAgICAgICAgICAgIGludm9jYXRpb25JZDogaW52b2NhdGlvbklkLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBtZXRob2ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkludm9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2xhdW5jaFN0cmVhbXMoc3RyZWFtcywgcHJvbWlzZVF1ZXVlKSB7XHJcbiAgICAgICAgaWYgKHN0cmVhbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU3luY2hyb25pemUgc3RyZWFtIGRhdGEgc28gdGhleSBhcnJpdmUgaW4tb3JkZXIgb24gdGhlIHNlcnZlclxyXG4gICAgICAgIGlmICghcHJvbWlzZVF1ZXVlKSB7XHJcbiAgICAgICAgICAgIHByb21pc2VRdWV1ZSA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBXZSB3YW50IHRvIGl0ZXJhdGUgb3ZlciB0aGUga2V5cywgc2luY2UgdGhlIGtleXMgYXJlIHRoZSBzdHJlYW0gaWRzXHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGd1YXJkLWZvci1pblxyXG4gICAgICAgIGZvciAoY29uc3Qgc3RyZWFtSWQgaW4gc3RyZWFtcykge1xyXG4gICAgICAgICAgICBzdHJlYW1zW3N0cmVhbUlkXS5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlUXVldWUgPSBwcm9taXNlUXVldWUudGhlbigoKSA9PiB0aGlzLl9zZW5kV2l0aFByb3RvY29sKHRoaXMuX2NyZWF0ZUNvbXBsZXRpb25NZXNzYWdlKHN0cmVhbUlkKSkpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyICYmIGVyci50b1N0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJVbmtub3duIGVycm9yXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VRdWV1ZSA9IHByb21pc2VRdWV1ZS50aGVuKCgpID0+IHRoaXMuX3NlbmRXaXRoUHJvdG9jb2wodGhpcy5fY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2Uoc3RyZWFtSWQsIG1lc3NhZ2UpKSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmV4dDogKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlUXVldWUgPSBwcm9taXNlUXVldWUudGhlbigoKSA9PiB0aGlzLl9zZW5kV2l0aFByb3RvY29sKHRoaXMuX2NyZWF0ZVN0cmVhbUl0ZW1NZXNzYWdlKHN0cmVhbUlkLCBpdGVtKSkpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX3JlcGxhY2VTdHJlYW1pbmdQYXJhbXMoYXJncykge1xyXG4gICAgICAgIGNvbnN0IHN0cmVhbXMgPSBbXTtcclxuICAgICAgICBjb25zdCBzdHJlYW1JZHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYXJndW1lbnQgPSBhcmdzW2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNPYnNlcnZhYmxlKGFyZ3VtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyZWFtSWQgPSB0aGlzLl9pbnZvY2F0aW9uSWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnZvY2F0aW9uSWQrKztcclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBzdHJlYW0gZm9yIGxhdGVyIHVzZVxyXG4gICAgICAgICAgICAgICAgc3RyZWFtc1tzdHJlYW1JZF0gPSBhcmd1bWVudDtcclxuICAgICAgICAgICAgICAgIHN0cmVhbUlkcy5wdXNoKHN0cmVhbUlkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHN0cmVhbSBmcm9tIGFyZ3NcclxuICAgICAgICAgICAgICAgIGFyZ3Muc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbc3RyZWFtcywgc3RyZWFtSWRzXTtcclxuICAgIH1cclxuICAgIF9pc09ic2VydmFibGUoYXJnKSB7XHJcbiAgICAgICAgLy8gVGhpcyBhbGxvd3Mgb3RoZXIgc3RyZWFtIGltcGxlbWVudGF0aW9ucyB0byBqdXN0IHdvcmsgKGxpa2UgcnhqcylcclxuICAgICAgICByZXR1cm4gYXJnICYmIGFyZy5zdWJzY3JpYmUgJiYgdHlwZW9mIGFyZy5zdWJzY3JpYmUgPT09IFwiZnVuY3Rpb25cIjtcclxuICAgIH1cclxuICAgIF9jcmVhdGVTdHJlYW1JbnZvY2F0aW9uKG1ldGhvZE5hbWUsIGFyZ3MsIHN0cmVhbUlkcykge1xyXG4gICAgICAgIGNvbnN0IGludm9jYXRpb25JZCA9IHRoaXMuX2ludm9jYXRpb25JZDtcclxuICAgICAgICB0aGlzLl9pbnZvY2F0aW9uSWQrKztcclxuICAgICAgICBpZiAoc3RyZWFtSWRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbklkOiBpbnZvY2F0aW9uSWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIHN0cmVhbUlkcyxcclxuICAgICAgICAgICAgICAgIHRhcmdldDogbWV0aG9kTmFtZSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLlN0cmVhbUludm9jYXRpb24sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbklkOiBpbnZvY2F0aW9uSWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIHRhcmdldDogbWV0aG9kTmFtZSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLlN0cmVhbUludm9jYXRpb24sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2NyZWF0ZUNhbmNlbEludm9jYXRpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnZvY2F0aW9uSWQ6IGlkLFxyXG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZS5DYW5jZWxJbnZvY2F0aW9uLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlU3RyZWFtSXRlbU1lc3NhZ2UoaWQsIGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnZvY2F0aW9uSWQ6IGlkLFxyXG4gICAgICAgICAgICBpdGVtLFxyXG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZS5TdHJlYW1JdGVtLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBfY3JlYXRlQ29tcGxldGlvbk1lc3NhZ2UoaWQsIGVycm9yLCByZXN1bHQpIHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLFxyXG4gICAgICAgICAgICAgICAgaW52b2NhdGlvbklkOiBpZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkNvbXBsZXRpb24sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGludm9jYXRpb25JZDogaWQsXHJcbiAgICAgICAgICAgIHJlc3VsdCxcclxuICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGUuQ29tcGxldGlvbixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgX2NyZWF0ZUNsb3NlTWVzc2FnZSgpIHtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiBNZXNzYWdlVHlwZS5DbG9zZSB9O1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUh1YkNvbm5lY3Rpb24uanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBEZWZhdWx0UmVjb25uZWN0UG9saWN5IH0gZnJvbSBcIi4vRGVmYXVsdFJlY29ubmVjdFBvbGljeVwiO1xyXG5pbXBvcnQgeyBIdHRwQ29ubmVjdGlvbiB9IGZyb20gXCIuL0h0dHBDb25uZWN0aW9uXCI7XHJcbmltcG9ydCB7IEh1YkNvbm5lY3Rpb24gfSBmcm9tIFwiLi9IdWJDb25uZWN0aW9uXCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBKc29uSHViUHJvdG9jb2wgfSBmcm9tIFwiLi9Kc29uSHViUHJvdG9jb2xcIjtcclxuaW1wb3J0IHsgTnVsbExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlcnNcIjtcclxuaW1wb3J0IHsgQXJnLCBDb25zb2xlTG9nZ2VyIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuY29uc3QgTG9nTGV2ZWxOYW1lTWFwcGluZyA9IHtcclxuICAgIHRyYWNlOiBMb2dMZXZlbC5UcmFjZSxcclxuICAgIGRlYnVnOiBMb2dMZXZlbC5EZWJ1ZyxcclxuICAgIGluZm86IExvZ0xldmVsLkluZm9ybWF0aW9uLFxyXG4gICAgaW5mb3JtYXRpb246IExvZ0xldmVsLkluZm9ybWF0aW9uLFxyXG4gICAgd2FybjogTG9nTGV2ZWwuV2FybmluZyxcclxuICAgIHdhcm5pbmc6IExvZ0xldmVsLldhcm5pbmcsXHJcbiAgICBlcnJvcjogTG9nTGV2ZWwuRXJyb3IsXHJcbiAgICBjcml0aWNhbDogTG9nTGV2ZWwuQ3JpdGljYWwsXHJcbiAgICBub25lOiBMb2dMZXZlbC5Ob25lLFxyXG59O1xyXG5mdW5jdGlvbiBwYXJzZUxvZ0xldmVsKG5hbWUpIHtcclxuICAgIC8vIENhc2UtaW5zZW5zaXRpdmUgbWF0Y2hpbmcgdmlhIGxvd2VyLWNhc2luZ1xyXG4gICAgLy8gWWVzLCBJIGtub3cgY2FzZS1mb2xkaW5nIGlzIGEgY29tcGxpY2F0ZWQgcHJvYmxlbSBpbiBVbmljb2RlLCBidXQgd2Ugb25seSBzdXBwb3J0XHJcbiAgICAvLyB0aGUgQVNDSUkgc3RyaW5ncyBkZWZpbmVkIGluIExvZ0xldmVsTmFtZU1hcHBpbmcgYW55d2F5LCBzbyBpdCdzIGZpbmUgLWFudXJzZS5cclxuICAgIGNvbnN0IG1hcHBpbmcgPSBMb2dMZXZlbE5hbWVNYXBwaW5nW25hbWUudG9Mb3dlckNhc2UoKV07XHJcbiAgICBpZiAodHlwZW9mIG1hcHBpbmcgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICByZXR1cm4gbWFwcGluZztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBsb2cgbGV2ZWw6ICR7bmFtZX1gKTtcclxuICAgIH1cclxufVxyXG4vKiogQSBidWlsZGVyIGZvciBjb25maWd1cmluZyB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb259IGluc3RhbmNlcy4gKi9cclxuZXhwb3J0IGNsYXNzIEh1YkNvbm5lY3Rpb25CdWlsZGVyIHtcclxuICAgIGNvbmZpZ3VyZUxvZ2dpbmcobG9nZ2luZykge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKGxvZ2dpbmcsIFwibG9nZ2luZ1wiKTtcclxuICAgICAgICBpZiAoaXNMb2dnZXIobG9nZ2luZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbG9nZ2luZyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBjb25zdCBsb2dMZXZlbCA9IHBhcnNlTG9nTGV2ZWwobG9nZ2luZyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IENvbnNvbGVMb2dnZXIobG9nTGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgQ29uc29sZUxvZ2dlcihsb2dnaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB3aXRoVXJsKHVybCwgdHJhbnNwb3J0VHlwZU9yT3B0aW9ucykge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHVybCwgXCJ1cmxcIik7XHJcbiAgICAgICAgQXJnLmlzTm90RW1wdHkodXJsLCBcInVybFwiKTtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICAvLyBGbG93LXR5cGluZyBrbm93cyB3aGVyZSBpdCdzIGF0LiBTaW5jZSBIdHRwVHJhbnNwb3J0VHlwZSBpcyBhIG51bWJlciBhbmQgSUh0dHBDb25uZWN0aW9uT3B0aW9ucyBpcyBndWFyYW50ZWVkXHJcbiAgICAgICAgLy8gdG8gYmUgYW4gb2JqZWN0LCB3ZSBrbm93IChhcyBkb2VzIFR5cGVTY3JpcHQpIHRoaXMgY29tcGFyaXNvbiBpcyBhbGwgd2UgbmVlZCB0byBmaWd1cmUgb3V0IHdoaWNoIG92ZXJsb2FkIHdhcyBjYWxsZWQuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFuc3BvcnRUeXBlT3JPcHRpb25zID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaHR0cENvbm5lY3Rpb25PcHRpb25zID0geyAuLi50aGlzLmh0dHBDb25uZWN0aW9uT3B0aW9ucywgLi4udHJhbnNwb3J0VHlwZU9yT3B0aW9ucyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5odHRwQ29ubmVjdGlvbk9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi50aGlzLmh0dHBDb25uZWN0aW9uT3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0VHlwZU9yT3B0aW9ucyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKiogQ29uZmlndXJlcyB0aGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9ufSB0byB1c2UgdGhlIHNwZWNpZmllZCBIdWIgUHJvdG9jb2wuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtJSHViUHJvdG9jb2x9IHByb3RvY29sIFRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLklIdWJQcm90b2NvbH0gaW1wbGVtZW50YXRpb24gdG8gdXNlLlxyXG4gICAgICovXHJcbiAgICB3aXRoSHViUHJvdG9jb2wocHJvdG9jb2wpIHtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZChwcm90b2NvbCwgXCJwcm90b2NvbFwiKTtcclxuICAgICAgICB0aGlzLnByb3RvY29sID0gcHJvdG9jb2w7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB3aXRoQXV0b21hdGljUmVjb25uZWN0KHJldHJ5RGVsYXlzT3JSZWNvbm5lY3RQb2xpY3kpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWNvbm5lY3RQb2xpY3kpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSByZWNvbm5lY3RQb2xpY3kgaGFzIGFscmVhZHkgYmVlbiBzZXQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJldHJ5RGVsYXlzT3JSZWNvbm5lY3RQb2xpY3kpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWNvbm5lY3RQb2xpY3kgPSBuZXcgRGVmYXVsdFJlY29ubmVjdFBvbGljeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJldHJ5RGVsYXlzT3JSZWNvbm5lY3RQb2xpY3kpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb25uZWN0UG9saWN5ID0gbmV3IERlZmF1bHRSZWNvbm5lY3RQb2xpY3kocmV0cnlEZWxheXNPclJlY29ubmVjdFBvbGljeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlY29ubmVjdFBvbGljeSA9IHJldHJ5RGVsYXlzT3JSZWNvbm5lY3RQb2xpY3k7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqIENvbmZpZ3VyZXMge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9uLnNlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kc30gZm9yIHRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb259LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1YkNvbm5lY3Rpb25CdWlsZGVyfSBpbnN0YW5jZSwgZm9yIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICB3aXRoU2VydmVyVGltZW91dChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZChtaWxsaXNlY29uZHMsIFwibWlsbGlzZWNvbmRzXCIpO1xyXG4gICAgICAgIHRoaXMuX3NlcnZlclRpbWVvdXRJbk1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKiBDb25maWd1cmVzIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbi5rZWVwQWxpdmVJbnRlcnZhbEluTWlsbGlzZWNvbmRzfSBmb3IgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbn0uXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbkJ1aWxkZXJ9IGluc3RhbmNlLCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIHdpdGhLZWVwQWxpdmVJbnRlcnZhbChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZChtaWxsaXNlY29uZHMsIFwibWlsbGlzZWNvbmRzXCIpO1xyXG4gICAgICAgIHRoaXMuX2tlZXBBbGl2ZUludGVydmFsSW5NaWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKiogRW5hYmxlcyBhbmQgY29uZmlndXJlcyBvcHRpb25zIGZvciB0aGUgU3RhdGVmdWwgUmVjb25uZWN0IGZlYXR1cmUuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgVGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSHViQ29ubmVjdGlvbkJ1aWxkZXJ9IGluc3RhbmNlLCBmb3IgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIHdpdGhTdGF0ZWZ1bFJlY29ubmVjdChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaHR0cENvbm5lY3Rpb25PcHRpb25zID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5odHRwQ29ubmVjdGlvbk9wdGlvbnMgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5odHRwQ29ubmVjdGlvbk9wdGlvbnMuX3VzZVN0YXRlZnVsUmVjb25uZWN0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9zdGF0ZWZ1bFJlY29ubmVjdEJ1ZmZlclNpemUgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuYnVmZmVyU2l6ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKiBDcmVhdGVzIGEge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9ufSBmcm9tIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgc3BlY2lmaWVkIGluIHRoaXMgYnVpbGRlci5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7SHViQ29ubmVjdGlvbn0gVGhlIGNvbmZpZ3VyZWQge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5IdWJDb25uZWN0aW9ufS5cclxuICAgICAqL1xyXG4gICAgYnVpbGQoKSB7XHJcbiAgICAgICAgLy8gSWYgaHR0cENvbm5lY3Rpb25PcHRpb25zIGhhcyBhIGxvZ2dlciwgdXNlIGl0LiBPdGhlcndpc2UsIG92ZXJyaWRlIGl0IHdpdGggdGhlIG9uZVxyXG4gICAgICAgIC8vIHByb3ZpZGVkIHRvIGNvbmZpZ3VyZUxvZ2dlclxyXG4gICAgICAgIGNvbnN0IGh0dHBDb25uZWN0aW9uT3B0aW9ucyA9IHRoaXMuaHR0cENvbm5lY3Rpb25PcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIC8vIElmIGl0J3MgJ251bGwnLCB0aGUgdXNlciAqKmV4cGxpY2l0bHkqKiBhc2tlZCBmb3IgbnVsbCwgZG9uJ3QgbWVzcyB3aXRoIGl0LlxyXG4gICAgICAgIGlmIChodHRwQ29ubmVjdGlvbk9wdGlvbnMubG9nZ2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gSWYgb3VyIGxvZ2dlciBpcyB1bmRlZmluZWQgb3IgbnVsbCwgdGhhdCdzIE9LLCB0aGUgSHR0cENvbm5lY3Rpb24gY29uc3RydWN0b3Igd2lsbCBoYW5kbGUgaXQuXHJcbiAgICAgICAgICAgIGh0dHBDb25uZWN0aW9uT3B0aW9ucy5sb2dnZXIgPSB0aGlzLmxvZ2dlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTm93IGNyZWF0ZSB0aGUgY29ubmVjdGlvblxyXG4gICAgICAgIGlmICghdGhpcy51cmwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlICdIdWJDb25uZWN0aW9uQnVpbGRlci53aXRoVXJsJyBtZXRob2QgbXVzdCBiZSBjYWxsZWQgYmVmb3JlIGJ1aWxkaW5nIHRoZSBjb25uZWN0aW9uLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbiA9IG5ldyBIdHRwQ29ubmVjdGlvbih0aGlzLnVybCwgaHR0cENvbm5lY3Rpb25PcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gSHViQ29ubmVjdGlvbi5jcmVhdGUoY29ubmVjdGlvbiwgdGhpcy5sb2dnZXIgfHwgTnVsbExvZ2dlci5pbnN0YW5jZSwgdGhpcy5wcm90b2NvbCB8fCBuZXcgSnNvbkh1YlByb3RvY29sKCksIHRoaXMucmVjb25uZWN0UG9saWN5LCB0aGlzLl9zZXJ2ZXJUaW1lb3V0SW5NaWxsaXNlY29uZHMsIHRoaXMuX2tlZXBBbGl2ZUludGVydmFsSW5NaWxsaXNlY29uZHMsIHRoaXMuX3N0YXRlZnVsUmVjb25uZWN0QnVmZmVyU2l6ZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaXNMb2dnZXIobG9nZ2VyKSB7XHJcbiAgICByZXR1cm4gbG9nZ2VyLmxvZyAhPT0gdW5kZWZpbmVkO1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUh1YkNvbm5lY3Rpb25CdWlsZGVyLmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuLyoqIERlZmluZXMgdGhlIHR5cGUgb2YgYSBIdWIgTWVzc2FnZS4gKi9cclxuZXhwb3J0IHZhciBNZXNzYWdlVHlwZTtcclxuKGZ1bmN0aW9uIChNZXNzYWdlVHlwZSkge1xyXG4gICAgLyoqIEluZGljYXRlcyB0aGUgbWVzc2FnZSBpcyBhbiBJbnZvY2F0aW9uIG1lc3NhZ2UgYW5kIGltcGxlbWVudHMgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuSW52b2NhdGlvbk1lc3NhZ2V9IGludGVyZmFjZS4gKi9cclxuICAgIE1lc3NhZ2VUeXBlW01lc3NhZ2VUeXBlW1wiSW52b2NhdGlvblwiXSA9IDFdID0gXCJJbnZvY2F0aW9uXCI7XHJcbiAgICAvKiogSW5kaWNhdGVzIHRoZSBtZXNzYWdlIGlzIGEgU3RyZWFtSXRlbSBtZXNzYWdlIGFuZCBpbXBsZW1lbnRzIHRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLlN0cmVhbUl0ZW1NZXNzYWdlfSBpbnRlcmZhY2UuICovXHJcbiAgICBNZXNzYWdlVHlwZVtNZXNzYWdlVHlwZVtcIlN0cmVhbUl0ZW1cIl0gPSAyXSA9IFwiU3RyZWFtSXRlbVwiO1xyXG4gICAgLyoqIEluZGljYXRlcyB0aGUgbWVzc2FnZSBpcyBhIENvbXBsZXRpb24gbWVzc2FnZSBhbmQgaW1wbGVtZW50cyB0aGUge0BsaW5rIEBtaWNyb3NvZnQvc2lnbmFsci5Db21wbGV0aW9uTWVzc2FnZX0gaW50ZXJmYWNlLiAqL1xyXG4gICAgTWVzc2FnZVR5cGVbTWVzc2FnZVR5cGVbXCJDb21wbGV0aW9uXCJdID0gM10gPSBcIkNvbXBsZXRpb25cIjtcclxuICAgIC8qKiBJbmRpY2F0ZXMgdGhlIG1lc3NhZ2UgaXMgYSBTdHJlYW0gSW52b2NhdGlvbiBtZXNzYWdlIGFuZCBpbXBsZW1lbnRzIHRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLlN0cmVhbUludm9jYXRpb25NZXNzYWdlfSBpbnRlcmZhY2UuICovXHJcbiAgICBNZXNzYWdlVHlwZVtNZXNzYWdlVHlwZVtcIlN0cmVhbUludm9jYXRpb25cIl0gPSA0XSA9IFwiU3RyZWFtSW52b2NhdGlvblwiO1xyXG4gICAgLyoqIEluZGljYXRlcyB0aGUgbWVzc2FnZSBpcyBhIENhbmNlbCBJbnZvY2F0aW9uIG1lc3NhZ2UgYW5kIGltcGxlbWVudHMgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuQ2FuY2VsSW52b2NhdGlvbk1lc3NhZ2V9IGludGVyZmFjZS4gKi9cclxuICAgIE1lc3NhZ2VUeXBlW01lc3NhZ2VUeXBlW1wiQ2FuY2VsSW52b2NhdGlvblwiXSA9IDVdID0gXCJDYW5jZWxJbnZvY2F0aW9uXCI7XHJcbiAgICAvKiogSW5kaWNhdGVzIHRoZSBtZXNzYWdlIGlzIGEgUGluZyBtZXNzYWdlIGFuZCBpbXBsZW1lbnRzIHRoZSB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLlBpbmdNZXNzYWdlfSBpbnRlcmZhY2UuICovXHJcbiAgICBNZXNzYWdlVHlwZVtNZXNzYWdlVHlwZVtcIlBpbmdcIl0gPSA2XSA9IFwiUGluZ1wiO1xyXG4gICAgLyoqIEluZGljYXRlcyB0aGUgbWVzc2FnZSBpcyBhIENsb3NlIG1lc3NhZ2UgYW5kIGltcGxlbWVudHMgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuQ2xvc2VNZXNzYWdlfSBpbnRlcmZhY2UuICovXHJcbiAgICBNZXNzYWdlVHlwZVtNZXNzYWdlVHlwZVtcIkNsb3NlXCJdID0gN10gPSBcIkNsb3NlXCI7XHJcbiAgICBNZXNzYWdlVHlwZVtNZXNzYWdlVHlwZVtcIkFja1wiXSA9IDhdID0gXCJBY2tcIjtcclxuICAgIE1lc3NhZ2VUeXBlW01lc3NhZ2VUeXBlW1wiU2VxdWVuY2VcIl0gPSA5XSA9IFwiU2VxdWVuY2VcIjtcclxufSkoTWVzc2FnZVR5cGUgfHwgKE1lc3NhZ2VUeXBlID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SUh1YlByb3RvY29sLmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuLy8gVGhlc2UgdmFsdWVzIGFyZSBkZXNpZ25lZCB0byBtYXRjaCB0aGUgQVNQLk5FVCBMb2cgTGV2ZWxzIHNpbmNlIHRoYXQncyB0aGUgcGF0dGVybiB3ZSdyZSBlbXVsYXRpbmcgaGVyZS5cclxuLyoqIEluZGljYXRlcyB0aGUgc2V2ZXJpdHkgb2YgYSBsb2cgbWVzc2FnZS5cclxuICpcclxuICogTG9nIExldmVscyBhcmUgb3JkZXJlZCBpbiBpbmNyZWFzaW5nIHNldmVyaXR5LiBTbyBgRGVidWdgIGlzIG1vcmUgc2V2ZXJlIHRoYW4gYFRyYWNlYCwgZXRjLlxyXG4gKi9cclxuZXhwb3J0IHZhciBMb2dMZXZlbDtcclxuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xyXG4gICAgLyoqIExvZyBsZXZlbCBmb3IgdmVyeSBsb3cgc2V2ZXJpdHkgZGlhZ25vc3RpYyBtZXNzYWdlcy4gKi9cclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiVHJhY2VcIl0gPSAwXSA9IFwiVHJhY2VcIjtcclxuICAgIC8qKiBMb2cgbGV2ZWwgZm9yIGxvdyBzZXZlcml0eSBkaWFnbm9zdGljIG1lc3NhZ2VzLiAqL1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJEZWJ1Z1wiXSA9IDFdID0gXCJEZWJ1Z1wiO1xyXG4gICAgLyoqIExvZyBsZXZlbCBmb3IgaW5mb3JtYXRpb25hbCBkaWFnbm9zdGljIG1lc3NhZ2VzLiAqL1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJJbmZvcm1hdGlvblwiXSA9IDJdID0gXCJJbmZvcm1hdGlvblwiO1xyXG4gICAgLyoqIExvZyBsZXZlbCBmb3IgZGlhZ25vc3RpYyBtZXNzYWdlcyB0aGF0IGluZGljYXRlIGEgbm9uLWZhdGFsIHByb2JsZW0uICovXHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIldhcm5pbmdcIl0gPSAzXSA9IFwiV2FybmluZ1wiO1xyXG4gICAgLyoqIExvZyBsZXZlbCBmb3IgZGlhZ25vc3RpYyBtZXNzYWdlcyB0aGF0IGluZGljYXRlIGEgZmFpbHVyZSBpbiB0aGUgY3VycmVudCBvcGVyYXRpb24uICovXHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkVycm9yXCJdID0gNF0gPSBcIkVycm9yXCI7XHJcbiAgICAvKiogTG9nIGxldmVsIGZvciBkaWFnbm9zdGljIG1lc3NhZ2VzIHRoYXQgaW5kaWNhdGUgYSBmYWlsdXJlIHRoYXQgd2lsbCB0ZXJtaW5hdGUgdGhlIGVudGlyZSBhcHBsaWNhdGlvbi4gKi9cclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiQ3JpdGljYWxcIl0gPSA1XSA9IFwiQ3JpdGljYWxcIjtcclxuICAgIC8qKiBUaGUgaGlnaGVzdCBwb3NzaWJsZSBsb2cgbGV2ZWwuIFVzZWQgd2hlbiBjb25maWd1cmluZyBsb2dnaW5nIHRvIGluZGljYXRlIHRoYXQgbm8gbG9nIG1lc3NhZ2VzIHNob3VsZCBiZSBlbWl0dGVkLiAqL1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJOb25lXCJdID0gNl0gPSBcIk5vbmVcIjtcclxufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SUxvZ2dlci5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbi8vIFRoaXMgd2lsbCBiZSB0cmVhdGVkIGFzIGEgYml0IGZsYWcgaW4gdGhlIGZ1dHVyZSwgc28gd2Uga2VlcCBpdCB1c2luZyBwb3dlci1vZi10d28gdmFsdWVzLlxyXG4vKiogU3BlY2lmaWVzIGEgc3BlY2lmaWMgSFRUUCB0cmFuc3BvcnQgdHlwZS4gKi9cclxuZXhwb3J0IHZhciBIdHRwVHJhbnNwb3J0VHlwZTtcclxuKGZ1bmN0aW9uIChIdHRwVHJhbnNwb3J0VHlwZSkge1xyXG4gICAgLyoqIFNwZWNpZmllcyBubyB0cmFuc3BvcnQgcHJlZmVyZW5jZS4gKi9cclxuICAgIEh0dHBUcmFuc3BvcnRUeXBlW0h0dHBUcmFuc3BvcnRUeXBlW1wiTm9uZVwiXSA9IDBdID0gXCJOb25lXCI7XHJcbiAgICAvKiogU3BlY2lmaWVzIHRoZSBXZWJTb2NrZXRzIHRyYW5zcG9ydC4gKi9cclxuICAgIEh0dHBUcmFuc3BvcnRUeXBlW0h0dHBUcmFuc3BvcnRUeXBlW1wiV2ViU29ja2V0c1wiXSA9IDFdID0gXCJXZWJTb2NrZXRzXCI7XHJcbiAgICAvKiogU3BlY2lmaWVzIHRoZSBTZXJ2ZXItU2VudCBFdmVudHMgdHJhbnNwb3J0LiAqL1xyXG4gICAgSHR0cFRyYW5zcG9ydFR5cGVbSHR0cFRyYW5zcG9ydFR5cGVbXCJTZXJ2ZXJTZW50RXZlbnRzXCJdID0gMl0gPSBcIlNlcnZlclNlbnRFdmVudHNcIjtcclxuICAgIC8qKiBTcGVjaWZpZXMgdGhlIExvbmcgUG9sbGluZyB0cmFuc3BvcnQuICovXHJcbiAgICBIdHRwVHJhbnNwb3J0VHlwZVtIdHRwVHJhbnNwb3J0VHlwZVtcIkxvbmdQb2xsaW5nXCJdID0gNF0gPSBcIkxvbmdQb2xsaW5nXCI7XHJcbn0pKEh0dHBUcmFuc3BvcnRUeXBlIHx8IChIdHRwVHJhbnNwb3J0VHlwZSA9IHt9KSk7XHJcbi8qKiBTcGVjaWZpZXMgdGhlIHRyYW5zZmVyIGZvcm1hdCBmb3IgYSBjb25uZWN0aW9uLiAqL1xyXG5leHBvcnQgdmFyIFRyYW5zZmVyRm9ybWF0O1xyXG4oZnVuY3Rpb24gKFRyYW5zZmVyRm9ybWF0KSB7XHJcbiAgICAvKiogU3BlY2lmaWVzIHRoYXQgb25seSB0ZXh0IGRhdGEgd2lsbCBiZSB0cmFuc21pdHRlZCBvdmVyIHRoZSBjb25uZWN0aW9uLiAqL1xyXG4gICAgVHJhbnNmZXJGb3JtYXRbVHJhbnNmZXJGb3JtYXRbXCJUZXh0XCJdID0gMV0gPSBcIlRleHRcIjtcclxuICAgIC8qKiBTcGVjaWZpZXMgdGhhdCBiaW5hcnkgZGF0YSB3aWxsIGJlIHRyYW5zbWl0dGVkIG92ZXIgdGhlIGNvbm5lY3Rpb24uICovXHJcbiAgICBUcmFuc2ZlckZvcm1hdFtUcmFuc2ZlckZvcm1hdFtcIkJpbmFyeVwiXSA9IDJdID0gXCJCaW5hcnlcIjtcclxufSkoVHJhbnNmZXJGb3JtYXQgfHwgKFRyYW5zZmVyRm9ybWF0ID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SVRyYW5zcG9ydC5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcIi4vSUh1YlByb3RvY29sXCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBUcmFuc2ZlckZvcm1hdCB9IGZyb20gXCIuL0lUcmFuc3BvcnRcIjtcclxuaW1wb3J0IHsgTnVsbExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlcnNcIjtcclxuaW1wb3J0IHsgVGV4dE1lc3NhZ2VGb3JtYXQgfSBmcm9tIFwiLi9UZXh0TWVzc2FnZUZvcm1hdFwiO1xyXG5jb25zdCBKU09OX0hVQl9QUk9UT0NPTF9OQU1FID0gXCJqc29uXCI7XHJcbi8qKiBJbXBsZW1lbnRzIHRoZSBKU09OIEh1YiBQcm90b2NvbC4gKi9cclxuZXhwb3J0IGNsYXNzIEpzb25IdWJQcm90b2NvbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvKiogQGluaGVyaXREb2MgKi9cclxuICAgICAgICB0aGlzLm5hbWUgPSBKU09OX0hVQl9QUk9UT0NPTF9OQU1FO1xyXG4gICAgICAgIC8qKiBAaW5oZXJpdERvYyAqL1xyXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IDI7XHJcbiAgICAgICAgLyoqIEBpbmhlcml0RG9jICovXHJcbiAgICAgICAgdGhpcy50cmFuc2ZlckZvcm1hdCA9IFRyYW5zZmVyRm9ybWF0LlRleHQ7XHJcbiAgICB9XHJcbiAgICAvKiogQ3JlYXRlcyBhbiBhcnJheSBvZiB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1Yk1lc3NhZ2V9IG9iamVjdHMgZnJvbSB0aGUgc3BlY2lmaWVkIHNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0IEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBAcGFyYW0ge0lMb2dnZXJ9IGxvZ2dlciBBIGxvZ2dlciB0aGF0IHdpbGwgYmUgdXNlZCB0byBsb2cgbWVzc2FnZXMgdGhhdCBvY2N1ciBkdXJpbmcgcGFyc2luZy5cclxuICAgICAqL1xyXG4gICAgcGFyc2VNZXNzYWdlcyhpbnB1dCwgbG9nZ2VyKSB7XHJcbiAgICAgICAgLy8gVGhlIGludGVyZmFjZSBkb2VzIGFsbG93IFwiQXJyYXlCdWZmZXJcIiB0byBiZSBwYXNzZWQgaW4sIGJ1dCB0aGlzIGltcGxlbWVudGF0aW9uIGRvZXMgbm90LiBTbyBsZXQncyB0aHJvdyBhIHVzZWZ1bCBlcnJvci5cclxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5wdXQgZm9yIEpTT04gaHViIHByb3RvY29sLiBFeHBlY3RlZCBhIHN0cmluZy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW5wdXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9nZ2VyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlciA9IE51bGxMb2dnZXIuaW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFBhcnNlIHRoZSBtZXNzYWdlc1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gVGV4dE1lc3NhZ2VGb3JtYXQucGFyc2UoaW5wdXQpO1xyXG4gICAgICAgIGNvbnN0IGh1Yk1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZE1lc3NhZ2UgPSBKU09OLnBhcnNlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlZE1lc3NhZ2UudHlwZSAhPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXlsb2FkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKHBhcnNlZE1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5JbnZvY2F0aW9uOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzSW52b2NhdGlvbk1lc3NhZ2UocGFyc2VkTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlN0cmVhbUl0ZW06XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNTdHJlYW1JdGVtTWVzc2FnZShwYXJzZWRNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ29tcGxldGlvbjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0NvbXBsZXRpb25NZXNzYWdlKHBhcnNlZE1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5QaW5nOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmdsZSB2YWx1ZSwgbm8gbmVlZCB0byB2YWxpZGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5DbG9zZTpcclxuICAgICAgICAgICAgICAgICAgICAvLyBBbGwgb3B0aW9uYWwgdmFsdWVzLCBubyBuZWVkIHRvIHZhbGlkYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkFjazpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0Fja01lc3NhZ2UocGFyc2VkTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlNlcXVlbmNlOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzU2VxdWVuY2VNZXNzYWdlKHBhcnNlZE1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBGdXR1cmUgcHJvdG9jb2wgY2hhbmdlcyBjYW4gYWRkIG1lc3NhZ2UgdHlwZXMsIG9sZCBjbGllbnRzIGNhbiBpZ25vcmUgdGhlbVxyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIFwiVW5rbm93biBtZXNzYWdlIHR5cGUgJ1wiICsgcGFyc2VkTWVzc2FnZS50eXBlICsgXCInIGlnbm9yZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGh1Yk1lc3NhZ2VzLnB1c2gocGFyc2VkTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBodWJNZXNzYWdlcztcclxuICAgIH1cclxuICAgIC8qKiBXcml0ZXMgdGhlIHNwZWNpZmllZCB7QGxpbmsgQG1pY3Jvc29mdC9zaWduYWxyLkh1Yk1lc3NhZ2V9IHRvIGEgc3RyaW5nIGFuZCByZXR1cm5zIGl0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SHViTWVzc2FnZX0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byB3cml0ZS5cclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1lc3NhZ2UuXHJcbiAgICAgKi9cclxuICAgIHdyaXRlTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgcmV0dXJuIFRleHRNZXNzYWdlRm9ybWF0LndyaXRlKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcclxuICAgIH1cclxuICAgIF9pc0ludm9jYXRpb25NZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLl9hc3NlcnROb3RFbXB0eVN0cmluZyhtZXNzYWdlLnRhcmdldCwgXCJJbnZhbGlkIHBheWxvYWQgZm9yIEludm9jYXRpb24gbWVzc2FnZS5cIik7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuaW52b2NhdGlvbklkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXNzZXJ0Tm90RW1wdHlTdHJpbmcobWVzc2FnZS5pbnZvY2F0aW9uSWQsIFwiSW52YWxpZCBwYXlsb2FkIGZvciBJbnZvY2F0aW9uIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9pc1N0cmVhbUl0ZW1NZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLl9hc3NlcnROb3RFbXB0eVN0cmluZyhtZXNzYWdlLmludm9jYXRpb25JZCwgXCJJbnZhbGlkIHBheWxvYWQgZm9yIFN0cmVhbUl0ZW0gbWVzc2FnZS5cIik7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuaXRlbSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGF5bG9hZCBmb3IgU3RyZWFtSXRlbSBtZXNzYWdlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaXNDb21wbGV0aW9uTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UucmVzdWx0ICYmIG1lc3NhZ2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXlsb2FkIGZvciBDb21wbGV0aW9uIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW1lc3NhZ2UucmVzdWx0ICYmIG1lc3NhZ2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXNzZXJ0Tm90RW1wdHlTdHJpbmcobWVzc2FnZS5lcnJvciwgXCJJbnZhbGlkIHBheWxvYWQgZm9yIENvbXBsZXRpb24gbWVzc2FnZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Fzc2VydE5vdEVtcHR5U3RyaW5nKG1lc3NhZ2UuaW52b2NhdGlvbklkLCBcIkludmFsaWQgcGF5bG9hZCBmb3IgQ29tcGxldGlvbiBtZXNzYWdlLlwiKTtcclxuICAgIH1cclxuICAgIF9pc0Fja01lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS5zZXF1ZW5jZUlkICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNlcXVlbmNlSWQgZm9yIEFjayBtZXNzYWdlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfaXNTZXF1ZW5jZU1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS5zZXF1ZW5jZUlkICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNlcXVlbmNlSWQgZm9yIFNlcXVlbmNlIG1lc3NhZ2UuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9hc3NlcnROb3RFbXB0eVN0cmluZyh2YWx1ZSwgZXJyb3JNZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIiB8fCB2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SnNvbkh1YlByb3RvY29sLmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuLyoqIEEgbG9nZ2VyIHRoYXQgZG9lcyBub3RoaW5nIHdoZW4gbG9nIG1lc3NhZ2VzIGFyZSBzZW50IHRvIGl0LiAqL1xyXG5leHBvcnQgY2xhc3MgTnVsbExvZ2dlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgLyoqIEBpbmhlcml0RG9jICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuICAgIGxvZyhfbG9nTGV2ZWwsIF9tZXNzYWdlKSB7XHJcbiAgICB9XHJcbn1cclxuLyoqIFRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgdGhlIHtAbGluayBAbWljcm9zb2Z0L3NpZ25hbHIuTnVsbExvZ2dlcn0uICovXHJcbk51bGxMb2dnZXIuaW5zdGFuY2UgPSBuZXcgTnVsbExvZ2dlcigpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dnZXJzLmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgQWJvcnRDb250cm9sbGVyIH0gZnJvbSBcIi4vQWJvcnRDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IEh0dHBFcnJvciwgVGltZW91dEVycm9yIH0gZnJvbSBcIi4vRXJyb3JzXCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBUcmFuc2ZlckZvcm1hdCB9IGZyb20gXCIuL0lUcmFuc3BvcnRcIjtcclxuaW1wb3J0IHsgQXJnLCBnZXREYXRhRGV0YWlsLCBnZXRVc2VyQWdlbnRIZWFkZXIsIHNlbmRNZXNzYWdlIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuLy8gTm90IGV4cG9ydGVkIGZyb20gJ2luZGV4JywgdGhpcyB0eXBlIGlzIGludGVybmFsLlxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIExvbmdQb2xsaW5nVHJhbnNwb3J0IHtcclxuICAgIC8vIFRoaXMgaXMgYW4gaW50ZXJuYWwgdHlwZSwgbm90IGV4cG9ydGVkIGZyb20gJ2luZGV4JyBzbyB0aGlzIGlzIHJlYWxseSBqdXN0IGludGVybmFsLlxyXG4gICAgZ2V0IHBvbGxBYm9ydGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb2xsQWJvcnQuYWJvcnRlZDtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKGh0dHBDbGllbnQsIGxvZ2dlciwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuX2h0dHBDbGllbnQgPSBodHRwQ2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcclxuICAgICAgICB0aGlzLl9wb2xsQWJvcnQgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25yZWNlaXZlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uY2xvc2UgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY29ubmVjdCh1cmwsIHRyYW5zZmVyRm9ybWF0KSB7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQodXJsLCBcInVybFwiKTtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZCh0cmFuc2ZlckZvcm1hdCwgXCJ0cmFuc2ZlckZvcm1hdFwiKTtcclxuICAgICAgICBBcmcuaXNJbih0cmFuc2ZlckZvcm1hdCwgVHJhbnNmZXJGb3JtYXQsIFwidHJhbnNmZXJGb3JtYXRcIik7XHJcbiAgICAgICAgdGhpcy5fdXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgQ29ubmVjdGluZy5cIik7XHJcbiAgICAgICAgLy8gQWxsb3cgYmluYXJ5IGZvcm1hdCBvbiBOb2RlIGFuZCBCcm93c2VycyB0aGF0IHN1cHBvcnQgYmluYXJ5IGNvbnRlbnQgKGluZGljYXRlZCBieSB0aGUgcHJlc2VuY2Ugb2YgcmVzcG9uc2VUeXBlIHByb3BlcnR5KVxyXG4gICAgICAgIGlmICh0cmFuc2ZlckZvcm1hdCA9PT0gVHJhbnNmZXJGb3JtYXQuQmluYXJ5ICYmXHJcbiAgICAgICAgICAgICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG5ldyBYTUxIdHRwUmVxdWVzdCgpLnJlc3BvbnNlVHlwZSAhPT0gXCJzdHJpbmdcIikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmluYXJ5IHByb3RvY29scyBvdmVyIFhtbEh0dHBSZXF1ZXN0IG5vdCBpbXBsZW1lbnRpbmcgYWR2YW5jZWQgZmVhdHVyZXMgYXJlIG5vdCBzdXBwb3J0ZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBbbmFtZSwgdmFsdWVdID0gZ2V0VXNlckFnZW50SGVhZGVyKCk7XHJcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHsgW25hbWVdOiB2YWx1ZSwgLi4udGhpcy5fb3B0aW9ucy5oZWFkZXJzIH07XHJcbiAgICAgICAgY29uc3QgcG9sbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGFib3J0U2lnbmFsOiB0aGlzLl9wb2xsQWJvcnQuc2lnbmFsLFxyXG4gICAgICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgICAgICB0aW1lb3V0OiAxMDAwMDAsXHJcbiAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdGhpcy5fb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodHJhbnNmZXJGb3JtYXQgPT09IFRyYW5zZmVyRm9ybWF0LkJpbmFyeSkge1xyXG4gICAgICAgICAgICBwb2xsT3B0aW9ucy5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE1ha2UgaW5pdGlhbCBsb25nIHBvbGxpbmcgcmVxdWVzdFxyXG4gICAgICAgIC8vIFNlcnZlciB1c2VzIGZpcnN0IGxvbmcgcG9sbGluZyByZXF1ZXN0IHRvIGZpbmlzaCBpbml0aWFsaXppbmcgY29ubmVjdGlvbiBhbmQgaXQgcmV0dXJucyB3aXRob3V0IGRhdGFcclxuICAgICAgICBjb25zdCBwb2xsVXJsID0gYCR7dXJsfSZfPSR7RGF0ZS5ub3coKX1gO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGAoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBwb2xsaW5nOiAke3BvbGxVcmx9LmApO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5faHR0cENsaWVudC5nZXQocG9sbFVybCwgcG9sbE9wdGlvbnMpO1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlICE9PSAyMDApIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5FcnJvciwgYChMb25nUG9sbGluZyB0cmFuc3BvcnQpIFVuZXhwZWN0ZWQgcmVzcG9uc2UgY29kZTogJHtyZXNwb25zZS5zdGF0dXNDb2RlfS5gKTtcclxuICAgICAgICAgICAgLy8gTWFyayBydW5uaW5nIGFzIGZhbHNlIHNvIHRoYXQgdGhlIHBvbGwgaW1tZWRpYXRlbHkgZW5kcyBhbmQgcnVucyB0aGUgY2xvc2UgbG9naWNcclxuICAgICAgICAgICAgdGhpcy5fY2xvc2VFcnJvciA9IG5ldyBIdHRwRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCB8fCBcIlwiLCByZXNwb25zZS5zdGF0dXNDb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlY2VpdmluZyA9IHRoaXMuX3BvbGwodGhpcy5fdXJsLCBwb2xsT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBfcG9sbCh1cmwsIHBvbGxPcHRpb25zKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuX3J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9sbFVybCA9IGAke3VybH0mXz0ke0RhdGUubm93KCl9YDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgcG9sbGluZzogJHtwb2xsVXJsfS5gKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2h0dHBDbGllbnQuZ2V0KHBvbGxVcmwsIHBvbGxPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgUG9sbCB0ZXJtaW5hdGVkIGJ5IHNlcnZlci5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuRXJyb3IsIGAoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBVbmV4cGVjdGVkIHJlc3BvbnNlIGNvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX0uYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVuZXhwZWN0ZWQgc3RhdHVzIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VFcnJvciA9IG5ldyBIdHRwRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCB8fCBcIlwiLCByZXNwb25zZS5zdGF0dXNDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvY2VzcyB0aGUgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGAoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBkYXRhIHJlY2VpdmVkLiAke2dldERhdGFEZXRhaWwocmVzcG9uc2UuY29udGVudCwgdGhpcy5fb3B0aW9ucy5sb2dNZXNzYWdlQ29udGVudCl9LmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub25yZWNlaXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbnJlY2VpdmUocmVzcG9uc2UuY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFub3RoZXIgd2F5IHRpbWVvdXQgbWFuaWZlc3QuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBcIihMb25nUG9sbGluZyB0cmFuc3BvcnQpIFBvbGwgdGltZWQgb3V0LCByZWlzc3VpbmcuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTG9nIGJ1dCBkaXNyZWdhcmQgZXJyb3JzIHRoYXQgb2NjdXIgYWZ0ZXIgc3RvcHBpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYChMb25nUG9sbGluZyB0cmFuc3BvcnQpIFBvbGwgZXJyb3JlZCBhZnRlciBzaHV0ZG93bjogJHtlLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFRpbWVvdXRFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIHRpbWVvdXRzIGFuZCByZWlzc3VlIHRoZSBwb2xsLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBQb2xsIHRpbWVkIG91dCwgcmVpc3N1aW5nLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsb3NlIHRoZSBjb25uZWN0aW9uIHdpdGggdGhlIGVycm9yIGFzIHRoZSByZXN1bHQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZUVycm9yID0gZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBQb2xsaW5nIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICAgICAgLy8gV2Ugd2lsbCByZWFjaCBoZXJlIHdpdGggcG9sbEFib3J0ZWQ9PWZhbHNlIHdoZW4gdGhlIHNlcnZlciByZXR1cm5lZCBhIHJlc3BvbnNlIGNhdXNpbmcgdGhlIHRyYW5zcG9ydCB0byBzdG9wLlxyXG4gICAgICAgICAgICAvLyBJZiBwb2xsQWJvcnRlZD09dHJ1ZSB0aGVuIGNsaWVudCBpbml0aWF0ZWQgdGhlIHN0b3AgYW5kIHRoZSBzdG9wIG1ldGhvZCB3aWxsIHJhaXNlIHRoZSBjbG9zZSBldmVudCBhZnRlciBERUxFVEUgaXMgc2VudC5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBvbGxBYm9ydGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yYWlzZU9uQ2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzeW5jIHNlbmQoZGF0YSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcnVubmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2Fubm90IHNlbmQgdW50aWwgdGhlIHRyYW5zcG9ydCBpcyBjb25uZWN0ZWRcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2UodGhpcy5fbG9nZ2VyLCBcIkxvbmdQb2xsaW5nXCIsIHRoaXMuX2h0dHBDbGllbnQsIHRoaXMuX3VybCwgZGF0YSwgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgU3RvcHBpbmcgcG9sbGluZy5cIik7XHJcbiAgICAgICAgLy8gVGVsbCByZWNlaXZpbmcgbG9vcCB0byBzdG9wLCBhYm9ydCBhbnkgY3VycmVudCByZXF1ZXN0LCBhbmQgdGhlbiB3YWl0IGZvciBpdCB0byBmaW5pc2hcclxuICAgICAgICB0aGlzLl9ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcG9sbEFib3J0LmFib3J0KCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVjZWl2aW5nO1xyXG4gICAgICAgICAgICAvLyBTZW5kIERFTEVURSB0byBjbGVhbiB1cCBsb25nIHBvbGxpbmcgb24gdGhlIHNlcnZlclxyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgc2VuZGluZyBERUxFVEUgcmVxdWVzdCB0byAke3RoaXMuX3VybH0uYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcclxuICAgICAgICAgICAgY29uc3QgW25hbWUsIHZhbHVlXSA9IGdldFVzZXJBZ2VudEhlYWRlcigpO1xyXG4gICAgICAgICAgICBoZWFkZXJzW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IC4uLmhlYWRlcnMsIC4uLnRoaXMuX29wdGlvbnMuaGVhZGVycyB9LFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogdGhpcy5fb3B0aW9ucy50aW1lb3V0LFxyXG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IGVycm9yO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5faHR0cENsaWVudC5kZWxldGUodGhpcy5fdXJsLCBkZWxldGVPcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXNDb2RlID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBBIDQwNCByZXNwb25zZSB3YXMgcmV0dXJuZWQgZnJvbSBzZW5kaW5nIGEgREVMRVRFIHJlcXVlc3QuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgYChMb25nUG9sbGluZyB0cmFuc3BvcnQpIEVycm9yIHNlbmRpbmcgYSBERUxFVEUgcmVxdWVzdDogJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBcIihMb25nUG9sbGluZyB0cmFuc3BvcnQpIERFTEVURSByZXF1ZXN0IGFjY2VwdGVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoTG9uZ1BvbGxpbmcgdHJhbnNwb3J0KSBTdG9wIGZpbmlzaGVkLlwiKTtcclxuICAgICAgICAgICAgLy8gUmFpc2UgY2xvc2UgZXZlbnQgaGVyZSBpbnN0ZWFkIG9mIGluIHBvbGxpbmdcclxuICAgICAgICAgICAgLy8gSXQgbmVlZHMgdG8gaGFwcGVuIGFmdGVyIHRoZSBERUxFVEUgcmVxdWVzdCBpcyBzZW50XHJcbiAgICAgICAgICAgIHRoaXMuX3JhaXNlT25DbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9yYWlzZU9uQ2xvc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub25jbG9zZSkge1xyXG4gICAgICAgICAgICBsZXQgbG9nTWVzc2FnZSA9IFwiKExvbmdQb2xsaW5nIHRyYW5zcG9ydCkgRmlyaW5nIG9uY2xvc2UgZXZlbnQuXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jbG9zZUVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dNZXNzYWdlICs9IFwiIEVycm9yOiBcIiArIHRoaXMuX2Nsb3NlRXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgbG9nTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMub25jbG9zZSh0aGlzLl9jbG9zZUVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TG9uZ1BvbGxpbmdUcmFuc3BvcnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCIuL0lIdWJQcm90b2NvbFwiO1xyXG5pbXBvcnQgeyBpc0FycmF5QnVmZmVyIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlQnVmZmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3RvY29sLCBjb25uZWN0aW9uLCBidWZmZXJTaXplKSB7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVyU2l6ZSA9IDEwMDAwMDtcclxuICAgICAgICB0aGlzLl9tZXNzYWdlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3RvdGFsTWVzc2FnZUNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLl93YWl0Rm9yU2VxdWVuY2VNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gTWVzc2FnZSBJRHMgc3RhcnQgYXQgMSBhbmQgYWx3YXlzIGluY3JlbWVudCBieSAxXHJcbiAgICAgICAgdGhpcy5fbmV4dFJlY2VpdmluZ1NlcXVlbmNlSWQgPSAxO1xyXG4gICAgICAgIHRoaXMuX2xhdGVzdFJlY2VpdmVkU2VxdWVuY2VJZCA9IDA7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVyZWRCeXRlQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdEluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9wcm90b2NvbCA9IHByb3RvY29sO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlclNpemUgPSBidWZmZXJTaXplO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgX3NlbmQobWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRNZXNzYWdlID0gdGhpcy5fcHJvdG9jb2wud3JpdGVNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgIGxldCBiYWNrcHJlc3N1cmVQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgLy8gT25seSBjb3VudCBpbnZvY2F0aW9uIG1lc3NhZ2VzLiBBY2tzLCBwaW5ncywgZXRjLiBkb24ndCBuZWVkIHRvIGJlIHJlc2VudCBvbiByZWNvbm5lY3RcclxuICAgICAgICBpZiAodGhpcy5faXNJbnZvY2F0aW9uTWVzc2FnZShtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl90b3RhbE1lc3NhZ2VDb3VudCsrO1xyXG4gICAgICAgICAgICBsZXQgYmFja3ByZXNzdXJlUHJvbWlzZVJlc29sdmVyID0gKCkgPT4geyB9O1xyXG4gICAgICAgICAgICBsZXQgYmFja3ByZXNzdXJlUHJvbWlzZVJlamVjdG9yID0gKCkgPT4geyB9O1xyXG4gICAgICAgICAgICBpZiAoaXNBcnJheUJ1ZmZlcihzZXJpYWxpemVkTWVzc2FnZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZUNvdW50ICs9IHNlcmlhbGl6ZWRNZXNzYWdlLmJ5dGVMZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idWZmZXJlZEJ5dGVDb3VudCArPSBzZXJpYWxpemVkTWVzc2FnZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2J1ZmZlcmVkQnl0ZUNvdW50ID49IHRoaXMuX2J1ZmZlclNpemUpIHtcclxuICAgICAgICAgICAgICAgIGJhY2twcmVzc3VyZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja3ByZXNzdXJlUHJvbWlzZVJlc29sdmVyID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrcHJlc3N1cmVQcm9taXNlUmVqZWN0b3IgPSByZWplY3Q7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5wdXNoKG5ldyBCdWZmZXJlZEl0ZW0oc2VyaWFsaXplZE1lc3NhZ2UsIHRoaXMuX3RvdGFsTWVzc2FnZUNvdW50LCBiYWNrcHJlc3N1cmVQcm9taXNlUmVzb2x2ZXIsIGJhY2twcmVzc3VyZVByb21pc2VSZWplY3RvcikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHNldCBpdCBtZWFucyB3ZSBhcmUgcmVjb25uZWN0aW5nIG9yIHJlc2VuZGluZ1xyXG4gICAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNlbmQgb24gYSBkaXNjb25uZWN0ZWQgY29ubmVjdGlvblxyXG4gICAgICAgICAgICAvLyBBbmQgd2UgZG9uJ3Qgd2FudCB0byBzZW5kIGlmIHJlc2VuZCBpcyBydW5uaW5nIHNpbmNlIHRoYXQgd291bGQgbWVhbiBzZW5kaW5nXHJcbiAgICAgICAgICAgIC8vIHRoaXMgbWVzc2FnZSB0d2ljZVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlY29ubmVjdEluUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2Nvbm5lY3Rpb24uc2VuZChzZXJpYWxpemVkTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNjb25uZWN0ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgYmFja3ByZXNzdXJlUHJvbWlzZTtcclxuICAgIH1cclxuICAgIF9hY2soYWNrTWVzc2FnZSkge1xyXG4gICAgICAgIGxldCBuZXdlc3RBY2tlZE1lc3NhZ2UgPSAtMTtcclxuICAgICAgICAvLyBGaW5kIGluZGV4IG9mIG5ld2VzdCBtZXNzYWdlIGJlaW5nIGFja2VkXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX21lc3NhZ2VzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fbWVzc2FnZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5faWQgPD0gYWNrTWVzc2FnZS5zZXF1ZW5jZUlkKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdlc3RBY2tlZE1lc3NhZ2UgPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5QnVmZmVyKGVsZW1lbnQuX21lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyZWRCeXRlQ291bnQgLT0gZWxlbWVudC5fbWVzc2FnZS5ieXRlTGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyZWRCeXRlQ291bnQgLT0gZWxlbWVudC5fbWVzc2FnZS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyByZXNvbHZlIGl0ZW1zIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gc2VudCBhbmQgYWNrZWRcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuX3Jlc29sdmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fYnVmZmVyZWRCeXRlQ291bnQgPCB0aGlzLl9idWZmZXJTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXNvbHZlIGl0ZW1zIHRoYXQgbm93IGZhbGwgdW5kZXIgdGhlIGJ1ZmZlciBsaW1pdCBidXQgaGF2ZW4ndCBiZWVuIGFja2VkXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50Ll9yZXNvbHZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld2VzdEFja2VkTWVzc2FnZSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gV2UncmUgcmVtb3ZpbmcgZXZlcnl0aGluZyBpbmNsdWRpbmcgdGhlIG1lc3NhZ2UgcG9pbnRlZCB0bywgc28gYWRkIDFcclxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZXMgPSB0aGlzLl9tZXNzYWdlcy5zbGljZShuZXdlc3RBY2tlZE1lc3NhZ2UgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfc2hvdWxkUHJvY2Vzc01lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl93YWl0Rm9yU2VxdWVuY2VNZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLnR5cGUgIT09IE1lc3NhZ2VUeXBlLlNlcXVlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YWl0Rm9yU2VxdWVuY2VNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBObyBzcGVjaWFsIHByb2Nlc3NpbmcgZm9yIGFja3MsIHBpbmdzLCBldGMuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0ludm9jYXRpb25NZXNzYWdlKG1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjdXJyZW50SWQgPSB0aGlzLl9uZXh0UmVjZWl2aW5nU2VxdWVuY2VJZDtcclxuICAgICAgICB0aGlzLl9uZXh0UmVjZWl2aW5nU2VxdWVuY2VJZCsrO1xyXG4gICAgICAgIGlmIChjdXJyZW50SWQgPD0gdGhpcy5fbGF0ZXN0UmVjZWl2ZWRTZXF1ZW5jZUlkKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50SWQgPT09IHRoaXMuX2xhdGVzdFJlY2VpdmVkU2VxdWVuY2VJZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2hvdWxkIG9ubHkgaGl0IHRoaXMgaWYgd2UganVzdCByZWNvbm5lY3RlZCBhbmQgdGhlIHNlcnZlciBpcyBzZW5kaW5nXHJcbiAgICAgICAgICAgICAgICAvLyBNZXNzYWdlcyBpdCBoYXMgYnVmZmVyZWQsIHdoaWNoIHdvdWxkIG1lYW4gaXQgaGFzbid0IHNlZW4gYW4gQWNrIGZvciB0aGVzZSBtZXNzYWdlc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWNrVGltZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZ25vcmUsIHRoaXMgaXMgYSBkdXBsaWNhdGUgbWVzc2FnZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xhdGVzdFJlY2VpdmVkU2VxdWVuY2VJZCA9IGN1cnJlbnRJZDtcclxuICAgICAgICAvLyBPbmx5IHN0YXJ0IHRoZSB0aW1lciBmb3Igc2VuZGluZyBhbiBBY2sgbWVzc2FnZSB3aGVuIHdlIGhhdmUgYSBtZXNzYWdlIHRvIGFjay4gVGhpcyBhbHNvIGNvbnZlbmllbnRseSBzb2x2ZXNcclxuICAgICAgICAvLyB0aW1lciB0aHJvdHRsaW5nIGJ5IG5vdCBoYXZpbmcgYSByZWN1cnNpdmUgdGltZXIsIGFuZCBieSBzdGFydGluZyB0aGUgdGltZXIgdmlhIGEgbmV0d29yayBjYWxsIChyZWN2KVxyXG4gICAgICAgIHRoaXMuX2Fja1RpbWVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBfcmVzZXRTZXF1ZW5jZShtZXNzYWdlKSB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2Uuc2VxdWVuY2VJZCA+IHRoaXMuX25leHRSZWNlaXZpbmdTZXF1ZW5jZUlkKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5zdG9wKG5ldyBFcnJvcihcIlNlcXVlbmNlIElEIGdyZWF0ZXIgdGhhbiBhbW91bnQgb2YgbWVzc2FnZXMgd2UndmUgcmVjZWl2ZWQuXCIpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9uZXh0UmVjZWl2aW5nU2VxdWVuY2VJZCA9IG1lc3NhZ2Uuc2VxdWVuY2VJZDtcclxuICAgIH1cclxuICAgIF9kaXNjb25uZWN0ZWQoKSB7XHJcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0SW5Qcm9ncmVzcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fd2FpdEZvclNlcXVlbmNlTWVzc2FnZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBhc3luYyBfcmVzZW5kKCkge1xyXG4gICAgICAgIGNvbnN0IHNlcXVlbmNlSWQgPSB0aGlzLl9tZXNzYWdlcy5sZW5ndGggIT09IDBcclxuICAgICAgICAgICAgPyB0aGlzLl9tZXNzYWdlc1swXS5faWRcclxuICAgICAgICAgICAgOiB0aGlzLl90b3RhbE1lc3NhZ2VDb3VudCArIDE7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5fY29ubmVjdGlvbi5zZW5kKHRoaXMuX3Byb3RvY29sLndyaXRlTWVzc2FnZSh7IHR5cGU6IE1lc3NhZ2VUeXBlLlNlcXVlbmNlLCBzZXF1ZW5jZUlkIH0pKTtcclxuICAgICAgICAvLyBHZXQgYSBsb2NhbCB2YXJpYWJsZSB0byB0aGUgX21lc3NhZ2VzLCBqdXN0IGluIGNhc2UgbWVzc2FnZXMgYXJlIGFja2VkIHdoaWxlIHJlc2VuZGluZ1xyXG4gICAgICAgIC8vIFdoaWNoIHdvdWxkIHNsaWNlIHRoZSBfbWVzc2FnZXMgYXJyYXkgKHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29weSlcclxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IHRoaXMuX21lc3NhZ2VzO1xyXG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBtZXNzYWdlcykge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9jb25uZWN0aW9uLnNlbmQoZWxlbWVudC5fbWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdEluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIF9kaXNwb3NlKGVycm9yKSB7XHJcbiAgICAgICAgZXJyb3IgIT09IG51bGwgJiYgZXJyb3IgIT09IHZvaWQgMCA/IGVycm9yIDogKGVycm9yID0gbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJlY29ubmVjdCB0byBzZXJ2ZXIuXCIpKTtcclxuICAgICAgICAvLyBVbmJsb2NrIGJhY2twcmVzc3VyZSBpZiBhbnlcclxuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5fbWVzc2FnZXMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5fcmVqZWN0b3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9pc0ludm9jYXRpb25NZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgICAgICAvLyBUaGVyZSBpcyBubyB3YXkgdG8gY2hlY2sgaWYgc29tZXRoaW5nIGltcGxlbWVudHMgYW4gaW50ZXJmYWNlLlxyXG4gICAgICAgIC8vIFNvIHdlIGluZGl2aWR1YWxseSBjaGVjayB0aGUgbWVzc2FnZXMgaW4gYSBzd2l0Y2ggc3RhdGVtZW50LlxyXG4gICAgICAgIC8vIFRvIG1ha2Ugc3VyZSB3ZSBkb24ndCBtaXNzIGFueSBtZXNzYWdlIHR5cGVzIHdlIHJlbHkgb24gdGhlIGNvbXBpbGVyXHJcbiAgICAgICAgLy8gc2VlaW5nIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdmFsdWUgYW5kIGl0IHdpbGwgZG8gdGhlXHJcbiAgICAgICAgLy8gZXhoYXVzdGl2ZSBjaGVjayBmb3IgdXMgb24gdGhlIHN3aXRjaCBzdGF0ZW1lbnQsIHNpbmNlIHdlIGRvbid0IHVzZSAnY2FzZSBkZWZhdWx0J1xyXG4gICAgICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuSW52b2NhdGlvbjpcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5TdHJlYW1JdGVtOlxyXG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkNvbXBsZXRpb246XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuU3RyZWFtSW52b2NhdGlvbjpcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5DYW5jZWxJbnZvY2F0aW9uOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ2xvc2U6XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuU2VxdWVuY2U6XHJcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuUGluZzpcclxuICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5BY2s6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX2Fja1RpbWVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hY2tUaW1lckhhbmRsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fja1RpbWVySGFuZGxlID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fcmVjb25uZWN0SW5Qcm9ncmVzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9jb25uZWN0aW9uLnNlbmQodGhpcy5fcHJvdG9jb2wud3JpdGVNZXNzYWdlKHsgdHlwZTogTWVzc2FnZVR5cGUuQWNrLCBzZXF1ZW5jZUlkOiB0aGlzLl9sYXRlc3RSZWNlaXZlZFNlcXVlbmNlSWQgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgZXJyb3JzLCB0aGF0IG1lYW5zIHRoZSBjb25uZWN0aW9uIGlzIGNsb3NlZCBhbmQgd2UgZG9uJ3QgY2FyZSBhYm91dCB0aGUgQWNrIG1lc3NhZ2UgYW55bW9yZS5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIHsgfVxyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Fja1RpbWVySGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Fja1RpbWVySGFuZGxlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgLy8gMSBzZWNvbmQgZGVsYXkgc28gd2UgZG9uJ3Qgc3BhbSBBY2sgbWVzc2FnZXMgaWYgdGhlcmUgYXJlIG1hbnkgbWVzc2FnZXMgYmVpbmcgcmVjZWl2ZWQgYXQgb25jZS5cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNsYXNzIEJ1ZmZlcmVkSXRlbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBpZCwgcmVzb2x2ZXIsIHJlamVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5fbWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9yZXNvbHZlciA9IHJlc29sdmVyO1xyXG4gICAgICAgIHRoaXMuX3JlamVjdG9yID0gcmVqZWN0b3I7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TWVzc2FnZUJ1ZmZlci5qcy5tYXAiLCIvLyBMaWNlbnNlZCB0byB0aGUgLk5FVCBGb3VuZGF0aW9uIHVuZGVyIG9uZSBvciBtb3JlIGFncmVlbWVudHMuXHJcbi8vIFRoZSAuTkVUIEZvdW5kYXRpb24gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBUcmFuc2ZlckZvcm1hdCB9IGZyb20gXCIuL0lUcmFuc3BvcnRcIjtcclxuaW1wb3J0IHsgQXJnLCBnZXREYXRhRGV0YWlsLCBnZXRVc2VyQWdlbnRIZWFkZXIsIFBsYXRmb3JtLCBzZW5kTWVzc2FnZSB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmVyU2VudEV2ZW50c1RyYW5zcG9ydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihodHRwQ2xpZW50LCBhY2Nlc3NUb2tlbiwgbG9nZ2VyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5faHR0cENsaWVudCA9IGh0dHBDbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4gPSBhY2Nlc3NUb2tlbjtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5vbnJlY2VpdmUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25jbG9zZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhc3luYyBjb25uZWN0KHVybCwgdHJhbnNmZXJGb3JtYXQpIHtcclxuICAgICAgICBBcmcuaXNSZXF1aXJlZCh1cmwsIFwidXJsXCIpO1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHRyYW5zZmVyRm9ybWF0LCBcInRyYW5zZmVyRm9ybWF0XCIpO1xyXG4gICAgICAgIEFyZy5pc0luKHRyYW5zZmVyRm9ybWF0LCBUcmFuc2ZlckZvcm1hdCwgXCJ0cmFuc2ZlckZvcm1hdFwiKTtcclxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBcIihTU0UgdHJhbnNwb3J0KSBDb25uZWN0aW5nLlwiKTtcclxuICAgICAgICAvLyBzZXQgdXJsIGJlZm9yZSBhY2Nlc3NUb2tlbkZhY3RvcnkgYmVjYXVzZSB0aGlzLl91cmwgaXMgb25seSBmb3Igc2VuZCBhbmQgd2Ugc2V0IHRoZSBhdXRoIGhlYWRlciBpbnN0ZWFkIG9mIHRoZSBxdWVyeSBzdHJpbmcgZm9yIHNlbmRcclxuICAgICAgICB0aGlzLl91cmwgPSB1cmw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjY2Vzc1Rva2VuKSB7XHJcbiAgICAgICAgICAgIHVybCArPSAodXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCIpICsgYGFjY2Vzc190b2tlbj0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLl9hY2Nlc3NUb2tlbil9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodHJhbnNmZXJGb3JtYXQgIT09IFRyYW5zZmVyRm9ybWF0LlRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJUaGUgU2VydmVyLVNlbnQgRXZlbnRzIHRyYW5zcG9ydCBvbmx5IHN1cHBvcnRzIHRoZSAnVGV4dCcgdHJhbnNmZXIgZm9ybWF0XCIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZXZlbnRTb3VyY2U7XHJcbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc0Jyb3dzZXIgfHwgUGxhdGZvcm0uaXNXZWJXb3JrZXIpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50U291cmNlID0gbmV3IHRoaXMuX29wdGlvbnMuRXZlbnRTb3VyY2UodXJsLCB7IHdpdGhDcmVkZW50aWFsczogdGhpcy5fb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBOb24tYnJvd3NlciBwYXNzZXMgY29va2llcyB2aWEgdGhlIGRpY3Rpb25hcnlcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvb2tpZXMgPSB0aGlzLl9odHRwQ2xpZW50LmdldENvb2tpZVN0cmluZyh1cmwpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaGVhZGVycy5Db29raWUgPSBjb29raWVzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW25hbWUsIHZhbHVlXSA9IGdldFVzZXJBZ2VudEhlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRTb3VyY2UgPSBuZXcgdGhpcy5fb3B0aW9ucy5FdmVudFNvdXJjZSh1cmwsIHsgd2l0aENyZWRlbnRpYWxzOiB0aGlzLl9vcHRpb25zLndpdGhDcmVkZW50aWFscywgaGVhZGVyczogeyAuLi5oZWFkZXJzLCAuLi50aGlzLl9vcHRpb25zLmhlYWRlcnMgfSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRTb3VyY2Uub25tZXNzYWdlID0gKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vbnJlY2VpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGAoU1NFIHRyYW5zcG9ydCkgZGF0YSByZWNlaXZlZC4gJHtnZXREYXRhRGV0YWlsKGUuZGF0YSwgdGhpcy5fb3B0aW9ucy5sb2dNZXNzYWdlQ29udGVudCl9LmApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbnJlY2VpdmUoZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlOiBub3QgdXNpbmcgZXZlbnQgb24gcHVycG9zZVxyXG4gICAgICAgICAgICAgICAgZXZlbnRTb3VyY2Uub25lcnJvciA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRXZlbnRTb3VyY2UgZG9lc24ndCBnaXZlIGFueSB1c2VmdWwgaW5mb3JtYXRpb24gYWJvdXQgc2VydmVyIHNpZGUgY2xvc2VzLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcGVuZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJFdmVudFNvdXJjZSBmYWlsZWQgdG8gY29ubmVjdC4gVGhlIGNvbm5lY3Rpb24gY291bGQgbm90IGJlIGZvdW5kIG9uIHRoZSBzZXJ2ZXIsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgZWl0aGVyIHRoZSBjb25uZWN0aW9uIElEIGlzIG5vdCBwcmVzZW50IG9uIHRoZSBzZXJ2ZXIsIG9yIGEgcHJveHkgaXMgcmVmdXNpbmcvYnVmZmVyaW5nIHRoZSBjb25uZWN0aW9uLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiIElmIHlvdSBoYXZlIG11bHRpcGxlIHNlcnZlcnMgY2hlY2sgdGhhdCBzdGlja3kgc2Vzc2lvbnMgYXJlIGVuYWJsZWQuXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZXZlbnRTb3VyY2Uub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIGBTU0UgY29ubmVjdGVkIHRvICR7dGhpcy5fdXJsfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50U291cmNlID0gZXZlbnRTb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNlbmQoZGF0YSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZXZlbnRTb3VyY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBzZW5kIHVudGlsIHRoZSB0cmFuc3BvcnQgaXMgY29ubmVjdGVkXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbmRNZXNzYWdlKHRoaXMuX2xvZ2dlciwgXCJTU0VcIiwgdGhpcy5faHR0cENsaWVudCwgdGhpcy5fdXJsLCBkYXRhLCB0aGlzLl9vcHRpb25zKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5fY2xvc2UoKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgICBfY2xvc2UoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudFNvdXJjZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudFNvdXJjZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudFNvdXJjZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25jbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbmNsb3NlKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNlcnZlclNlbnRFdmVudHNUcmFuc3BvcnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuLyoqIFN0cmVhbSBpbXBsZW1lbnRhdGlvbiB0byBzdHJlYW0gaXRlbXMgdG8gdGhlIHNlcnZlci4gKi9cclxuZXhwb3J0IGNsYXNzIFN1YmplY3Qge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcclxuICAgIH1cclxuICAgIG5leHQoaXRlbSkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgb2JzZXJ2ZXIgb2YgdGhpcy5vYnNlcnZlcnMpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlcnJvcihlcnIpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG9ic2VydmVyIG9mIHRoaXMub2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChvYnNlcnZlci5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBsZXRlKCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgb2JzZXJ2ZXIgb2YgdGhpcy5vYnNlcnZlcnMpIHtcclxuICAgICAgICAgICAgaWYgKG9ic2VydmVyLmNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3Vic2NyaWJlKG9ic2VydmVyKSB7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdWJqZWN0U3Vic2NyaXB0aW9uKHRoaXMsIG9ic2VydmVyKTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJqZWN0LmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuLy8gTm90IGV4cG9ydGVkIGZyb20gaW5kZXhcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBUZXh0TWVzc2FnZUZvcm1hdCB7XHJcbiAgICBzdGF0aWMgd3JpdGUob3V0cHV0KSB7XHJcbiAgICAgICAgcmV0dXJuIGAke291dHB1dH0ke1RleHRNZXNzYWdlRm9ybWF0LlJlY29yZFNlcGFyYXRvcn1gO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBhcnNlKGlucHV0KSB7XHJcbiAgICAgICAgaWYgKGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdICE9PSBUZXh0TWVzc2FnZUZvcm1hdC5SZWNvcmRTZXBhcmF0b3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWVzc2FnZSBpcyBpbmNvbXBsZXRlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBpbnB1dC5zcGxpdChUZXh0TWVzc2FnZUZvcm1hdC5SZWNvcmRTZXBhcmF0b3IpO1xyXG4gICAgICAgIG1lc3NhZ2VzLnBvcCgpO1xyXG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcclxuICAgIH1cclxufVxyXG5UZXh0TWVzc2FnZUZvcm1hdC5SZWNvcmRTZXBhcmF0b3JDb2RlID0gMHgxZTtcclxuVGV4dE1lc3NhZ2VGb3JtYXQuUmVjb3JkU2VwYXJhdG9yID0gU3RyaW5nLmZyb21DaGFyQ29kZShUZXh0TWVzc2FnZUZvcm1hdC5SZWNvcmRTZXBhcmF0b3JDb2RlKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGV4dE1lc3NhZ2VGb3JtYXQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgTnVsbExvZ2dlciB9IGZyb20gXCIuL0xvZ2dlcnNcIjtcclxuLy8gVmVyc2lvbiB0b2tlbiB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgdGhlIHByZXBhY2sgY29tbWFuZFxyXG4vKiogVGhlIHZlcnNpb24gb2YgdGhlIFNpZ25hbFIgY2xpZW50LiAqL1xyXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IFwiOC4wLjdcIjtcclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBjbGFzcyBBcmcge1xyXG4gICAgc3RhdGljIGlzUmVxdWlyZWQodmFsLCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSAnJHtuYW1lfScgYXJndW1lbnQgaXMgcmVxdWlyZWQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzTm90RW1wdHkodmFsLCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKCF2YWwgfHwgdmFsLm1hdGNoKC9eXFxzKiQvKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSAnJHtuYW1lfScgYXJndW1lbnQgc2hvdWxkIG5vdCBiZSBlbXB0eS5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNJbih2YWwsIHZhbHVlcywgbmFtZSkge1xyXG4gICAgICAgIC8vIFR5cGVTY3JpcHQgZW51bXMgaGF2ZSBrZXlzIGZvciAqKmJvdGgqKiB0aGUgbmFtZSBhbmQgdGhlIHZhbHVlIG9mIGVhY2ggZW51bSBtZW1iZXIgb24gdGhlIHR5cGUgaXRzZWxmLlxyXG4gICAgICAgIGlmICghKHZhbCBpbiB2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biAke25hbWV9IHZhbHVlOiAke3ZhbH0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgUGxhdGZvcm0ge1xyXG4gICAgLy8gcmVhY3QtbmF0aXZlIGhhcyBhIHdpbmRvdyBidXQgbm8gZG9jdW1lbnQgc28gd2Ugc2hvdWxkIGNoZWNrIGJvdGhcclxuICAgIHN0YXRpYyBnZXQgaXNCcm93c2VyKCkge1xyXG4gICAgICAgIHJldHVybiAhUGxhdGZvcm0uaXNOb2RlICYmIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCA9PT0gXCJvYmplY3RcIjtcclxuICAgIH1cclxuICAgIC8vIFdlYldvcmtlcnMgZG9uJ3QgaGF2ZSBhIHdpbmRvdyBvYmplY3Qgc28gdGhlIGlzQnJvd3NlciBjaGVjayB3b3VsZCBmYWlsXHJcbiAgICBzdGF0aWMgZ2V0IGlzV2ViV29ya2VyKCkge1xyXG4gICAgICAgIHJldHVybiAhUGxhdGZvcm0uaXNOb2RlICYmIHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIFwiaW1wb3J0U2NyaXB0c1wiIGluIHNlbGY7XHJcbiAgICB9XHJcbiAgICAvLyByZWFjdC1uYXRpdmUgaGFzIGEgd2luZG93IGJ1dCBubyBkb2N1bWVudFxyXG4gICAgc3RhdGljIGdldCBpc1JlYWN0TmF0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiAhUGxhdGZvcm0uaXNOb2RlICYmIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH1cclxuICAgIC8vIE5vZGUgYXBwcyBzaG91bGRuJ3QgaGF2ZSBhIHdpbmRvdyBvYmplY3QsIGJ1dCBXZWJXb3JrZXJzIGRvbid0IGVpdGhlclxyXG4gICAgLy8gc28gd2UgbmVlZCB0byBjaGVjayBmb3IgYm90aCBXZWJXb3JrZXIgYW5kIHdpbmRvd1xyXG4gICAgc3RhdGljIGdldCBpc05vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MucmVsZWFzZSAmJiBwcm9jZXNzLnJlbGVhc2UubmFtZSA9PT0gXCJub2RlXCI7XHJcbiAgICB9XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhRGV0YWlsKGRhdGEsIGluY2x1ZGVDb250ZW50KSB7XHJcbiAgICBsZXQgZGV0YWlsID0gXCJcIjtcclxuICAgIGlmIChpc0FycmF5QnVmZmVyKGRhdGEpKSB7XHJcbiAgICAgICAgZGV0YWlsID0gYEJpbmFyeSBkYXRhIG9mIGxlbmd0aCAke2RhdGEuYnl0ZUxlbmd0aH1gO1xyXG4gICAgICAgIGlmIChpbmNsdWRlQ29udGVudCkge1xyXG4gICAgICAgICAgICBkZXRhaWwgKz0gYC4gQ29udGVudDogJyR7Zm9ybWF0QXJyYXlCdWZmZXIoZGF0YSl9J2A7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBkZXRhaWwgPSBgU3RyaW5nIGRhdGEgb2YgbGVuZ3RoICR7ZGF0YS5sZW5ndGh9YDtcclxuICAgICAgICBpZiAoaW5jbHVkZUNvbnRlbnQpIHtcclxuICAgICAgICAgICAgZGV0YWlsICs9IGAuIENvbnRlbnQ6ICcke2RhdGF9J2A7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRldGFpbDtcclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEFycmF5QnVmZmVyKGRhdGEpIHtcclxuICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShkYXRhKTtcclxuICAgIC8vIFVpbnQ4QXJyYXkubWFwIG9ubHkgc3VwcG9ydHMgcmV0dXJuaW5nIGFub3RoZXIgVWludDhBcnJheT9cclxuICAgIGxldCBzdHIgPSBcIlwiO1xyXG4gICAgdmlldy5mb3JFYWNoKChudW0pID0+IHtcclxuICAgICAgICBjb25zdCBwYWQgPSBudW0gPCAxNiA/IFwiMFwiIDogXCJcIjtcclxuICAgICAgICBzdHIgKz0gYDB4JHtwYWR9JHtudW0udG9TdHJpbmcoMTYpfSBgO1xyXG4gICAgfSk7XHJcbiAgICAvLyBUcmltIG9mIHRyYWlsaW5nIHNwYWNlLlxyXG4gICAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG59XHJcbi8vIEFsc28gaW4gc2lnbmFsci1wcm90b2NvbC1tc2dwYWNrL1V0aWxzLnRzXHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcclxuICAgIHJldHVybiB2YWwgJiYgdHlwZW9mIEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgKHZhbCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8XHJcbiAgICAgICAgICAgIC8vIFNvbWV0aW1lcyB3ZSBnZXQgYW4gQXJyYXlCdWZmZXIgdGhhdCBkb2Vzbid0IHNhdGlzZnkgaW5zdGFuY2VvZlxyXG4gICAgICAgICAgICAodmFsLmNvbnN0cnVjdG9yICYmIHZhbC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIkFycmF5QnVmZmVyXCIpKTtcclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRNZXNzYWdlKGxvZ2dlciwgdHJhbnNwb3J0TmFtZSwgaHR0cENsaWVudCwgdXJsLCBjb250ZW50LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0ge307XHJcbiAgICBjb25zdCBbbmFtZSwgdmFsdWVdID0gZ2V0VXNlckFnZW50SGVhZGVyKCk7XHJcbiAgICBoZWFkZXJzW25hbWVdID0gdmFsdWU7XHJcbiAgICBsb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKCR7dHJhbnNwb3J0TmFtZX0gdHJhbnNwb3J0KSBzZW5kaW5nIGRhdGEuICR7Z2V0RGF0YURldGFpbChjb250ZW50LCBvcHRpb25zLmxvZ01lc3NhZ2VDb250ZW50KX0uYCk7XHJcbiAgICBjb25zdCByZXNwb25zZVR5cGUgPSBpc0FycmF5QnVmZmVyKGNvbnRlbnQpID8gXCJhcnJheWJ1ZmZlclwiIDogXCJ0ZXh0XCI7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGh0dHBDbGllbnQucG9zdCh1cmwsIHtcclxuICAgICAgICBjb250ZW50LFxyXG4gICAgICAgIGhlYWRlcnM6IHsgLi4uaGVhZGVycywgLi4ub3B0aW9ucy5oZWFkZXJzIH0sXHJcbiAgICAgICAgcmVzcG9uc2VUeXBlLFxyXG4gICAgICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dCxcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzLFxyXG4gICAgfSk7XHJcbiAgICBsb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKCR7dHJhbnNwb3J0TmFtZX0gdHJhbnNwb3J0KSByZXF1ZXN0IGNvbXBsZXRlLiBSZXNwb25zZSBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX0uYCk7XHJcbn1cclxuLyoqIEBwcml2YXRlICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2dnZXIobG9nZ2VyKSB7XHJcbiAgICBpZiAobG9nZ2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbnNvbGVMb2dnZXIoTG9nTGV2ZWwuSW5mb3JtYXRpb24pO1xyXG4gICAgfVxyXG4gICAgaWYgKGxvZ2dlciA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBOdWxsTG9nZ2VyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgaWYgKGxvZ2dlci5sb2cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiBsb2dnZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IENvbnNvbGVMb2dnZXIobG9nZ2VyKTtcclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGNsYXNzIFN1YmplY3RTdWJzY3JpcHRpb24ge1xyXG4gICAgY29uc3RydWN0b3Ioc3ViamVjdCwgb2JzZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gc3ViamVjdDtcclxuICAgICAgICB0aGlzLl9vYnNlcnZlciA9IG9ic2VydmVyO1xyXG4gICAgfVxyXG4gICAgZGlzcG9zZSgpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3N1YmplY3Qub2JzZXJ2ZXJzLmluZGV4T2YodGhpcy5fb2JzZXJ2ZXIpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YmplY3Qub2JzZXJ2ZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9zdWJqZWN0Lm9ic2VydmVycy5sZW5ndGggPT09IDAgJiYgdGhpcy5fc3ViamVjdC5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJqZWN0LmNhbmNlbENhbGxiYWNrKCkuY2F0Y2goKF8pID0+IHsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgQ29uc29sZUxvZ2dlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtaW5pbXVtTG9nTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLl9taW5MZXZlbCA9IG1pbmltdW1Mb2dMZXZlbDtcclxuICAgICAgICB0aGlzLm91dCA9IGNvbnNvbGU7XHJcbiAgICB9XHJcbiAgICBsb2cobG9nTGV2ZWwsIG1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAobG9nTGV2ZWwgPj0gdGhpcy5fbWluTGV2ZWwpIHtcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dICR7TG9nTGV2ZWxbbG9nTGV2ZWxdfTogJHttZXNzYWdlfWA7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobG9nTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTG9nTGV2ZWwuQ3JpdGljYWw6XHJcbiAgICAgICAgICAgICAgICBjYXNlIExvZ0xldmVsLkVycm9yOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0LmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIExvZ0xldmVsLldhcm5pbmc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXQud2Fybihtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5JbmZvcm1hdGlvbjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dC5pbmZvKG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcgb25seSBnb2VzIHRvIGF0dGFjaGVkIGRlYnVnZ2VycyBpbiBOb2RlLCBzbyB3ZSB1c2UgY29uc29sZS5sb2cgZm9yIFRyYWNlIGFuZCBEZWJ1Z1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0LmxvZyhtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlckFnZW50SGVhZGVyKCkge1xyXG4gICAgbGV0IHVzZXJBZ2VudEhlYWRlck5hbWUgPSBcIlgtU2lnbmFsUi1Vc2VyLUFnZW50XCI7XHJcbiAgICBpZiAoUGxhdGZvcm0uaXNOb2RlKSB7XHJcbiAgICAgICAgdXNlckFnZW50SGVhZGVyTmFtZSA9IFwiVXNlci1BZ2VudFwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFt1c2VyQWdlbnRIZWFkZXJOYW1lLCBjb25zdHJ1Y3RVc2VyQWdlbnQoVkVSU0lPTiwgZ2V0T3NOYW1lKCksIGdldFJ1bnRpbWUoKSwgZ2V0UnVudGltZVZlcnNpb24oKSldO1xyXG59XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29uc3RydWN0VXNlckFnZW50KHZlcnNpb24sIG9zLCBydW50aW1lLCBydW50aW1lVmVyc2lvbikge1xyXG4gICAgLy8gTWljcm9zb2Z0IFNpZ25hbFIvW1ZlcnNpb25dIChbRGV0YWlsZWQgVmVyc2lvbl07IFtPcGVyYXRpbmcgU3lzdGVtXTsgW1J1bnRpbWVdOyBbUnVudGltZSBWZXJzaW9uXSlcclxuICAgIGxldCB1c2VyQWdlbnQgPSBcIk1pY3Jvc29mdCBTaWduYWxSL1wiO1xyXG4gICAgY29uc3QgbWFqb3JBbmRNaW5vciA9IHZlcnNpb24uc3BsaXQoXCIuXCIpO1xyXG4gICAgdXNlckFnZW50ICs9IGAke21ham9yQW5kTWlub3JbMF19LiR7bWFqb3JBbmRNaW5vclsxXX1gO1xyXG4gICAgdXNlckFnZW50ICs9IGAgKCR7dmVyc2lvbn07IGA7XHJcbiAgICBpZiAob3MgJiYgb3MgIT09IFwiXCIpIHtcclxuICAgICAgICB1c2VyQWdlbnQgKz0gYCR7b3N9OyBgO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdXNlckFnZW50ICs9IFwiVW5rbm93biBPUzsgXCI7XHJcbiAgICB9XHJcbiAgICB1c2VyQWdlbnQgKz0gYCR7cnVudGltZX1gO1xyXG4gICAgaWYgKHJ1bnRpbWVWZXJzaW9uKSB7XHJcbiAgICAgICAgdXNlckFnZW50ICs9IGA7ICR7cnVudGltZVZlcnNpb259YDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHVzZXJBZ2VudCArPSBcIjsgVW5rbm93biBSdW50aW1lIFZlcnNpb25cIjtcclxuICAgIH1cclxuICAgIHVzZXJBZ2VudCArPSBcIilcIjtcclxuICAgIHJldHVybiB1c2VyQWdlbnQ7XHJcbn1cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNwYWNlZC1jb21tZW50XHJcbi8qI19fUFVSRV9fKi8gZnVuY3Rpb24gZ2V0T3NOYW1lKCkge1xyXG4gICAgaWYgKFBsYXRmb3JtLmlzTm9kZSkge1xyXG4gICAgICAgIHN3aXRjaCAocHJvY2Vzcy5wbGF0Zm9ybSkge1xyXG4gICAgICAgICAgICBjYXNlIFwid2luMzJcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIldpbmRvd3MgTlRcIjtcclxuICAgICAgICAgICAgY2FzZSBcImRhcndpblwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibWFjT1NcIjtcclxuICAgICAgICAgICAgY2FzZSBcImxpbnV4XCI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJMaW51eFwiO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MucGxhdGZvcm07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbn1cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNwYWNlZC1jb21tZW50XHJcbi8qI19fUFVSRV9fKi8gZnVuY3Rpb24gZ2V0UnVudGltZVZlcnNpb24oKSB7XHJcbiAgICBpZiAoUGxhdGZvcm0uaXNOb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0UnVudGltZSgpIHtcclxuICAgIGlmIChQbGF0Zm9ybS5pc05vZGUpIHtcclxuICAgICAgICByZXR1cm4gXCJOb2RlSlNcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBcIkJyb3dzZXJcIjtcclxuICAgIH1cclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yU3RyaW5nKGUpIHtcclxuICAgIGlmIChlLnN0YWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIGUuc3RhY2s7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChlLm1lc3NhZ2UpIHtcclxuICAgICAgICByZXR1cm4gZS5tZXNzYWdlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke2V9YDtcclxufVxyXG4vKiogQHByaXZhdGUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEdsb2JhbFRoaXMoKSB7XHJcbiAgICAvLyBnbG9iYWxUaGlzIGlzIHNlbWktbmV3IGFuZCBub3QgYXZhaWxhYmxlIGluIE5vZGUgdW50aWwgdjEyXHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFsVGhpcztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiY291bGQgbm90IGZpbmQgZ2xvYmFsXCIpO1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVV0aWxzLmpzLm1hcCIsIi8vIExpY2Vuc2VkIHRvIHRoZSAuTkVUIEZvdW5kYXRpb24gdW5kZXIgb25lIG9yIG1vcmUgYWdyZWVtZW50cy5cclxuLy8gVGhlIC5ORVQgRm91bmRhdGlvbiBsaWNlbnNlcyB0aGlzIGZpbGUgdG8geW91IHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuaW1wb3J0IHsgSGVhZGVyTmFtZXMgfSBmcm9tIFwiLi9IZWFkZXJOYW1lc1wiO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL0lMb2dnZXJcIjtcclxuaW1wb3J0IHsgVHJhbnNmZXJGb3JtYXQgfSBmcm9tIFwiLi9JVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IEFyZywgZ2V0RGF0YURldGFpbCwgZ2V0VXNlckFnZW50SGVhZGVyLCBQbGF0Zm9ybSB9IGZyb20gXCIuL1V0aWxzXCI7XHJcbi8qKiBAcHJpdmF0ZSAqL1xyXG5leHBvcnQgY2xhc3MgV2ViU29ja2V0VHJhbnNwb3J0IHtcclxuICAgIGNvbnN0cnVjdG9yKGh0dHBDbGllbnQsIGFjY2Vzc1Rva2VuRmFjdG9yeSwgbG9nZ2VyLCBsb2dNZXNzYWdlQ29udGVudCwgd2ViU29ja2V0Q29uc3RydWN0b3IsIGhlYWRlcnMpIHtcclxuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XHJcbiAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5GYWN0b3J5ID0gYWNjZXNzVG9rZW5GYWN0b3J5O1xyXG4gICAgICAgIHRoaXMuX2xvZ01lc3NhZ2VDb250ZW50ID0gbG9nTWVzc2FnZUNvbnRlbnQ7XHJcbiAgICAgICAgdGhpcy5fd2ViU29ja2V0Q29uc3RydWN0b3IgPSB3ZWJTb2NrZXRDb25zdHJ1Y3RvcjtcclxuICAgICAgICB0aGlzLl9odHRwQ2xpZW50ID0gaHR0cENsaWVudDtcclxuICAgICAgICB0aGlzLm9ucmVjZWl2ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbmNsb3NlID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9oZWFkZXJzID0gaGVhZGVycztcclxuICAgIH1cclxuICAgIGFzeW5jIGNvbm5lY3QodXJsLCB0cmFuc2ZlckZvcm1hdCkge1xyXG4gICAgICAgIEFyZy5pc1JlcXVpcmVkKHVybCwgXCJ1cmxcIik7XHJcbiAgICAgICAgQXJnLmlzUmVxdWlyZWQodHJhbnNmZXJGb3JtYXQsIFwidHJhbnNmZXJGb3JtYXRcIik7XHJcbiAgICAgICAgQXJnLmlzSW4odHJhbnNmZXJGb3JtYXQsIFRyYW5zZmVyRm9ybWF0LCBcInRyYW5zZmVyRm9ybWF0XCIpO1xyXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIFwiKFdlYlNvY2tldHMgdHJhbnNwb3J0KSBDb25uZWN0aW5nLlwiKTtcclxuICAgICAgICBsZXQgdG9rZW47XHJcbiAgICAgICAgaWYgKHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSkge1xyXG4gICAgICAgICAgICB0b2tlbiA9IGF3YWl0IHRoaXMuX2FjY2Vzc1Rva2VuRmFjdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXmh0dHAvLCBcIndzXCIpO1xyXG4gICAgICAgICAgICBsZXQgd2ViU29ja2V0O1xyXG4gICAgICAgICAgICBjb25zdCBjb29raWVzID0gdGhpcy5faHR0cENsaWVudC5nZXRDb29raWVTdHJpbmcodXJsKTtcclxuICAgICAgICAgICAgbGV0IG9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNOb2RlIHx8IFBsYXRmb3JtLmlzUmVhY3ROYXRpdmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSBnZXRVc2VyQWdlbnRIZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnNbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbSGVhZGVyTmFtZXMuQXV0aG9yaXphdGlvbl0gPSBgQmVhcmVyICR7dG9rZW59YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1tIZWFkZXJOYW1lcy5Db29raWVdID0gY29va2llcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgcGFzcyBoZWFkZXJzIHdoZW4gaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzXHJcbiAgICAgICAgICAgICAgICB3ZWJTb2NrZXQgPSBuZXcgdGhpcy5fd2ViU29ja2V0Q29uc3RydWN0b3IodXJsLCB1bmRlZmluZWQsIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IC4uLmhlYWRlcnMsIC4uLnRoaXMuX2hlYWRlcnMgfSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICh1cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIikgKyBgYWNjZXNzX3Rva2VuPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRva2VuKX1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghd2ViU29ja2V0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDaHJvbWUgaXMgbm90IGhhcHB5IHdpdGggcGFzc2luZyAndW5kZWZpbmVkJyBhcyBwcm90b2NvbFxyXG4gICAgICAgICAgICAgICAgd2ViU29ja2V0ID0gbmV3IHRoaXMuX3dlYlNvY2tldENvbnN0cnVjdG9yKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYW5zZmVyRm9ybWF0ID09PSBUcmFuc2ZlckZvcm1hdC5CaW5hcnkpIHtcclxuICAgICAgICAgICAgICAgIHdlYlNvY2tldC5iaW5hcnlUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdlYlNvY2tldC5vbm9wZW4gPSAoX2V2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLkluZm9ybWF0aW9uLCBgV2ViU29ja2V0IGNvbm5lY3RlZCB0byAke3VybH0uYCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQgPSB3ZWJTb2NrZXQ7XHJcbiAgICAgICAgICAgICAgICBvcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3ZWJTb2NrZXQub25lcnJvciA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yRXZlbnQgaXMgYSBicm93c2VyIG9ubHkgdHlwZSB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSB0eXBlIGV4aXN0cyBiZWZvcmUgdXNpbmcgaXRcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgRXJyb3JFdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBldmVudCBpbnN0YW5jZW9mIEVycm9yRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IGV2ZW50LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBcIlRoZXJlIHdhcyBhbiBlcnJvciB3aXRoIHRoZSB0cmFuc3BvcnRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuSW5mb3JtYXRpb24sIGAoV2ViU29ja2V0cyB0cmFuc3BvcnQpICR7ZXJyb3J9LmApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3ZWJTb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuVHJhY2UsIGAoV2ViU29ja2V0cyB0cmFuc3BvcnQpIGRhdGEgcmVjZWl2ZWQuICR7Z2V0RGF0YURldGFpbChtZXNzYWdlLmRhdGEsIHRoaXMuX2xvZ01lc3NhZ2VDb250ZW50KX0uYCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbnJlY2VpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ucmVjZWl2ZShtZXNzYWdlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2UoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3ZWJTb2NrZXQub25jbG9zZSA9IChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgY2FsbCBjbG9zZSBoYW5kbGVyIGlmIGNvbm5lY3Rpb24gd2FzIG5ldmVyIGVzdGFibGlzaGVkXHJcbiAgICAgICAgICAgICAgICAvLyBXZSdsbCByZWplY3QgdGhlIGNvbm5lY3QgY2FsbCBpbnN0ZWFkXHJcbiAgICAgICAgICAgICAgICBpZiAob3BlbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvckV2ZW50IGlzIGEgYnJvd3NlciBvbmx5IHR5cGUgd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgdHlwZSBleGlzdHMgYmVmb3JlIHVzaW5nIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBFcnJvckV2ZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGV2ZW50IGluc3RhbmNlb2YgRXJyb3JFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IGV2ZW50LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBcIldlYlNvY2tldCBmYWlsZWQgdG8gY29ubmVjdC4gVGhlIGNvbm5lY3Rpb24gY291bGQgbm90IGJlIGZvdW5kIG9uIHRoZSBzZXJ2ZXIsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgZWl0aGVyIHRoZSBlbmRwb2ludCBtYXkgbm90IGJlIGEgU2lnbmFsUiBlbmRwb2ludCxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIiB0aGUgY29ubmVjdGlvbiBJRCBpcyBub3QgcHJlc2VudCBvbiB0aGUgc2VydmVyLCBvciB0aGVyZSBpcyBhIHByb3h5IGJsb2NraW5nIFdlYlNvY2tldHMuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgSWYgeW91IGhhdmUgbXVsdGlwbGUgc2VydmVycyBjaGVjayB0aGF0IHN0aWNreSBzZXNzaW9ucyBhcmUgZW5hYmxlZC5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2VuZChkYXRhKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3dlYlNvY2tldCAmJiB0aGlzLl93ZWJTb2NrZXQucmVhZHlTdGF0ZSA9PT0gdGhpcy5fd2ViU29ja2V0Q29uc3RydWN0b3IuT1BFTikge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLlRyYWNlLCBgKFdlYlNvY2tldHMgdHJhbnNwb3J0KSBzZW5kaW5nIGRhdGEuICR7Z2V0RGF0YURldGFpbChkYXRhLCB0aGlzLl9sb2dNZXNzYWdlQ29udGVudCl9LmApO1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJXZWJTb2NrZXQgaXMgbm90IGluIHRoZSBPUEVOIHN0YXRlXCIpO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fd2ViU29ja2V0KSB7XHJcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IGludm9rZSBvbmNsb3NlIGNhbGxiYWNrIGlubGluZSBzbyB3ZSBrbm93IHRoZSBIdHRwQ29ubmVjdGlvbiB3YXMgY2xvc2VkIHByb3Blcmx5IGJlZm9yZSByZXR1cm5pbmdcclxuICAgICAgICAgICAgLy8gVGhpcyBhbHNvIHNvbHZlcyBhbiBpc3N1ZSB3aGVyZSB3ZWJzb2NrZXQub25jbG9zZSBjb3VsZCB0YWtlIDE4KyBzZWNvbmRzIHRvIHRyaWdnZXIgZHVyaW5nIG5ldHdvcmsgZGlzY29ubmVjdHNcclxuICAgICAgICAgICAgdGhpcy5fY2xvc2UodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgX2Nsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgLy8gd2ViU29ja2V0IHdpbGwgYmUgbnVsbCBpZiB0aGUgdHJhbnNwb3J0IGRpZCBub3Qgc3RhcnQgc3VjY2Vzc2Z1bGx5XHJcbiAgICAgICAgaWYgKHRoaXMuX3dlYlNvY2tldCkge1xyXG4gICAgICAgICAgICAvLyBDbGVhciB3ZWJzb2NrZXQgaGFuZGxlcnMgYmVjYXVzZSB3ZSBhcmUgY29uc2lkZXJpbmcgdGhlIHNvY2tldCBjbG9zZWQgbm93XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYlNvY2tldC5vbmNsb3NlID0gKCkgPT4geyB9O1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQub25tZXNzYWdlID0gKCkgPT4geyB9O1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQub25lcnJvciA9ICgpID0+IHsgfTtcclxuICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYlNvY2tldCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZyhMb2dMZXZlbC5UcmFjZSwgXCIoV2ViU29ja2V0cyB0cmFuc3BvcnQpIHNvY2tldCBjbG9zZWQuXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uY2xvc2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ2xvc2VFdmVudChldmVudCkgJiYgKGV2ZW50Lndhc0NsZWFuID09PSBmYWxzZSB8fCBldmVudC5jb2RlICE9PSAxMDAwKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbmNsb3NlKG5ldyBFcnJvcihgV2ViU29ja2V0IGNsb3NlZCB3aXRoIHN0YXR1cyBjb2RlOiAke2V2ZW50LmNvZGV9ICgke2V2ZW50LnJlYXNvbiB8fCBcIm5vIHJlYXNvbiBnaXZlblwifSkuYCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25jbG9zZShldmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9pc0Nsb3NlRXZlbnQoZXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gZXZlbnQgJiYgdHlwZW9mIGV2ZW50Lndhc0NsZWFuID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2YgZXZlbnQuY29kZSA9PT0gXCJudW1iZXJcIjtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1XZWJTb2NrZXRUcmFuc3BvcnQuanMubWFwIiwiLy8gTGljZW5zZWQgdG8gdGhlIC5ORVQgRm91bmRhdGlvbiB1bmRlciBvbmUgb3IgbW9yZSBhZ3JlZW1lbnRzLlxyXG4vLyBUaGUgLk5FVCBGb3VuZGF0aW9uIGxpY2Vuc2VzIHRoaXMgZmlsZSB0byB5b3UgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG5pbXBvcnQgeyBBYm9ydEVycm9yLCBIdHRwRXJyb3IsIFRpbWVvdXRFcnJvciB9IGZyb20gXCIuL0Vycm9yc1wiO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiLi9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vSUxvZ2dlclwiO1xyXG5pbXBvcnQgeyBpc0FycmF5QnVmZmVyIH0gZnJvbSBcIi4vVXRpbHNcIjtcclxuZXhwb3J0IGNsYXNzIFhockh0dHBDbGllbnQgZXh0ZW5kcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xyXG4gICAgfVxyXG4gICAgLyoqIEBpbmhlcml0RG9jICovXHJcbiAgICBzZW5kKHJlcXVlc3QpIHtcclxuICAgICAgICAvLyBDaGVjayB0aGF0IGFib3J0IHdhcyBub3Qgc2lnbmFsZWQgYmVmb3JlIGNhbGxpbmcgc2VuZFxyXG4gICAgICAgIGlmIChyZXF1ZXN0LmFib3J0U2lnbmFsICYmIHJlcXVlc3QuYWJvcnRTaWduYWwuYWJvcnRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFib3J0RXJyb3IoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVxdWVzdC5tZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk5vIG1ldGhvZCBkZWZpbmVkLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVxdWVzdC51cmwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk5vIHVybCBkZWZpbmVkLlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiByZXF1ZXN0LndpdGhDcmVkZW50aWFscztcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LmNvbnRlbnQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuY29udGVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC5jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBFeHBsaWNpdGx5IHNldHRpbmcgdGhlIENvbnRlbnQtVHlwZSBoZWFkZXIgZm9yIFJlYWN0IE5hdGl2ZSBvbiBBbmRyb2lkIHBsYXRmb3JtLlxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlCdWZmZXIocmVxdWVzdC5jb250ZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycztcclxuICAgICAgICAgICAgaWYgKGhlYWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGhlYWRlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlc3BvbnNlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LmFib3J0U2lnbmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmFib3J0U2lnbmFsLm9uYWJvcnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBBYm9ydEVycm9yKCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdC50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICB4aHIudGltZW91dCA9IHJlcXVlc3QudGltZW91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuYWJvcnRTaWduYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LmFib3J0U2lnbmFsLm9uYWJvcnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBIdHRwUmVzcG9uc2UoeGhyLnN0YXR1cywgeGhyLnN0YXR1c1RleHQsIHhoci5yZXNwb25zZSB8fCB4aHIucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEh0dHBFcnJvcih4aHIucmVzcG9uc2UgfHwgeGhyLnJlc3BvbnNlVGV4dCB8fCB4aHIuc3RhdHVzVGV4dCwgeGhyLnN0YXR1cykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coTG9nTGV2ZWwuV2FybmluZywgYEVycm9yIGZyb20gSFRUUCByZXF1ZXN0LiAke3hoci5zdGF0dXN9OiAke3hoci5zdGF0dXNUZXh0fS5gKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgSHR0cEVycm9yKHhoci5zdGF0dXNUZXh0LCB4aHIuc3RhdHVzKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKExvZ0xldmVsLldhcm5pbmcsIGBUaW1lb3V0IGZyb20gSFRUUCByZXF1ZXN0LmApO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBUaW1lb3V0RXJyb3IoKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKHJlcXVlc3QuY29udGVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9WGhySHR0cENsaWVudC5qcy5tYXAiLCJpbXBvcnQgKiBhcyBzaWduYWxSIGZyb20gJ0BtaWNyb3NvZnQvc2lnbmFscic7XG5cbmNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgc2lnbmFsUi5IdWJDb25uZWN0aW9uQnVpbGRlcigpXG4gIC53aXRoVXJsKCcvcGluZy1odWInLCB7fSlcbiAgLndpdGhBdXRvbWF0aWNSZWNvbm5lY3QoKVxuICAuYnVpbGQoKTtcblxuY29ubmVjdGlvbi5vbigncG9uZycsIGFzeW5jIChtZXNzYWdlOiBzdHJpbmcpID0+IHtcbiAgY29uc29sZS5sb2coYEdvdCBhIHJlc3BvbnNlIG1lc3NhZ2UgYXMgJHttZXNzYWdlfWApO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIHN0YXJ0Q29ubmVjdGlvbigpIHtcbiAgYXdhaXQgY29ubmVjdGlvbi5zdGFydCgpO1xuICBjb25zb2xlLmxvZygnY29ubmVjdGVkJyk7XG59XG5cblxuc3RhcnRDb25uZWN0aW9uKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBpbmcoKSB7XG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIHBpbmcnKTtcbn1cblxuXG5cblxuXG5cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgcGluZyB9IGZyb20gJy4vUGluZyc7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICogYXMgY29tcG9uZW50cyBmcm9tICcuL2NvbXBvbmVudHMnO1xuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50czsgXG4iXSwibmFtZXMiOlsiX3JlZ2VuZXJhdG9yUnVudGltZSIsInIiLCJ0IiwiZSIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJTeW1ib2wiLCJpIiwiaXRlcmF0b3IiLCJhIiwiYXN5bmNJdGVyYXRvciIsInUiLCJ0b1N0cmluZ1RhZyIsImMiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiaCIsIkdlbmVyYXRvciIsImNyZWF0ZSIsIkVycm9yIiwiZG9uZSIsIm1ldGhvZCIsImFyZyIsImRlbGVnYXRlIiwiZCIsImYiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsInMiLCJ0eXBlIiwiQ29udGV4dCIsImNhbGwiLCJ3cmFwIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsImwiLCJwIiwiZ2V0UHJvdG90eXBlT2YiLCJ5IiwieCIsInYiLCJnIiwiZm9yRWFjaCIsIl9pbnZva2UiLCJBc3luY0l0ZXJhdG9yIiwiX3R5cGVvZiIsInJlc29sdmUiLCJfX2F3YWl0IiwidGhlbiIsIlR5cGVFcnJvciIsIm5leHQiLCJ3IiwidHJ5RW50cmllcyIsInB1c2giLCJtIiwicmVzZXQiLCJpc05hTiIsImxlbmd0aCIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwibmFtZSIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInVuc2hpZnQiLCJwb3AiLCJ2YWx1ZXMiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsInNpZ25hbFIiLCJjb25uZWN0aW9uIiwiSHViQ29ubmVjdGlvbkJ1aWxkZXIiLCJ3aXRoVXJsIiwid2l0aEF1dG9tYXRpY1JlY29ubmVjdCIsImJ1aWxkIiwib24iLCJfcmVmIiwiX2NhbGxlZSIsIm1lc3NhZ2UiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwiY29uc29sZSIsImxvZyIsImNvbmNhdCIsIl94Iiwic3RhcnRDb25uZWN0aW9uIiwiX3N0YXJ0Q29ubmVjdGlvbiIsIl9jYWxsZWUyIiwiX2NhbGxlZTIkIiwiX2NvbnRleHQyIiwic3RhcnQiLCJQaW5nIiwiZGVmYXVsdCIsInBpbmciLCJjb21wb25lbnRzIl0sInNvdXJjZVJvb3QiOiIifQ==