import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import BrowerBtn from './components/BrowseBtn'
import Gallery from './components/Gallery'
import useFetchImage from './components/hooks/fetchImageHook'

const fixBody = () => {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop
  document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;'
}

const looseBody = () => {
  const body = document.body
  body.style.position = ''
  const top = body.style.top
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
  body.style.top = ''
}

const renderReactApp = canonicalUrl => {
  console.log('renderReactApp')
  console.log('canonicalUrl', canonicalUrl)

  if (
    !!canonicalUrl &&
    canonicalUrl.match(/\/(\d*$)/) &&
    !document.getElementById('dcard-images-root')
  ) {
    document.querySelector('[class^=Post_title]').innerHTML +=
      '<span id="dcard-images-root"></span>'
    ReactDOM.render(<App />, document.getElementById('dcard-images-root'))
  }
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { fetchImagesByPostID, images } = useFetchImage()

  const handleOpen = useCallback(() => {
    const postID = document
      .querySelector('link[rel=canonical]')
      .href.match(/(\d*$)/)[0]

    fetchImagesByPostID(postID).then(() => {
      setIsOpen(true)
      fixBody()
    })
  }, [fetchImagesByPostID])

  const handleClose = useCallback(() => {
    looseBody()
    setIsOpen(false)
  }, [])

  return (
    <React.Fragment>
      <BrowerBtn onClick={handleOpen} />
      <Gallery isOpen={isOpen} images={images} onClose={handleClose} />
    </React.Fragment>
  )
}

let canonicalUrl = ''
setInterval(() => {
  const url = document.querySelector('link[rel=canonical]').href
  if (url !== canonicalUrl) {
    canonicalUrl = url
    renderReactApp(canonicalUrl)
  }
}, 500)
