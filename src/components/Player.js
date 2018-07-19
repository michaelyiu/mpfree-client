import React, { Component } from 'react';

class Player extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { playlist } = this.props;
        return (
            <React.Fragment>
                <div className="player"></div>
            </React.Fragment>
        )
    }
}

export default Player;