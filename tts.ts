import { news } from './src/news'
import * as fs from 'fs';
import {spawn, exec} from 'child_process';

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
  // newsYield(news, 0, {duration: []});
  console.log(process.env.HOME)
  execE(news, 0, {duration: []});
}

function execE(items: Array<any>, i: number, meta: {duration: Array<any>}) {
  const comm = exec(`docker run -e "HOME=$\{HOME\}" -v "$HOME:$\{HOME\}" -w "$\{PWD\}" --user "$(id -u):$(id -g)" "synesthesiam/coqui-tts:latest" --text "${items[i]}" --out_path $HOME/t${i}.wav`, (e, o, stderr) => {
    if (e) { console.log(e); return; }
    console.log(o);
    wavFileInfo.infoByFilename(`./audio/t${i}.wav`, function(err: any, info: any){
      console.log('duration', Math.ceil(info.duration));
      meta.duration.push(Math.ceil(info.duration));
      if (items[i + 1]) {
        execE(items, i + 1, meta);
      } else if (items[i + 2]) {
        execE(items, i + 2, meta);
      } else {
        console.log(meta);
        fs.writeFile('./audio/meta.json', JSON.stringify(meta), () => {});
        fs.writeFile('./audio/audio.ts', `${items.filter(i => i.length).map((item, i) => `import audio${2 * i} from './t${2 * i}.wav'; \n export const t${2 * i} = audio${2 * i};`).join('\n')}`, () => {});
      }
    });
  });
}

const cps = main();
