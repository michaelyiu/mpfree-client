import React, { Component } from 'react';
import Playlist from './Playlist';

class Navigation extends Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        // console.log(this.props.playlists);
        const { playlists } = this.props;
        return (
            <div className="navigation">
                <div className="library">YOUR LIBRARY</div>
                <div className="playlists">PLAYLISTS</div>
                {playlists.map(key => (
                    <Playlist 
                        playlist={key} 
                        displaySongs={this.props.displaySongs}
                        playlists={this.props.playlists} />
                ))}
            </div>
        )
    }
}

export default Navigation;