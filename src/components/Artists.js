import React, { Component } from 'react';

class Artists extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const { dataTab } = this.props;
        console.log(dataTab);

        return (
            <React.Fragment>
                <div className="info-container">                
                    <h2 className="main-container-artists">Artists</h2>
                </div>
                <div className="playlist-search-container">
                    <i className="fas fa-search"></i>
                    <input className="playlist-search" type="text" placeholder="Filter" />
                </div>
                <div className="artists-wrapper">

                {dataTab.items ? dataTab.items.map((key) =>{
                    return (
                        key.id && key.name ?
                        <div className="single-artist">
                            <img className="single-artist-image" src={key.images[0].url} alt="" />
                            <div>{key.name}</div>
                            {/* <div>{key.album ? key.album.artists.map((artist, i) => i > 0 ? ", " + artist.name : artist.name) : null}</div> */}
                        </div> : null
                    )
                }) : null} 
                </div>
            </React.Fragment>
        )
    }
}

export default Artists;