import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'

const Ranker = ({ selectedItem, setScreen }) => {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    axios.get(`/v1/albums/${selectedItem.id}/tracks?market=US`).then((result) => {
      setSongs(result.data.items)
      console.log('tracks: ', result)
    })
  }, [])

  console.log('selectedItem :>> ', selectedItem)
  return (
    <Container>
      <Heading>Choose a song</Heading>
      {songs.length && (
        <Options>
          <div>
            <AlbumArtwork src={selectedItem.images[0]?.url} />
            <TitleText>{songs[0]?.name}</TitleText>
            <ArtistText>{songs[0]?.artists[0].name}</ArtistText>
          </div>
          <OrText>OR</OrText>
          <div>
            <AlbumArtwork src={selectedItem.images[0]?.url} />
            <TitleText>{songs[1]?.name}</TitleText>
            <ArtistText>{songs[1]?.artists[0].name}</ArtistText>
          </div>
        </Options>
      )}
    </Container>
  )
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
  transform: translateY(-30px);
`

const AlbumArtwork = styled.img`
  height: 136px;
  width: 136px;
`

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TitleText = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  color: white;
  margin-bottom: 5px;
`

const ArtistText = styled.p`
  font-style: italic;
  font-weight: normal;
  font-size: 12px;
  color: #8d9193;
`

export default Ranker
