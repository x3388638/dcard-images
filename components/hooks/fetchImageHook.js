import { useState, useCallback } from 'react'

const useFetchImage = () => {
  const [images, setImages] = useState([])

  const IMGUR_REGEX = 'https?://i\\.imgur\\.com/\\w*\\.(jpg|png)'
  const MEGAPX_REGEX = 'https?://megapx(?:-assets)?\\.dcard\\.tw/\\S+'

  const isImage = useCallback(
    url =>
      new RegExp(IMGUR_REGEX).test(url) || new RegExp(MEGAPX_REGEX).test(url),
    []
  )

  const getImagesInPost = useCallback(
    post =>
      post.media.reduce((result, mediaData) => {
        if (isImage(mediaData.url)) {
          result.push({
            floor: 0,
            createdAt: post.createdAt,
            school: post.school || '匿名',
            department: post.department || '',
            gender: post.gender,
            imgHash: 'Deprecated', // FIXME
            img: mediaData.url
          })
        }

        return result
      }, []),
    [isImage]
  )

  const getImagesInAllComments = useCallback((postID, commentCount) => {
    const commentsPerPage = 30

    return Promise.all(
      [...Array(Math.ceil(commentCount / commentsPerPage))].map((val, i) =>
        fetch(
          `/_api/posts/${postID}/comments?after=${i * commentsPerPage}`
        ).then(res => res.json())
      )
    ).then(commentSets =>
      commentSets.reduce((result, commentSet) => {
        commentSet.forEach(comment => {
          const links =
            (comment.content &&
              comment.content.match(new RegExp(IMGUR_REGEX, 'gi'))) ||
            []

          links.forEach(link => {
            result.push({
              floor: comment.floor,
              host: comment.host ? '原PO - ' : '',
              createdAt: comment.createdAt,
              school: comment.school || '匿名',
              department: comment.department || '',
              gender: comment.gender,
              imgHash: 'Deprecated',
              img: link.match(IMGUR_REGEX)[0]
            })
          })
        })

        return result
      }, [])
    )
  }, [])

  const fetchImagesByPostID = useCallback(
    postID => {
      if (postID) {
        return fetch(`/_api/posts/${postID}`)
          .then(res => res.json())
          .then(post =>
            Promise.all([
              getImagesInPost(post),
              getImagesInAllComments(postID, post.commentCount)
            ])
          )
          .then(([imagesInPost, imagesInAllComments]) => {
            setImages([...imagesInPost, ...imagesInAllComments])
            return true
          })
      } else {
        return Promise.reject()
      }
    },
    [getImagesInPost, getImagesInAllComments]
  )

  return { fetchImagesByPostID, images }
}

export default useFetchImage
