import React, { useState, useEffect, useRef } from 'react'
import { Link, Route } from 'react-router-dom'

import Archive from './PessimistsArchive.json'
import Matter, { Engine, Render, World, Bodies, Composites, Common, Mouse } from 'matter-js'

import './Matter.css'

// let clippings = []
// Archive.cards.forEach(card => {
//   let { url, height, width } = 'scaled' in card.cover ? card.cover.scaled[2] : ({})
//   if (url) clippings.push({ url, name: card.name, desc: card.desc, height, width, year: Number.parseInt(card.name) })
// })

let clippingYears = {}
Archive.cards.forEach(card => {
  let { url, height, width } = 'scaled' in card.cover ? card.cover.scaled[2] : ({})
  if (!url) return
  const year = Number.parseInt(card.name)
  if (!year) return
  if (!(year in clippingYears)) clippingYears[year] = []
  clippingYears[year].push({ url, name: card.name, desc: card.desc, height: height / 1, width: width / 1 })
})


const YEAR_HEIGHT = 50 // pixels per year of clippings

const PX_HEIGHT = 200 * YEAR_HEIGHT
const pixelHeight = PX_HEIGHT

function yearToY(year, maxYear = 2021) {
  const yearsAgo = maxYear - year
  return yearsAgo * YEAR_HEIGHT
}

function Year({ y, r = [1800, 2021] }) {
  return <strong style={{ top: `${((r[1] - y)/(r[1] - r[0])) * 100}%` }}>&nbsp;&nbsp;&nbsp;&nbsp;{y}</strong>
}

const DECADES = [2010, 2000, 1990, 1980, 1970, 1960, 1950, 1940, 1930, 1920, 1910, 1900, 1890, 1880, 1870, 1860, 1850, 1840, 1830, 1820, 1810, 1800]

function decadesBetween(y1, y2) {
  let decades = []
  let pointer = y1 - (y1 % 10)
  const pointerEnd = y2 - (y2 % 10)
  while (pointer <= pointerEnd) {
    decades.push(pointer)
    pointer += 10
  }
  return decades
}

function cap(value, [lowest, highest]) {
  return Math.min(Math.max(value, lowest), highest)
}

const Component = ({ years }) => {
  const [range, setRange] = useState([1800, 2021])
  const period = range[1] - range[0]
  const [filter, setFilter] = useState('')
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  useEffect(() => {
    let MouseConstraint = Matter.MouseConstraint
    let Events = Matter.Events
    let engine = Engine.create({})
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 2000,
        height: period * YEAR_HEIGHT, // whatever height needed to show spread of PERIOD (YEARS)
        background: '#8881',
        wireframes: false,
      },
    })
    const floor = Bodies.rectangle(0, PX_HEIGHT / 2, 10, PX_HEIGHT, { isStatic: true, render: { fillStyle: 'black' } })
    let decades = []
    DECADES.forEach(decade => {
      const x = ((decade % 100) !== 0) ? 200 : 400
      const y = yearToY(decade, range[1])
      decades.push(new Bodies.rectangle(x, y, ((decade % 100) !== 0) ? 400 : 800, (decade % 50) ? 4 : 6, {
        isStatic: true,
        render: {
          fillStyle: (decade % 50) ? '#8884' : '#8888',
        },
      }))
    })


    let grid = Object.entries(clippingYears).map(([y, values]) => {
      const year = Number.parseInt(y)
      if (!values) return []
      if (year < range[0] || year > range[1]) return []
      const averageWidth = values.reduce((s, e) => e.width + s, 0) / values.length
      return values.filter(c => !filter || c.name.toLowerCase().includes(filter)).map((clip, clipIndex) => Bodies.rectangle(200 + (clipIndex * averageWidth), yearToY(year, range[1]), clip.width, clip.height, {
        render: period < 75
          ? ({ sprite: { texture: clip.url } })
          : ({ fillStyle: '#aaaaaa' }), collisionFilter: { group: year }
      }))
    }).flat()

    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: .2,
          render: { visible: false }
        }
      })
    // Events.on(mouseConstraint, 'mousedown', e => {
    //   console.log('mousedown', { event: e, source: e.source })
    // })
    engine.gravity.y = 0
    engine.gravity.x = -.1
    render.mouse = mouse
    World.add(engine.world, [floor, ...decades, ...grid, mouseConstraint])
    Engine.run(engine)
    Render.run(render)
  }, [filter, range])

  const onDblClick = e => {
    const { clientY } = e
    const target = clientY / window.outerHeight // 0..1
    const targetYear = Math.round((range[0] * target) + range[1] * (1 - target))
    console.log({ clientY, target, targetYear })
    const diff = range[1] - range[0]
    const halfDiff = Math.round(diff / 4)
    setRange([targetYear - halfDiff, targetYear + halfDiff])
  }

  const onWheel = e => {
    const diff = range[1] - range[0]
    // const diffPart = Math.round(diff / 8)
    const diffPart = 10
    const { deltaY } = e
    if (deltaY > 50) {
      // scroll down
      // if (range[1] < 2021) return
      const newRange = range.map(r => cap(r - diffPart, [1500, 2021]))
      setRange(newRange)
    } else {
      // scroll up
      // if (range[0] > 1800) return
      const newRange = range.map(r => cap(r + diffPart, [1500, 2021]))
      setRange(newRange)
    }
  }

  return (<div className="Matter">
    <input placeholder="search" value={filter} onChange={e => setFilter(e.target.value)} />
    <div
      ref={boxRef}
      style={{
        // width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
      <div className="ranges">
        <label>
          <strong style={{ top: `${((2020 - range[0])/200) * 100}%` }}>{range[0]}</strong>
          <input type="range" value={range[0]} onChange={e => setRange([Math.min(e.target.value, range[1]), range[1]])} min={1800} max={2021} />
          {decadesBetween(range[0], range[1]).map(decade => <Year y={decade} r={range} />)}
        </label>
        <label>
          <input type="range" value={range[1]} onChange={e => setRange([range[0], Math.max(range[0], e.target.value)])} min={1800} max={2021} />
          <strong style={{ top: `${((2020 - range[1])/200) * 100}%` }}>{range[1]}&nbsp;&nbsp;</strong>
        </label>
      </div>
      <canvas
        ref={canvasRef}
        onDoubleClick={onDblClick}
        onWheel={onWheel}
        style={{
          maxHeight: '100%'
        }} />
    </div>
  </div>)
}

export default Component
