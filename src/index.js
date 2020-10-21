import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import Home from './Home'

const theme = {
  primary: '#4B89AC',
  lightBlue: '#ACE6F6',
  background: '#292929',
  darkestGray: '#1F1F1F',
  gray100: '#D7DBDC',
  gray200: '#8D9193',
  spotifyGreen: '#1DB954',
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
