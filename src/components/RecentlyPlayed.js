import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
class RecentlyPlayed extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        
        const { dataTab } = this.props;

        return (
            <React.Fragment>
                {dataTab.items ? dataTab.items.map((key) => {
                    
                    return (
                        key.track ?
                            <li className="songtrack" key={key.id + uuidv1() }>
                                <div className="songName">{key.track.name}</div>
                                <div className="songArtists">
                                    {
                                        key.track.artists.map((artist, i) => 
                                            i > 0 ? ", " + artist.name : artist.name)
                                    }
                                </div>
                                <div className="songAlbum">{key.track.album.name}</div>
                                <div className="songDuration">{this.props.calcTime(Math.round(key.track.duration_ms / 1000))}</div>
                            </li> : null
                    )
                }) : null} 
            </React.Fragment>
        )
    }
}

export default RecentlyPlayed;