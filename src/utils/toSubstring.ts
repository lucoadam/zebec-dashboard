export const toSubstring = (
  str: string | undefined,
  length: number,
  divide: boolean,
) => {
  let currentStr = str;
  if (currentStr === undefined) return null;
  else if (divide)
    return (
      currentStr.substring(0, length) +
      "..." +
      currentStr.substring(currentStr.length - length)
    );
  return currentStr?.substring(0, length) + "...";
};
