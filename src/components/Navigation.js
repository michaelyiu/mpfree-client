import React, { Component } from 'react';
import Playlist from './Playlist';
import LibraryItem from './LibraryItem';

class Navigation extends Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        const { playlists, libraryItem } = this.props;
        
        return (
            <div className="navigation">
                <div className="library">YOUR LIBRARY</div>
                {libraryItem.map((key, index) => {

                    return libraryItem.length === index + 1 
                    ? <LibraryItem
                        key={key}
                        item={key}
                        classToAdd={"library-item-last"}
                        displayContent={this.props.displayContent}

                    /> 
                    : <LibraryItem
                        key={key}
                        item={key}
                        classToAdd={"library-item"}
                        displayContent={this.props.displayContent}
                    />

                })}
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