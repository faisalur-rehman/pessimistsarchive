import { useState, useEffect } from 'react'
import { useLocation, useHistory, Route, NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'

import Archive from './data/PessimistsArchive.json'
import Popup from './Clipping/Popup'
import ClippingLink from './Clipping/Link'

import archive, { getArchiveYearGroups } from './data/archive'

const CLIPPINGS = styled.div`
  display: flex;
  justify-content: center;
  /* overflow: auto;
  overflow-y: clip; */
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
  }
  input.search:hover:not(:focus):not(.notEmpty) {
    background: #eee;
  }
  input.search.notEmpty,
  input.search:focus {
    border-color: #fff;
    border-radius: 0;
    width: 8em;
    cursor: auto;
  }
  input.search.notEmpty {
    color: #08f;
    background: #fff;
    /* outline-color: #08f; */
    border-color: #08f;
    border-radius: .25em;
    border-style: solid;
  }
`

const EVENTS = styled.div`
  /* width: 100%; */
  display: flex;
  /* align-items: flex-start; */
  /* justify-content: center; */
  transition: .5s ease all;
  /* overflow: auto; */
  /* flex: 1; */
  padding: 1em;
  box-sizing: border-box;
  /* background: linear-gradient(#fff0, #8884); */
  background-attachment: local;
  scroll-snap: x mandatory;
  .isColumn & {
    flex-direction: column;
  }
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

`

const YEAR = styled(Link)`
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
  &:focus {
    background: red;
  }
`

const ITEMS = styled.div`
  text-align: center;
  backdrop-filter: blur(2px);
  background: #fff8;
  .groups {
    display: inline;
    > ol, > ol > li {
      display: inline;
      margin: 0;
      padding: 0;
    }
  }
`

const yearRE = /\d\d\d\d/

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

const periodSizes = [1, 5, 10]

const canon = archive.clips.year

function yearInDecade(year, decade) {
  const y = Number.parseInt(decade)
  return year.toString().includes(y.slice(0, 2))
}

const isEven = n => (n % 2 === 0)

function Clippings({ url = '/clippings', list = null, ungrouped = false, catEmoji, year, index, reverse = false, searchOverride = '', noTools = false, showYear = false, ...props }) {
  const [nRecords, setN] = useState(0)
  const [size, setSize] = useState(0)
  const [isColumn, setColumn] = useState(false)
  const [isCaption, setCaption] = useState(false)
  const history = useHistory()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const filter = searchOverride || params.get('s')
  let group = params.get('group')
  let queryString = ''
  if (filter && group) queryString = `s=${filter}&group=${group}`
  else if (filter) queryString = `s=${filter}`
  let periodSize = 1
  if (group === 'decade') periodSize = 10
  if (group === 'century') periodSize = 100
  let years = getArchiveYearGroups(Archive.cards, periodSize, url)
  // const [filter, setFilter] = useState('')
  let filterRE = filter ? new RegExp(filter ? filter.toLowerCase() : '*', 'i') : ({ test: () => true })
  let yearsToShow = Object.entries(years).filter(entry => !filter || entry[1].some(c => filterRE.test(c.title + ' ' + c.desc)))
  if (!reverse) yearsToShow = yearsToShow.reverse()
  useEffect(() => {
    const newN = document.getElementsByClassName('clipping').length
    if (newN != nRecords) setN(newN)
  }, [filter])

  if (ungrouped) {
    return (<CLIPPINGS className={isColumn && 'isColumn' + isCaption && ' isCaption'} {...props}>
      <Route path={`${url}/:year/:index`} render={({ match: { params: { year, index }  } }) => <Popup key={[year, index].join('-')} clipping={canon[year][index]} year={year} clippingsURL={url} close={() => history.goBack()} />} />
      {noTools ? null : (<div className="Tools">
        {periodSize !== 1 ? <Link to={`${url}?s=${filter}`}>Years</Link> : <strong>Years</strong>}
        {periodSize === 10 ? <strong>Decades</strong> : <Link to={`${url}?s=${filter}&group=decade`}>Decades</Link>}
        {periodSize === 100 ? <strong>Century</strong> : <Link to={`${url}?s=${filter}&group=century`}>Century</Link>}
        {year && <Link to={`${url}/${year.length === 4 ? `${year.slice(0, 3)}0s` : ''}?${queryString}`}><strong>{year}</strong> x</Link>}
        {searchOverride ? null : (<span>
          <input className={`search ${filter && 'notEmpty'}`} placeholder="🔍" value={filter} onChange={e => history.push(`${url}?s=${e.target.value}${group ? `&group=${group}` : ''}`)} />
          {filter && <Link className="constraint" to={`${window.location.pathname}?${group ? `group=${group}` : ''}`}>×</Link>}
        </span>)}
        <button onClick={e => setColumn(!isColumn)}>{isColumn ? '➡️' : '⬇️'}</button>
        <label style={{ display: 'none' }}>Caption: <input type="checkbox" value={isCaption} onChange={e => setColumn(!isCaption)} /></label>
        <strong>{nRecords} entries</strong>
        <select onChange={e => history.push(`${url}?s=${e.target.value}`)}>
          <option></option>
          {Object.entries(mostPopularWords(Object.values(years).flat(), 'title', 5)).sort((e1, e2) => e1[1] < e2[1] ? 1 : -1).map(entry => {
            return <option value={entry[0]}>{entry[0]} [#{entry[1]}]</option>
          })}
        </select>
      </div>)}
      <ITEMS className={year && index && 'blur' || ''}>
        {yearsToShow.length
          ? yearsToShow.filter(e => year ? (year.length === 4 ? Number.parseInt(year) === Number.parseInt(e[0]) : e[0].includes(year.slice(0, 3))) : true).map(([year, records]) => (<div className="groups">
            <ol>
              {records.map((record, index) => (!filter || filterRE.test(record.title + ' ' + record.desc)) ? (<li key={record.localURL}>
                <ClippingLink to={record.localURL} record={record} size={size} year={year} index={index}>
                  {filter && filterRE.test(record.title)
                    ? (record.title.split(filterRE).map((t, i) => {
                      if (i !== (record.title.split(filterRE).length - 1)) return <><span key={i}>{t}</span><mark>{filter}</mark></>
                      return <span key={i}>{t}</span>
                    }))
                    : (<span>{record.title || 'Untitled'}</span>)}
                </ClippingLink>
              </li>) : null)}
            </ol>
          </div>))
          : <div className="noResults">No results for <b>{filter}</b></div>}
      </ITEMS>
    </CLIPPINGS>)
  }

  return (<CLIPPINGS className={isColumn && 'isColumn' + isCaption && ' isCaption'} {...props}>
    {noTools ? null : (<div className="Tools">
      {periodSize !== 1 ? <Link to={`${url}?s=${filter}`}>Years</Link> : <strong>Years</strong>}
      {periodSize === 10 ? <strong>Decades</strong> : <Link to={`${url}?s=${filter}&group=decade`}>Decades</Link>}
      {periodSize === 100 ? <strong>Century</strong> : <Link to={`${url}?s=${filter}&group=century`}>Century</Link>}
      {year && <Link to={`${url}/${year.length === 4 ? `${year.slice(0, 3)}0s` : ''}?${queryString}`}><strong>{year}</strong> x</Link>}
      {searchOverride ? null : (<span>
        <input className={`search ${filter && 'notEmpty'}`} placeholder="🔍" value={filter} onChange={e => history.push(`${url}?s=${e.target.value}${group ? `&group=${group}` : ''}`)} />
        {filter && <Link className="constraint" to={`${window.location.pathname}?${group ? `group=${group}` : ''}`}>×</Link>}
      </span>)}
      <button onClick={e => setColumn(!isColumn)}>{isColumn ? '➡️' : '⬇️'}</button>
      <label style={{ display: 'none' }}>Caption: <input type="checkbox" value={isCaption} onChange={e => setColumn(!isCaption)} /></label>
      <strong>{nRecords} entries</strong>
      <select onChange={e => history.push(`${url}?s=${e.target.value}`)}>
        <option></option>
        {Object.entries(mostPopularWords(Object.values(years).flat(), 'title', 5)).sort((e1, e2) => e1[1] < e2[1] ? 1 : -1).map(entry => {
          return <option value={entry[0]}>{entry[0]} [#{entry[1]}]</option>
        })}
      </select>
    </div>)}
    <EVENTS className={year && index && 'blur' || ''}>
      {yearsToShow.length
        ? yearsToShow.filter(e => year ? (year.length === 4 ? Number.parseInt(year) === Number.parseInt(e[0]) : e[0].includes(year.slice(0, 3))) : true).map(([year, records]) => (<div className="category" style={{ order: 2021 - Number.parseInt(year) }}>
          {showYear && <Link className={`year ${year.length === 5 && 'decade'}`} to={`${url}/${year}?${queryString}`} id={`y${year}`}>{year}</Link>}
          <ol>
            {records.map((record, index) => (!filter || filterRE.test(record.title + ' ' + record.desc)) ? (<li key={record.localURL}>
              <ClippingLink to={record.localURL} record={record} size={size} year={year} index={index}>
                {filter && filterRE.test(record.title)
                  ? (record.title.split(filterRE).map((t, i) => {
                    if (i !== (record.title.split(filterRE).length - 1)) return <><span key={i}>{t}</span><mark>{filter}</mark></>
                    return <span key={i}>{t}</span>
                  }))
                  : (<span>{record.title || 'Untitled'}</span>)}
              </ClippingLink>
            </li>) : null)}
          </ol>
        </div>))
        : <div className="noResults">No results for <b>{filter}</b></div>}
    </EVENTS>
    <Route path={`${url}/:year/:index`} render={({ match: { params: { year, index }  } }) => <Popup key={[year, index].join('-')} clipping={canon[year][index]} year={year} clippingsURL={url} catEmoji={catEmoji} close={() => history.goBack()} />} />
  </CLIPPINGS>)
}

export default Clippings
