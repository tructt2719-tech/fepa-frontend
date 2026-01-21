export const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadData = <T>(key: string, fallback: T) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};
