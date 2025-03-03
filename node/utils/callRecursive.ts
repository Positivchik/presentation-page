export const callRecursive = function fn<T extends () => any>(
  returnCb: T,
  ifCb: (data: ReturnType<T>) => boolean
): ReturnType<T> {
  const data = returnCb();
  return ifCb(data) ? data : fn(returnCb, ifCb);
};
