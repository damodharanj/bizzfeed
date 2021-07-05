import {Composition} from 'remotion';
import {comm, eachDuration, animationDuration, fps, sumReduce} from './HelloWorld';
import { news } from './news';
import durationInfo from '../audio/meta.json';
import {Logo} from './HelloWorld/Logo';
import {Subtitle} from './HelloWorld/Subtitle';
import {Title, } from './HelloWorld/Title';



export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="HelloWorld"
				component={comm(news)}
				durationInFrames={ durationInfo.duration.reduce(sumReduce, 0) * fps + news.length * fps}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					titleText: 'Welcome to Remotion',
					titleColor: 'black',
				}}
			/>
		</>
	);
};
