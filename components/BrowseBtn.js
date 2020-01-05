import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const BrowseBtn = () => {
  return (
    <span
      css={`
        font-size: 18px;
        background: rgb(196, 196, 196);
        padding: 2px 5px;
        color: #fff;
        margin-left: 10px;
        border-radius: 20px;
        cursor: pointer;
        &:hover {
          background: #006aa6;
        }
      `}
    >
      <FontAwesomeIcon icon={faImage} />
    </span>
  )
}

export default BrowseBtn
