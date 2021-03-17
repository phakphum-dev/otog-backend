export const strToObj = (data: string) => {
  return data == null ? [] : JSON.parse(data);
};
