import { useEffect, useState } from 'react';

export function useStoredDraft<T extends string | Record<string, string | number>>(
  key: string,
  initial: T,
) {
  const [value, setValue] = useState(initial),
    [loadedKey, setLoadedKey] = useState('');
  useEffect(() => {
    setValue(initial);
    const saved = sessionStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const matches =
          typeof initial === 'string'
            ? typeof parsed === 'string'
            : parsed &&
              typeof parsed === 'object' &&
              Object.entries(initial).every(([k, v]) => typeof parsed[k] === typeof v);
        if (matches) setValue(parsed);
      } catch {
        sessionStorage.removeItem(key);
      }
    }
    setLoadedKey(key);
  }, [key]);
  useEffect(() => {
    if (loadedKey === key) sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, loadedKey, value]);
  return [value, setValue, () => sessionStorage.removeItem(key)] as const;
}
