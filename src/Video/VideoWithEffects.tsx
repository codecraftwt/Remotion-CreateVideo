import { useEffect, useRef, useState } from 'react';
import { Video } from 'remotion';
const subtitles = require('../transcript.json');

export const VideoWithEffects: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [subtitleChunks, setSubtitleChunks] = useState<any[]>([]);
    const [isVideoRendered, setIsVideoRendered] = useState(false);

    const groupSubtitles = (subtitles: any[], groupSize: number) => {
        const filteredSubtitles = subtitles.filter((subtitle) => subtitle.type === 'word');
        const chunks = [];

        for (let i = 0; i < filteredSubtitles.length; i += groupSize) {
            const chunk = filteredSubtitles.slice(i, i + groupSize);
            const combinedStart = chunk[0].start;
            const combinedEnd = chunk[chunk.length - 1].end;
            const combinedText = chunk.map((sub) => sub.text).join(' ');
            const combinedEmoji = chunk.map((sub) => sub.emoji).join(' ');
            chunks.push({ start: combinedStart, end: combinedEnd, text: combinedText, emoji: combinedEmoji });
        }

        return chunks;
    };

    const getColorForGroup = (groupIndex: number) => {
        const colors = ['text-yellow-400', 'text-green-400', 'text-red-400'];
        return colors[groupIndex % colors.length];
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
            }
        }, 150);

        const chunks = groupSubtitles(subtitles, 4);
        setSubtitleChunks(chunks);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Set the video rendered flag to true when the component mounts
        setIsVideoRendered(true);
    }, []);

    return (
        <div className="relative w-full h-full">
            <Video
                ref={videoRef}
                src={require('../Assets/input.mp4')}
                className="w-full h-auto aspect-video"
                volume={1}
                loop
            />

            {subtitleChunks.map((chunk: any, index: number) => {
                const { start, end, text, emoji } = chunk;
                const isActive = currentTime >= start && currentTime <= end;

                const words = text.split(' ');
                const wordDuration = (end - start) / words.length;
                const groupColor = getColorForGroup(index);

                return (
                    isActive && (
                        <div key={index} className="absolute inset-x-0 top-2/3 flex justify-center">
                            <div className="w-11/12 max-w-[600px] overflow-hidden text-center">
                                <div className="flex justify-center flex-wrap">
                                    {words.map((word: string, wordIndex: number) => {
                                        const wordStart = start + wordIndex * wordDuration;
                                        const wordEnd = wordStart + wordDuration;

                                        return (
                                            <span
                                                key={wordIndex}
                                                className={`font-bold text-[3vw] uppercase transition-colors duration-500 ease-in-out mr-2 whitespace-nowrap ${currentTime >= wordStart && currentTime <= wordEnd ? groupColor : 'text-white'}`}
                                            >
                                                {word + ' '}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {isVideoRendered && (
                                <span className={`absolute text-[4vw] text-white ${isActive ? 'inline emoji-animation' : 'hidden'} top-3/4 left-1/2 transform -translate-x-1/2`}>
                                    {emoji}
                                </span>
                            )}
                        </div>
                    )
                );
            })}
        </div>
    );
};
