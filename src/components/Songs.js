import React, { Component } from 'react';

class Songs extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const { dataTab } = this.props;
        console.log(dataTab);
        
        return (
            <React.Fragment>
                <div className="info-container">                
                    <h2 className="main-container-songs">Songs</h2>
                    <button className="playlist-play play-button" onClick={this.handleClick}>PLAY</button>
                </div>
                <div className="playlist-search-container">
                    <i className="fas fa-search"></i>
                    <input className="playlist-search" type="text" placeholder="Filter" />
                </div>

                <li className="songtrack trackLabels">
                    <div className="playSong"></div>
                    <div className="songName">TITLE</div>
                    <div className="songArtists">ARTIST</div>
                    <div className="songAlbum">ALBUM</div>
                    <div className="songDuration"><i className="far fa-clock"></i></div>
                </li>

                
                {dataTab.items ? dataTab.items.map((key) => {
                    return (
                        key.track ? 
                            <li className="songtrack" key={key.id}>
                                <div className="songName">{key.track.name}</div>
                                <div className="songArtists">{key.track.artists.map((artist, i) => i > 0 ? ", " + artist.name : artist.name)}</div>
                                <div className="songAlbum">{key.track.album.name}</div>
                                <div className="songDuration">{this.props.calcTime(Math.round(key.track.duration_ms/1000))}</div>
                            </li> : null
                    )
                }) : null} 
            </React.Fragment>
        )
    }
}

export default Songs;