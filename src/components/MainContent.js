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
                <ul className="main-content">
                    {selectedPlaylist 
                    ?   
                    <React.Fragment>
                        <li class="songtrack trackLabels">
                            <div className="playSong"></div>
                            <div className="songName">TITLE</div>
                            <div className="songArtists">ARTIST</div>
                            <div className="songAlbum">ALBUM</div>
                            <div className="songDuration"><i class="far fa-clock"></i></div>
                        </li>
                        {selectedPlaylist.songs.map((song) => {
                        return (
                            <li className="songtrack">
                                <div className="playSong" onClick={() => this.handleClick(song.id)}><i class="far fa-play-circle"></i></div>
                                <div className="songName">{song.name}</div>
                                <div className="songArtists">{song.artists.map(artist => artist.name)}</div>
                                <div className="songAlbum">{song.album}</div>
                                <div className="songDuration">{this.calcTime(song.duration)}</div>
                            </li>
                            
                            
                    )})}
                    </React.Fragment>
                    : null

                    }
                </ul>
            </React.Fragment>

        )
    }
}

export default MainContent;