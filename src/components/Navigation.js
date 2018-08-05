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
                    // console.log(key);
                    
                    

                    return libraryItem.length === index + 1 
                    ? <LibraryItem
                        item={key}
                        classToAdd={"library-item-last"}
                        displayContent={this.props.displayContent}

                    /> 
                    : <LibraryItem
                        item={key}
                        classToAdd={"library-item"}
                        displayContent={this.props.displayContent}
                    />

                    // if(libraryItem.length === index + 1){
                    //     return (<div className="library-item-last">{key}</div>)    
                    // }
                    // else
                    //     return (<div className="library-item">{key}</div>)
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