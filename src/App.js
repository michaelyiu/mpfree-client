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
      <div className="aggregate" style={{ color: 'grey', width: "40%", display: 'inline-block', margin: '0 auto', 'textAlign': 'center' }}>
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
        <img src={playlist.imageUrl} style={{width: '60px'}}alt="" />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
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
    }
  }

  componentDidMount() {
    const url_string = window.location;
    const url = new URL(url_string);
    const ACCESS_TOKEN = url.searchParams.get("access_token");
  
    if(!accessToken)
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
      .then(data => this.setState({ 
        playlists: data.items.map(item => {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
          }
        })
      }))
  }

  render() {
    let playlistToRender = this.state.user && this.state.playlists
     ? this.state.playlists
      .filter(playlist =>
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())
      ) : []
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
              <Playlist playlist={playlist} />
            )}
          </div> : <button onClick={() => window.location='http://localhost:8888/login'}
          style={{ padding: '20px', fontSize: '50px', marginTop: '20px' }}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
