import { news } from './src/news'
import * as fs from 'fs';
var wavFileInfo = require('wav-file-info');
// import * as fetch from ;
const fetch = require('node-fetch')
const url = (text: string) => `http://localhost:5002/api/tts?text=${text}&speaker_id=&style_wav=`


function newsYield(items: any, i: number, meta: {duration: Array<any>}) {
    fetch(url(items[i]))
    .then((s: Response) => s.blob())
    .then((s: Blob) => s.arrayBuffer())
    .then((s: any) => {
      fs.writeFile(`./audio/t${i}.wav`, Buffer.from(new Uint8Array(s)), () => {
        if (i + 1 < news.length) {
          wavFileInfo.infoByFilename(`./audio/t${i}.wav`, function(err: any, info: any){
            console.log('duration', Math.ceil(info.duration));
            meta.duration.push(Math.ceil(info.duration));
          });
          items[i + 1] ? newsYield(items, i + 1, meta) : newsYield(items, i + 2, meta);
        } else {
          fs.writeFile('./audio/meta.json', JSON.stringify(meta), () => {});
        }
      });
    });
}

function main() {
  newsYield(news, 0, {duration: []});
}

const cps = main();
