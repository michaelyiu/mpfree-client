import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';

class Artists extends Component {


    render() {
        const { dataTab } = this.props;

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
                        key.id && key.name && key.images ?
                        <div className="single-artist" key={key.id + uuidv1()}>
                            <img className="single-artist-image" src={key.images[0].url} alt="" />
                            <div>{key.name}</div>
                        </div> : null
                    )
                }) : null} 
                </div>
            </React.Fragment>
        )
    }
}

export default Artists;