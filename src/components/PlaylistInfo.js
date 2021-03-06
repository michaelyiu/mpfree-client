import React, { Component } from 'react';

class PlaylistInfo extends Component {
    // constructor(props) {
    //     super(props);
    // }

    calcPlaylistTime() {
        const { selectedPlaylist } = this.props;
        const totalSeconds = selectedPlaylist.songs.reduce((total, song) => {
            return total + song.duration;
        }, 0);

        // console.log(selectedPlaylist);
        
        // let minutes = Math.floor(duration / 60);
        // let seconds = duration % 60;

        // if (seconds.toString().length === 1) {
        //     seconds = "0" + seconds;
        // }

        // return minutes + ":" + seconds
        
        return this.secondsToHHMM(totalSeconds);
    }

    secondsToHHMM(duration) {
        let hours = Math.floor(duration / 3600);
        let minutes = Math.floor((duration - hours) % 60)

        return hours +  " hr " + minutes + " min";
    }   
    handleClick = () => {
        const allSongs = this.props.selectedPlaylist.songs.map((key) => {
            return key.uri;
        })
        
        this.props.onPlayRecentSongsClick(allSongs);
    }

    render() {
        const { selectedPlaylist } = this.props;
        
        return (
            <React.Fragment>
                <div className="playlist-image-container">
                    <img className="playlist-image" src={selectedPlaylist.imageUrl} alt=""/>
                    <div className="playlist-info">
                        <div>PLAYLIST</div>
                        <div className="playlist-name">{selectedPlaylist.name}</div>
                        <div className="playlist-name">Created by {selectedPlaylist.owner} · {selectedPlaylist.songs.length} songs, {this.calcPlaylistTime()}</div>
                        <button className="playlist-play" onClick={this.handleClick}>PLAY</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default PlaylistInfo;