import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'

const AlbumPicker = ({
  setScreen,
  selectedItem,
  setAlbums,
  albums,
  selectedAlbums,
  setSelectedAlbums,
}) => {
  useEffect(() => {
    axios
      .get(`/v1/artists/${selectedItem.id}/albums?market=US&include_groups=album`)
      .then((result) => {
        setAlbums(result.data.items)
      })
      .catch((error) => console.log(error))
  }, [])

  const toggleSelected = (a) => {
    setSelectedAlbums((prevState) => {
      const newState = [...prevState]
      if (newState.some((n) => n == a)) {
        newState.splice(newState.indexOf(a), 1)
      } else {
        newState.push(a)
      }
      return newState
    })
  }

  const onNext = () => {
    setScreen('ranker')
  }

  return (
    <Container>
      <Subheader>
        Select which albums to include
        <br /> in your ranking
      </Subheader>
      <WarningText>
        For best results, select at most one version of each album to avoid duplicate songs
      </WarningText>
      {albums.length && (
        <div>
          {albums.map((a, idx) => (
            <ResultItem
              onClick={() => toggleSelected(a)}
              key={idx}
              selected={selectedAlbums.includes(a) ? true : false}
            >
              {a.images[0] ? <ResultImage src={a.images[0].url} /> : <WhiteCircle />}
              <Text>{a.name}</Text>
            </ResultItem>
          ))}
        </div>
      )}
      {selectedAlbums.length ? (
        <PrimaryButton onClick={onNext} block>
          BEGIN RANKING
        </PrimaryButton>
      ) : null}
    </Container>
  )
}

const WarningText = styled(Text)`
  color: ${(props) => props.theme.lightBlue};
  font-size: 14px;
`

const Container = styled.div`
  padding: 16px;
  padding-top: 70px;
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
  background-color: ${(props) =>
    props.selected ? props.theme.darkestGray : props.theme.background};
`

export default AlbumPicker
