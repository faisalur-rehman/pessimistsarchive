import React, { useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import styled from "styled-components";

import HeartableLink from "../HeartableLink";

const ClippingLink = styled(RouterLink)`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  width: auto;
  min-height: 6em;
  max-height: 12em;
  min-width: 6em;
  max-width: 8em;
  @media (min-width: 32rem) {
    max-width: 12em;
  }
  perspective: 24em;
  color: inherit;
  transition: 0.5s ease all;
  &:hover {
    z-index: 5;
  }
  &:hover,
  &:focus-within {
    background: #eee;
    img {
      transform: scale(1.5);
      transform-delay: 0.5s;
    }
    .detail {
      transform: scale(1.5);
    }
  }
  &.active {
    filter: sepia(1);
  }
  &:visited {
    background-color: #eee;
  }
  img {
    box-shadow: 0.5em 0.5em 1em 0 #0004;
    transform: rotate3d(0, 1, 0, 0deg);
    transition: 0.5s ease all;
    backface-visibility: hidden;
    max-height: inherit;
    z-index: 3;
  }
  &:hover {
    img {
      /* transform: scale(1.33); */
      box-shadow: 0 0 1em 0 #0006;
    }
  }
  .detail {
    position: absolute;
    padding: 0.25em;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    display: flex;
    /* background: #fff; */
    /* transform: rotate3d(0, 1, 0, 180deg); */
    transition: 0.75s ease all;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
      opacity: 0;
      text-transform: uppercase;
      transition: 0.75s ease all;
      span {
        background: #fff;
      }
      span,
      mark {
        padding: 0.25em;
        display: inline;
      }
    }
    .year {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 1rem;
      font-weight: bold;
      color: #fff;
      background: #08f;
      padding: 0.25em;
    }
    button {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &:visited .detail {
    color: inherit;
  }
  img {
    transition: 0.75s ease all;
    height: 100%;
    width: auto;
    max-width: 100%;
  }
  .cat {
    position: absolute;
    left: 0;
    bottom: 0;
  }
`;

const IMG = styled.div`
  max-height: 8em;
  height: auto;
  max-width: 16em;
  /* overflow: hidden; */
  text-align: center;
  flex: 1;
  img {
    margin: auto;
  }
`;

function randomNumber(min, max) {
  const range = max - min;
  const rand = Math.random() * range - range / 2;
  return rand;
}

function Link({ size = 0, to, record, children, key, ...props }) {
  const [randomRotate] = useState(() => randomNumber(-4, 4));
  // const { year } = record
  return (
    <ClippingLink
      key={record.id}
      to={to}
      size={size}
      id={record.id}
      title={record.title}
      tabIndex={0}
      style={{ transform: `scale(.92) rotate(${randomRotate}deg)` }}
      {...props}
    >
      {record.img && (
        <IMG>
          <img src={record.img} alt={record.title} loading="lazy" />
        </IMG>
      )}
      <div className="detail">
        <div className="title">{children || <span>{record.title}</span>}</div>
        {record.year > 0 ? <div className="year">{record.year}</div> : null}
        {<div className="cat">{record.categories.map((cat) => cat.emoji)}</div>}
        <HeartableLink url={record.id} readonly hideOff />
      </div>
    </ClippingLink>
  );
}

export default Link;
