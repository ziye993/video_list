import { useEffect, useRef } from "react";

export default function Video(props) {
    const { videoSrc } = props;
    const vf = useRef();
    if (!videoSrc) {
        vf?.current?.pause();
    }

    useEffect(() => {
        const v = vf.current;
        if (vf) {
            // 页面加载时恢复视频状态
            const volume = localStorage.getItem('videoVolume');
            const playbackRate = localStorage.getItem('videoPlaybackRate');
            if (volume) {
                v.volume = parseFloat(volume);
            }
            if (playbackRate) {
                v.playbackRate = parseFloat(playbackRate);
            }

            function volumechange() {
                localStorage.setItem('videoVolume', v.volume);
            }
            function ratechange() {
                localStorage.setItem('videoPlaybackRate', v.playbackRate);
            }
            function keydown(event) {
                if (event.key === 'ArrowLeft') {
                    v.currentTime = Math.max(0, v.currentTime - 10);
                } else if (event.key === 'ArrowRight') {
                    v.currentTime = Math.min(v.duration, v.currentTime + 10);
                }
            }

            // 音量和倍速变化时保存到 localStorage
            v.addEventListener('volumechange', volumechange);
            v.addEventListener('ratechange', ratechange);
            // 按键控制视频进度
            document.addEventListener('keydown', keydown);
            return () => {
                v.removeEventListener('volumechange', volumechange);
                v.removeEventListener('ratechange', ratechange);
                document.removeEventListener('keydown', keydown)
            }
        }
    }, [videoSrc])
    return <div id="videoBox">
        <video id="videoItem" ref={vf} src={videoSrc} width="640" height="360" autoPlay={true} controls>
            <source src={videoSrc} autoPlay={true} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        {/* <div className="videoCtr">
            <div className="videoPlay"></div>
            <div className="videoPlay"></div>
        </div> */}
    </div>
}