import { useEffect, useState } from 'react'

function Typed({ text, startAt = 0, fast = false }) {
  let displayedText = ''
  const [chars, setChars] = useState(startAt)
  let speedMS = 50
  if (fast) speedMS = 250
  useEffect(() => {
    let timer
    if (chars < text.length) {
      timer = setTimeout(() => {
        let charsToType = 1
        if (fast) {
          charsToType = text.slice(chars).indexOf(' ') + 1
          if (text.slice(chars).indexOf(' ') === -1) charsToType = text.length - chars
        }
        setChars(chars + charsToType)
      }, speedMS)
    }
    return () => clearTimeout(timer)
  }, [chars, text, fast, speedMS])
  if (chars < 0) return ''
  let whiteSpace = [...(new Array(text.length - chars))].map(() => ' ').join('')
  displayedText = text.slice(0, chars) + whiteSpace
  return displayedText
}

export default Typed
