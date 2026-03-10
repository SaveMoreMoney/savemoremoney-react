export const getCachedData = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    const parsedItem = JSON.parse(item);
    const now = new Date().getTime();

    if (now > parsedItem.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedItem.value;
  } catch (error) {
    console.error('Error parsing cached data:', error);
    return null;
  }
};

export const setCachedData = (key, value, ttlInMinutes = 60) => {
  const now = new Date().getTime();
  const item = {
    value: value,
    expiry: now + ttlInMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};
