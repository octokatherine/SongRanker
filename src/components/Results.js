import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Subheader, SpotifyButton, SecondaryButton, PrimaryButton, Text } from '../Base'
import axios from 'axios'

export const authEndpoint = 'https://accounts.spotify.com/authorize'
const redirectUri = 'https://katherinepeterson.github.io/rankify/'
const scopes = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'streaming',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
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

const Results = ({ rankedList, token, setToken, restart }) => {
  const [playlistUrl, setPlaylistUrl] = useState(null)

  useEffect(() => {
    let _token = hash.access_token
    if (_token) {
      setToken(_token)
    }
  }, [token, setToken])

  const createPlaylist = () => {
    axios
      .get('/v1/me', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        const userSpotifyId = response.data.id
        axios
          .post(
            `/v1/users/${userSpotifyId}/playlists`,
            { name: 'Rankify Results' },
            { headers: { Authorization: 'Bearer ' + token } }
          )
          .then((response) => {
            setPlaylistUrl(response.data.external_urls.spotify)
            const playlistId = response.data.id
            console.log('response :>> ', response)
            axios
              .post(
                `/v1/playlists/${playlistId}/tracks`,
                { uris: rankedList.map((s) => s.uri) },
                { headers: { Authorization: 'Bearer ' + token } }
              )
              .catch((err) => console.log(err))
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  }

  if (rankedList.length) {
    return (
      <Container>
        {!token ? (
          <LoginContainer>
            <InstructionText>
              Log in with Spotify to save your ranking to a playlist
            </InstructionText>
            <SpotifyButton
              onClick={() =>
                (window.location.href = `${authEndpoint}?client_id=f170a7aa1b8e4e11ae2e80cbbc695b31&redirect_uri=${redirectUri}&scope=${scopes.join(
                  '%20'
                )}&response_type=token&show_dialog=true`)
              }
            >
              LOG IN WITH SPOTIFY
            </SpotifyButton>
          </LoginContainer>
        ) : playlistUrl ? (
          <LoginContainer>
            <InstructionText>Playlist created!</InstructionText>
            <PrimaryButton
              onClick={() => {
                window.location.href = `${playlistUrl}`
              }}
            >
              Open Playlist
            </PrimaryButton>
          </LoginContainer>
        ) : (
          <LoginContainer>
            <InstructionText>Click below to save your ranking to a playlist</InstructionText>
            <PrimaryButton onClick={createPlaylist}>Create Spotify Playlist</PrimaryButton>
          </LoginContainer>
        )}
        <HeadingContainer>
          <Subheader style={{ margin: 0 }}>Your Ranking</Subheader>
          <StartOverButton onClick={restart}>START OVER</StartOverButton>
        </HeadingContainer>
        {rankedList.map((song, idx) => (
          <ResultItemContainer key={idx}>
            <RankText>#{idx + 1}</RankText>
            <ResultItem key={idx}>
              {song.image_url ? <ResultImage src={song.image_url} /> : <WhiteCircle />}
              <div>
                <TitleText>{song.name}</TitleText>
                <ArtistText>{song.artists[0].name}</ArtistText>
              </div>
            </ResultItem>
          </ResultItemContainer>
        ))}
      </Container>
    )
  } else {
    return null
  }
}

const Container = styled.div`
  padding: 16px;
  padding-top: 70px;
`

const ResultItemContainer = styled.div`
  display: flex;
  align-items: center;
`

const RankText = styled.p`
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
`

const ResultImage = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 2ch;
`

const WhiteCircle = styled.span`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: 2ch;
  background-color: white;
`

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  margin-bottom: 1ch;
  border-radius: 10px;
  padding: ${(props) => (props.selected ? '1ch' : '0')} 2ch;
`

const TitleText = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  color: white;
  margin-bottom: 0px;
`

const ArtistText = styled.p`
  font-style: italic;
  font-weight: normal;
  font-size: 12px;
  color: #8d9193;
  margin-top: 0.5em;
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InstructionText = styled.p`
  font-size: 14px;
  color: white;
`
const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-top: 32px;
`

const StartOverButton = styled(SecondaryButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  padding: 8px 32px;
  color: ${(props) => props.theme.background};
`
export default Results
