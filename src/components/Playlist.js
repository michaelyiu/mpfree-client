import React, { Component } from 'react';

class Playlist extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        this.props.displaySongs(this.props.playlist.id);
    }

    render() {
        const { playlist } = this.props;
        return (
            <React.Fragment>
                <div className="playlist" onClick={() => this.props.displaySongs(this.props.playlist.id)}>{playlist.name}</div>
            </React.Fragment>
        )
    }
}

export default Playlist;