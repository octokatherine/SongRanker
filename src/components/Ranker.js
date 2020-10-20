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

const Ranker = ({ setScreen, songs, setSongs, albums, setRankedList, rankedList }) => {
  const leftOption = useRef(null)
  const rightOption = useRef(null)
  const [prioritizer, setPrioritizer] = useState(null)
  const [, forceUpdate] = React.useState(0)

  useEffect(() => {
    let albumIds = ''
    albums.forEach((a, idx) => {
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
  }, [])

  useEffect(() => {
    if (prioritizer == null && songs.length) {
      const items = [...songs]
      setPrioritizer(new Prioritizer(items, forceUpdate))
    }
  }, [songs])

  useEffect(() => {
    if (leftOption.current && rightOption.current) {
      console.log('clicks on')
      leftOption.current.style.pointerEvents = 'auto'
      rightOption.current.style.pointerEvents = 'auto'
    }
    if (prioritizer?.done) {
      setRankedList(prioritizer?.ranked)
    }
  })

  useEffect(() => {
    if (prioritizer?.done) {
      setScreen('results')
    }
  }, [rankedList])

  const leftSong = prioritizer?.itemA
  const rightSong = prioritizer?.itemB
  console.log('leftSong :>> ', leftSong)
  console.log('rightSong :>> ', rightSong)
  console.log('songs :>> ', songs)
  console.log('prioritizer?.ranked :>> ', prioritizer?.ranked)
  return (
    <Container>
      <Heading>Choose a song</Heading>
      {songs.length && (
        <Options>
          <Option
            ref={leftOption}
            onClick={() => {
              leftOption.current.style.pointerEvents = 'none'
              rightOption.current.style.pointerEvents = 'none'
              prioritizer.compare(prioritizer.highestIndex, prioritizer.currentIndex, true)
              console.log('click')
            }}
          >
            <AlbumArtwork src={leftSong?.image_url} />
            <TitleText>{leftSong?.name}</TitleText>
            <ArtistText>{leftSong?.artists[0].name}</ArtistText>
          </Option>
          <OrText>OR</OrText>
          <Option
            ref={rightOption}
            onClick={() => {
              console.log('click')
              console.log('clicks off')
              leftOption.current.style.pointerEvents = 'none'
              rightOption.current.style.pointerEvents = 'none'
              prioritizer.compare(prioritizer.currentIndex, prioritizer.highestIndex, true)
            }}
          >
            <AlbumArtwork src={leftSong?.image_url} />
            <TitleText>{rightSong?.name}</TitleText>
            <ArtistText>{rightSong?.artists[0].name}</ArtistText>
          </Option>
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
