import axios from 'axios'
import React, { Component } from 'react'
import styled from 'styled-components'
import { SpotifyButton } from './Base'
import Home from './Home'

axios.defaults.baseURL = 'https://api.spotify.com'
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
  'user-read-email',
  'user-read-private',
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
      deviceId: null,
    }
    this.playerCheckInterval = null
  }

  componentDidMount() {
    let _token = hash.access_token
    if (_token) {
      this.setState({
        token: _token,
      })
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + _token
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000)
    }
  }

  checkForPlayer() {
    if (window.Spotify) {
      clearInterval(this.playerCheckInterval)
      this.player = new window.Spotify.Player({
        name: 'Rankify Spotify Player',
        getOAuthToken: (cb) => {
          cb(this.state.token)
        },
      })

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => {
        console.error(message)
      })
      this.player.addListener('authentication_error', ({ message }) => {
        console.error(message)
      })
      this.player.addListener('account_error', ({ message }) => {
        console.error(message)
      })
      this.player.addListener('playback_error', ({ message }) => {
        console.error(message)
      })

      // Playback status updates
      this.player.addListener('player_state_changed', (state) => {
        console.log(state)
      })

      // Ready
      this.player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id)
        await this.setState({ deviceId: device_id })
        this.transferPlaybackHere()
      })

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id)
      })

      // Connect to the this.player!
      this.player.connect()
    }
  }

  transferPlaybackHere() {
    const { deviceId, token } = this.state
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: true,
      }),
    })
  }

  render() {
    return (
      <Container className="App">
        {!this.state.token && (
          <Header className="App-header">
            <HeaderText>Log in with Spotify to continue to Rankify</HeaderText>
            <audio
              ref="audio_tag"
              src="https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1?cid=774b29d4f13844c495f206cafdad9c86"
              controls
              autoPlay
            />
            <SpotifyButton
              onClick={() =>
                (window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  '%20'
                )}&response_type=token&show_dialog=true`)
              }
            >
              LOGIN WITH SPOTIFY
            </SpotifyButton>
          </Header>
        )}
        {this.state.token && <Home token={this.state.token} player={this.player} />}
      </Container>
    )
  }
}
export default App

const Container = styled.div`
  padding: 16px;
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
`
const HeaderText = styled.h3`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`
