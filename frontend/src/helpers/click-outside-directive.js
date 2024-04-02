export default {
    mounted(element, binding) {
      const clickEventHandler = (event) => {
        if (!element.contains(event.target)) {
          binding.value(event)
        }
      }
      element.__clickedOutsideHandler__ = clickEventHandler
      document.addEventListener("click", clickEventHandler)
    },
    unmounted(element) {
      document.removeEventListener("click", element.__clickedOutsideHandler__)
    },
  }
