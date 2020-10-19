import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'
import Prioritizer from '../utils/prioritizer'

function Comparison(g, l, gIndex, lIndex, clicked) {
  this.greater = g
  this.lesser = l
  this.greaterIndex = gIndex
  this.lesserIndex = lIndex
  this.clicked = clicked
}

const Ranker = ({ setScreen, songs, setSongs, albums }) => {
  const [prioritizer, setPrioritizer] = useState(null)
  const [, forceUpdate] = React.useState(0)

  useEffect(() => {
    albums.forEach((a) => {
      axios
        .get(`/v1/albums/${a.id}/tracks?market=US`)
        .then((result) => {
          const tracks = result.data.items.map((t) => ({ ...t, image_url: a.images[0]?.url }))
          setSongs((prev) => [...prev, ...tracks])
        })
        .catch((error) => console.log(error))
    })
  }, [])

  useEffect(() => {
    setPrioritizer(new Prioritizer(songs))
  }, [songs])

  console.log('prioritizer?.ranked :>> ', prioritizer?.ranked)
  const leftSong = prioritizer?.itemA
  const rightSong = prioritizer?.itemB
  return (
    <Container>
      <Heading>Choose a song</Heading>
      {songs.length && (
        <Options>
          <div
            onClick={() => {
              prioritizer.compare(prioritizer.highestIndex, prioritizer.currentIndex, true)
              forceUpdate((n) => !n)
            }}
          >
            <AlbumArtwork src={leftSong?.image_url} />
            <TitleText>{leftSong?.name}</TitleText>
            <ArtistText>{leftSong?.artists[0].name}</ArtistText>
          </div>
          <OrText>OR</OrText>
          <div
            onClick={() => {
              prioritizer.compare(prioritizer.currentIndex, prioritizer.highestIndex, true)
              forceUpdate((n) => !n)
            }}
          >
            <AlbumArtwork src={leftSong?.image_url} />
            <TitleText>{rightSong?.name}</TitleText>
            <ArtistText>{rightSong?.artists[0].name}</ArtistText>
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
  max-width: 400px;
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
