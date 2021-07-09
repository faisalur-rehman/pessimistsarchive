import React, { useState, useEffect, useRef } from 'react'

import Archive from './data/PessimistsArchive.json'
import { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint, Events } from 'matter-js'

import styled from 'styled-components'
import useWindowSize from './useWindowSize'

const Container = styled.div`
  /* z-index: 2; */
  &:active {
    // z-index: 5;
  }
`

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


// const YEAR_HEIGHT = 50 // pixels per year of clippings

// const PX_HEIGHT = 200 * YEAR_HEIGHT
// const pixelHeight = PX_HEIGHT

// function yearToY(year, maxYear = 2021) {
//   const yearsAgo = maxYear - year
//   return yearsAgo * YEAR_HEIGHT
// }

// function Year({ y, r = [1800, 2021] }) {
//   return <strong style={{ top: `${((r[1] - y)/(r[1] - r[0])) * 100}%` }}>&nbsp;&nbsp;&nbsp;&nbsp;{y}</strong>
// }

// const DECADES = [2010, 2000, 1990, 1980, 1970, 1960, 1950, 1940, 1930, 1920, 1910, 1900, 1890, 1880, 1870, 1860, 1850, 1840, 1830, 1820, 1810, 1800]

// function decadesBetween(y1, y2) {
//   let decades = []
//   let pointer = y1 - (y1 % 10)
//   const pointerEnd = y2 - (y2 % 10)
//   while (pointer <= pointerEnd) {
//     decades.push(pointer)
//     pointer += 10
//   }
//   return decades
// }

// function cap(value, [lowest, highest]) {
//   return Math.min(Math.max(value, lowest), highest)
// }

const VELOCITY_SCALE = 8

const Component = ({ images, years, scale = .5, highlight = null, onClick, ...props }) => {
  const [clicked] = useState()
  const { width, height } = useWindowSize()
  const boxRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    let engine = Engine.create({})
    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width,
        height,
        background: '#8880',
        wireframes: false,
      },
    })

    let padding = 16
    const floors = ([
      // N W S E
      [width / 2, 0, width + padding, 1],
      [width / 2, height, width + padding, 1],
      [0, height / 2, 1, height + padding],
      [width, height / 2, 1, height + padding]
    ]).map(([x, y, w, h]) => Bodies.rectangle(x, y, w, h, { isStatic: true, render: { fillStyle: '#000' } }))

    const rectangles = images.map(image => {
      const x = Math.round(Math.random() * width)
      const y = Math.round(Math.random() * height)
      let scale = .5
      if (image.data.id === clicked) scale = 1.5
      return Bodies.rectangle(x, y, image.width * scale, image.height * scale, {
        id: image.data.id,
        isActive: false,
        render: {
          // opacity: .5,
          sprite: {
            xScale: scale,
            yScale: scale,
            texture: image.full || image.url,
          }
        },
        // speed: 122, angle: (Math.random() * Math.PI) - (Math.PI / 2)
      })
    })

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: .2,
        render: { visible: false }
      }
    })

    function mouseDown(e) {
      const { body } = e.source
      const clickedId = body?.id
      if (body) {
        if (!body.isActive) {
          body.isActive = true
          body.render.sprite.xScale = 1
          body.render.sprite.yScale = 1
          Body.scale(body, 2, 2)
          Body.setAngle(body, 0)
          Body.setAngularVelocity(body, 0)
        } else {
          body.isActive = false
          body.render.sprite.xScale = .5
          body.render.sprite.yScale = .5
          Body.scale(body, .5, .5)
        }
      }
      if (clickedId && onClick) {
        onClick(clickedId)
        // setClicked(clickedId)
      }
    }
    Events.on(mouseConstraint, 'mousedown', mouseDown)
    // Events.on(mouseConstraint, 'mouseup', e => {
    //   // ?e.source.blur()
    //   if (clicked) {
    //     if (onClick) onClick(clicked)
    //     setClicked()
    //   }
    // })
    engine.gravity.y = 0
    engine.gravity.x = 0
    render.mouse = mouse
    World.add(engine.world, [...floors, ...rectangles, mouseConstraint])
    Engine.run(engine)
    Render.run(render)
    // let timeout = setTimeout(() => {
      rectangles.forEach(rect => Body.setVelocity(rect, { x: (VELOCITY_SCALE / 2) - (Math.random() * VELOCITY_SCALE), y: (VELOCITY_SCALE / 2) - (Math.random() * VELOCITY_SCALE) }))
      rectangles.forEach(rect => Body.setAngularVelocity(rect, (Math.random() * .01)))
    // }, 500)
    return () => {
      Events.off(mouseConstraint, 'mousedown', mouseDown)
    }
    // return () => clearTimeout(timeout)
  }, [width, height, images.length, clicked, images, onClick])

  return (<Container {...props} title={clicked}>
    <div ref={boxRef}
      style={{
        // width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex'
      }}>
      <canvas ref={canvasRef} style={{ maxHeight: '100%' }} />
    </div>
  </Container>)
}

export default Component
