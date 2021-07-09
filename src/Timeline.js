import { useState, useEffect } from 'react'

import styled from 'styled-components'

const TIMELINE = styled.div`
  align-self: center;
  min-height: 1em;
  width: 100%;
  flex: 1;
`

const yearRegex = (/\d\d\d\d/)

const MIN_POSSIBLE_YEAR = 1440 // guttenburg press

function parseYear(text) {
  let year, match
  if (text) match = text.match(yearRegex)
  if (match) year = match[0]
  if (year) year = Math.max(MIN_POSSIBLE_YEAR, year)
  return year
}

const DEFAULT_YEAR = 2021

function Timeline () {
  const { TL } = window
  const { Papa } = window
  const csv_url = '/tweets.csv'
  const [, setTL] = useState()
  // const json = '/tweets-no-rt.json'
  // const [data, setData] = useState()
  const [csv] = useState()
  useEffect(() => {
    if (!csv) {
      Papa.parse(csv_url, {
        download: true,
        complete: function(newData) {
          const cols = newData.data[0]
          const rows = newData.data.slice(1)
          let events = []
          rows.forEach(row => {
            let event = {}
            cols.forEach((col, i) => event[col] = row[i])
            const year = parseYear(event.text) || DEFAULT_YEAR
            if (!event.text) return
            // const emoji = '☔️'
            const ev = {
              start_date: { year },
              text: {
                text: event.text, headline: event.text },
              media: {
                url: `https://twitter.com/PessimistsArc/status/${event.tweet_id}`,
                // thumbnail: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ctext style='font-size:50px;' y='50'%3E${emoji}%3C/text%3E%3C/svg%3E`
              }
            }
            events.push(ev)
          })
          // setCSV(events)
          let slideToStart = 0
          events.find((event, slideIndex) => {
            if (event.start_date.year === 1850) return slideToStart = slideIndex
            return false
          })
          setTL(new TL.Timeline('events', { events: events.filter(e => !e.text.text.startsWith('RT')) }, {
            initial_zoom: 6,
            timenav_position: 'bottom',
            start_at_slide: slideToStart,
            duration: 750,
            timenav_height_percentage: 50,
            // scale_factor: 3,
            hash_bookmark: true,
            optimal_tick_width: 120
          }))
        }
      })
    }
  })
  // useEffect(() => {
  //   if (csv) {
  //     let request = fetch(json).then(res => res.json())
  //     request.then(({ events }) => {
  //       const newEvents = events.filter(e => e.text.headline && !e.text.headline.startsWith('RT'))
  //       const newData = { events: newEvents.map(e => ({ ...e, media: getTweetURL(e, csv) })) }
  //       setData(newData)
  //       console.log(newData)
  //     })
  //   }
  // }, [csv, json])
  return (<TIMELINE>
    <div id="events" style={{ width: '100%', height: '32em' }} />
  </TIMELINE>)
}

export default Timeline
