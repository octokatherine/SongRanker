import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'
import axios from 'axios'

const DownIcon = require('../images/down.svg')
const MagnifyingGlassIcon = require('../images/magnify.svg')

var timerId

const Search = () => {
  //artist or album
  const [searchType, setSearchType] = useState('artist')
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const getSearchResults = () => {
    axios.get(`/v1/search?q=${searchText}&type=${searchType}&limit=5`).then((response) => {
      console.log(response)
      setSearchResults(response.data[searchType + 's'].items)
    })
  }

  const onChange = (ev) => {
    setSearchText(ev.target.value)
    debounceFunction(getSearchResults, 200)
  }

  const debounceFunction = (func, delay) => {
    clearTimeout(timerId)
    timerId = setTimeout(func, delay)
  }

  return (
    <Container>
      <Subheader>
        Search for an Artist, Album, or
        <br /> Playlist to begin ranking songs
      </Subheader>
      <SearchContainer>
        <Dropdown>
          <Subheader>Artist</Subheader>
          <Down src={DownIcon} />
        </Dropdown>
        <SearchBarContainer>
          <SearchBar
            type="text"
            value={searchText}
            onChange={(ev) => {
              onChange(ev)
            }}
          />
          <Magnify src={MagnifyingGlassIcon} />
        </SearchBarContainer>
      </SearchContainer>
      {searchResults && (
        <div>
          {searchResults.map((item, idx) => (
            <ResultItem
              onClick={() => setSelectedItem(item)}
              key={idx}
              selected={selectedItem == item ? true : false}
            >
              {item.images[0] ? <ArtistImage src={item.images[0].url} /> : <WhiteCircle />}
              <Text>{item.name}</Text>
            </ResultItem>
          ))}
        </div>
      )}
      {selectedItem && (
        <PrimaryButton style={{ marginTop: '10px' }} block>
          BEGIN RANKING
        </PrimaryButton>
      )}
    </Container>
  )
}

const Container = styled.div`
  padding: 16px;
  padding-top: 70px;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const SearchBarContainer = styled.div`
  position: relative;
  height: 30px;
  flex-grow: 1;
  margin-left: 12px;
`

const SearchBar = styled.input`
  border-radius: 15px;
  border: 1px #000 solid;
  padding: 5px 5px 5px 36px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`

const Magnify = styled.img`
  position: absolute;
  top: -3px;
  left: 5px;
  z-index: 10;
`

const Dropdown = styled.div`
  display: flex;
`

const Down = styled.img`
  margin-left: 0.5ch;
`

const ArtistImage = styled.img`
  border-radius: 50%;
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

export default Search
