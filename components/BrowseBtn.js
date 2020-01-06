import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const BrowseBtn = ({ onClick }) => {
  return (
    <span
      css={`
        font-size: 18px;
        background: rgb(196, 196, 196);
        padding: 6px 8px;
        color: #fff;
        margin-left: 10px;
        border-radius: 50%;
        cursor: pointer;
        vertical-align: top;
        &:hover {
          background: #006aa6;
        }
      `}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faImage} />
    </span>
  )
}

export default BrowseBtn
