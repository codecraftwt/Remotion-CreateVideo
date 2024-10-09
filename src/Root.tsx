import './tailwind.css';
import { Composition } from "remotion";
import { VideoWithEffects } from './Video/VideoWithEffects';


export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoWithEffects"
        component={VideoWithEffects}
        durationInFrames={1230}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
