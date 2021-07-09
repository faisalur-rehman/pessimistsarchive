import React from 'react'
// import { NavLink as Link } from 'react-router'
import styled from 'styled-components'

import archive from './data/archive'
import ClippingLink from './Clipping/Link'

const HEARTS_KEY = 'hearts'

const Hearts = {
  get: () => JSON.parse(localStorage.getItem(HEARTS_KEY)) || [],
  add: heart => localStorage.setItem(HEARTS_KEY, JSON.stringify([...Hearts.get(), heart])),
  del: heart => localStorage.setItem(HEARTS_KEY, JSON.stringify(Hearts.get().filter(h => h !== heart)))
}

const LIST = styled.article`
  flex: 0;
`

function Fav({ id }) {
  const [, year, index] = id.split('-')
  if (!year || !index) return null
  let card = archive.clips.year[year][index]
  return <ClippingLink to={card.categoryURL || card.localURL} record={card} />
}

function Favs() {
  const hearts = Hearts.get()
  return (<LIST>
    {hearts.map(heart => <Fav id={heart} />)}
  </LIST>)
}

export default Favs
