export const removeEmpty = (obj: any) => {
  const result: { [key: string]: any } = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== "") {
      result[key] = value;
    }
  }
  return result;
};
