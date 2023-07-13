export class UploadedFilesObject {
  readonly pdf?: Express.Multer.File[];

  readonly zip?: Express.Multer.File[];
}
