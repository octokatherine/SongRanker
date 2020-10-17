import React, { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Home = ({ token }) => {
  useEffect(() => {
    // axios
    //   .get('/v1/artists/1vCWHaC5f2uS3yhpwWbIA6/albums?album_type=SINGLE&offset=20&limit=10')
    //   .then(function (response) {
    //     console.log(response)
    //   })
  }, [])

  return <h1>Welcome!</h1>
}

export default Home
