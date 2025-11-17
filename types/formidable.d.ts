declare module 'formidable' {
  export interface File {
    size: number;
    name: string;
    type: string;
    mtime?: Date;
    filepath: string;
    lastModified: number;
  }

  export interface IncomingFormOptions {
    multiples?: boolean;
  }

  export class IncomingForm {
    constructor(options?: IncomingFormOptions);
    parse(
      req: any,
      callback: (
        err: Error | null,
        fields: Record<string, any>,
        files: Record<string, File | File[]>,
      ) => void,
    ): void;
  }

  const formidable: {
    (options?: IncomingFormOptions): IncomingForm;
    IncomingForm: typeof IncomingForm;
  };

  export default formidable;
}
