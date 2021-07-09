import React from 'react'
import { NavLink as A } from 'react-router-dom'
import styled from 'styled-components'

import Archive from '../data/PessimistsArchive.json'
import archive from '../data/archive'
// import List from '../data/categories.json'

import Page from './Page'
import Link from './Link'

function getListCards(cat) {
  let list = Archive.lists.find(list => list.name.toLowerCase().replace(' ', '') === cat)
  let groups = Object.values(archive.clips.year) // array of arrays
  let matchingCards = []
  groups.forEach(group => {
    group.forEach(card => {
      if (list && card.list && card.list.id === list.id) matchingCards.push(card)
      else if ([card.title, card.desc].some(text => text.toLowerCase().includes(cat))) matchingCards.push(card)
    })
  })
  return matchingCards
}

function getListCard(cat, year, index) {
  // let list = Archive.lists.find(list => list.name.toLowerCase() === decodeURIComponent(cat))
  // if (!list) return null
  return archive.clips.year[year][index] // array
}

const Thumbs = styled.ol`
  overflow: visible;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;
  ${props => props.hasCard && `
    font-size: .75em;
    .year {
      font-size: 1rem;
    }
  `}
  > li {
    display: inline-block;
    list-style: none;
    margin: .5em;
    padding: 0;
  }
`

const LIST = styled.div`
  /* position: relative; */
`

function List({ cat, year, index }) {
  let cards = getListCards(cat)
  let card
  if (year && index) card = getListCard(cat, year, index)
  // let prevCards = [] //, nextCards = []
  // if (card) {
  //   prevCards = cards.slice(0, cards.indexOf(card)) //.reverse()
  //   // nextCards = cards.slice(cards.indexOf(card) + 1)
  // } else {
  //   prevCards = cards
  // }
  return (<LIST>
    {card && <Page clipping={card} />}
    {card && card.category && <p><A to={card.category.url}>Back to list</A></p>}
    <Thumbs hasCard={card}>
      {cards.map(card => (<li>
        <Link key={card.id} to={`${card.categoryURL || `/cat/${cat}/clippings/${card.year}/${card.index}`}#page${card.trelloId}`} onClick={e => e.target.blur()} record={card} />
      </li>))}
    </Thumbs>
  </LIST>)
      // {prevCards.map(card => (<li>
      //   <Link key={card.id} to={card.categoryURL || `/cat/${cat}/clippings/${card.year}/${card.index}#${card.year}`} record={card} />
      // </li>))}
      // {card && <Link key={card.id} to={card.categoryURL || `/cat/${cat}/clippings/${card.year}/${card.index}`} record={card} />}
      // {nextCards.map(card => (<li>
      //   <Link key={card.id} to={`/cat/${cat}/clippings/${card.year}/${card.index}#${card.year}`} record={card} />
      // </li>))}
    // {card && <Thumbs hasCard={card}>
    // </Thumbs>}
}

export default List
