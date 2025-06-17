import React, { useRef, useState } from 'react';

const VideoController = (props) => {
    const { videoSrc } = props;
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [hoverTime, setHoverTime] = useState(null);

    // 播放/暂停视频
    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    // 格式化时间为 MM:SS 格式
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 更新当前时间和总时长
    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
        if (!duration) setDuration(videoRef.current.duration);
    };

    // 拖动进度条
    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // 拖动音量
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
    };

    // 切换全屏
    const toggleFullscreen = () => {
        const videoContainer = document.getElementById('video-container');
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.error(`全屏请求错误: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // 显示速度菜单
    const toggleSpeedMenu = () => {
        setShowSpeedMenu(!showSpeedMenu);
    };

    // 设置播放速度
    const setSpeed = (speed) => {
        videoRef.current.playbackRate = speed;
        setPlaybackRate(speed);
        setShowSpeedMenu(false);
    };

    // 视频加载完成
    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    // 隐藏/显示控制栏
    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(window.controlTimeout);
        window.controlTimeout = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    // 视频结束时重置状态
    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div
            id="video-container"
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '64rem',
                margin: '0 auto',
                overflow: 'hidden',
                borderRadius: '0.75rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#000'
            }}
            onMouseMove={handleMouseMove}
        >
            {/* 视频播放器 */}
            {/* {props.children} */}
            <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                poster="https://picsum.photos/1280/720"
            ></video>

            {/* 居中播放按钮 */}
            {!isPlaying && (
                <div
                    style={{
                        position: 'absolute',
                        inset: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        transition: 'background-color 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'}
                    onClick={togglePlay}
                >
                    <div style={{
                        width: '5rem',
                        height: '5rem',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(22, 93, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'scale(1)',
                        transition: 'transform 0.3s ease'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <i className="fa-solid fa-play" style={{ color: '#fff', fontSize: '1.5rem' }}></i>
                    </div>
                </div>
            )}

            {/* 控制栏背景 */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '6rem',
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '0 1rem 0.5rem',
                    opacity: '0',
                    transition: 'opacity 0.3s ease',
                    pointerEvents: showControls ? 'auto' : 'none'
                }}
                className={showControls ? 'opacity-100' : 'opacity-0'}
            >
                {/* 进度条 */}
                <div style={{
                    position: 'relative',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                }}
                    onMouseLeave={() => setHoverTime(null)}
                >
                    <div style={{
                        height: '0.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                    }}>
                        <div
                            style={{
                                height: '100%',
                                backgroundColor: '#165DFF',
                                borderRadius: '0.5rem',
                                width: `${(currentTime / duration) * 100 || 0}%`
                            }}
                        ></div>
                    </div>

                    {/* 进度条悬停提示 */}
                    {hoverTime !== null && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '-2rem',
                                left: '0',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: '#fff',
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                transform: 'translateX(-50%)',
                                opacity: '0',
                                transition: 'opacity 0.2s ease',
                                left: `${(hoverTime / duration) * 100 || 0}%`
                            }}
                            className="opacity-100"
                        >
                            {formatTime(hoverTime)}
                        </div>
                    )}
                </div>

                {/* 控制按钮 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff'
                }}>
                    {/* 左侧控制区 */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {/* 播放/暂停按钮 */}
                        <button
                            style={{
                                color: '#fff',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#165DFF'}
                            onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                            onClick={togglePlay}
                        >
                            <i className={isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i>
                        </button>

                        {/* 音量控制 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            position: 'relative'
                        }}>
                            <button
                                style={{
                                    color: '#fff',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#165DFF'}
                                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                            >
                                {volume > 0.7 ? (
                                    <i className="fa-solid fa-volume-high"></i>
                                ) : volume > 0 ? (
                                    <i className="fa-solid fa-volume-low"></i>
                                ) : (
                                    <i className="fa-solid fa-volume-off"></i>
                                )}
                            </button>
                            <div style={{
                                width: '0',
                                opacity: '0',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }}
                                className="w-20 opacity-100"
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    style={{
                                        width: '100%',
                                        height: '0.5rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        borderRadius: '0.25rem',
                                        appearance: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>

                        {/* 倍速控制 */}
                        <div style={{
                            position: 'relative'
                        }}>
                            <button
                                style={{
                                    color: '#fff',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#165DFF'}
                                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                                onClick={toggleSpeedMenu}
                            >
                                <span>{playbackRate}x</span>
                            </button>

                            {/* 倍速菜单 */}
                            {showSpeedMenu && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '0',
                                    marginBottom: '0.5rem',
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    borderRadius: '0.25rem',
                                    padding: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    opacity: '0',
                                    transition: 'opacity 0.2s ease',
                                    zIndex: '10'
                                }}
                                    className="opacity-100"
                                >
                                    <ul style={{
                                        listStyle: 'none',
                                        margin: '0',
                                        padding: '0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}>
                                        <li><button onClick={() => setSpeed(0.5)} style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(22, 93, 255, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >0.5x</button></li>
                                        <li><button onClick={() => setSpeed(0.75)} style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(22, 93, 255, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >0.75x</button></li>
                                        <li><button onClick={() => setSpeed(1)} style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease',
                                            fontWeight: 'bold'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(22, 93, 255, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >1.0x</button></li>
                                        <li><button onClick={() => setSpeed(1.25)} style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(22, 93, 255, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >1.25x</button></li>
                                        <li><button onClick={() => setSpeed(1.5)} style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(22, 93, 255, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >1.5x</button></li>
                                        <li><button onClick={() => setSpeed(2)} style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'transparent',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(22, 93, 255, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >2.0x</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 右侧控制区 */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {/* 时间显示 */}
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            {formatTime(currentTime)} / {formatTime(duration || 0)}
                        </span>

                        {/* 全屏按钮 */}
                        <button
                            style={{
                                color: '#fff',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#165DFF'}
                            onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                            onClick={toggleFullscreen}
                        >
                            <i className="fa-solid fa-expand"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoController;  