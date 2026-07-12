const BASE = import.meta.env.VITE_API_URL ?? '';

let authToken = localStorage.getItem('transitops.token') || null;

export function setToken(token) {
  authToken = token;
  if (token) localStorage.setItem('transitops.token', token);
  else localStorage.removeItem('transitops.token');
}

export function getToken() {
  return authToken;
}

/**
 * Thin fetch wrapper: injects the bearer token, parses JSON, and throws a
 * normalized Error (with .status and .details) so callers handle one shape.
 */
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) return null;

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = payload?.error?.message || 'Request failed';
    const error = new Error(message);
    error.status = res.status;
    error.details = payload?.error?.details;
    throw error;
  }
  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  raw: (path) =>
    fetch(`${BASE}/api${path}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    }),
};
