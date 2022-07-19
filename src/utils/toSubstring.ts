export const toSubstring = (
  str: string | undefined,
  length: number,
  divide: boolean
) => {
  if (str === undefined) return null
  else if (divide) {
    if (str.length > length) {
      return (
        str.substring(0, length) + "..." + str.substring(str.length - length)
      )
    } else {
      return str
    }
  }

  return str?.substring(0, length) + (str?.length > length ? "..." : "")
}
