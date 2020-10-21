import React from 'react'
import styled from 'styled-components'
import { Subheader } from '../Base'

const Results = ({ rankedList }) => {
  if (rankedList.length) {
    return (
      <Container>
        <Subheader>Your Ranking</Subheader>
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

export default Results
