# Pessimists Archive

## document

https://docs.google.com/document/d/1xVRnzV8G-sCLL9rWQ7YQsHnRJ9HFkNfSKd6U9fEuWtM/edit


## deploy

https://app.netlify.com/sites/pessimistsarchive/deploys

## to do

* tech debt
  * general refactoring
  * anonymous "/archive" component, mostly redundant use of <Clipping /> in App.js
  * update "category" to "list" (?)
    * /list/:listName/clippings/:year/:id?
* deployment
  * [x] server side rendering
  * [x] twitter cards
  * heroku
  * netlify server
* mobile accessibility
  * clipping view
* URLs
  * question: how do we ensure URLs are stable across database migrations (possibly data added / merged, changed in order?)?
  * current clipping "id" / url = "/cat/:categoryName/clippings/:year/:index"
    * index = 0-indexed place of clipping within year (ordered by order of trello "cards" array)

## Edge case data
* **Very wide**
  * http://localhost:3000/clippings/1930/2?s=doub&group=null
* **Tall images**
  * ?
* **Small images**
  * ?
* **Big images**
  * ?

## Lists / "Categories"

1. We started out creating Categories manually from a JSON that searches the cards' title & description for a specified search term (or the "category name" by default)
1. We then created category pages for the items of this JSON
1. Now it seems we have a new canonical source of "categories", which are in fact called "lists", altough they don't have emoji data so it can be helpful to reconcile them with a legacy "manual" category
1. Now we have discovered "lists" in the trello data to be a source of truth for "category" (now "list") pages, there are tasks to migrate & cleanup fully:
  * moving conceptualization (names, urls etc) from category to list [watch out for name conflict if "list" or "category" have multiple uses]
  * url = pessimistsarchive.com/list/electricity/2000/0
1. we also have a parallel task for the URLs which is prehaps changing them (e.g. to contain a unique ID that matches trello, or to contain the title (good for SEO))
  * e.g. "PessimistsArchive.com/list/electricity/a9f8-1880-edison-blamed"
    * /list/:listName +
    * /:uniqueID-:year-:title
      * where uniqueID is a four-character hexadeimcal or base-64 BLOB relating to its trello ID for brevity

## Example abstracted "archive" data

* Top level: lists (index on list-name)
* 2nd level: index by year & title keywords

```js
// object
archive.clips.list = {
  lowercaselistname: [

  ]
}
```
