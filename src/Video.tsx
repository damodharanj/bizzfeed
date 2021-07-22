import {Composition} from 'remotion';
import {comm, eachDuration, animationDuration, fps, sumReduce, Intro, news} from './HelloWorld';
import durationInfo from '../audio/meta.json';







export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="HelloWorld"
				component={comm(news)}
				durationInFrames={ durationInfo.duration.reduce(sumReduce, 0) * fps + news.length / 2 * (fps * animationDuration)}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					titleText: 'Welcome to Remotion',
					titleColor: 'black',
				}}
			/>
			<Composition
				id="Intro"
				component={Intro}
				durationInFrames={2 * 30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={
					new Date()
				}
			/>
		</>
	);
};
