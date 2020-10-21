import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AlbumPicker from './components/AlbumPicker'
import Header from './components/Header'
import Ranker from './components/Ranker'
import Results from './components/Results'
import Search from './components/Search'

axios.defaults.baseURL = 'https://api.spotify.com'

const screens = {
  search: 'search',
  ranker: 'ranker',
  album_picker: 'album_picker',
  results: 'results',
}

function useStickyState(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key)
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue
  })
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

const Home = () => {
  const [token, setToken] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [selectedAlbums, setSelectedAlbums] = useState([])
  const [rankedList, setRankedList] = useStickyState([])
  const [screen, setScreen] = useState(() => {
    return rankedList.length ? screens.results : screens.search
  })

  const restart = () => {
    setRankedList([])
    setScreen(screens.search)
  }

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
      {screen === screens.results && (
        <Results
          rankedList={rankedList}
          token={userToken}
          setToken={setUserToken}
          restart={restart}
        />
      )}
    </div>
  )
}

export default Home
