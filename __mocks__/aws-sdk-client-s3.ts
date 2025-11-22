// Minimal mock types for testing
interface PutObjectCommandInput {
  Bucket: string;
  Key: string;
  Body: Uint8Array | string;
  ContentType?: string;
}

export class S3Client {
  // command is unused, but we type it correctly
  send = async (command: PutObjectCommand): Promise<{ $metadata: { httpStatusCode: number } }> => {
    return {
      $metadata: { httpStatusCode: 200 },
    };
  };
}

export class PutObjectCommand {
  constructor(public params: PutObjectCommandInput) {}
}
