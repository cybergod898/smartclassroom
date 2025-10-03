const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function http(method: string, path: string, body?: any) {
  const response = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') 
    ? response.json() 
    : response.text();
}

export const api = {
  assignments: {
    list: () => http('GET', '/assignments'),
    create: (data: any) => http('POST', '/assignments', data),
  },
  messages: {
    list: () => http('GET', '/messages'),
    act: (id: string, data: any) => http('POST', `/messages/${id}/actions`, data),
  },
};