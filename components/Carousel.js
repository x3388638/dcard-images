import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

const Conatienr = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 20030;
  top: 0;
  left: 0;
  position: fixed;
  color: #f3f3f3;
`

const Label = styled.span`
  background: ${({ gender }) => (gender === 'F' ? '#f48fb1' : '#81d4fa')};
  font-size: 12px;
  display: inline-flex;
  padding: 5px;
  position: fixed;
  top: 10px;
  left: 0;
  line-height: 14px;
  color: #111;

  span,
  div {
    display: flex;
    align-items: center;
  }

  span + span {
    border-left: 1px solid #111;
    margin-left: 10px;
    padding-left: 10px;
  }
`

const BackBtn = styled.div`
  padding-right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #f3f3f3;

  &:hover {
    color: #444;
  }
`

const Img = styled.img`
  object-fit: contain;
  height: 100%;
  width: 100%;
`

const Index = styled.span`
  position: fixed;
  top: 15px;
  right: 25px;
  line-height: 12px;
  font-size: 12px;
  color: #f3f3f3;
`

const btnBase = styled.span`
  font-size: 40px;
  color: #f3f3f3;
  opacity: 0.3;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: opacity 0.2s;
  line-height: 40px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 50%;
  background: #666;

  &:hover {
    opacity: 1;
  }
`

const PrevBtn = styled(btnBase)`
  left: 50px;
`

const NextBtn = styled(btnBase)`
  right: 50px;
  transform: translateY(-50%) rotate(180deg);
`

const Carousel = ({ images, index, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  const handleIndex = amount => {
    let nextPage = currentIndex + amount
    setCurrentIndex(
      nextPage >= images.length
        ? 0
        : nextPage < 0
        ? images.length - 1
        : nextPage
    )
  }

  const { floor, host, school, department, createdAt, gender, img } = images[
    currentIndex
  ]

  return (
    <Conatienr>
      <Label gender={gender}>
        <BackBtn onClick={onClose}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </BackBtn>
        <span>B{floor}</span>
        <span>
          {host} {school} {department}
          <br />
          {createdAt
            .match(/\d\d-\d\dT\d\d:\d\d/)[0]
            .replace('T', ' ')
            .replace('-', '/')}
        </span>
      </Label>
      <Img src={img} />
      <PrevBtn onClick={() => handleIndex(-1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </PrevBtn>
      <NextBtn onClick={() => handleIndex(1)}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </NextBtn>
      <Index>
        {currentIndex + 1} / {images.length}
      </Index>
    </Conatienr>
  )
}

export default Carousel
