import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'
// = ({ setScreen, songs, setSongs, albums, setRankedList, rankedList }) =>

class Ranker extends React.Component {
  constructor(props) {
    super(props)
    this.state = { leftSong: null, rightSong: null }
  }

  componentDidMount() {
    let albumIds = ''
    this.props.albums.forEach((a, idx) => {
      if (idx !== 0) {
        albumIds += ','
      }
      albumIds += a.id
    })
    axios
      .get(`/v1/albums?ids=${albumIds}&market=US`)
      .then((result) => {
        let songList = []
        result.data.albums.forEach((album, idx) => {
          let tracks = album.tracks.items.map((i) => ({ ...i, image_url: album.images[0]?.url }))
          songList = [...songList, ...tracks]
        })
        setSongs(songList)
      })
      .catch((error) => console.log(error))
  }

  render() {
    const { songs } = this.props
    const { leftSong, rightSong } = this.state
    return (
      <Container>
        <Heading>Choose a song</Heading>
        {songs.length && (
          <Options>
            <Option onClick={() => {}}>
              <AlbumArtwork src={leftSong?.image_url} />
              <TitleText>{leftSong?.name}</TitleText>
              <ArtistText>{leftSong?.artists[0].name}</ArtistText>
            </Option>
            <OrText>OR</OrText>
            <Option onClick={() => {}}>
              <AlbumArtwork src={leftSong?.image_url} />
              <TitleText>{rightSong?.name}</TitleText>
              <ArtistText>{rightSong?.artists[0].name}</ArtistText>
            </Option>
          </Options>
        )}
      </Container>
    )
  }
}

const Container = styled.div`
  padding: 16px;
  padding-top: 70px;
`

const Heading = styled.p`
  font-weight: bold;
  font-size: 24px;
  margin-top: 80px;
  margin-bottom: 80px;
  color: white;
`

const OrText = styled(Text)`
  transform: translateY(60px);
`

const AlbumArtwork = styled.img`
  height: 136px;
  width: 136px;
`

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 400px;
`

const Option = styled.div`
  max-width: 136px;
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

export default Ranker
