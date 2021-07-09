import Categories from './categories.json'
import Archive from './PessimistsArchive.json'

const yearRE = /\d\d\d\d/

function ordinalSuffix(i) {
  let j = i % 10
  let k = i % 100
  let suffix = 'th'
  if (j === 1 && k !== 11) suffix = "st"
  else if (j === 2 && k !== 12) suffix = "nd"
  else if (j === 3 && k !== 13) suffix = "rd"
  return i + suffix
}

const getArchiveYearGroups = (cards, groupSize = 1, baseURL = '/clippings') => {
  let groups = {}
  const yearIndices = {}
  cards.forEach(card => {
    let [y, ...title] = card.name.split(' ')
    let year = Number.parseInt(y)
    if (!year && yearRE.exec(card.name)) year = yearRE.exec(card.name)[0]
    if (!year) {
      year = 0
      title.unshift(y)
    }
    let yearGrouped = year - (year % groupSize)
    if (groupSize === 10) yearGrouped += 's'
    if (groupSize === 100) yearGrouped = ordinalSuffix((yearGrouped / 100) + 1)
    if (!(yearGrouped in groups)) groups[yearGrouped] = []
    yearIndices[year] = (year in yearIndices) ? (yearIndices[year] + 1) : 0
    const index = yearIndices[year]
    let categories = []
    let categoryURL
    Categories.forEach(category => {
      let match = category.search || category.name.toLowerCase()
      let cardText = [card.name, card.desc].join(' ').toLowerCase()
      // let cardList
      // if (card.idList) cardList = Archive.lists.find(list => list.id === card.idList)
      if (cardText.includes(match)) {
        let listURL = `/cat/${match.replace(' ', '')}/clippings`
        categoryURL = `${listURL}/${year}/${index}`
        categories.push({ ...category, url: listURL })
      }
    })
    let list
    if (card.idList) {
      list = Archive.lists.find(list => list.id === card.idList)
    }
    let localURL = `${baseURL}/${year}/${index}`
    groups[yearGrouped].push({
      id: ['clipping', year, index].join('-'),
      trelloId: card.id,
      list,
      title: title.join(' '),
      category: categories[0],
      categories,
      desc: card.desc,
      url: card.url,
      attachments: card.attachments,
      localURL,
      categoryURL,
      img: card.cover.scaled ? card.cover.scaled[3].url : null,
      full: card.cover.scaled ? card.cover.scaled[card.cover.scaled.length - 1].url : null,
      fullY: card.cover.scaled ? card.cover.scaled[card.cover.scaled.length - 1].height : null,
      fullX: card.cover.scaled ? card.cover.scaled[card.cover.scaled.length - 1].width : null,
      year,
      index,
      tags: [],
      data: card
    })
  })
  return groups
}

const clips = {
  year: getArchiveYearGroups(Archive.cards)
}

const archive = {
  clips
}

export { getArchiveYearGroups }
export default archive
