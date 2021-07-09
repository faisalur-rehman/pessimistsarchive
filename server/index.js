import path from 'path'
import fs from 'fs'

import React from 'react'
import express from 'express'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'

import App from '../src/App'

const PORT = process.env.PORT || 3000
const app = express()

app.get('/:page?/:p2?/:p3?/:p4?/:p5?', (req, res) => {
  const app = ReactDOMServer.renderToString(<Router location={req.url} context={{}}><App /></Router>)

  const indexFile = path.resolve('./build/index.html')
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    let html = data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)

    if (req.params.p4) {
      // clipping page, add meta tags
      let clipping = {}
      const metaTags = `
        <meta property="og:image" content="${clipping.full}" />
        <meta name="twitter:image" content="${clipping.full}" />
      `
      html = data.replace('</head>', `${metaTags}</head>`)
    }

    return res.send(html)
  })
})

app.use(express.static('./build'))

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})
