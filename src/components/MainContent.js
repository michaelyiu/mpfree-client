import React, { Component } from 'react';
import Playlist from './Playlist';

class MainContent extends Component {
    constructor(props){
        super(props);
    }

    calcTime(duration){
        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;
        
        if (seconds.toString().length == 1){
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds
    }
    handleClick(selectedSong) {
        this.props.playSongAndDisplay(selectedSong);
        
    }
    render(){
        const { playlists, selectedPlaylist } = this.props;
        
        return (
            <React.Fragment>
                <div className="main-content">

                    {selectedPlaylist 
                    ?   
                    
                        selectedPlaylist.songs.map((song) => {
                        return (
                            <React.Fragment>
                                <div className="songtrack">
                                    <div className="playSong" onClick={() => this.handleClick(song.id)}><i class="far fa-play-circle"></i></div>
                                        {song.name + " " + song.artists.map(artist => artist.name) + " " + song.album + " " + this.calcTime(song.duration)}
                                    </div>
                            </React.Fragment>
                            
                    )}): null

                    }
                </div>
            </React.Fragment>

        )
    }
}

export default MainContent;