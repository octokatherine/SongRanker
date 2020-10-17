import React, { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Home = ({ token, player }) => {
  // useEffect(() => {
  //   axios.put('/v1/me/player/play').then(function (response) {
  //     console.log(response)
  //   })
  // }, [])

  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={() => player.togglePlay()}>Play</button>
    </div>
  )
}

export default Home
