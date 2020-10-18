import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Subheader } from '../Base'

const DownIcon = require('../images/down.svg')
const MagnifyingGlassIcon = require('../images/magnify.svg')

const Search = () => {
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
          <SearchBar type="text" />
          <Magnify src={MagnifyingGlassIcon} />
        </SearchBarContainer>
      </SearchContainer>
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

export default Search
