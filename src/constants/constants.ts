export const constants = {
  MAX_OWNERS: 11,
  PROGRAM_ID: "3QR2HYqZPPn4P6Xh2eaujTnQUQRenFeRR8e3by6DZoa1",
  ALLOWED_FILES: ["jpeg", "jpg", "png", "pdf", "docx", "doc"],
  MAX_FILE_SIZE: 200 * 1024, // 200KB
  STREAM_START_ADD: 3, // 2 minutes
  STREAM_END_ADD: 2, // 2 minutes
  STREAM_FETCH_TIMEOUT: 10000,
  AVERAGE_TPS: 2500,
  DEPOSIT_MAX_OFFSET: 0.01,
  ZEBEC_VERSIONS: [
    {
      title: "v1",
      display: "v1",
      url: "https://zebec.io"
    },
    {
      title: "v2 (beta)",
      display: "v2",
      url: "/"
    }
  ],
  TEST_ZBC_AMOUNT: 2,
  BALANCE_FETCH_TIMEOUT: 15000,
  REFRESH_ANIMATION_DURATION: 2000
}
