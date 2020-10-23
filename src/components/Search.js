import axios from 'axios'
import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryButton, Subheader, Text } from '../Base'

const DownIcon = require('../images/down.svg')
const MagnifyingGlassIcon = require('../images/magnify.svg')

var timerId

const searchTypes = ['artist', 'album']

const Search = ({ setScreen, selectedItem, setSelectedItem, setSelectedAlbums }) => {
  //artist or album
  const [searchType, setSearchType] = useState(searchTypes[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState(null)

  const getSearchResults = () => {
    axios.get(`/v1/search?q=${searchText}&type=${searchType}&limit=5`).then((response) => {
      setSearchResults(response.data[searchType + 's'].items)
    })
  }

  const onChange = (ev) => {
    setSearchText(ev.target.value)
    if (!ev.target.value) {
      clearTimeout(timerId)
      setSearchResults(null)
    } else {
      debounceFunction(getSearchResults, 300)
    }
  }

  const debounceFunction = (func, delay) => {
    clearTimeout(timerId)
    timerId = setTimeout(func, delay)
  }

  const toggleShowDropdown = (ev) => {
    setShowDropdown((prev) => !prev)
    ev.stopPropagation()
  }

  const nextScreen = () => {
    if (searchType === 'album') {
      setSelectedAlbums([selectedItem])
      setScreen('ranker')
    } else {
      setScreen('album_picker')
    }
  }

  return (
    <Container onClick={() => setShowDropdown(false)}>
      <Subheader>Search for an Artist, Album, or Playlist to begin ranking songs</Subheader>
      <SearchContainer>
        <Dropdown onClick={(ev) => toggleShowDropdown(ev)}>
          <Subheader>{searchType.charAt(0).toUpperCase() + searchType.slice(1)}</Subheader>
          <Down src={DownIcon} />
        </Dropdown>
        <SearchBarContainer>
          <div>
            <Magnify src={MagnifyingGlassIcon} />
          </div>
          <SearchBar
            type="text"
            value={searchText}
            onChange={(ev) => {
              onChange(ev)
            }}
          />
        </SearchBarContainer>
      </SearchContainer>
      {showDropdown && (
        <DropdownOptions>
          {searchTypes.map((s, idx) => (
            <DropdownOption
              key={idx}
              onClick={() => {
                setSearchType(s)
                setSearchResults(null)
                setSelectedItem(null)
                setSearchText('')
              }}
              selected={searchType === s ? true : false}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </DropdownOption>
          ))}
        </DropdownOptions>
      )}
      {searchResults && (
        <div>
          {searchResults.map((item, idx) => (
            <ResultItem
              onClick={() => setSelectedItem(item)}
              key={idx}
              selected={selectedItem === item ? true : false}
            >
              {item.images[0] ? (
                <ResultImage src={item.images[0].url} type={searchType} />
              ) : (
                <WhiteCircle />
              )}
              <Text>{item.name}</Text>
            </ResultItem>
          ))}
        </div>
      )}
      {selectedItem && (
        <PrimaryButton
          onClick={nextScreen}
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            width: 'calc(100% - 30px)',
            transform: 'translateX(-50%)',
            maxWidth: '400px',
          }}
        >
          {searchType === 'album' ? 'BEGIN RANKING' : 'NEXT'}
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
  height: 30px;
  flex-grow: 1;
  margin-left: 12px;

  display: flex;
  justify-content: flex-start;

  border-radius: 15px;
  border: 1px #000 solid;
  padding: 0 5px;
  background-color: white;
`

const SearchBar = styled.input`
  width: 100%;
  border-radius: 0 15px 15px 0;
  border: none;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`

const Magnify = styled.img`
  top: 0px;
  left: 5px;
  /* z-index: 10; */
`

const Dropdown = styled.div`
  display: flex;
`

const Down = styled.img`
  margin-left: 0.5ch;
`

const DropdownOptions = styled.div`
  background-color: ${(props) => props.theme.darkestGray};
  width: 100px;
  height: 100px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const DropdownOption = styled(Text)`
  background-color: ${(props) => (props.selected ? props.theme.primary : props.theme.darkestGray)};
  margin: 0;
  padding-top: 16px;
  padding-bottom: 16px;
`

const ResultImage = styled.img`
  border-radius: ${(props) => (props.type === 'artist' ? '50%' : null)};
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

export default Search
