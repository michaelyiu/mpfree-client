import React, { Component } from 'react';
import SoundSlider from './SoundSlider';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            shuffleActive: false,
            repeatActive: false
        })
    }
    handleRepeat(){
        let { repeatActive } = this.state
        repeatActive = !repeatActive;this.props.onRepeatClick();

        this.setState({
            repeatActive
        })
    }
    handleShuffle(){
        let { shuffleActive } = this.state
        shuffleActive = !shuffleActive;
        
        this.setState({
            shuffleActive
        })
        this.props.onShuffleClick();
    }
    handlePlay(){
        this.props.onPlayClick();
    }

    handleNext(){
        this.props.onNextClick();
    }

    handlePrev(){
        this.props.onPrevClick();
    }

    render() {
        const { playing, selectedSong, volume, volumeChange } = this.props;
        const { shuffleActive, repeatActive } = this.state;
        
        return (
            <React.Fragment>
                <div className="player">
                    <div className="songInfo">
                    
                    {selectedSong ?
                        <React.Fragment>
                            <img src={selectedSong.image ? selectedSong.image.url : selectedSong.album.images[0].url} alt=""/>
                            <div className="artistInfo">
                                <div>{selectedSong.name}</div>
                                <div>{selectedSong.artists.map((artist, i) => 
                                        i > 0 ? ", " + artist.name : artist.name
                                    )}
                                </div>
                            </div>
                        </React.Fragment>
                    : null
                    }
                    </div>
                    <div className="media-controls">
                        <div className={shuffleActive ? "shuffle control-active" : "shuffle"} onClick={() => this.handleShuffle()}><i className="fas fa-random"></i></div>
                        <div className="prev" onClick={() => this.handlePrev()}><i className="fas fa-step-backward"></i></div>  
                        <div className="play" onClick={() => this.handlePlay()}>{playing ? <i className="far fa-pause-circle"></i> : <i className="far fa-play-circle"></i>}</div>
                        <div className="next" onClick={() => this.handleNext()}><i className="fas fa-step-forward"></i></div>  
                        <div className={repeatActive ? "repeat control-active" : "repeat"} onClick={() => this.handleRepeat()}><i className="fas fa-redo"></i></div>
    
                    </div>
                    <div className="player-misc">
                        <SoundSlider 
                        volume={volume}
                        volumeChange={volumeChange}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Player;