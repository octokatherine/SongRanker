import styled from 'styled-components'

const PrimaryButton = styled.button`
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-weight: 550;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: 40px;
  padding: 12px 32px;
  border: 0px;
  background-color: ${(props) => props.theme.primary};
  color: white;
  width: ${(props) => (props.block ? '100%' : null)};
`

const SecondaryButton = styled(PrimaryButton)`
  background-color: white;
  color: ${(props) => props.theme.primary};
`

const SpotifyButton = styled(PrimaryButton)`
  background-color: ${(props) => props.theme.spotifyGreen};
`

const Subheader = styled.p`
  font-size: 1.1em;
  color: white;
  font-weight: bold;
`

const Text = styled.p`
  color: white;
`

export { PrimaryButton, SecondaryButton, SpotifyButton, Subheader, Text }
