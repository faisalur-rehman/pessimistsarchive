import React from 'react'
import { NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'

import Typed from './Typed'

const HEADER = styled.header`
  /* position: sticky;
  top: 0; */
  display: flex;
  padding: 0 1em;
  gap: .5em;
  align-items: center;
  justify-content: flex-start;
  max-width: 100vw;
  overflow: auto;
  overflow-y: hidden;
  margin: 1em auto;
  border-radius: 1em;
  z-index: 2;
  font-size: .8em;
  background: var(--main-bg-alpha);
	backdrop-filter: blur(3px);
  .logo {
    width: 3em;
    height: auto;
  }
  @media (min-width: 42em) {
    margin: 1rem auto;
    font-size: 1em;
    .logo {
      width: 4em;
    }
  }
  .root:hover, .root:focus {
    background: transparent !important;
  }
  ::-webkit-scrollbar-track {
    background: #fff;
  }
  ::-webkit-scrollbar-thumb {
    background: #ff0;
    &:hover {
      background: #fff;
    }
  }
  img {
    vertical-align: middle;
  }
  h1 {
    font-size: 1.2em;
    font-weight: normal;
    margin: 0 .25em;
    padding: .5em;
    line-height: 1.8;
    display: inline-block;
    text-align: left;
    transform: rotate(-2.5deg);
    vertical-align: middle;
    mark {
      padding: .25em 0;
      background: #000;
      color: #fff;
      white-space: pre;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    display: inline-block;
    vertical-align: middle;
    padding: .5em;
    line-height: 1;
    padding-bottom: .3em;
    border-bottom: .2em solid #fff0;
    transition: .2s ease all;
    &.active {
      font-weight: bold;
      border-bottom-color: #08f;
    }
    &:hover, &:focus {
      color: #fff;
      background: #08f;
      cursor: pointer;
      transition: .1s ease all;
    }
    &.root {
      border-bottom: 0;
      &:hover, &:focus {
        transform: scale(1.1);
      }
    }
    &.mode {
      position: fixed;
      right: 0;
      top: 0;
      border-radius: 1em;
      transition: .1s ease all;
      &:hover, &:focus {
        background: var(--main-fg);
        transform: scale(1.5);
      }
    }
  }
`

const Emoji = styled.span`
  position: relative;
  display: inline-block;
  transform: scale(1.5);
`

// <Link exact to="/tweets">Tweets</Link>
function Header({ isDark, setDark }) {
  return (<HEADER>
    <span>
      <Link exact to="/favs"><Emoji>❤️</Emoji></Link>
      <Link exact to="/clippings">Archive</Link>
    </span>
    <Link exact to="/" className="root">
      <img className="logo" src="/logo.png" height={64} alt="" />
      <h1>
        <mark> <Typed text="Pessimists" /> </mark>
        <br />
        <mark> <Typed startAt={-9} text="Archive" /> </mark>
      </h1>
    </Link>
    <span>
      <Link exact to="/manifesto">Manifesto</Link>
      <Link exact to="/about">About</Link>
    </span>
  </HEADER>)
}

export default Header
