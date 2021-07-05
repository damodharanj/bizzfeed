import { useState, useEffect, useRef } from 'react';
import './style.css';
import logo from './logo.jpeg';
import { Player } from '@remotion/player';
import { useCurrentFrame, interpolate, spring, Sequence, Img } from 'remotion';
import Lottie from 'lottie-react';
import { news } from './news';
import { Lottier, useLottie } from 'remotion-lottie';
import durationInfo from '../audio/meta.json';
import data from './stock.json';

const colors = ['purple', 'green', 'blue', 'red'];

const Title = ({ title, index }) => {
  const frame = useCurrentFrame();

  const scale = spring({
    fps,
    from: 0,
    to: 1,
    frame: frame
  });

  const boldDuration = (eachDuration * fps) / title.split(' ').length;

  return (
    <div className={"container"}>
      <div className={"card"} style={{ transform: `scale(${scale})`, fontSize: 100 }}>
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



export const comm = val => () => {
  const frame = useCurrentFrame();
	const uiref = useRef(null);

	useEffect(() => {
		if (uiref.current) {
			uiref.current.querySelector('svg').setAttribute('viewBox', '');
		}
	})
  return (
    <div>
      {val.map((n, i) => (
        <>
          <Sequence
            from={
              !n.length
                ? Math.floor(i / 2) * animationDuration * fps +
                  Math.ceil(i / 2) * eachDuration * fps
                : (i / 2) * eachDuration * fps + i * 30
            }
            durationInFrames={!n.length ? 60 : eachDuration * fps}
          >
            {!n.length ? (
							<div ref={uiref} className={"svg-holder"} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
								<h1 style={{position: 'absolute', top: '60px', backgroundColor: 'white'}}>KiranDheep - Bizzfeed</h1>
								<Lottier
								stayAtLastFrame={true}
                // animationData={data}
								data={data}
              />
							</div>
            ) : (
              <Title title={n} index={i} />
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
