import { useState, useCallback } from 'react'

const IMGUR_REGEX = 'https?://i\\.imgur\\.com/\\w*\\.(jpg|png)'
const MEGAPX_REGEX = 'https?://megapx(?:-assets)?\\.dcard\\.tw/\\S+'

const isImage = url =>
  new RegExp(IMGUR_REGEX).test(url) || new RegExp(MEGAPX_REGEX).test(url)

const getImagesInPost = post =>
  Promise.resolve(
    post.media.reduce((result, mediaData) => {
      if (isImage(mediaData.url)) {
        result.push({
          floor: 0,
          createdAt: post.createdAt,
          school: post.school || '匿名',
          department: post.department || '',
          gender: post.gender,
          img: mediaData.url.replace('i.imgur.com', 'imgur.dcard.tw')
        })
      }

      return result
    }, [])
  )

const combineImages = commentSets =>
  commentSets.reduce((result, commentSet) => {
    commentSet.forEach(comment => {
      const {
        content,
        floor,
        host,
        createdAt,
        school,
        department,
        gender
      } = comment

      if (!content) {
        return
      }

      const links = [
        ...(content.match(new RegExp(IMGUR_REGEX, 'gi')) || []),
        ...(content.match(new RegExp(MEGAPX_REGEX, 'gi')) || [])
      ]

      links.forEach(link => {
        result.push({
          floor,
          host: host ? '原PO - ' : '',
          createdAt,
          school: school || '匿名',
          department: department || '',
          gender,
          img: link.replace('i.imgur.com', 'imgur.dcard.tw')
        })
      })
    })

    return result
  }, [])

const useFetchImage = () => {
  const [images, setImages] = useState([])

  const getImagesInAllComments = useCallback((postID, commentCount) => {
    const commentsPerPage = 30
    const timesToCallApi = Math.ceil(commentCount / commentsPerPage)
    const maxApiCallOneTime = 5

    return [...Array(Math.ceil(timesToCallApi / maxApiCallOneTime))]
      .map((v, i) =>
        [...Array(maxApiCallOneTime)].map((v, j) => {
          const index = i * maxApiCallOneTime + j
          if (index + 1 > timesToCallApi) {
            return null
          }

          return index * commentsPerPage
        })
      )
      .reduce(
        (_p, floorStartSet) =>
          _p
            .then(() =>
              Promise.all(
                floorStartSet.map(floor =>
                  floor !== null
                    ? fetch(
                        `/_api/posts/${postID}/comments?after=${floor}`
                      ).then(res => res.json())
                    : []
                )
              )
            )
            .then(combineImages)
            .then(images => {
              setImages(state => [...state, ...images])

              return new Promise(resolve => {
                setTimeout(() => {
                  resolve()
                }, 777)
              })
            }),
        Promise.resolve()
      )
  }, [])

  const fetchImagesByPostID = useCallback(
    postID => {
      if (postID) {
        return fetch(`/_api/posts/${postID}`)
          .then(res => res.json())
          .then(post =>
            getImagesInPost(post).then(images => {
              setImages(state => [...state, ...images])
              return getImagesInAllComments(postID, post.commentCount)
            })
          )
      } else {
        return Promise.reject()
      }
    },
    [getImagesInAllComments]
  )

  return { fetchImagesByPostID, images }
}

export default useFetchImage
