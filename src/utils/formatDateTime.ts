import moment from "moment"

export const formatDateTime = (value: number) => {
  return moment.unix(value).format("MMM DD YYYY, h:mm A")
}
