import React, { Component } from 'react';

class DailyMix extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const { dataTab } = this.props;
        console.log(dataTab);

        return (
            <React.Fragment>
                {/* <div className="songArtists">{song.artists.map((artist, i) => i > 0 ? ", " + artist.name : artist.name)}</div> */}

                <div>{dataTab.items ? dataTab.items.map((key) =>
                    key.name

                ) : null} </div>
            </React.Fragment>
        )
    }
}

export default DailyMix;