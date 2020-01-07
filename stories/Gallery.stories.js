import React, { useState, useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs'
import Gallery from '../components/Gallery'

const mockedImageInArticle = {
  floor: 0,
  host: '原PO - ',
  createdAt: '2020-01-01T00:00:00+08:00',
  school: '匿名',
  department: '',
  gender: 'M',
  img: 'https://fakeimg.pl/320x180/'
}

const mockedImageInComment = {
  floor: 1,
  host: '',
  createdAt: '2020-01-02T10:00:00+08:00',
  school: '國立暨南國際大學',
  department: '資訊管理學系',
  gender: 'M',
  img: 'https://fakeimg.pl/640x800/'
}

const getArticleImages = amount =>
  [...Array(amount)].map(() => mockedImageInArticle)

const getCommentImages = amount =>
  [...Array(amount)].map(() => mockedImageInComment)

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 1000)
  }, [])

  const handleClose = e => {
    setIsOpen(false)
    action('onClose')(e)
  }

  return (
    <Gallery
      isOpen={isOpen}
      images={[mockedImageInArticle, mockedImageInComment]}
      onClose={handleClose}
    />
  )
}

export const ImagesInArticle = () => (
  <Gallery
    isOpen
    images={getArticleImages(
      number('image amount', 10, { range: true, min: 1, max: 50, step: 1 })
    )}
    onClose={action('onClose')}
  />
)

export const ImagesInComment = () => (
  <Gallery
    isOpen
    images={getCommentImages(
      number('image amount', 10, { range: true, min: 1, max: 50, step: 1 })
    )}
    onClose={action('onClose')}
  />
)

export default {
  component: Gallery,
  title: 'Gallery',
  decorators: [withKnobs]
}
