import {createHash} from "crypto";
import { ObsidianMinioPluginSettings } from "./settings";
import { Notice } from "obsidian";
export function help (){}

export function splitName (filename:string):[string,string] {
  const result = /(.+)\.([a-zA-Z0-9]+)$/.exec(filename);
  if(!result) {
    throw new Error("文件名称错误,解析失败");
  }
  const [_,name,fileType] = result;
  return [name,fileType];
}

export function hashName (name:string):string{
  const hash = createHash('sha256');
  hash.update(name+Date.now());
  return hash.digest('hex');
}

export function connectUrl (settings:ObsidianMinioPluginSettings, filename:string):string{
  if(settings.customDomain){
    return `${settings.customDomain}/${settings.bucket}/${filename}`;
  }
  const host = `http${settings.useSSL?'s':''}://${settings.endPoint}`;
  return `${host}/${settings.bucket}/${filename}`
}

export function isValidSettings(settings: ObsidianMinioPluginSettings) {
  let check = true;
  const { accessKey, secretKey, endPoint, bucket } = settings;
  if (accessKey == '' || secretKey == '' || endPoint == '' || bucket == '') {
    new Notice(`请填写相关配置！！！`);
    check = false;
  }
  return check;
}