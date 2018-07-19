import React, { Component } from 'react';

class Player extends Component {
    constructor(props) {
        super(props);
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
        const { playing, selectedSong } = this.props;
        console.log(selectedSong);
        
        return (
            <React.Fragment>
                <div className="player">
                    <div className="songInfo">
                    {console.log(selectedSong)}
                    
                    {selectedSong ?
                        <React.Fragment>
                            <img src={selectedSong.image ? selectedSong.image.url : selectedSong.album.images[0].url} alt=""/>
                            <div className="artistInfo">
                                <div>{selectedSong.name}</div>
                                <div>{selectedSong.artists.map((artist, i) => {
                                        if(i>0){
                                            return ", " + artist.name;
                                        }
                                        else{
                                            return artist.name;
                                        }
                                    }
                                    )}
                                </div>
                            </div>
                        </React.Fragment>
                    : null
                    }
                    </div>
                    <div className="media-controls">
                        <div className="prev" onClick={() => this.handlePrev()}><i className="fas fa-step-backward"></i></div>  
                        <div className="play" onClick={() => this.handlePlay()}>{playing ? <i class="far fa-pause-circle"></i> : <i class="far fa-play-circle"></i>}</div>
                        <div className="next" onClick={() => this.handleNext()}><i className="fas fa-step-forward"></i></div>  
                    </div>
                    <div className="player-misc">
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Player;