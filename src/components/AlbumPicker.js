import axios from 'axios'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { PrimaryButton, Subheader, Text } from '../Base'

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
      .get(`/v1/artists/${selectedItem.id}/albums?market=US&include_groups=album&limit=50`)
      .then((result) => {
        setAlbums(result.data.items)
      })
      .catch((error) => console.log(error))
  }, [setAlbums, selectedItem])

  const toggleSelected = (a) => {
    setSelectedAlbums((prevState) => {
      const newState = [...prevState]
      if (newState.some((n) => n === a)) {
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
        For best results, select at most one version of each album to avoid duplicate songs. The
        more albums you pick, the longer it will take to rank.
      </WarningText>
      {albums.length > 0 && (
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
      {selectedAlbums.length > 0 ? (
        <FixedButtonContainer>
          <PrimaryButton
            onClick={onNext}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              width: 'calc(100% - 30px)',
              transform: 'translateX(-50%)',
              maxWidth: '400px',
            }}
          >
            BEGIN RANKING
          </PrimaryButton>
        </FixedButtonContainer>
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
  padding-bottom: 80px;
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
  margin-bottom: 5px;
  border-radius: 10px;
  padding: 2px 10px;
  background-color: ${(props) =>
    props.selected ? props.theme.darkestGray : props.theme.background};
`
const FixedButtonContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  height: 80px;
  width: 100%;
  background-color: rgb(41, 41, 41, 0.93);
`

export default AlbumPicker
