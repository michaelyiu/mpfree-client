import React, { Component } from 'react';
import Playlist from './Playlist';

class Navigation extends Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        const { playlists } = this.props;
        
        return (
            <div className="navigation">
                <div className="library">YOUR LIBRARY</div>
                <div className="playlists">PLAYLISTS</div>
                {playlists.map(key => (
                    <Playlist 
                        key={key.id}
                        playlist={key} 
                        displaySongs={this.props.displaySongs}
                        playlists={playlists.id} />
                ))}
            </div>
        )
    }
}

export default Navigation;