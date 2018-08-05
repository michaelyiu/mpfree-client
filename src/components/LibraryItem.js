import React, { Component } from 'react';

class LibraryItem extends Component {
    // constructor(props) {
    //     super(props);
    // }

    

    render() {
        const { item, classToAdd } = this.props;
        
        return (
            <React.Fragment>
                { 
                    <div className={classToAdd} onClick={() => this.props.displayContent(item)}>{item}</div>
                    // <div className="playlist" onClick={() => this.props.displaySongs(this.props.playlist.id)}>{playlist.name}</div>
                }
            </React.Fragment>
        )
    }
}

export default LibraryItem;