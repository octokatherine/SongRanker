import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Subheader, Text, PrimaryButton } from '../Base'
import axios from 'axios'

const DownIcon = require('../images/down.svg')
const MagnifyingGlassIcon = require('../images/magnify.svg')

var timerId

const searchTypes = ['artist', 'album']

const Search = ({ setScreen, selectedItem, setSelectedItem }) => {
  //artist or album
  const [searchType, setSearchType] = useState(searchTypes[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState(null)

  const getSearchResults = () => {
    axios.get(`/v1/search?q=${searchText}&type=${searchType}&limit=5`).then((response) => {
      console.log(response)
      setSearchResults(response.data[searchType + 's'].items)
    })
  }

  const onChange = (ev) => {
    setSearchText(ev.target.value)
    debounceFunction(getSearchResults, 300)
  }

  const debounceFunction = (func, delay) => {
    clearTimeout(timerId)
    timerId = setTimeout(func, delay)
  }

  const toggleShowDropdown = (ev) => {
    setShowDropdown((prev) => !prev)
    ev.stopPropagation()
  }

  return (
    <Container onClick={() => setShowDropdown(false)}>
      <Subheader>
        Search for an Artist, Album, or
        <br /> Playlist to begin ranking songs
      </Subheader>
      <SearchContainer>
        <Dropdown onClick={(ev) => toggleShowDropdown(ev)}>
          <Subheader>{searchType.charAt(0).toUpperCase() + searchType.slice(1)}</Subheader>
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
      {showDropdown && (
        <DropdownOptions>
          {searchTypes.map((s, idx) => (
            <DropdownOption
              key={idx}
              onClick={() => {
                setSearchType(s)
                setSearchResults(null)
                setSelectedItem(null)
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
        <PrimaryButton onClick={() => setScreen('ranking')} style={{ marginTop: '10px' }} block>
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
  margin-bottom: 1ch;
  border-radius: 10px;
  padding: ${(props) => (props.selected ? '1ch' : '0')} 2ch;
  background-color: ${(props) =>
    props.selected ? props.theme.darkestGray : props.theme.background};
`

export default Search
