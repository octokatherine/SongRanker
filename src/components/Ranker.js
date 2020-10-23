import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Text } from '../Base'
import Prioritizer from '../utils/prioritizer'

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
        result.data.albums.forEach((album) => {
          let tracks = album.tracks.items.map((i) => ({ ...i, image_url: album.images[0]?.url }))
          songList = [...songList, ...tracks]
        })
        const shuffledSongList = songList
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value)
        setSongs(shuffledSongList)
      })
      .catch((error) => console.log(error))
  }, [setSongs, albums])

  useEffect(() => {
    if (prioritizer == null && songs.length) {
      const items = [...songs]
      setPrioritizer(new Prioritizer(items, forceUpdate))
    }
  }, [songs, prioritizer])

  useEffect(() => {
    if (leftOption.current && rightOption.current) {
      leftOption.current.style.pointerEvents = 'auto'
      rightOption.current.style.pointerEvents = 'auto'
    }
    if (prioritizer?.done) {
      const list = []
      for (let i = prioritizer?.ranked.length - 1; i >= 0; i--) {
        list.push(prioritizer?.ranked[i])
      }
      setRankedList(list)
    }
  })

  useEffect(() => {
    if (prioritizer?.done) {
      setScreen('results')
    }
  }, [rankedList, prioritizer, setScreen])

  console.log(
    'prioritizer?.ranked :>> ',
    JSON.stringify(
      prioritizer?.ranked.map((r) => r.name),
      0,
      4
    )
  )
  const leftSong = prioritizer?.items[prioritizer?.current]
  const rightSong = prioritizer?.ranked[prioritizer?.middle]
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
              prioritizer.onClickCurrent()
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
              leftOption.current.style.pointerEvents = 'none'
              rightOption.current.style.pointerEvents = 'none'
              prioritizer.onClickMiddle()
            }}
          >
            <AlbumArtwork src={rightSong?.image_url} />
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
