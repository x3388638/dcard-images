import React, { useState, useCallback, useEffect } from 'react'
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
  if (
    !!canonicalUrl &&
    canonicalUrl.match(/\/(\d*$)/) &&
    !document.getElementById('dcard-images-root')
  ) {
    document.querySelector('article h1').innerHTML +=
      '<span id="dcard-images-root"></span>'
    ReactDOM.render(<App />, document.getElementById('dcard-images-root'))
  }
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchError, setIsFetchError] = useState(false)
  const { fetchImagesByPostID, images } = useFetchImage()

  useEffect(() => {
    if (isOpen && !images.length && !isFetching) {
      fetchImages()
    }
  }, [isOpen, images, fetchImages])

  useEffect(() => {
    if (isOpen && isFetchError) {
      handleClose()
    }
  }, [isOpen, isFetchError, handleClose])

  const fetchImages = useCallback(() => {
    const postID = document
      .querySelector('link[rel=canonical]')
      .href.match(/(\d*$)/)[0]

    setIsFetching(true)
    setIsFetchError(false)
    fetchImagesByPostID(postID)
      .then(() => {
        setIsFetching(false)
      })
      .catch(() => {
        setIsFetchError(true)
      })

    setIsOpen(true)
    fixBody()
  }, [fetchImagesByPostID])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    fixBody()
  }, [])

  const handleClose = useCallback(() => {
    looseBody()
    setIsOpen(false)
  }, [])

  return (
    <React.Fragment>
      <BrowerBtn onClick={handleOpen} />
      <Gallery
        isOpen={isOpen}
        images={images}
        isFetching={isFetching}
        onClose={handleClose}
      />
    </React.Fragment>
  )
}

let canonicalUrl = ''
setInterval(() => {
  const canonical = document.querySelector('link[rel=canonical]')
  const url = canonical && canonical.href
  if (url && url !== canonicalUrl) {
    canonicalUrl = url
    renderReactApp(canonicalUrl)
  }
}, 500)
