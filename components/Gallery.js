import React from 'react'

const Gallery = ({ images }) => {
  console.log(images)
  return <span>{JSON.stringify(images)}</span>
}

export default Gallery
