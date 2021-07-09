import React from 'react'
// import { NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'

const ABOUT = styled.article`
  flex: 1;
`

function About() {
  return (<ABOUT>
    <h1>About</h1>
    Dunno what you want here Louis
    <a href="https://app.netlify.com/sites/pessimistsarchive/deploys">Deploy</a>
    <a href="https://docs.google.com/document/d/1xVRnzV8G-sCLL9rWQ7YQsHnRJ9HFkNfSKd6U9fEuWtM/edit#heading=h.xuekv36ll6ne">doc</a>
  </ABOUT>)
}

export default About
