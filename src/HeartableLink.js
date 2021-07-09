import React, { useReducer } from 'react'
// import { NavLink as Link } from 'react-router'
import styled from 'styled-components'

const HEARTS_KEY = 'hearts'

const { localStorage } = global

const Storage = {
  get: (key) => JSON.parse(localStorage ? localStorage.getItem(key) : '[]') || [],
  set: (key, value) => localStorage ? localStorage.setItem(key, JSON.stringify(value)) : null
}

const Hearts = {
  get: () => Storage.get(HEARTS_KEY) || [],
  add: heart => Storage.set(HEARTS_KEY, [...Hearts.get(), heart]),
  del: heart => Storage.set(HEARTS_KEY, Hearts.get().filter(h => h !== heart))
}

const HEART = styled.button`
  background: none;
  border: 0;
  padding: .5em;
  line-height: 1;
  cursor: pointer;
  &:disabled {
    opacity: 1;
    color: inherit;
    cursor: default;
  }
`

const HEARTS = ['🤍', '❤️']
// const HEARTS = ['💔', '❤️']

function HeartableLink({ url, readonly = false, hideOff = false, children, ...props }) {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const hearts = Hearts.get()
  let isHearted = hearts.includes(url)
  let heart = HEARTS[isHearted ? 1 : 0]
  // let negHeart = HEARTS[isHearted ? 0 : 1]
  if (!isHearted && hideOff) return null
  function onClick() {
    isHearted ? Hearts.del(url) : Hearts.add(url)
    forceUpdate()
  }
  return <HEART onClick={onClick} disabled={readonly} title={!isHearted ? 'Save to Favorites' : 'Remove from Favorites'} {...props}>{heart}</HEART>
}

export default HeartableLink
