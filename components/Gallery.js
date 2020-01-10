import React, { useState, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimesCircle,
  faRedo,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { Transition } from 'react-transition-group'
import Carousel from './Carousel'
import ImageItem from './ImageItem'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.95);
  z-index: 20020;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  opacity: 0;
  padding: 0 calc(3% + 25px);
  overflow: auto;
  box-sizing: border-box;
`

const ToolBtn = styled.span`
  justify-content: center;
  align-items: center;
  display: flex;
  color: #ddd;
  font-size: 25px;
  cursor: pointer;
  position: fixed;
  right: 2%;
  line-height: 25px;
  transition: transform 0.2s;

  &:hover {
    color: #fff;
    transform: rotate(360deg);
  }
`

const CloseBtn = styled(ToolBtn)`
  top: 10px;
`

const ReloadBtn = styled(ToolBtn)`
  top: 50px;
`

const ImageGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
  margin: 50px 0;

  @media screen and (max-width: 1480px) {
    & {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media screen and (max-width: 1024px) {
    & {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 768px) {
    & {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${rotate} 1s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
  color: #f3f3f3;
  font-size: 24px;
  height: 175px;
`

const Gallery = ({
  isOpen = false,
  isFetching = false,
  images = [],
  onClose
}) => {
  const [reload, setReload] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(null)
  const handleReload = useCallback(() => {
    setReload(c => c + 1)
  }, [])

  const closeCarousel = useCallback(() => {
    setCarouselIndex(null)
  }, [])

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
  }

  return (
    <Transition
      in={isOpen}
      timeout={{ enter: 0, exit: 225 }}
      mountOnEnter
      unmountOnExit
    >
      {state => (
        <Backdrop style={transitionStyles[state]}>
          <CloseBtn onClick={onClose}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </CloseBtn>
          <ReloadBtn onClick={handleReload}>
            <FontAwesomeIcon icon={faRedo} />
          </ReloadBtn>
          <ImageGridContainer>
            {images.map((imageData, i) => (
              <ImageItem
                key={i}
                reload={reload}
                imageData={imageData}
                onClick={() => {
                  setCarouselIndex(i)
                }}
              />
            ))}
            {isFetching && (
              <Loading>
                <FontAwesomeIcon icon={faSpinner} />
              </Loading>
            )}
          </ImageGridContainer>
          {carouselIndex !== null && (
            <Carousel
              onClose={closeCarousel}
              images={images}
              index={carouselIndex}
            />
          )}
        </Backdrop>
      )}
    </Transition>
  )
}

export default Gallery
