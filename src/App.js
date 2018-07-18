import React, { Component } from 'react';
import './App.css';

let defaultTextColor = 'grey';
let defaultStyle={
  color: defaultTextColor
}
let fakeServerData = {
  user: {
    name: 'Monon',
    playlists: [
      {
        name: 'My Favourites',
        songs: [{ name: 'Finesse', duration: 1345 },
        { name: 'Attention', duration: 1231 },
        { name: 'We Dont talk Anymore', duration: 1414 },
        { name: 'Does It Feel', duration: 1544 },
        { name: 'Never Be The Same', duration: 1666 },
        { name: 'Thats What I Like', duration: 1141 }]
      },
      {
        name: 'Hmmm',
        songs: [{ name: 'Im Upset', duration: 2144 },
        { name: 'Gods Plan', duration: 1658 },
        { name: 'Perfect', duration: 1539 },
        { name: 'Girls Like You', duration: 1722 },
        { name: 'Without You', duration: 1485 },
        { name: 'Teacher', duration: 1598 }]
      },
      {
        name: 'Shocking',
        songs: [{ name: 'This Is America', duration: 1787 },
        { name: 'Done For Me', duration: 1555 },
        { name: 'Sit Still, Look Pretty', duration: 2155 },
        { name: 'Cake', duration: 2355 }]
      },
      {
        name: 'The Past',
        songs: [{ name: 'Despacito', duration: 1915 },
        { name: 'Bodak Yellow', duration: 1250 },
        { name: 'Wild Thoughts', duration: 1400 },
        { name: 'No Limit', duration: 1578 }]
      }]
  }
}

class PlaylistCounter extends Component {
  render() {
    return (
      <div className="aggregate" style={{ color: 'grey', width: "40%", display: 'inline-block', margin: '0 auto', 'textAlign': 'center' }}>
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
      <div style={{ color: 'grey', width: "40%", display: 'inline-block', margin: '0 auto', 'textAlign': 'center' }}>
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
          this.props.onTextChange(event.target.value)} />
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: '25%' }}>
        <img src={playlist.imageUrl} style={{width: '60px'}} alt="" />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li key={song.name}>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: '',
      device_id: '',
      playing: false
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

  checkForPlayer(){
    const { token } = this.state;
    // console.log(window.Spotify);
    
    if(window.Spotify != null){
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Michael Yiu's Spotify Player",
        getOAuthToken: cb => { cb(token); }
      });
      this.createEventHandlers();

      //finally connect!
      this.player.connect();
// console.log(this.player);

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
            .map(item => item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000
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
            songs: item.trackDatas.slice(0,3)
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
        let playerEndpoint = endpoint + `/player/play?device_id=${deviceId}`
        // console.log(deviceId);
        
        fetch(endpoint + `/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
        })
        .then(response => console.log(response))
          .then(data => {
            // console.log(data);
          })

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
        "play": true,
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


  onPrevClick(){
    this.player.previousTrack();
  }
  onPlayClick() {
    this.player.togglePlay();
  }
  onNextClick() {
    this.player.nextTrack();
  }

  render() {
    
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
        {this.state.user ?
          <div>
            <h1 style={{ color: 'grey', 'fontSize': '54px' }}>
              {this.state.user.name}'s Playlist
        </h1>
            <PlaylistCounter playlists={playlistToRender} />
            <HoursCounter playlists={playlistToRender} />
            <Filter onTextChange={text =>
              this.setState({ filterString: text })} />
            {playlistToRender.map(playlist =>
             <Playlist 
                key={playlist.imageUrl}
                playlist={playlist} />
            )}
          </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login'
              : 'https://mpfree-backend.herokuapp.com/login' }
          }
          style={{ padding: '20px', fontSize: '50px', marginTop: '20px' }}>Sign in with Spotify</button>
        }
        {this.state.deviceType === "Computer" 
          ? <div className="player-controls">
              <button onClick={() => this.onPrevClick()}>Previous</button>  
              <button onClick={() => this.onPlayClick()}>{this.state.playing ? "Pause" : "Play"}</button> 
              <button onClick={() => this.onNextClick()}>Next</button>  
            </div>
          : null }

      </div>
    );
  }
}

export default App;
