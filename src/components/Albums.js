import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';

class Albums extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const { dataTab } = this.props;

        return (
            <React.Fragment>
                <div className="info-container">                

                    <h2 className="main-container-albums">Albums</h2>
                </div>
                <div className="playlist-search-container">
                    <i className="fas fa-search"></i>
                    <input className="playlist-search" type="text" placeholder="Filter" />
                </div>
                <div className="albums-wrapper">

                {dataTab.items ? dataTab.items.map((key) => {
                    
                    return (
                        key.album ?
                        <div className="single-album" key={ key.id + uuidv1() }> 
                            <img className="single-album-image" src={key.album.images[0].url} alt="" />
                            <div>{key.album ? key.album.name : null}</div>
                        <div>{key.album ? key.album.artists.map((artist, i) => i > 0 ? ", " + artist.name : artist.name) : null}</div>
                        </div> : null
                    )
                }) : null} 
                </div>
            </React.Fragment>
        )
    }
}

export default Albums;