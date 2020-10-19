import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Header from './components/Header'
import Search from './components/Search'
import Ranker from './components/Ranker'
import Results from './components/Results'
import AlbumPicker from './components/AlbumPicker'

axios.defaults.baseURL = 'https://api.spotify.com'

const screens = {
  search: 'search',
  ranker: 'ranker',
  album_picker: 'album_picker',
  results: 'results',
}

const Home = () => {
  const [token, setToken] = useState(null)
  const [screen, setScreen] = useState(screens.search)
  const [selectedItem, setSelectedItem] = useState(null)
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [selectedAlbums, setSelectedAlbums] = useState([])
  const [rankedList, setRankedList] = useState([])

  useEffect(() => {
    let config = {
      headers: {
        Authorization: 'Basic ' + new Buffer(process.env.REACT_APP_CLIENTID).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const data = 'grant_type=client_credentials'
    axios
      .post('https://accounts.spotify.com/api/token', data, config)
      .then(function (response) {
        if (response.data) {
          const token = response.data.access_token
          setToken(token)
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  return (
    <div>
      <Header />
      {screen === screens.search && (
        <Search
          setScreen={setScreen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setSelectedAlbums={setSelectedAlbums}
        />
      )}
      {screen === screens.album_picker && (
        <AlbumPicker
          setScreen={setScreen}
          selectedItem={selectedItem}
          setAlbums={setAlbums}
          albums={albums}
          selectedAlbums={selectedAlbums}
          setSelectedAlbums={setSelectedAlbums}
        />
      )}
      {screen === screens.ranker && (
        <Ranker
          setScreen={setScreen}
          selectedItem={selectedItem}
          songs={songs}
          albums={selectedAlbums}
          setSongs={setSongs}
          rankedList={rankedList}
          setRankedList={setRankedList}
        />
      )}
      {screen === screens.results && <Results rankedList={rankedList} />}
    </div>
  )
}

export default Home
