import React, { Component } from 'react';
import PlaylistInfo from './PlaylistInfo';
import Songs from './Songs';
import Albums from './Albums';
import Artists from './Artists';
import RecentlyPlayed from './RecentlyPlayed';
import DailyMix from './DailyMix';

class MainContent extends Component {
    constructor(){
        super();
        this.state = { songList: null }
    }

    componentDidMount(){
        this.tabHandler(this.props.chosenTab)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.chosenTab !== this.props.chosenTab){
            this.tabHandler(nextProps.chosenTab)
        }
    }

    calcTime(duration){
        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;
        
        if (seconds.toString().length === 1){
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds
    }
    handleClick(selectedSong) {
        this.props.playSongAndDisplay(selectedSong);
        
    }

    tabHandler = (tab) => {
        console.log(tab);
        
        // if(tab == 'Songs'){
        //     this.props.songsAPICall(tab);
        // }
        // else if(tab == 'Albums'){
            this.props.songsAPICall(tab);
            
        // }
        // else if (tab == 'Artists') {
        //     this.props.songsAPICall(tab);
        // }
        // else if (tab == 'Recently Played') {
        //     this.props.songsAPICall(tab);
        // }
        // else if (tab == 'Your Daily Mix') {
        //     this.props.songsAPICall(tab);
        // }
        // else{
        //     //dummy call..
        //     this.props.songsAPICall();

        // }
    }

    render(){
        const { selectedPlaylist, chosenTab } = this.props;
        
        return (
            <React.Fragment>
                <ul className="main-content">
                    {selectedPlaylist 
                    ?   
                    <React.Fragment>
                        <PlaylistInfo 
                            selectedPlaylist={selectedPlaylist}
                            onPlayClick={this.props.onPlayClick}
                        />
                        <div className="playlist-search-container">
                            <i className="fas fa-search"></i>
                            <input className="playlist-search" type="text" placeholder="Filter" />
                        </div>

                        <li className="songtrack trackLabels">
                            <div className="playSong"></div>
                            <div className="songName">TITLE</div>
                            <div className="songArtists">ARTIST</div>
                            <div className="songAlbum">ALBUM</div>
                            <div className="songDuration"><i className="far fa-clock"></i></div>
                        </li>
                        {selectedPlaylist.songs.map((song) => {
                        return (
                            <li className="songtrack" key={song.id}>
                                <div className="playSong" onClick={() => this.handleClick(song.id)}><i className="far fa-play-circle"></i></div>
                                <div className="songName">{song.name}</div>
                                <div className="songArtists">{song.artists.map((artist, i) => i > 0 ? ", " + artist.name : artist.name)}</div>
                                <div className="songAlbum">{song.album}</div>
                                <div className="songDuration">{this.calcTime(song.duration)}</div>
                            </li>        
                            )}
                        )}

                    </React.Fragment>
                        : (chosenTab !== "" ? 
                            (
                                //only way for me to chain this crap.. holy.
                                (chosenTab === "Songs" ? <Songs dataTab={this.props.dataTab} calcTime={this.calcTime}/> 
                                : (chosenTab === "Albums" ? <Albums dataTab={this.props.dataTab} /> 
                                : (chosenTab === "Artists" ? <Artists dataTab={this.props.dataTab} />
                                            : (chosenTab === "Recently Played" ? <RecentlyPlayed dataTab={this.props.dataTab} calcTime={this.calcTime} /> 
                                : (chosenTab === "Your Daily Mix" ? <DailyMix dataTab={this.props.dataTab} /> : null)))))
                            )
                            : null)

                    }
                </ul>
            </React.Fragment>

        )
    }
}

export default MainContent;