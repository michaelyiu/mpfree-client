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
        const { playlist, playing } = this.props;
        return (
            <React.Fragment>
                <div className="player">
                    <div className="songInfo">

                    </div>
                    <div className="media-controls">
                        <div className="prev" onClick={() => this.handlePrev()}><i className="fas fa-step-backward"></i></div>  
                        <div className="play" onClick={() => this.handlePlay()}>{playing ? <i class="far fa-pause-circle"></i> : <i class="far fa-play-circle"></i>}</div> 
                        <div className="next" onClick={() => this.handleNext()}><i className="fas fa-step-forward"></i></div>  
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Player;