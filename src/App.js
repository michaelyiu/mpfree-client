import React, { Component } from 'react';
import Navigation from './components/Navigation';
import MainContent from './components/MainContent';
import Player from './components/Player';
import 'reset-css/reset.css';
import './App.css';

// class PlaylistCounter extends Component {
//   render() {
//     return (
//       <div style={counterStyle}>
//         <h2>{this.props.playlists.length} playlists</h2>
//       </div>
//     );
//   }
// }

// class HoursCounter extends Component {
  
//   render() {
//     let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
//       return songs.concat(eachPlaylist.songs);
//     }, []);
//     let totalDuration = Math.round(allSongs.reduce((sum, eachSong) => {
//       return sum + eachSong.duration
//     }, 0) / 60)
    
//     return (
//       <div style={counterStyle}>
//         <h2>{totalDuration} hours</h2>
//       </div>
//     );
//   }
// }

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
      serverData: {},
      filterString: '',
      device_id: '',
      deviceType: null,
      playing: false,
      playlists: [],
      selectedPlaylist: null,
      selectedSong: null,
      shuffleState: false
    }
    this.playerCheckInterval = null;
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
    
    const { selectedPlaylist } = this.state;
    //selectedPlaylist almost always exists, but that doesnt mean it can find the song ID...
    const selectedSong = selectedPlaylist ? selectedPlaylist.songs.find((song) => song.id === key) : key;

    console.log(selectedSong);
    
    //cannot play from SDK, its much simpler
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + this.state.token },
        // 'offset': {'position': 5 },
        body: JSON.stringify({
          "context_uri": this.state.selectedPlaylist.uri,
          "offset": {"position": selectedSong.offset}
        })
      })



    this.setState({ selectedSong })
  }

  displaySongs = (key) => {
    console.log(key);
    
    const selectedPlaylist = this.state.playlists.find((playlist) => playlist.id === key)
    console.log(selectedPlaylist);

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

  componentDidMount() {
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
      console.log(playlists);
      
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
      .then(data => {
        const deviceId = data.devices.find((device) => device.type === "Smartphone") 
          ? data.devices.find((device) => device.type === "Smartphone").id : data.devices[0].id;
        const deviceType = data.devices.find((device) => device.type === "Smartphone")
          ? data.devices.find((device) => device.type === "Smartphone").type : data.devices[0].type;
        // console.log(data);
        
        // const deviceId = data.devices ? data.devices.find((device) => device.type === "Smartphone") : data.devices[0].id;
        // console.log(deviceId);
        
        

          this.setState({
            deviceType: deviceType
          })

      }
    );

    // fetch(endpoint + '/player', {
    //   headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
    // // }).then(response => response.json())
    // }).then(response => console.log(response))
    // .then(data => {
    //     // console.log(data);
    //   });



      this.setState({
        token: ACCESS_TOKEN
      }, )

      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }


  transferPlaybackHere(){
    const { deviceId, token } = this.state;
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
  }

  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      // const {
      //   current_track: currentTrack,
      //   position,
      //   duration,
      // } = state.track_window;
      // const trackName = currentTrack.name;
      // const albumName = currentTrack.album.name;
      // const artistName = currentTrack.artists
      //   .map(artist => artist.name)
      //   .join(", ");
      const playing = !state.paused;
      this.setState({
        // position,
        // duration,
        // trackName,
        // albumName,
        // artistName,
        playing
      });
    }
  }

  onShuffleClick = () => {
    let { shuffleState } = this.state;
    shuffleState = !shuffleState;
    fetch(`https://api.spotify.com/v1/me/player/shuffle?device_id=${this.state.deviceId}&state=${shuffleState}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + this.state.token },
      // 'offset': {'position': 5 },
      // body: JSON.stringify({
      //   "context_uri": this.state.selectedPlaylist.uri,
      //   "offset": { "position": selectedSong.offset }
      // })
    })
      .then(response => console.log(response))
      .then(data => {
      })

      this.setState({
        shuffleState
      })

  }

  onPrevClick = () => {
    
    // fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${this.state.deviceId}`, {
    //   method: 'POST',
    //   headers: { 'Authorization': 'Bearer ' + this.state.token },
    //   // 'offset': {'position': 5 },
    //   // body: JSON.stringify({
    //     //   "context_uri": this.state.selectedPlaylist.uri,
    //     //   "offset": { "position": selectedSong.offset }
    //     // })
    //   })
    //   .then(response => console.log(response))
    //   .then(data => {
    //   })
    this.player.previousTrack();
    this.updateCurrentlyPlaying();    
  }
  onPlayClick = () => {
    //might have to redo this one..
    // let playerEndpoint = `https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`
    let endpoint;
    
    this.state.playing ? endpoint = `https://api.spotify.com/v1/me/player/pause?device_id=${this.state.deviceId}` : endpoint = `https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`;
    // fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
      fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + this.state.token },
      })
      
      
      this.updateCurrentlyPlaying();    
      
    }
    
  updateCurrentlyPlaying(){
    let selectedSong;
    fetch(`https://api.spotify.com/v1/me/player/currently-playing?device_id=${this.state.deviceId}`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.state.token },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        selectedSong = {
          name: data.item.name,
          duration: Math.round(data.item.duration_ms / 1000),
          artists: data.item.artists,
          album: data.item.album.name,
          image: data.item.album.images[0],
          id: data.item.id,
          uri: data.item.uri,
          offset: data.offset
        }
        console.log(selectedSong);

        this.setState({ selectedSong })
        // }data.item;
      })
      // this.setState({})
  }
  
  onNextClick = () => {
    // this.onPlayClick();
    // this.onPlayClick();    
    // fetch(`https://api.spotify.com/v1/me/player/next?device_id=${this.state.deviceId}`, {
    //   method: 'POST',
    //   headers: { 'Authorization': 'Bearer ' + this.state.token },
    // })
    // .then(response => {
    //   response.json()
    // })
    this.player.nextTrack();
    this.updateCurrentlyPlaying();    
  }
  
  onRepeatClick = () => {
    let { repeatState } = this.state;
    repeatState = !repeatState;
    let repeat;
    repeatState ? repeat = "context" : repeat = "off";

    fetch(`https://api.spotify.com/v1/me/player/repeat?device_id=${this.state.deviceId}&state=${repeat}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + this.state.token },
      // 'offset': {'position': 5 },
      // body: JSON.stringify({
      //   "context_uri": this.state.selectedPlaylist.uri,
      //   "offset": { "position": selectedSong.offset }
      // })
    })
      .then(response => console.log(response))
      .then(data => {
      })
  }

  render() {
    const {
      playing,
      playlists,
      selectedPlaylist,
      selectedSong,
      deviceType
    } = this.state;
    
    let playlistToRender = 
      this.state.user && 
      this.state.playlists
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())
          let matchesSong = playlist.songs.filter(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()));
          return matchesPlaylist || matchesSong.length > 0
        }) : []
    return (
      <div className="App">
        {this.state.user && playlists ?
          


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
