import {createHash} from 'node:crypto';
export const speechLocale=(locale:string)=>{const lang=locale.trim().replaceAll('_','-').toLowerCase().split('-')[0];return ["ar", "bg", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "hi", "hu", "id", "it", "ja", "ko", "lv", "lt", "pl", "pt", "ro", "ru", "sk", "sl", "es", "sv", "tr", "uk", "vi"].includes(lang)?lang:null;};
export const ttsHash=(text:string)=>createHash('sha256').update(text).digest('hex');
export const voice=(value:unknown,fallback='F1')=>typeof value==='string'&&/^[FM][1-5]$/.test(value)?value:/^[FM][1-5]$/.test(fallback)?fallback:'F1';
export function rawAudio(repository:string,path:string){return /^[-\w.]+\/[-\w.]+$/.test(repository)&&/^content\/audio\/[a-f0-9]{64}\.mp3$/.test(path)?`https://raw.githubusercontent.com/${repository}/main/${path}`:null;}
export type AudioEntry={postId:string;locale:string;voice:string;fullHash:string;textHash:string;fullPath:string;previewPath:string;version:string};
export function findAudio(entries:AudioEntry[],id:string,locale:string,voice:string,fullText:string){return speechLocale(locale)?entries.find(x=>x.postId===id&&x.locale===locale&&x.voice===voice&&x.fullHash===ttsHash(fullText)&&x.version==='supertonic3-v1'):undefined;}
