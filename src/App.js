import React, { useState, useEffect } from 'react'
import { useLocation, useHistory, NavLink as Link, Route } from 'react-router-dom'
import Archive from './data/PessimistsArchive.json'
import Timeline from './Timeline'
// import './App.css'
import styled from 'styled-components'

import Header from './Header'
// import Clippings from './Clippings'
import Favorites from './Favs'
import Categories from './Categories'
import About from './Pages/About'
import Manifesto from './Pages/Manifesto'
import { getArchiveYearGroups } from './data/archive'

import ClippingPopup from './Clipping/Popup'
import ClippingLink from './Clipping/Link'

const NoResults = styled.div`
  font-size: 1.5em;
  text-align: center;
  margin: .5em;
  align-self: center;
  justify-self: center;
`

const Tools = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  max-width: 100vw;
  overflow: auto;
  flex-wrap: wrap;
  background: #aaa4;
  box-shadow: inset 0 0 1em 0em #0003;
  padding: .5em;
  a {
    padding: .25em;
    display: inline-block;
    background: #08f;
    color: #fff;
    text-decoration: none;
    &:hover,
    &:focus {
      background: #5c0;
    }
  }
  a.constraint:hover,
  a.constraint:focus {
    background: #c00;
  }
  > button {
    background: none;
    border: 0;
    cursor: pointer;
  }
`

function mostPopularWords(list, searchProp, minEntries = 10, exclude = ['the', 'and', 'a', 'of', 'be', 'to', 'for', 'in', 'on', 'is', 'as']) {
  let dictionary = {}
  list.forEach(entry => {
    entry[searchProp].split(' ').map(word => word.toLowerCase()).forEach(word => {
      if (!(word in dictionary)) dictionary[word] = 0
      dictionary[word] += 1
    })
  })
  Object.entries(dictionary).forEach(entry => {
    if (entry[1] < minEntries) delete dictionary[entry[0]]
    if (exclude.includes(entry[0])) delete dictionary[entry[0]]
  })
  return dictionary
}

const canon = getArchiveYearGroups(Archive.cards, 1)

const dots = canon


const APP = styled.div`
  font-family: Courier, monospace;
  background: #fff;
  position: relative;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  justify-content: space-around;
  margin: auto;
  text-align: center;
  color: var(--main-fg);
  scroll-behavior: smooth;
  --main-bg: #fff;
  --main-bg-alpha: #fff8;
  --main-fg: #000;
  --button-bg: #eee;
`

const Clippings2 = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 10;
  overflow: auto;
  flex: 1;
  .Events {
    width: 100%;
    display: flex;
    /* align-items: flex-start; */
    /* justify-content: center; */
    transition: .5s ease all;
    overflow: auto;
    flex: 1;
    padding: 1em;
    box-sizing: border-box;
    background: linear-gradient(#fff0, #8888);
    background-attachment: local;
    &.blur {
      filter: blur(.1em);
      &:hover {
        filter: blur(0);
      }
    }
    .category {
      display: block;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .year {
        display: inline-block;
        text-decoration: none;
        font-size: 1.25em;
        background: #08f;
        color: #fff;
        padding: .25em;
        font-weight: bold;
        &.decade {
          box-shadow: .25em .25em 0 #004988;
        }
      }
      > ol {
        margin: 0;
        display: inline-flex;
        list-style: none;
        padding: 0;
        /* flex-wrap: wrap; */
        flex-direction: column;
        min-width: 12em;
        > li {
          display: block;
        }
      }
    }
    .clipping {
      color: inherit;
      width: 100%;
      position: relative;
      display: inline-block;
      display: inline-flex;
      align-items: center;
      max-width: 16em;
      max-height: 18em;
      min-height: 6em;
      /* transition: .5s ease all; */
      vertical-align: middle;
      perspective: 24em;
      /* filter: sepia(.25); */
      background: #fff;
      outline: .25em solid #08f0;
      &:hover,
      &:focus-within {
        z-index: 3;
      }
      &.active {
        filter: sepia(1);
      }
      &:visited {
        background-color: #eee;
      }
      &:focus {
        overflow: visible;
        z-index: 1;
      }
      &:active {
        outline: .25em solid #08f8;
      }
      img {
        transform: rotate3d(0, 1, 0, 0deg);
        transition: .5s ease all;
        backface-visibility: hidden;
        max-height: inherit;
      }
      .detail {
        position: absolute;
        padding: .25em;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        background: #8882;
        background: #fff;
        transition: .75s ease all;
        transform: rotate3d(0, 1, 0, 180deg);
        backface-visibility: hidden;
        color: blue;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:hover .detail {
        text-decoration: underline;
        transform: rotate3d(0, 1, 0, 0deg);
      }
      &:hover img {
        transform: rotate3d(0, 1, 0, -180deg);
      }
      &:visited .detail {
        color: inherit;
      }
      img {
        transition: .75s ease all;
        height: 100%;
        width: auto;
	      margin: auto;
      }
    }
    .detail a {
      color: inherit;
      text-decoration: none;
    }
  }

  ${props => props.isColumn && `.Events {
    flex-direction: column;
  }`}
  input.search {
    padding: .25em;
    font-size: 1em;
    line-height: 1;
    width: 1.25em;
    transition: .2s ease all;
    text-align: center;
    border-radius: 1em;
    /* border: .2em solid #ccc; */
    border-color: #ddd;
    background: #fff;
    cursor: pointer;
    &:hover:not(:focus):not(.notEmpty) {
      background: #eee;
    }
    &.notEmpty,
    &:focus {
      border-color: #fff;
      border-radius: 0;
      width: 8em;
      cursor: auto;
    }
    &.notEmpty {
      color: #08f;
      background: #fff;
      /* outline-color: #08f; */
      border-color: #08f;
      border-radius: .25em;
      border-style: solid;
    }
  }
`

function App() {
  const [isDark, setDark] = useState(false)
  const [nRecords, setN] = useState(0)
  const [isColumn, setColumn] = useState(false)
  const [isCaption] = useState(false)
  const history = useHistory()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const filter = params.get('s') || ''
  const group = params.get('group')
  let queryString = ''
  if (filter) queryString = `s=${filter}`
  if (group) queryString = `${queryString ? `${queryString}&` : queryString}group=${group}`
  let periodSize = 1
  if (group === 'decade') periodSize = 10
  if (group === 'century') periodSize = 100
  let years = getArchiveYearGroups(Archive.cards, periodSize)
  let filterRE = filter ? new RegExp(filter.toLowerCase(), 'i') : ({ test: () => true })
  let yearsToShow = Object.entries(years).reverse().filter(entry => !filter || entry[1].some(c => filterRE.test(c.title + ' ' + c.desc)))
  function filterYears(years, year = false, index = -1) {
    if (index > -1) return years
    return years.filter(e => year ? (year.length === 4 ? Number.parseInt(year) === Number.parseInt(e[0]) : e[0].includes(year.slice(0, 3))) : true)
  }
  useEffect(() => {
    setN(document.getElementsByClassName('clipping').length)
  }, [filter])
  // const nRecords = yearsToShow

  return (<APP>
    <Header isDark={isDark} setDark={setDark} />
    <Route exact path={["/", "/cat/:category?", "/cat/:category?/clippings/:year?/:index?"]} render={({ match: { params } }) => <Categories dots={dots} {...params} />} />
    <Route path="/clippings/:year?/:index?" render={({ match: { params: { year, index } } }) => (<Clippings2 isColumn={isColumn} isCaption={isCaption}>
        <Tools>
          {periodSize !== 1 ? <Link to={`/clippings?s=${filter}`}>Years</Link> : <strong>Years</strong>}
          {periodSize === 10 ? <strong>Decades</strong> : <Link to={`/clippings?s=${filter}&group=decade`}>Decades</Link>}
          {periodSize === 100 ? <strong>Century</strong> : <Link to={`/clippings?s=${filter}&group=century`}>Century</Link>}
          {year && <Link to={`/clippings/${year.length === 4 ? `${year.slice(0, 3)}0s` : ''}?${queryString}`}><strong>{year}</strong> x</Link>}
          <span>
            <input className={`search ${filter && 'notEmpty'}`} placeholder="🔍" value={filter} onChange={e => history.push(`/clippings?s=${e.target.value}${group ? `&group=${group}` : ''}`)} />
            {filter && <Link className="constraint" to={`${window.location.pathname}?${group ? `group=${group}` : ''}`}>×</Link>}
          </span>
          <button onClick={e => setColumn(!isColumn)}>{isColumn ? '➡️' : '⬇️'}</button>
          <label style={{ display: 'none' }}>Caption: <input type="checkbox" value={isCaption} onChange={e => setColumn(!isCaption)} /></label>
          <strong>{nRecords} entries</strong>
          <select onChange={e => history.push(`/clippings?s=${e.target.value}`)}>
            <option></option>
            {Object.entries(mostPopularWords(Object.values(years).flat(), 'title', 5)).sort((e1, e2) => e1[1] < e2[1] ? 1 : -1).map(entry => {
              return <option value={entry[0]}>{entry[0]} [#{entry[1]}]</option>
            })}
          </select>
        </Tools>
        <div className={`Events ${(year && index) ? 'blur' : ''}`}>
          {yearsToShow.length
            ? filterYears(yearsToShow, year, index).map(([year, records]) => (<div className="category" style={{ order: 2021 - Number.parseInt(year) }}>
              <Link className={`year ${year.length === 5 && 'decade'}`} to={`/clippings/${year}?${queryString}`} id={`y${year}`}>{year}</Link>
              <ol>
                {records.map((record, index) => (!filter || filterRE.test(record.title + ' ' + record.desc)) ? (<li key={record.localURL}><ClippingLink to={`${record.localURL}?s=${filter}&group=${group}`} record={record} /></li>) : null)}
              </ol>
            </div>))
            : <NoResults>No results for <b>{filter}</b></NoResults>}
        </div>
        {year && index
          ? (<ClippingPopup clipping={canon[year][index]} clippingsURL={`/clippings?${queryString}`} />)
          : null}
      </Clippings2>)} />
    <Route exact path="/favs"><Favorites /></Route>
    <Route exact path="/tweets"><Timeline /></Route>
    <Route exact path="/about" component={About} />
    <Route exact path="/manifesto" component={Manifesto}/>
  </APP>)
}
// {records.map((record, index) => (!filter || filterRE.test(record.title + ' ' + record.desc)) ? (<li key={record.localURL}><Link to={`${record.localURL}?s=${filter}&group=${group}`} className="clipping" id={`clip-${year}-${index}`} title={record.title} tabIndex={0} style={{ ...randomScale(index) }}>
//   {record.img && <img src={record.img} loading="lazy" />}
//   <div className="detail">
//     <div className="title">
//       {filter && filterRE.test(record.title)
//         ? (<>{record.title.split(filterRE)[0]}<mark>{filter}</mark>{record.title.split(filterRE)[1]}</>)
//         : (record.title || 'Untitled')}
//     </div>
//   </div>
// </Link></li>) : null)}

export default App
