export type SendFileInput = {
  context: string
  file: Express.Multer.File
}

export type SendFileOutput = {
  url: string
}
