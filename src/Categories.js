import React, { useState, useEffect, useCallback } from 'react'
import { Route, NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'

import Archive from './data/PessimistsArchive.json'
import List from './data/categories.json'

import Typed from './Typed'
import ClippingList from './Clipping/List'
import PhysicalImages from './PhysicalImages'

const Cats = List.map(cat => {
  let slug = (cat.search || cat.name).toLowerCase().replace(' ', '')
  let list = Archive.lists.find(list => list.name.toLowerCase().replace(' ', '') === slug)
  return ({
    ...cat,
    slug,
    url: `/cat/${slug}`,
    list
  })
})

const CATEGORIES = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;

  flex: 1;
  justify-content: space-between;
`

const CATEGORY = styled.article`
  overflow: auto;
  padding-bottom: 1em;
  flex: 1;
  scroll-behavior: smooth;
  .description > .title {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 32em;
    h1 {
      flex: 1;
      margin: 0;
      > a {
        color: inherit;
        text-decoration: none;
        &:hover, &:focus {
          text-decoration: underline;
        }
      }
    }
  }
  .description {
    max-width: 32em;
    position: relative;
    h1 {
      text-transform: uppercase;
      font-size: 1.75em;
      line-height: 1;
    }
    z-index: 4;
    padding: 1em;
    background: var(--main-bg-alpha);
    backdrop-filter: blur(3px);
    margin: auto;
    border-radius: 1em;
  }
`

const Explore = styled(Link)`
  margin: 1em;
  background: var(--button-bg);
  border: 1px solid #6664;
  color: inherit;
  padding: .5em 1em;
  line-height: 1;
  display: inline-block;
  text-decoration: none;
  font-weight: bold;
  border-radius: .25em;
  transition: .5s ease all;
  box-shadow: 0 0 .5em 0 #fff8;
  &:hover, &:focus {
    box-shadow: .5em .5em .5em 0 #0004;
    border-color: #eee;
    transform: scale(1.1);
    transform-origin: 75% 75%;
    background: #08f;
    border-color: #048;
    color: #fff;
    /* color: #fff; */
  }
`

const Nav = styled(Link)`
  line-height: 1;
  color: #0006;
  text-decoration: none;
  min-width: 1em;
  border-radius: .25em;
  font-size: 1.5em;
  display: block;
  @media (min-width: 32em) {
    display: inline-block;
    font-size: 2em;
    padding: .25em;
  }
  &.active {
    pointer-events: none;
    color: #0001;
  }
  transition: .2s ease all;
  &:hover,
  &:focus {
    /* background: #08f;
    color: #fff; */
    color: #08f;
    transform: scale(1.5);
  }
`

const Timeline = styled.div`
  max-width: 100vw;
  font-size: 1em;
  overflow: auto;
  min-height: 7rem;
  height: 7rem;
  max-height: 32vh;
  position: relative;
  box-shadow: 0 0 2em 0 #0002;
  border-top: 1px solid #ccc;
  transition: .5s ease all;
  bottom: 0;
  /* position: fixed; */
  z-index: 3;
  &:hover, &:focus-within {
    z-index: 5;
    background: #fffd;
  }
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0; */
`
const Years = styled.ol`
  display: flex;
  background: #6662;
  background: #fff;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: stretch;
  justify-content: flex-start;
  height: 100%;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  overflow-y: clip;
  box-shadow: inset -1.5em 0 1em -1em #0004, inset 1.5em 0 1em -1em #0004;
  > li {
    position: relative;
    flex: 1;
    min-width: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: .2s ease all;
    &:nth-child(1) {
      background: linear-gradient(to right, #ffff, #fff0);
      min-width: 2em;
    }
    &:last-child {
      background: linear-gradient(to left, #ffff, #fff0);
      min-width: 2em;
    }
     > ol {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    &:hover {
      > strong {
        color: #000;
        font: inherit;
        z-index: 2;
        width: 1.5em;
        .century {
          font-size: 0;
        }
        .decade {
          opacity: 1;
          color: inherit;
        }
      }
    }
  }
`

const Year = styled.li`
  ${props => props.isYear && `
    background: #ddd8;
    strong {
      font-size: 1em;
      .century {
        font-size: 0;
      }
    }
  `}
  ${props => props.isActive && `
  `}
`
// background: linear-gradient(#08f4, #fff0);

const YearLabel = styled.strong`
  position: absolute;
  top: 4rem;
  left: -1em;
  right: -1em;
  text-align: center;
  color: #666e;
  font-size: 0;
  display: inline-block;
  padding: .25em;
  ${props => (props.isDecade || props.isCentury) && `
    font-size: 1em;
    padding-top: 1em;
    &::after {
      content: '';
      height: 1em;
      border-left: .1em solid #aaa;
      position: absolute;
      top: 0;
      left: 50%;
      color: #ddd;
    }
  `}
  ${props => (props.isDecade && !props.isCentury) && `
    color: #444;
    .century {
      display: none;
      display: inline;
      opacity: .5;
    }
  `}
  ${props => props.isCentury && `
    font-size: 1.5em;
    padding-top: 1rem;
    margin-left: -1rem;
    .decade {
      opacity: .25;
    }
    &::after {
      height: 1rem;
      border-width: .2em;
    }
  `}
`

const Entries = styled.ol`
  position: relative;
  overflow: visible;
  overflow-y: clip;
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: .1em solid #bbb;
  height: 2rem;
  background: #bbb4;
  > li {
    position: relative;
    &.dot > a {
      position: relative;
      font-size: inherit;
      line-height: 1;
      color: #ddd;
      font-size: 1em;
      transition: .5s ease all;
      filter: grayscale(1);
      &:hover {
        opacity: 1;
        transform: scale(3);
      }
      &:hover, &:focus {
        filter: grayscale(0);
      }
      img {
        transition: inherit;
      }
    }
    > a.category {
      position: absolute;
      display: inline-block;
      box-sizing: content-box;
      font-size: 1.5em;
      line-height: 1;
      cursor: pointer;
      color: inherit;
      width: 1em;
      top: .25em;
      left: -.5em;
      text-align: center;
      z-index: 1;
      text-decoration: none;
      transition: .5s ease transform;
      transform-origin: 50% 50%;
      outline: 0;
      &:focus {
        outline: 0;
        text-decoration: underline;
        color: #08f;
      }
      &.active {
        z-index: 2;
        transform: scale(1.5);
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: -.5em;
          z-index: -1;
          height: 1em;
          width: 2px;
          margin-left: -1px;
          background: linear-gradient(#08ff, #08f0);
        }
      }
      &:hover, &:focus {
        z-index: 3;
        transform: scale(2);
      }
    }
  }
`

// const Options = styled.div`
//   position: absolute;
//   right: 0;
//   top: 0;
//   z-index: 7;
//   padding: .5em;
//   text-align: left;
//   &:hover {
//     background: #fff;
//   }
//   label {
//     display: block;
//   }
// `

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

function getYears(min, max) {
  return range(min, max)
}

const cardInCategory = (card, cat) => (card.title || '').toLowerCase().includes(cat.toLowerCase())

function Dot({ dot, dotIndex, shy }) {
  let icon = '📰'
  let url = dot.localURL
  Cats.find(cat => {
    if ((dot.title || '').toLowerCase().includes(cat.search || cat.name.toLowerCase())) {
      if (cat.emoji) icon = cat.emoji
      url = `/cat/${cat.name}/clippings/${dot.year}/${dotIndex}`
      return true
    }
    return false
  })
  const size = 16
  let opacity = 1
  if (shy) opacity = .25
  if (dot.img) icon = <img src={dot.img} alt="" style={{ maxWidth: size, maxHeight: size, opacity }} />
  return (<Link to={url} title={dot.title}>
    {icon}
  </Link>)
}

const MAX_IMAGES = 12

function cardToImage(card) {
  let scaledImgs = card.cover.scaled
  let scaledImg
  if (scaledImgs) scaledImg = scaledImgs.find(s => s.scaled)
  else return false
  let { width, height } = scaledImg
  return ({
    ...scaledImg,
    width,
    height,
    data: { id: card.id }
  })
}

function Categories({ category, year, index, dots = [], showClippings = false, children }) {
  const [view] = useState(['categories'])

  const autoFocus = useCallback(el => el ? el.focus() : null, [])
  let range = [1868, 2021]
  // range = [1940, 2000]
  const years = getYears(...range)

  const catData = category && Cats.find(item => item.slug === category)
  const catIndex = Cats.indexOf(catData)
  let images
  if (category) images = Archive.cards.filter(card => card.name?.toLowerCase().includes(category.toLowerCase())).slice(0, MAX_IMAGES).filter(card => card.cover && card.cover.scaled && card.cover.scaled.some(img => (img.width / img.height) > 0.5)).map(cardToImage)
  else {
    const randomStart = Math.round((Archive.cards.length - 12) * Math.random())
    images = Archive.cards.slice(randomStart, randomStart + 12).map(cardToImage).filter(res => res)
  }

  useEffect(() => {
    let oldTitle = document.title
    if (catData && catData.emoji && !year && !index) document.title = `${catData.emoji} ${catData.name} - ${oldTitle}`
    return () => {
      document.title = oldTitle
    }
  }, [catData, index, year])

  function scrollToClickedCategory(e, absNavPos) {
    const parent = e.target.parentElement.parentElement.parentElement.parentElement
    const scrollTo = (parent.scrollWidth - parent.clientWidth) * absNavPos
    parent.scrollLeft = scrollTo
  }

  let lastCat, nextCat, startCat, endCat
  startCat = Cats[0]
  if (category) {
    endCat = Cats[Cats.length - 1]
    lastCat = Cats[catIndex - 1] || startCat
    nextCat = Cats[catIndex + 1] || endCat
    // if (lastCat === startCat) startCat = null
    // if (nextCat === endCat) endCat = null
  }
  let randomCat = Cats[Math.floor(Math.random()*Cats.length)]

  // <Route path="/cat/:cat/clippings" render={() => <Clippings url={`/cat/${cat}/clippings`} ungrouped index={index} searchOverride={cat} list={Archive.lists.find(list => list.name === catData.name)} noTools style={{ position: 'relative', zIndex: 6 }} />} />
    // {Archive.lists.map(list => list.name)}
  return (<CATEGORIES>
    <Route exact path={["/", "/cat/:cat/:subpage?/:y?"]} render={() => <hr />} />
    <Route path="/cat/:cat/:subpage?/:year?/:index?" render={({ match: { params: { cat, subpage, year, index } } }) => (<CATEGORY key={cat}>
      <div className="description">
        <div className="title">
          <span>
            {startCat && <Nav to={`/cat/${startCat.slug}${subpage === 'clippings' ? '/clippings' : ''}`} title={`${startCat.emoji} ${startCat.name}`}>«</Nav>}
            {lastCat && <Nav to={`/cat/${lastCat.slug}${subpage === 'clippings' ? '/clippings' : ''}`} title={`${lastCat.emoji} ${lastCat.name}`}>‹</Nav>}
          </span>
          <h1><Link to={`/cat/${catData.slug}`}><Typed startAt={catData.emoji.length + 1} text={`${catData.emoji} ${catData.name || category}`} /></Link></h1>
          <span>
            {nextCat && <Nav to={`/cat/${nextCat.slug}${subpage === 'clippings' ? '/clippings' : ''}`} title={`${nextCat.emoji} ${nextCat.name}`}>›</Nav>}
            {endCat && <Nav to={`/cat/${endCat.slug}${subpage === 'clippings' ? '/clippings' : ''}`} title={`${endCat.emoji} ${endCat.name}`}>»</Nav>}
          </span>
        </div>
        {catData.description && <p>{catData.description}</p>}
        {subpage ? null : <Explore to={`/cat/${category}${!subpage ? '/clippings' : ''}`}>EXPLORE</Explore>}
      </div>
      <Route path="/cat/:cat/clippings/:year?/:index?" render={({ match: { params: { cat, year, index } } }) => (<div>
        <ClippingList cat={cat} year={year} index={index} />
      </div>)} />
      {subpage ? null : <PhysicalImages
        images={images}
        highlight={(year && index) ? `r` : false}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: subpage ? -1 : 1, filter: subpage ? 'blur(4px)' : null }} />}
    </CATEGORY>)} />
    <Route exact path="/" render={() => (<>
      <PhysicalImages
        images={images}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />
      <CATEGORY><div className="description">
        <p>Welcome to <b>Pessimists' Archive</b>, click below to explore categories, or discover the Archive above</p>
        <Explore to={startCat && startCat.url}>{startCat.emoji} Start</Explore>
        <Explore to={randomCat && randomCat.url}>❓ I'm Feeling Lucky</Explore>
      </div></CATEGORY>
    </>)} />
    {children}
    <Timeline>
      <Years>
        {years.map(y => {
          const items = Cats.filter(item => item.year === y)
          let dotEntries = []
          if (y in dots) dotEntries = dots[year]
          // if (category) dotEntries = dotEntries.filter(dot => cardInCategory(dot, category))
          return (<Year id={y} isActive={items.find(item => item.slug === category)} isYear={Number(year) === Number(y)}>
            <Entries>
              {view.includes('categories') && items.map((item, itemIndex) => (<li key={itemIndex}>
                <Link tabIndex={2} className="category" ref={(item.slug === category) ? autoFocus : null} to={item.url} title={item.name} onClick={e => scrollToClickedCategory(e, (y - range[0]) / (range[1] - range[0]))}>{item.emoji}</Link>
              </li>))}
              {view.includes('stories') && dotEntries.map((dot, dotIndex) => (<li key={`dot-${dotIndex}`} className="dot" tabIndex={3}>
                <Dot dot={dot} dotIndex={dotIndex} shy={category && !cardInCategory(dot, category)} />
              </li>))}
            </Entries>
            <YearLabel isDecade={y % 10 === 0} isCentury={y % 100 === 0}>
              <span className="century">{y.toString().slice(0, 2)}</span>
              <span className="decade">{y.toString().slice(2, 4)}</span>
            </YearLabel>
          </Year>)
        })}
      </Years>
    </Timeline>
  </CATEGORIES>)
}
// <Options>
//   <label><input type="checkbox" checked={view.includes('categories')} onChange={() => setView(!view.includes('categories') ? [...view, 'categories'] : view.filter(s => s !== 'categories'))} /> Categories</label>
//   <label><input type="checkbox" checked={view.includes('stories')} onChange={() => setView(!view.includes('stories') ? [...view, 'stories'] : view.filter(s => s !== 'stories'))} /> 📰</label>
// </Options>

export default Categories
