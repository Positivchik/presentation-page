export const getRandomNumber = (length: number) => {
  return parseInt(`${Math.random() * Math.pow(10, length)}`);
};
