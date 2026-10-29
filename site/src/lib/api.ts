import { useEffect, useState } from 'react';

export async function api<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const result = await fetch(`/api${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const data = await result.json();
  if (!result.ok)
    throw new Error([data.error ?? 'The request failed.', ...(data.fields ?? [])].join('\n'));
  return data as T;
}

export function useResource<T>(path: string | null) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setData(undefined);
    setError('');
    api<T>(path, undefined, controller.signal)
      .then(setData)
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, [path, version]);
  return { data, error, reload: () => setVersion((v) => v + 1) };
}

export function safeReturn(value: string | null) {
  if (!value?.startsWith('/') || !URL.canParse(value, 'https://ohara.invalid'))
    return '/workspace/';
  const url = new URL(value, 'https://ohara.invalid');
  return url.origin === 'https://ohara.invalid'
    ? url.pathname + url.search + url.hash
    : '/workspace/';
}
