import React, { Component } from 'react'
import Home from './Home'
import axios from 'axios'
import styled from 'styled-components'

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
      <Container className="App">
        {!this.state.token && (
          <Header className="App-header">
            <HeaderText>Login to Spotify to continue to Rankify</HeaderText>
            <Button
              onClick={() =>
                (window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  '%20'
                )}&response_type=token&show_dialog=true`)
              }
            >
              Login to Spotify
            </Button>
          </Header>
        )}
        {this.state.token && <Home token={this.state.token} />}
      </Container>
    )
  }
}
export default App

const Container = styled.div`
  padding: 16px;
`
const Button = styled.button`
  color: white;
  background-color: #1db954;
  border: none;
  width: 100%;
  height: 40px;
  border-radius: 40px;
  margin: auto;
  font-size: 16px;
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50%;
`
const HeaderText = styled.h3`
  text-align: center;
  margin-bottom: 40px;
`
