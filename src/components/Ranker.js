import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'

function Comparison(g, l, gIndex, lIndex, clicked) {
  this.greater = g
  this.lesser = l
  this.greaterIndex = gIndex
  this.lesserIndex = lIndex
  this.clicked = clicked
}

const Ranker = ({ setScreen, songs, setSongs, albums }) => {
  const [ranked, setRanked] = useState([])
  const [comparisons, setComparisons] = useState([])
  const [highestIndex, setHighestIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [length, setLength] = useState(0)
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(songs)
    setLength(songs.length)
  }, [songs])

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

  const onSelectLeft = () => {
    compare(highestIndex, currentIndex, true)
  }

  const onSelectRight = () => {
    compare(currentIndex, highestIndex, true)
  }

  const rank = (index) => {
    if (length <= 0) return
    setRanked((prev) => [...prev, items[index]])
    setLength(items.length - 1)
    setItems((prev) => {
      const newState = prev
      newState.splice(index, 1)
      return newState
    })
    setHighestIndex(0)
    setCurrentIndex(1)
  }

  const greaterSearch = (comps, curr, target, i) => {
    var comp,
      found = false

    while (!found && i >= 0) {
      comp = comps[i]
      if (comp.greater === curr) {
        found = comp.lesser === target || greaterSearch(comps, comp.lesser, target, i)
      }
      i--
    }

    return found
  }

  const greaterThan = (aIndex, bIndex) => {
    return greaterSearch(comparisons, items[aIndex], items[bIndex], comparisons.length - 1)
  }

  const displayNext = () => {
    if (length < 1) {
      setScreen('results')
    } else if (currentIndex < length) {
      // check if a comparison can be inferred
      if (greaterThan(currentIndex, highestIndex)) {
        compare(currentIndex, highestIndex)
      } else if (greaterThan(highestIndex, currentIndex)) {
        compare(highestIndex, currentIndex)
      }
    } else {
      rank(highestIndex)
      displayNext()
    }
  }

  const compare = (hIndex, lIndex, clicked) => {
    var comp = new Comparison(items[hIndex], items[lIndex], hIndex, lIndex, clicked)
    setComparisons((prev) => [...prev, comp])

    if (hIndex !== highestIndex) {
      setHighestIndex(hIndex)
    }

    setCurrentIndex((prev) => prev + 1)
    displayNext()
  }

  const leftSong = items[highestIndex]
  const rightSong = items[currentIndex]

  console.log('ranked :>> ', ranked)
  console.log('highestIndex :>> ', highestIndex)
  console.log('currentIndex :>> ', currentIndex)
  console.log('length :>> ', length)
  console.log('items :>> ', items)
  console.log('length :>> ', length)
  console.log('comparisons :>> ', comparisons)
  return (
    <Container>
      <Heading>Choose a song</Heading>
      {songs.length && (
        <Options>
          <div onClick={onSelectLeft}>
            <AlbumArtwork src={leftSong?.image_url} />
            <TitleText>{leftSong?.name}</TitleText>
            <ArtistText>{leftSong?.artists[0].name}</ArtistText>
          </div>
          <OrText>OR</OrText>
          <div onClick={onSelectRight}>
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
