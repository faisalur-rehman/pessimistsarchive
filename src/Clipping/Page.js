import React, { useState, useEffect, useRef } from 'react'
import { NavLink as Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import HeartableLink from '../HeartableLink'
// import Typed from '../Typed'

const slideIn = keyframes`
  from {
    max-height: 0;
    justify-content: stretch;
    overflow: clip;
  }
  to {
    max-height: 200vh;
  }
`

function elipsis(text, length) {
  return text.slice(0, length) + (text.length > length ? '...' : '')
}

const ARTICLE = styled.article`
  text-align: center;
  transition: .5s ease all;
  transform: scale(1);
  transform-origin: middle;
  animation: ${slideIn} 4s;
  overflow: auto;
  box-sizing: border-box;
  max-width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-self: flex-start;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  section {
    position: relative;
    &.text {
      max-width: 36rem;
      margin: auto;
    }
    &.graphic {
    }
    > button {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
      font-size: 1.5rem;
      &.left {
        right: auto;
        left: 0;
      }
    }
  }
  .close {
    border-radius: 50%;
    color: #888;
    font-weight: bold;
    font-size: 2.5em;
    align-self: flex-start;
    width: 1em;
    height: auto;
    text-decoration: none;
    line-height: 1;
    cursor: pointer;
    transition: .2s ease all;
    transform: scale(.8);
    &:hover, &:focus {
      color: #f00;
      transform: scale(1);
    }
  }
  h1 {
    font-size: 1.5em;
    text-align: justify;
    display: flex;
    margin: 1rem auto;
    gap: .5em;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    a {
      color: inherit;
      text-decoration: none;
      &.icon {
        align-self: flex-start;
      }
      &.year {
        display: inline-block;
        align-self: flex-start;
        background: #888;
        padding: .25em;
        font-size: 1rem;
        line-height: 1;
        color: #fff;
        transition: .25s ease all;
        background: #08f;
        &:hover,
        &:focus {
          transform: scale(1.1);
        }
      }
    }
  }
  p {
    margin: 1rem;
    padding: 0;
    text-align: left;
  }
  h1, p {
    max-width: 42rem;
  }
  h1 {
    text-align: left;
    padding: 0 .5em;
  }
  a.src {
    max-width: 12em;
    display: inline-block;
    overflow: clip;
    text-overflow: ellipsis;
    text-decoration: none;
    white-space: nowrap;
    &:hover, &:focus {
      text-decoration: underline;
    }
  }
  .image {
    position: relative;
    max-width: 100vw;
    max-height: 100vh;
    margin: auto;
    overflow: auto;
    flex: 1;
    background: #eee;
  }
  .zoom {
    .graphic {
      max-height: none;
    }
    .image {
      max-height: none;
    }
    img {
      max-width: 100vw;
      height: auto;
      max-height: none;
    }
  }
  .graphic {
    max-height: 100vh;
    transition: 1s ease all;
  }
  img {
    transition: 1s ease all;
    background: #8882;
    margin: 0 auto;
    padding: 0;
    max-width: 100vw;
    height: auto;
    max-height: 16em;
    width: auto;
  }
`

const TITLE = styled(Link)`
  flex: 1;
  &:hover {
    text-decoration: underline;
  }
`

const NoImg = styled.span`
  padding: 1em;
  color: #0008;
  display: inline-block;
`

const numbers = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹'
}

const ShareSVG = styled.svg`
  cursor: pointer;
`

function ShareButton(props) {
  let size = 16
  let stroke = '#08f'
  return (<ShareSVG height={`${size}pt`} width={`${size}pt`} viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill={stroke} d="m453.332031 85.332031c0 38.292969-31.039062 69.335938-69.332031 69.335938s-69.332031-31.042969-69.332031-69.335938c0-38.289062 31.039062-69.332031 69.332031-69.332031s69.332031 31.042969 69.332031 69.332031zm0 0"/>
    <path fill={stroke} d="m384 170.667969c-47.0625 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.269531-85.332031 85.332031-85.332031s85.332031 38.273438 85.332031 85.332031c0 47.0625-38.269531 85.335938-85.332031 85.335938zm0-138.667969c-29.417969 0-53.332031 23.9375-53.332031 53.332031 0 29.398438 23.914062 53.335938 53.332031 53.335938s53.332031-23.9375 53.332031-53.335938c0-29.394531-23.914062-53.332031-53.332031-53.332031zm0 0"/>
    <path fill={stroke} d="m453.332031 426.667969c0 38.289062-31.039062 69.332031-69.332031 69.332031s-69.332031-31.042969-69.332031-69.332031c0-38.292969 31.039062-69.335938 69.332031-69.335938s69.332031 31.042969 69.332031 69.335938zm0 0"/>
    <path fill={stroke} d="m384 512c-47.0625 0-85.332031-38.273438-85.332031-85.332031 0-47.0625 38.269531-85.335938 85.332031-85.335938s85.332031 38.273438 85.332031 85.335938c0 47.058593-38.269531 85.332031-85.332031 85.332031zm0-138.667969c-29.417969 0-53.332031 23.9375-53.332031 53.335938 0 29.394531 23.914062 53.332031 53.332031 53.332031s53.332031-23.9375 53.332031-53.332031c0-29.398438-23.914062-53.335938-53.332031-53.335938zm0 0"/>
    <path fill={stroke} d="m154.667969 256c0 38.292969-31.042969 69.332031-69.335938 69.332031-38.289062 0-69.332031-31.039062-69.332031-69.332031s31.042969-69.332031 69.332031-69.332031c38.292969 0 69.335938 31.039062 69.335938 69.332031zm0 0"/>
    <path fill={stroke} d="m85.332031 341.332031c-47.058593 0-85.332031-38.269531-85.332031-85.332031s38.273438-85.332031 85.332031-85.332031c47.0625 0 85.335938 38.269531 85.335938 85.332031s-38.273438 85.332031-85.335938 85.332031zm0-138.664062c-29.417969 0-53.332031 23.933593-53.332031 53.332031s23.914062 53.332031 53.332031 53.332031c29.421875 0 53.335938-23.933593 53.335938-53.332031s-23.914063-53.332031-53.335938-53.332031zm0 0"/>
    <path fill={stroke} d="m135.703125 245.761719c-7.425781 0-14.636719-3.863281-18.5625-10.773438-5.824219-10.21875-2.238281-23.253906 7.980469-29.101562l197.949218-112.851563c10.21875-5.867187 23.253907-2.28125 29.101563 7.976563 5.824219 10.21875 2.238281 23.253906-7.980469 29.101562l-197.953125 112.851563c-3.328125 1.898437-6.953125 2.796875-10.535156 2.796875zm0 0"/>
    <path fill={stroke} d="m333.632812 421.761719c-3.585937 0-7.210937-.898438-10.539062-2.796875l-197.953125-112.851563c-10.21875-5.824219-13.800781-18.859375-7.976563-29.101562 5.800782-10.238281 18.855469-13.84375 29.097657-7.976563l197.953125 112.851563c10.21875 5.824219 13.800781 18.859375 7.976562 29.101562-3.945312 6.910157-11.15625 10.773438-18.558594 10.773438zm0 0"/>
  </ShareSVG>)
}

function Tweet() {
  let size = 24
  return (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <path fill="#08f" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
  </svg>)
}

const ZoomButton = styled.button`
  background: none;
  border: none;
  padding: .25em;
  transition: 1s ease-out all;
  &:hover, &:focus {
    transform: scale(1.5);
    transform-origin: top left;
    ${props => props.zoom && `
      transform: scale(.75);
      transform-origin: top left;
    `}
  }
`

const SHARE = styled.div`
  position: relative;
  ol {
    display: none;
    position: absolute;
    top: 100%;
    margin: 0;
    padding: 0;
    > li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
  ${props => props.isOpen && `
    ol {
      display: block;
    }
  `}
`

function Share({ children }) {
  const [isOpen, setOpen] = useState(false)
  return (<SHARE isOpen={isOpen}>
    <ShareButton title="Share" onClick={() => setOpen(!isOpen)} />
    <ol>
      {children}
    </ol>
  </SHARE>)
}

function Page({ clipping = {}, clippingsURL = '/clippings', ...props }) {
  const [zoom, setZoom] = useState(false)

  const myRef = useRef(null)
  const executeScroll = () => myRef.current.scrollIntoView()
  const executeFocus = () => myRef.current.focus()

  const { year } = clipping
  useEffect(() => {
    let oldTitle = document.title
    if (clipping.title && year) {
      executeScroll()
      executeFocus()
      document.title = `${year.toString().split('').map(year => numbers[year]).join('')} ${clipping.title} - Pessimists' Archive`
    }
    return () => {
      document.title = oldTitle
    }
  }, [clipping.title, year])
  if (!clipping.localURL) return null
  let host = global.location ? global.location.host : 'https://pessimistsarchive.netlify.com'
  return (<ARTICLE {...props}>
    <section className="text">
      <header>
        <h1>
          <span>
            {clipping.categories?.map(cat => <Link to={cat.url} className="icon">{cat.emoji}</Link>)}&nbsp;
            <TITLE ref={myRef} to={clipping.localURL} autoFocus>{clipping.title || <span style={{ color: '#888' }}>Untitled ({clipping.year})</span>}</TITLE>
          </span>
          {year > 0 ? <Link to={`${clippingsURL}/${year}`} className="year">{year}</Link> : null}
          <span>
            <Share>
              <li><a title="Tweet" href={`https://twitter.com/intent/tweet/?text=${clipping.title}&url=https://${host}${clipping.categoryURL || clipping.localURL}`} target="_blank" rel="noreferrer"><Tweet /></a></li>
            </Share>
          </span>
        </h1>
      </header>
      {clipping.desc ? <p>{clipping.desc}</p> : null}
      {clipping.attachments?.filter(a => !a.isUpload).length ? <p>Source: {clipping.attachments.filter(a => !a.isUpload).map(at => <a href={at.url} className="src" target="_blank" title={at.url} rel="noreferrer">{elipsis(at.url.slice(at.url.indexOf('://') + 3).replace('www.', ''), 16)}</a>)}</p> : null}
    </section>
    <section className={`graphic ${zoom && 'zoom'}`} key={clipping.id}>
      <HeartableLink url={clipping.id} />
      <ZoomButton className="left" title={`${zoom ? 'Shrink' : 'Enlarge'} image`} onClick={() => setZoom(!zoom)} zoom={zoom}>🔍</ZoomButton>
      <div className="image">
        {clipping.full ? <img alt={clipping.title} src={clipping.full} width={clipping.fullX} height={clipping.fullY} /> : <NoImg>No image</NoImg>}
      </div>
    </section>
  </ARTICLE>)
}

export default Page
