require('intersection-observer')
import { useState, useCallback, useMemo } from 'react'

const useIntersectionObserver = options => {
  const [entries, setEntries] = useState([])

  const onIntersect = useCallback(entries => {
    setEntries(entries)
  }, [])

  const observer = useMemo(
    () => new IntersectionObserver(onIntersect, options),
    [onIntersect, options]
  )

  const observe = useCallback(target => {
    let targetList = target
    if (!(target instanceof Array)) {
      targetList = [target]
    }

    targetList.forEach(target => {
      observer.observe(target)
    })
  }, [])

  const disconnect = useCallback(() => {
    observer.disconnect()
  }, [])

  return {
    observe,
    disconnect,
    entries
  }
}

export default useIntersectionObserver
