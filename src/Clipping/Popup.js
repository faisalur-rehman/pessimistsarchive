import React from 'react'
import { NavLink as Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import Page from './Page'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const BG = styled(Link)`
  position: absolute;
  height: 100%;
  width: 100%;
  perspective: 50vw;
  z-index: 2;
  background: #0006;
  backdrop-filter: blur(4px);
  transition: .5s ease all;
  animation: ${fadeIn} 1s;
  &:hover, &:focus {
    /* background: #0004; */
    backdrop-filter: blur(0);
  }
`

const POPUP = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  perspective: 50vw;
  z-index: 2;
  > article {
    flex-direction: column;
    max-height: 100vh;
    overflow: auto;
    background: var(--main-bg);
    color: var(--main-fg);
    box-shadow: .25em .25em .5em 0 #0008;
    z-index: 5;
    align-self: center;
    .image {
      max-height: 50vh;
    }
    > section.graphic {
      /* flex: 0; */
    }
  }
`

function Popup({ clipping, clippingsURL = '/clippings', ...props }) {
  return (<POPUP {...props}>
    <BG to={clippingsURL} />
    <Page clipping={clipping} />
  </POPUP>)
}

export default Popup
