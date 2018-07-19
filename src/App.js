import React, { Component } from 'react';
import Navigation from './components/Navigation';
import MainContent from './components/MainContent';
import Player from './components/Player';
import 'reset-css/reset.css';
import './App.css';

let defaultTextColor = 'grey';
let defaultStyle={
  color: defaultTextColor,
  'font-family': 'Helvetica'
}
let counterStyle = {
  ...defaultStyle,
  width: "40%",
  display: 'inline-block',
  margin: '0 auto',
  'margin-bottom': '20px',
  'fontSize': '20px',
  'line-height': '30px',
  'textAlign': 'center'
}

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={counterStyle}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs);
    }, []);
    let totalDuration = Math.round(allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0) / 60)
    
    return (
      <div style={counterStyle}>
        <h2>{totalDuration} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{ color: defaultTextColor }}>
        <img src="" alt="" />
        <input type="text" onKeyUp={event =>
          this.props.onTextChange(event.target.value)} 
          style={{...defaultStyle, 
            color: 'black', 
            'font-size': '20px', 
            padding: '10px',
            margin: '20px'
          }}
            />
      </div>
    )
  }
}

// class Playlist extends Component {
//   render() {
//     let playlist = this.props.playlist;
//     return (
//       <div style={{...defaultStyle, 
//         display: 'inline-block', 
//         width: '25%',
//         padding: '10px',
//         // background: this.props.index % 2 ? '#C0C0C0' : '#808080' 
//       }}>
//         <img src={playlist.imageUrl} style={{width: '60px'}} alt="" />
//         <h3>{playlist.name}</h3>
//         <ul>
//           {playlist.songs.map(song =>
//             <li key={song.name}>{song.name}</li>
//           )}
//         </ul>
//       </div>
//     );
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
      selectedSong: null
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
    const selectedSong = selectedPlaylist ? selectedPlaylist.songs.find((song) => song.id === key) : null;
    console.log(selectedSong);
    
    // console.log(this.state.selectedPlaylist.uri);
    // const test = this.state.selectedPlaylist.uri.replace("user", "user:spotify:playlist");


    //cannot play from SDK, its much simpler
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + this.state.token },
      // 'offset': {'position': 5 },
      body: JSON.stringify({
        // "uris": ["spotify:track:3Vo4wInECJQuz9BIBMOu8i"]
        "context_uri": this.state.selectedPlaylist.uri,
        "offset": {"position": selectedSong.offset}
      })
    })
    .then(response => console.log(response))
      .then(data => {
    })




    this.setState({ selectedSong })
  }

  displaySongs = (key) => {
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
            songs: item.trackDatas
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
        console.log(data);
        
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


  onPrevClick = () => {
    this.player.previousTrack();
  }
  onPlayClick = () => {
    
    let playerEndpoint = `https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`
    
    if(this.state.deviceType === "Computer"){
      this.player.togglePlay();
    }
    else{
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + this.state.token }
      })
      .then(response => console.log(response))
        .then(data => {
      })
    }
  }
  onNextClick = () => {
    this.player.nextTrack();
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
              playSongAndDisplay={this.playSongAndDisplay}
            />
            <div className="filler"></div>
            <Player 
              playing={playing} 
              deviceType={deviceType} 
              onPrevClick={this.onPrevClick}
              onPlayClick={this.onPlayClick}
              onNextClick={this.onNextClick}
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
