import { axiosInstance } from "../axiosInstance"

export const setTreasuryData = async ({ name = "", address = "" }) => {
  return await axiosInstance.post(`path`, { name, address })
}
