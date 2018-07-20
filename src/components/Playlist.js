import React, { Component } from 'react';

class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state={
            condition: false
        }
    }

    handleClick = () => {
        this.setState({
            condition: !this.state.condition
        })
        this.props.displaySongs(this.props.playlist.id);

    }

    render() {
        const { playlist } = this.props;
        return (
            <React.Fragment>
                <div className={this.state.condition ? "playlist active" : "playlist"} onClick={() => this.props.displaySongs(this.props.playlist.id)}>{playlist.name}</div>
            </React.Fragment>
        )
    }
}

export default Playlist;