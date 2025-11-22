export class S3Client {
  send = async (command: any) => {
    return {
      $metadata: { httpStatusCode: 200 },
    };
  };
}

export class PutObjectCommand {
  constructor(public params: any) {}
}
