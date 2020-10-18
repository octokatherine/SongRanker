import React from 'react'
import styled from 'styled-components'
const Logo = require('../images/logo.svg')

const FixedHeader = styled.div`
  position: fixed;
  background-color: ${(props) => props.theme.darkestGray};
  width: 100vh;
  height: 52px;
  padding-left: 16px;
  padding-top: 16px;
  box-sizing: border-box;
`

const Header = () => {
  return (
    <FixedHeader>
      <img src={Logo} />
    </FixedHeader>
  )
}

export default Header
