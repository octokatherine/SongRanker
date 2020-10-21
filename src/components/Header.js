import React from 'react'
import styled from 'styled-components'
const Logo = require('../images/logo.svg')

const FixedHeader = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.darkestGray};
  width: 100%;
  height: 52px;
  padding-left: 16px;
  padding-top: 16px;
  box-sizing: border-box;
  top: 0;
`

const Header = () => {
  return (
    <FixedHeader onClick={() => window.location.reload()}>
      <img src={Logo} alt="Rankify Logo" />
    </FixedHeader>
  )
}

export default Header
