import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import useIntersectionObserver from './hooks/intersectionObserverHook'

const Item = styled.div`
  border: 1px solid #fff;
  border-radius: 8px;
  height: 175px;
  cursor: pointer;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: ${({ img }) => `url(${img})`};
  transition: box-shadow 0.2s;
  position: relative;
  margin: 5px;

  &:hover {
    box-shadow: 0 0 10px 0 #f3f3f3;
  }
`

const Label = styled.span`
  background: ${({ gender }) => (gender === 'F' ? '#f48fb1' : '#81d4fa')};
  display: inline-flex;
  position: absolute;
  font-size: 12px;
  padding: 5px;
  top: 5px;
  left: -5px;
  line-height: 16px;
  color: #111;

  span + span {
    margin-left: 5px;
  }
`

const ImageItem = ({ imageData, onClick }) => {
  const [isIntersected, setIsIntersected] = useState(false)
  const itemRef = useRef(null)
  const { observe, disconnect, entries } = useIntersectionObserver()

  useEffect(() => {
    if (itemRef.current) {
      observe(itemRef.current)
    }

    return disconnect
  }, [itemRef])

  useEffect(() => {
    if (entries[0] && entries[0].isIntersecting) {
      setIsIntersected(true)
    }
  }, [entries])

  const { img, gender, floor, host, school, department } = imageData
  const defaultImg = 'https://fakeimg.pl/350x200/?text=Loading...'

  return (
    <Item
      ref={itemRef}
      img={isIntersected ? img : defaultImg}
      onClick={onClick}
    >
      <Label gender={gender}>
        <span>B{floor}</span>
        <span>
          {host} {school}
          <br />
          {department}
        </span>
      </Label>
    </Item>
  )
}

export default ImageItem
