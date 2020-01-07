import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import BrowerBtn from './components/BrowseBtn'
import Gallery from './components/Gallery'
import useFetchImage from './components/hooks/fetchImageHook'
// import { PubSub } from './util'

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

const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { fetchImagesByPostID, images } = useFetchImage()

  const handleOpen = useCallback(() => {
    const postID = document
      .querySelector('link[rel=canonical]')
      .href.match(/(\d*$)/)[0]

    fetchImagesByPostID(postID).then(() => {
      setIsOpen(true)
      fixBody()
    })
  }, [fetchImagesByPostID])

  const handleClose = useCallback(() => {
    looseBody()
    setIsOpen(false)
  }, [])

  return (
    <React.Fragment>
      <BrowerBtn onClick={handleOpen} />
      <Gallery isOpen={isOpen} images={images} onClose={handleClose} />
    </React.Fragment>
  )
}

document.querySelector('[class^=Post_title]').innerHTML +=
  '<span id="dcard-images-root"></span>'
ReactDOM.render(<App />, document.getElementById('dcard-images-root'))

// const _scripts = [
//   'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js',
//   'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.core.min.js'
// ]

// const _styles = [
//   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
// ]

// const _galleryBack = document.createElement('div')
// const _galleryImg = document.createElement('img')
// const _galleryNum = document.createElement('span')
// const _galleryTitle = document.createElement('span')
// const _galleryNext = document.createElement('span')
// const _galleryPrev = document.createElement('span')
// const _galleryClose = document.createElement('span')
// const IMGUR_REGEX = /https?:\/\/i\.imgur\.com\/(\w*)\.(jpg|png)/
// const IMGUR_REGEX_g = /https?:\/\/i\.imgur\.com\/\w*\.(jpg|png)/g
// const _commentUnit = 30
// let _isOpen = false
// let _pastURL = ''
// let _images = []
// let _currentImg = 0

// function init() {
//   _addStyle()
//   _addScript()
//   _initGallery()
//   _handleURLChange()
//   _URLCheck()
// }

// function _addScript() {
//   _scripts.forEach(s => {
//     const script = document.createElement('script')
//     script.src = s
//     document.head.appendChild(script)
//   })
// }

// function _addStyle() {
//   _styles.forEach(style => {
//     const link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.href = style
//     document.head.appendChild(link)
//   })

//   const style = document.createElement('style')
//   style.innerHTML = `
// 			.DcardImages__showGalleryBtn {
// 				font-size: 18px;
// 				background: rgb(196, 196, 196);
// 				padding: 5px;
// 				color: #fff;
// 				margin-left: 10px;
// 				border-radius: 20px;
// 				cursor: pointer;
// 			}

// 			.DcardImages__showGalleryBtn:hover {
// 				background: #006aa6;
// 			}

// 			.DcardImages__close {
// 				position: absolute;
// 				top: 20px;
// 				right: 30px;
// 				color: #bbb;
// 				font-size: 24px;
// 				padding: 5px;
// 				line-height: 12px;
// 				cursor: pointer;
// 			}

// 			.DcardImages__close:hover {
// 				color: red;
// 			}

// 			.DcardImages__galleryBack {
// 				position: fixed;
// 				height: 100vh;
// 				width: 100vw;
// 				background: rgba(0,0,0,.95);
// 				z-index: 20020;
// 				display: none;
// 			}

// 			.DcardImages__img {
// 				object-fit: contain;
// 				height: 100%;
// 				width: 100%
// 			}

// 			.DcardImages__num {
// 				position: absolute;
// 				top: 20px;
// 				left: 20px;
// 				color: #f3f3f3;
// 				display: inline-block;
// 				border-radius: 20px;
// 				font-weight: bold;
// 			}

// 			.DcardImages__title {
// 				position: absolute;
// 				top: 60px;
// 				left: 0;
// 				background: #fafafab3;
// 				display: inline-block;
// 				padding: 5px 20px;
// 				font-weight: bold;
// 			}

// 			.DcardImages__title--female {
// 				position: absolute;
// 				top: 60px;
// 				left: 0;
// 				display: inline-block;
// 				padding: 5px 20px;
// 				font-weight: bold;
// 				background: #f48fb1;
// 			}

// 			.DcardImages__title--male {
// 				position: absolute;
// 				top: 60px;
// 				left: 0;
// 				display: inline-block;
// 				padding: 5px 20px;
// 				font-weight: bold;
// 				background: #81d4fa;
// 			}

// 			.DcardImages__nextBtn {
// 				position: absolute;
// 				right: 5vw;
// 				top: 45vh;
// 				font-size: 60px;
// 				color: #bbb;
// 				cursor: pointer;
// 				opacity: 0.3;
// 			}

// 			.DcardImages__prevBtn {
// 				position: absolute;
// 				left: 5vw;
// 				top: 45vh;
// 				font-size: 60px;
// 				color: #bbb;
// 				cursor: pointer;
// 				opacity: 0.3;
// 			}

// 			.DcardImages__nextBtn:hover,
// 			.DcardImages__prevBtn:hover {
// 				opacity: 1;
// 			}
// 		`

//   document.head.appendChild(style)
// }

// function _initGallery() {
//   _galleryBack.setAttribute('class', 'DcardImages__galleryBack')
//   _galleryImg.setAttribute('class', 'DcardImages__img')
//   _galleryNum.setAttribute('class', 'DcardImages__num')
//   _galleryTitle.setAttribute('class', 'DcardImages__title')

//   _galleryNext.setAttribute('class', 'DcardImages__nextBtn')
//   _galleryNext.innerHTML =
//     '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
//   _galleryNext.addEventListener('click', _handleNext)

//   _galleryPrev.setAttribute('class', 'DcardImages__prevBtn')
//   _galleryPrev.innerHTML =
//     '<i class="fa fa-chevron-left" aria-hidden="true"></i>'
//   _galleryPrev.addEventListener('click', _handlePrev)

//   _galleryClose.innerHTML = '&times;'
//   _galleryClose.setAttribute('class', 'DcardImages__close')
//   _galleryClose.addEventListener('click', _handleClose)

//   _galleryBack.appendChild(_galleryImg)
//   _galleryBack.appendChild(_galleryNum)
//   _galleryBack.appendChild(_galleryTitle)
//   _galleryBack.appendChild(_galleryNext)
//   _galleryBack.appendChild(_galleryPrev)
//   _galleryBack.appendChild(_galleryClose)
//   document.body.appendChild(_galleryBack)

//   document.body.addEventListener('keydown', function(e) {
//     if (_isOpen) {
//       switch (e.which) {
//         case 27:
//           _handleClose()
//           break
//         case 37:
//           _handlePrev()
//           break
//         case 39:
//           _handleNext()
//           break
//       }
//     }
//   })
// }

// function _URLCheck() {
//   setInterval(() => {
//     if (
//       _pastURL !== location.href &&
//       !!document.querySelector('[class^=Post_title]')
//     ) {
//       _pastURL = location.href
//       PubSub.emit('URLChange')
//     }
//   }, 900)
// }

// function _handleURLChange() {
//   PubSub.on('URLChange', () => {
//     const canonical = document.querySelector('link[rel=canonical]')
//     if (
//       !!canonical &&
//       canonical.href.match(/\/(\d*$)/) &&
//       !document.querySelectorAll('.DcardImages__showGalleryBtn').length
//     ) {
//       const btn = document.createElement('span')
//       btn.setAttribute('class', 'DcardImages__showGalleryBtn')
//       btn.setAttribute('title', '瀏覽圖片')
//       btn.innerHTML = '<i class="fa fa-picture-o" aria-hidden="true"></i>'
//       btn.addEventListener('click', _handleClick)
//       document.querySelector('[class^=Post_title]').appendChild(btn)
//     }
//   })
// }

// function _isImgurLink(link) {
//   return IMGUR_REGEX.test(link)
// }

// function _getPost(postID) {
//   return fetch(`/_api/posts/${postID}`).then(res => res.json())
// }

// function _imagesInPost(post) {
//   return post.media
//     .filter(media => _isImgurLink(media.url))
//     .map(media => ({
//       floor: 0,
//       createdAt: post.createdAt,
//       school: post.school || '匿名',
//       department: post.department || '',
//       gender: post.gender,
//       imgHash: media.url.match(IMGUR_REGEX)[1]
//     }))
// }

// function _fetchComments(postID, after) {
//   return fetch(`/_api/posts/${postID}/comments?after=${after}`).then(res =>
//     res.json()
//   )
// }

// function _imagesInAllComments(postID, commentCount) {
//   return Promise.all(
//     [...new Array(Math.ceil(commentCount / _commentUnit))].map((val, i) =>
//       new Promise(resolve =>
//         setTimeout(resolve, parseInt(i / 10) * 12)
//       ).then(() => _fetchComments(postID, i * _commentUnit))
//     )
//   ).then(commentSets =>
//     commentSets
//       .reduce((comments, set) => comments.concat(set), [])
//       .map(comment => {
//         const links =
//           (comment.content && comment.content.match(IMGUR_REGEX_g)) || []
//         return links.map(link => ({
//           floor: comment.floor,
//           host: comment.host ? '原PO - ' : '',
//           createdAt: comment.createdAt,
//           school: comment.school || '匿名',
//           department: comment.department || '',
//           gender: comment.gender,
//           imgHash: link.match(IMGUR_REGEX)[1]
//         }))
//       })
//       .reduce((result, links) => result.concat(links), [])
//   )
// }

// function _handleClick() {
//   _images = []
//   const postID = _.head(
//     document.querySelector('link[rel=canonical]').href.match(/(\d*$)/)
//   )
//   if (postID) {
//     _getPost(postID)
//       .then(post =>
//         Promise.all([
//           _imagesInPost(post),
//           _imagesInAllComments(postID, post.commentCount)
//         ])
//       )
//       .then(([imagesInPost, imagesInAllComments]) => {
//         _images = imagesInPost.concat(imagesInAllComments)
//         _renderGallery()
//       })
//   }
// }

// function _renderGallery() {
//   if (!_images.length) {
//     return
//   }

//   _isOpen = true
//   _galleryBack.style.display = 'block'
//   _currentImg = 0
//   _renderImage(_currentImg)
// }

// function _renderImage(index) {
//   _galleryImg.setAttribute(
//     'src',
//     `https://imgur.dcard.tw/${_images[index].imgHash}.jpg`
//   )
//   _galleryNum.innerText = `${index + 1}/${_images.length}`
//   if (_images[index].gender === 'F') {
//     _galleryTitle.setAttribute('class', 'DcardImages__title--female')
//   } else {
//     _galleryTitle.setAttribute('class', 'DcardImages__title--male')
//   }

//   _galleryTitle.innerHTML = `
// 			${_images[index].host || ''}${_images[index].school} ${
//     _images[index].department
//   }<br />
// 			B${_images[index].floor} | ${moment(_images[index].createdAt)
//     .utc(8)
//     .format('M月DD日 HH:mm')}
// 		`
// }

// function _handleNext() {
//   _currentImg++
//   if (!_images[_currentImg]) {
//     _currentImg = 0
//   }

//   _renderImage(_currentImg)
// }

// function _handlePrev() {
//   _currentImg--
//   if (_currentImg < 0) {
//     _currentImg = _images.length - 1
//   }

//   _renderImage(_currentImg)
// }

// function _handleClose() {
//   _isOpen = false
//   _galleryBack.style.display = 'none'
// }

// init()
