export const PubSub = (() => {
  const _events = {}

  function on(event, callback) {
    _events[event] = callback
  }

  function emit(event) {
    if (_events[event]) {
      _events[event]()
    }
  }

  return {
    on,
    emit
  }
})()
