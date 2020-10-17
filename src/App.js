import React, { Component } from 'react'
import Home from './Home'
import axios from 'axios'

export const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientId = 'f170a7aa1b8e4e11ae2e80cbbc695b31'
const redirectUri = 'http://localhost:3000/'
const scopes = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'streaming',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'playlist-modify-private',
]

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=')
      initial[parts[0]] = decodeURIComponent(parts[1])
    }
    return initial
  }, {})
window.location.hash = ''

class App extends Component {
  constructor() {
    super()
    this.state = {
      token: null,
    }
  }

  componentDidMount() {
    let _token = hash.access_token
    if (_token) {
      this.setState({
        token: _token,
      })
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + _token
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                '%20'
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && <Home token={this.state.token} />}
        </header>
      </div>
    )
  }
}
export default App
