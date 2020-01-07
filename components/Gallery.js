import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Transition } from 'react-transition-group'

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

const CloseBtn = styled.span`
  justify-content: center;
  align-items: center;
  display: flex;
  color: #ddd;
  font-size: 25px;
  cursor: pointer;
  position: fixed;
  top: 10px;
  right: 2%;
  line-height: 25px;
  transition: transform 0.2s;

  &:hover {
    color: #fff;
    transform: rotate(360deg);
  }
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

const ImageItem = styled.div`
  border: 1px solid #fff;
  border-radius: 8px;
  height: 175px;
  cursor: pointer;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: ${({ img }) => `url(${img})`};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 10px 0px #f3f3f3;
  }
`

const Gallery = ({ isOpen = false, images = [], onClose }) => {
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
          {/* image grid, carousel */}
          <ImageGridContainer>
            {images.map((imageData, i) => (
              <ImageItem key={i} img={imageData.img}>
                {/* show floor, gender, name(school, dept), download btn, date, index */}
              </ImageItem>
            ))}
          </ImageGridContainer>
        </Backdrop>
      )}
    </Transition>
  )
}

export default Gallery
