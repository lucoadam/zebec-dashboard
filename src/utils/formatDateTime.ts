import moment from "moment"

export const formatDateTime = (
  value: number | string,
  gmt = true,
  inputFormat = "DD/MM/YYYY LT"
) => {
  if (typeof value === "number") {
    return moment.unix(value).format("MMM DD YYYY, h:mm A")
  }
  if (gmt) {
    return moment(value, inputFormat).format("MMM DD YYYY, h:mm A [GMT]Z")
  }
  return moment(value, inputFormat).format("MMM DD YYYY, h:mm A")
}

export const getTimesAgo = (timestamp: number | string) => {
  if (typeof timestamp === "string") {
    return moment.utc(timestamp).fromNow()
  } else {
    return moment.utc(new Date(timestamp * 1000)).fromNow()
  }
}
