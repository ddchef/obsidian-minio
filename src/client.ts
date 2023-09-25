import { ObsidianMinioPluginSettings } from "./settings";
import {Client, ItemBucketMetadata} from "minio";
import internal from "stream";
import blobToIt from "blob-to-it";

export class MinioClient {
  minio: Client;
  options: ObsidianMinioPluginSettings;
  metaData: ItemBucketMetadata;
  constructor(options:ObsidianMinioPluginSettings){
    this.options = options;
    this.minio = new Client({
      endPoint: options.endPoint,
      port: Number(options.port),
      useSSL: options.useSSL,
      accessKey: options.accessKey,
      secretKey: options.secretKey
    })
  }
  async put(file:File,path:string){
    const readable = internal.Readable.from(blobToIt(file));
    return this.minio.putObject(this.options.bucket,path,readable,file.size);
  }
  delete(){

  }
}