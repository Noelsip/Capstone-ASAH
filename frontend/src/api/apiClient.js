const BASE_URL = 'http://localhost:6080';

function getToken() {
    return localStorage.getItem('authToken') || '';
}

async function request(path, { method = 'GET', body, params, headers = {} } = {}) {
    let url = new URL(BASE_URL + path);
    
    if (params) Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: getToken() ? `Bearer ${getToken()}` : '',
            ...headers,
        }
    };

    if (body) opts.body = JSON.stringify(body);
    
    const response = await fetch(url, opts);
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw data || { message: response.statusText };
    return data;
}

export default {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts = {}) => request(path, { ...opts, method: 'POST', body }),
    put: (path, body, opts = {}) => request(path, { ...opts, method: 'PUT', body }),
    patch: (path, body, opts = {}) => request(path, { ...opts, method: 'PATCH', body }),
    delete: (path, opts = {}) => request(path, { ...opts, method: 'DELETE' }),
};