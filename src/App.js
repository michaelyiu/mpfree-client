import React, { Component } from 'react';
import Navigation from './components/Navigation';
import MainContent from './components/MainContent';
import Player from './components/Player';
import 'reset-css/reset.css';
import './App.css';

// class Filter extends Component {
//   render() {
//     return (
//       <div style={{ color: defaultTextColor }}>
//         <img src="" alt="" />
//         <input type="text" onKeyUp={event =>
//           this.props.onTextChange(event.target.value)} 
//           style={{...defaultStyle, 
//             color: 'black', 
//             'font-size': '20px', 
//             padding: '10px',
//             margin: '20px'
//           }}
//             />
//       </div>
//     )
//   }
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      baseUrl: 'https://api.spotify.com/v1/me/player',
      device_id: '',
      deviceType: null,
      filterString: '',
      playlists: [],
      playing: false,
      selectedPlaylist: null,
      selectedSong: null,
      shuffleState: false,
      volume: 50,
      // serverData: {},
    }
    this.playerCheckInterval = null;
    this.updateCurrentlyPlaying = this.updateCurrentlyPlaying.bind(this);
  }
   createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      // this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));

    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }

  playSongAndDisplay = (key) => {
    
    const { selectedPlaylist, deviceId, token, baseUrl } = this.state;
    //selectedPlaylist almost always exists, but that doesnt mean it can find the song ID...
    const selectedSong = selectedPlaylist ? selectedPlaylist.songs.find((song) => song.id === key) : key;

      fetch(`${baseUrl}/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        // 'offset': {'position': 5 },
        body: JSON.stringify({
          "context_uri": selectedPlaylist.uri,
          "offset": {"position": selectedSong.offset}
        })
      })

    this.setState({ selectedSong })
  }

  displaySongs = (key) => {
    const selectedPlaylist = this.state.playlists.find((playlist) => playlist.id === key)
    this.setState({ selectedPlaylist })
  }

  checkForPlayer(){
    const { token } = this.state;
    
    if(window.Spotify != null){
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Michael Yiu's Spotify Player",
        getOAuthToken: cb => { cb(token); }
      });
      this.createEventHandlers();

      //finally connect!
      this.player.connect();

    }
  }


  detectDesktop(){
    if(window.innerWidth <= 1000 && window.innerHeight <= 700){
      return true;
    } else {
      return false;
    }
  }

  async componentDidMount() {
    const url_string = window.location;
    const url = new URL(url_string);
    const ACCESS_TOKEN = url.searchParams.get("access_token");
  
    if (!ACCESS_TOKEN)
      return;


      
    const endpoint = 'https://api.spotify.com/v1/me';
    fetch(endpoint, {
      headers: {'Authorization' : 'Bearer ' + ACCESS_TOKEN}
    }).then(response => response.json())
    .then(data => this.setState({ 
      user: {
        name: data.display_name
      }
    }));


    fetch(endpoint + "/playlists", {
      headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items;
      // console.log(playlists);
      
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {
            'Authorization': 'Bearer ' + ACCESS_TOKEN
          }
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise;
      })
      let allTracksDataPromises = 
        Promise.all(trackDataPromises);
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map((item) => item.track)
            .map((trackData, offset) => ({
              name: trackData.name,
              duration: Math.round(trackData.duration_ms / 1000),
              artists: trackData.artists,
              album: trackData.album.name,
              image: trackData.album.images[0],
              id: trackData.id,
              uri: trackData.uri,
              offset: offset
            }))
          })
        return playlists;
      })
      
      return playlistsPromise;

    })
      .then(playlists => this.setState({ 
        playlists: playlists.map(item => {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            uri: item.uri,
            id: item.id,
            songs: item.trackDatas,
            owner: item.owner.display_name
          }
        })
      }))


      
      
      
      
      // const endpoint = 'https://api.spotify.com/v1/me';
      fetch(endpoint + '/player/devices', {
        headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
      }).then(response => response.json())
      .then(async data => {
        const deviceId = data.devices.find((device) => device.type === "Smartphone") 
          ? data.devices.find((device) => device.type === "Smartphone").id : data.devices[0].id;
        const deviceType = data.devices.find((device) => device.type === "Smartphone")
          ? data.devices.find((device) => device.type === "Smartphone").type : data.devices[0].type;
        

          this.setState({
            deviceType: deviceType
          })
          
        }
      );

      
      
      this.setState({
        token: ACCESS_TOKEN
      }, )
      
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
    
    
    async transferPlaybackHere(){
      const { deviceId, token, volume, baseUrl } = this.state;
      fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "device_ids": [deviceId],
          "play": false,
        }),
      });
      
      await fetch(`${baseUrl}/volume?volume_percent=${volume}&device_id=${deviceId}`, {
        method: "PUT",
        headers: { 'Authorization': 'Bearer ' + token }
      })
      // .then(response => response.json())
      .then(data => {
        console.log(data);
  
      })
      
      
    }
    
    onStateChanged(state) {
      // if we're no longer listening to music, we'll get a null state.
      if (state !== null) {
        const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      // console.log(currentTrack);
      
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    }
  }

  onShuffleClick = () => {
    let { shuffleState, baseUrl } = this.state;
    shuffleState = !shuffleState;
    fetch(`${baseUrl}/shuffle?device_id=${this.state.deviceId}&state=${shuffleState}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + this.state.token },
    })
      .then(response => console.log(response))
      .then(data => {
      })

      this.setState({
        shuffleState
      })

  }

  onPrevClick = () => {
    const { baseUrl, deviceId, token } = this.state;

    this.setState({ previousSong: this.state.selectedSong })
    console.log(deviceId);
    

    
    fetch(`${baseUrl}/previous?device_id=${deviceId}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        
      })
    // this.player.previousTrack();
    this.updateCurrentlyPlaying();    
  }
  onPlayClick = () => {
    //might have to redo this one..
    const { baseUrl, token, deviceId } = this.state;

    let endpoint;
    
    this.state.playing ? 
      endpoint = `${baseUrl}/pause?device_id=${deviceId}` 
      : endpoint = `${baseUrl}/play?device_id=${deviceId}`;

      fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
      })
      
      
      this.updateCurrentlyPlaying();    
      
    }
    
  updateCurrentlyPlaying = () => {
    
    const { token, selectedSong, baseUrl } = this.state;
    console.log(selectedSong);
    
    let selectedTrack;
    let numTries = 0;
    const retryFetchUntilUpdate = () => {

      fetch(baseUrl, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
      })
      .then(response => response.json())
      .then(data => {
        if (numTries < 3){
          numTries+= 1;
          setTimeout(retryFetchUntilUpdate, 50)
        }else{
          selectedTrack = {
            name: data.item.name,
            duration: Math.round(data.item.duration_ms / 1000),
            artists: data.item.artists,
            album: data.item.album.name,
            image: data.item.album.images[0],
            id: data.item.id,
            uri: data.item.uri,
            offset: data.offset
          }
          this.setState({ selectedSong: selectedTrack })

          return;
        }
      })
    }
    retryFetchUntilUpdate();
  }
  
  onNextClick = () => {
    const { baseUrl, deviceId, token } = this.state;

    this.setState({ previousSong: this.state.selectedSong })
    // console.log(this.state.selected);
    
    console.log(this.state.previousSong);


    fetch(`${baseUrl}/next?device_id=${deviceId}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
    })
    .then(() => this.updateCurrentlyPlaying());  
  }
  
  onRepeatClick = () => {
    let { repeatState, deviceId, token, baseUrl } = this.state;
    repeatState = !repeatState;
    let repeat;
    repeatState ? repeat = "context" : repeat = "off";

    fetch(`${baseUrl}/repeat?device_id=${deviceId}&state=${repeat}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token },
    }).then(response => console.log(response))
      .then(data => {
      })
  }



  volumeChange = (vol) => {
    let { baseUrl, token, deviceId } = this.state;
    // console.log(vol);
    fetch(`${baseUrl}/volume?volume_percent=${vol}&device_id=${deviceId}`, {
      method: "PUT",
      headers: { 'Authorization': 'Bearer ' + token }
    })
      // .then(response => response.json())
      .then(data => {
        console.log(data);

      })
this.setState({
  volume: vol
})

  }

  render() {
    const {
      deviceType,
      playing,
      playlists,
      selectedPlaylist,
      selectedSong,
      volume,
      user
    } = this.state;
    
    // let playlistToRender = 
    //   this.state.user && 
    //   this.state.playlists
    //     ? this.state.playlists.filter(playlist => {
    //       let matchesPlaylist = playlist.name.toLowerCase().includes(
    //         this.state.filterString.toLowerCase())
    //       let matchesSong = playlist.songs.filter(song => song.name.toLowerCase()
    //         .includes(this.state.filterString.toLowerCase()));
    //       return matchesPlaylist || matchesSong.length > 0
    //     }) : []
    return (
      <div className="App">
        {user && playlists ?
          

          <React.Fragment>
            <Navigation 
              playlists={playlists}
              displaySongs={this.displaySongs}  
            />
            <MainContent 
              playlists={playlists} 
              selectedPlaylist={selectedPlaylist} 
              onPlayClick={this.onPlayClick}
              playSongAndDisplay={this.playSongAndDisplay}
            />
            <div className="filler"></div>
            <Player 
              playing={playing} 
              deviceType={deviceType} 
              onShuffleClick={this.onShuffleClick}
              onPrevClick={this.onPrevClick}
              onPlayClick={this.onPlayClick}
              onNextClick={this.onNextClick}
              onRepeatClick={this.onRepeatClick}
              selectedSong={selectedSong}
              volume={volume}
              volumeChange={this.volumeChange}
            />
          </React.Fragment> :
          <React.Fragment>
            <div className="loginContainer">
              <h1>Mike's Spotify Recreation</h1>
              <p>Hi! This app requires you to have a Spotify account. Please sign up for one on their website!</p>
              <p>This app currently does not support mobile. Sorry for the inconvenience!</p>
              <button className="login" onClick={() => {
                window.location = window.location.href.includes('localhost') 
                  ? 'http://localhost:8888/login'
                  : 'https://mpfree-backend.herokuapp.com/login' }
              }
              >SIGN IN WITH SPOTIFY</button>
            </div>
          </React.Fragment>

        //   <div>
        //     <h1 style={{ ...defaultStyle,
        //        'fontSize': '54px',
        //        'margin-top': '5px' }}>
        //       {this.state.user.name}'s Playlist
        // </h1>
        //     <PlaylistCounter playlists={playlistToRender} />
        //     <HoursCounter playlists={playlistToRender} />
        //     <Filter onTextChange={text =>
        //       this.setState({ filterString: text })} />
        //     {/* {playlistToRender.map(playlist =>
        //      <Playlist 
        //         key={playlist.imageUrl}
        //         playlist={playlist} />
        //     )} */}
        //   </div> : <button onClick={() => {
        //     window.location = window.location.href.includes('localhost') 
        //       ? 'http://localhost:8888/login'
        //       : 'https://mpfree-backend.herokuapp.com/login' }
        //   }
        //   style={{ padding: '20px', fontSize: '50px', marginTop: '20px' }}>Sign in with Spotify</button>
        // }
        // {this.state.deviceType === "Computer" 
        //   ? <div className="player-controls">
        //       <div className="prev" onClick={() => this.onPrevClick()}><i className="fas fa-step-backward"></i></div>  
        //       <div className="play" onClick={() => this.onPlayClick()}>{playing ? <i class="far fa-pause-circle"></i> : <i class="far fa-play-circle"></i>}</div> 
        //       <div className="next" onClick={() => this.onNextClick()}><i className="fas fa-step-forward"></i></div>  
        //     </div>
          // : null }
      }

      </div>
    );
  }
}

export default App;
