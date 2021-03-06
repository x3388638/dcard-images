import React from 'react'
import Carousel from '../components/Carousel'
import { action } from '@storybook/addon-actions'

const mockedImages = [...Array(10)].map((val, i) => {
  const vertical = '252/448'
  const horizontal = '448/252'

  return {
    floor: i,
    host: '',
    createdAt: '2020-01-02T10:00:00+08:00',
    school: `國立暨南國際大學${i}`,
    department: '資訊管理學系',
    gender: 'F',
    img: `https://picsum.photos/${
      i % 2 === 0 ? vertical : horizontal
    }?random=${i}`
  }
})

export const Default = () => (
  <Carousel index={3} images={mockedImages} onClose={action('onClose')} />
)

export default {
  title: 'Carousel',
  component: Carousel
}
