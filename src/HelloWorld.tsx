import { useState, useEffect, useRef } from 'react';
import './style.css';
import logo from './logo.jpeg';
import { Player } from '@remotion/player';
import { Audio, useCurrentFrame, interpolate, spring, Sequence, Img, AbsoluteFill } from 'remotion';
import Lottie from 'lottie-react';
import { news } from './news';
import { Lottier, useLottie } from 'remotion-lottie';
import durationInfo from '../audio/meta.json';
import data from './stock.json';
import * as audios from '../audio/audio';


console.log(audios);

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
  const frame = useCurrentFrame();

  const scale = spring({
    fps,
    from: 0,
    to: 1,
    frame: frame
  });

  const boldDuration = (durationInfo.duration[index / 2] * fps) / title.split(' ').length;
  
  return (
    <div className={"container news-gradient"}>
      <div className={"card"} style={{ transform: `translateY(${scale})`, fontSize: 100 }}>
        <Img
          style={{ width: '300px', height: '100%' }}
          src={logo}
          alt=""
        />

        <div class="inner">
          {title.split(' ').map((w, i) => {
            return (
              <span
                style={{
                  fontWeight: i * boldDuration <= frame ? 'bold' : ''
                }}
                class="word"
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const eachDuration = 5;

export const animationDuration = 2;

export const sponser = 'https://damo.js.org/poong.png';

export const fps = 30;

const theme = '';

export const sumReduce = (sum : number, i: number) => {sum += i; return sum};

const itemDuration = (item: number) => durationInfo.duration.slice(0, item).reduce(sumReduce, 0);

console.log(itemDuration, durationInfo)

export const comm = val => () => {
  const frame = useCurrentFrame();
	const uiref = useRef(null);

	useEffect(() => {
		if (uiref.current) {
			uiref.current.querySelector('svg').setAttribute('viewBox', '');
		}
	})

  const as: any = audios;
  return (
    <div>
      <Intro/>
      {val.map((n, i) => (
        <>
          <Sequence
            from={
              !n.length
                ? Math.floor(i / 2) * animationDuration * fps +
                  itemDuration(Math.ceil(i / 2)) * fps + (2 * fps)
                : itemDuration(Math.ceil(i / 2)) * fps + i * fps + (2 * fps)
            }
            durationInFrames={!n.length ? animationDuration * fps : durationInfo.duration[i / 2] * fps}
          >
            {!n.length ? (
							<div ref={uiref} className={"svg-holder news-gradient-1"} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
								<h1 style={{position: 'absolute', top: '60px', backgroundColor: 'white'}}>KiranDheep - Bizzfeed</h1>
								<Lottier
								stayAtLastFrame={true}
								data={data}
              />
							</div>
            ) : (
              <>
              <Audio src={as[`t${i}`]} />
              <Title title={n} index={i} />
              </>
            )}
          </Sequence>
        </>
      ))}
      <div class="bottom">
        <div>Sponsered By</div>
        <img class="img" src={sponser} alt="" />
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
