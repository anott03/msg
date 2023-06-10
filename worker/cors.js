const methods = 'GET, POST, PATCH, DELETE';

const allowedOrigins = ["http://localhost:3000", "https://localhost:3000", "https://forum.twdl.us", "https://www.forum.twdl.us"];
/**
* @type {(origin: string) => string}
*/
const validateOrigin = (origin) => {
    if (allowedOrigins.includes(origin)) {
        return origin;
    }
    if (origin.indexOf("vercel") !== -1) {
        return origin;
    }
    return "";
}

/**
* @type {(request: Request) => Headers}
*/
export const handleCors = (request) => {
    let origin = request.headers.get('Origin') || request.headers.get('origin');
    return {
        'Access-Control-Allow-Origin': validateOrigin(origin),
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': methods,
        'Allow': `${methods}, HEAD, OPTIONS`,
    }
}

/**
* @type {(options?: {}) => (request: Request) => Response}
*/
export const handleCorsOptions = (options = {}) => request => {
    const headers = handleCors();
    return new Response(null, { headers });
}
