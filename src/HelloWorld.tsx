import { useState, useEffect, useRef } from 'react';
import './style.css';
import logo from './logo.jpeg';
import { Player } from '@remotion/player';
import { Audio, useCurrentFrame, interpolate, spring, Sequence, Img, AbsoluteFill } from 'remotion';
import Lottie from 'lottie-react';
// import { news } from './';
import { Lottier, useLottie } from 'remotion-lottie';
import durationInfo from '../audio/meta.json';
import data from './stock.json';
import * as audios from '../audio/audio';
import {useAudioData, visualizeAudio} from '@remotion/media-utils'
const json = require('../input.json');

console.log(audios);

export const news = json.newsItems.map(x => [x.text, '']).flat().slice(0, -1);

console.log('news', news);

const colors = ['purple', 'green', 'blue', 'red'];

export const delay = (seconds: number) => seconds * fps;

export const opacityAnimation = (frame: number, delayTime: number) => spring({
  fps,
  from: 0,
  to: 1,
  frame: frame - delay(delayTime),
  config: {
    damping: 200
  }
});

export const Intro = () => {
  const frame = useCurrentFrame();
  const titleanimation = opacityAnimation(frame, 0.25);
  const newsAnim = opacityAnimation(frame, 0.75);
  const date1 = new Date();
  return <Sequence
    from={0}
    durationInFrames={2 * 30}
  >
    <AbsoluteFill className='gradient' style={{justifyContent: 'center', alignItems: 'center', fontSize: 80, padding: 10, border: '40px solid black'}}>
      <div>
      <h1 style={{opacity: titleanimation}}>BizzFeed</h1>
      <div style={{opacity: newsAnim}}>{date1.getDate()}-{date1.getMonth() + 1}-{date1.getFullYear()}</div>
      </div>
    </AbsoluteFill>
  </Sequence>
  
}

const Title = ({ title, index }) => {
  
  const audioSrc: any = audios; 
  const frame = useCurrentFrame();
  // const audioData = useAudioData(`../audio/t${index}.wav`);
  let visualization;
  // if (audioData) { 
  //   visualization = visualizeAudio({
  //     fps,
  //     frame,
  //     audioData,
  //     numberOfSamples: 16,
  //   }) // [0.22, 0.1, 0.01, 0.01, 0.01, 0.02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  // }
  
  const scale = spring({
    fps,
    from: 0,
    to: 1,
    frame: frame
  });

  const boldDuration = (durationInfo.duration[index / 2] * fps) / title.split(' ').length;

  const zoom = interpolate(frame - 10, [0, parseInt(durationInfo.duration[index  / 2])], [1, 1.01]);

  console.log(json.newsItems, index)

  return (
    <div className={"container news-gradient"}>
      <Img style={{transform: `scale(${zoom})`, margin: 10, opacity: 0.1, position: 'absolute', height: '100%', width: '100%'}} src={json.newsItems[index / 2].img}></Img>
      <div className={"card"} style={{ transform: `translateY(${scale})`, fontSize: 90 }}>
        {/* <Img
          style={{ width: '300px', height: '100%' }}
          src={logo}
          alt=""
        /> */}

        <div className={"inner"}>
          {title.split(' ').map((w, i) => {
            return (
              <span
                style={{
                  fontWeight: i * boldDuration <= frame ? 'bold' : ''
                }}
                className={"word"}
              >
                {w}
              </span>
            );
          })}
        </div>
        {/* <div className={'news-gradient shadow'} style={{display: 'flex', justifyContent: 'center' , alignItems: 'center', backgroundColor: 'red', height: 120 , borderRadius: '20px' ,margin: '10px' ,padding: '20px'}}>
        {visualization ? visualization.map((v) => {
          return (
            <div style={{width: 20, margin: 5, height: 240 * v, backgroundColor: 'black'}} />
          )
        }): ''}
        </div> */}
        
      </div>
    </div>
  );
};

export const eachDuration = 5;

export const animationDuration = 1;

export const sponser = 'https://damo.js.org/poong.png';

export const fps = 30;

const theme = '';

export const sumReduce = (sum : number, i: number) => {sum += i; return sum};

const itemDuration = (item: number) => durationInfo.duration.slice(0, item).reduce(sumReduce, 0);

console.log(itemDuration, durationInfo)

const NewsItem = ({i, n, audioSrc, uiref, frame}: any) => {

  const calculateFrom = () => {
    const val = !n.length
    ? 
    Math.floor(i / 2) * animationDuration * fps + itemDuration(Math.ceil(i / 2)) * fps + (2 * animationDuration * fps)
    : itemDuration(Math.ceil(i / 2)) * fps + Math.floor(i / 2) * fps + (2 * animationDuration * fps)
    return val;
  }

  console.log(i, audioSrc);
  return <Sequence
      from={
        calculateFrom()
      }
      durationInFrames={!n.length ? animationDuration * fps : durationInfo.duration[i / 2] * fps}
    >
      {!n.length ? (
        <div ref={uiref} className={"svg-holder news-gradient-1"} style={{fontSize: 40, display: 'flex', backgroundImage: 'url(https://damo.js.org/poong.png)', justifyContent: 'center', alignItems: 'center'}}>
          <h1 style={{position: 'absolute', top: '60px'}}>KiranDheep - Bizzfeed</h1>
          <Lottier
          stayAtLastFrame={true}
          data={data}
        />
        </div>
      ) : (
        <>
        <Audio src={audioSrc[`t${i}`]} />
        <Title title={n} index={i} />
        </>
      )}
    </Sequence>
}

export const comm = val => () => {
  const frame = useCurrentFrame();
	const uiref = useRef(null);

	useEffect(() => {
		if (uiref.current) {
			uiref.current.querySelector('svg').setAttribute('viewBox', '');
		}
	})

  const audioSrc: any = audios; 
  // const audioData = useAudioData(music)
  return (
    <div>
      <Intro/>
      {val.map((n, i) => (
        <>
          <NewsItem n={n} i={i} audioSrc={audioSrc} uiref={uiref} frame={frame}></NewsItem>
        </>
      ))}
      <div class="bottom">
        <div>Sponsered By</div>
        <img class="img" src={logo} alt="" />
      </div>
    </div>
  );
};

export default function App() {
  const [newsI, setNews] = useState(news);
  const [typedItem, setTypedItem] = useState('');
  return (
    <div style={{ padding: '10px' }}>
      <Player
        controls={true}
        fps={fps}
        component={comm(newsI)}
        durationInFrames={
          Math.ceil(newsI.length / 2) * eachDuration * fps + newsI.length * 60
        }
        compositionHeight={500}
        compositionWidth={820}
      />
      <input
        type="text"
        onChange={e => {
          setTypedItem(e.target.value);
        }}
        value={typedItem}
      />
      <button
        label=""
        onClick={() => {
          setNews([typedItem, ...newsI]);
          setTypedItem('');
        }}
      >
        Add
      </button>
      <div style={{ overflow: 'scroll' }}>
        {newsI.map((n, i) => {
          return <div>{n}</div>;
        })}
      </div>
    </div>
  );
}
