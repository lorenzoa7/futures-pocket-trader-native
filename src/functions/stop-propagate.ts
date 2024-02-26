export function stopPropagate(callback: () => void) {
  return (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.stopPropagation()
    e.preventDefault()
    callback()
  }
}
