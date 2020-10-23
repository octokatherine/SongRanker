import axios from 'axios'
import React, { Component } from 'react'
import styled from 'styled-components'
import { SpotifyButton } from './Base'
import Home from './Home'

axios.defaults.baseURL = 'https://api.spotify.com'
export const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientId = process.env.REACT_APP_CLIENTID
const redirectUri = 'http://songranker.com/'
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
    }
  }

  componentDidMount() {
    let config = {
      headers: {
        Authorization: 'Basic ' + new Buffer(clientId).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    const data = 'grant_type=client_credentials'

    axios.post('https://accounts.spotify.com/api/token', data, config).then(function (response) {})
  }

  render() {
    return (
      <Container className="App">
        {!this.state.token && (
          <Header className="App-header">
            <HeaderText>Log in with Spotify to continue to Rankify</HeaderText>
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
