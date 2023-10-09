import { type RefObject, useLayoutEffect, useRef, useState, useEffect } from "react"

const _DANGEROUSLY_HACKY_REVISION_POINTS = 23;
const _DANGEROUSLY_HACKY_RESIZE_ANIMATION_DURATION = 0.12
const _DANGEROUSLY_HACKY_SCROLL_ANIMATION_DURATION = 0.142
const _DANGEROUSLY_HACKY_DELAY_DURATION = 0.08
const _DANGEROUSLY_HACKY_DEBOUNCE_DURATION = 50

const useSticky = ({buttonMarginBottom, inputs, scrollDOMRef}: {
  inputs?: RefObject<HTMLInputElement | HTMLTextAreaElement>[]
  scrollDOMRef?: RefObject<HTMLElement> | null
  buttonMarginBottom: number;
}) => {
  const buttonEl = useRef<HTMLButtonElement>(null);
  const inputEl = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isButtonSticky, setIsButtonSticky] = useState(false)

  const [isInputFocused, setIsInputFocused] = useState(false)
  const [revisionPoints, setRevisionPoints] = useState<null | number>(null)
  const [debouncedRevisionPoints, setDebouncedRevisionPoints] = useState<null | number>(null)

  useLayoutEffect(() => {
    if(inputs && inputs.length > 0) {
      inputs.forEach(input => {
        if(!input.current) return;

        input.current.onfocus = () => {
          setIsInputFocused(true)
        }
        input.current.onblur = () => {
          setIsInputFocused(false)
        }
      })
      return;
    }    
    
    if(!inputEl.current) return;

    inputEl.current.onfocus = () => {
      setIsInputFocused(true)
    }
    inputEl.current.onblur = () => {
      setIsInputFocused(false)
    }

    return () => {
      if(inputs && inputs.length > 0) {
        inputs.forEach(input => {
          if(!input.current) return;
  
          input.current.onfocus = null
          input.current.onblur = null        
        })
      }
      if(!inputEl.current) return;

      inputEl.current.onfocus = null;     
      inputEl.current.onblur = null    
    }
  }, [])

  useLayoutEffect(() => {
    if(!window.visualViewport) return;

    const resizeHandler = () => {
      if(!window.visualViewport) return;
      const revisionPoints = window.outerHeight - window.visualViewport.height - window.visualViewport.offsetTop
      setRevisionPoints(revisionPoints)
    }
    resizeHandler();

    const scrollHandler = () => {
      if(!window.visualViewport) return;
      const revisionPoints = window.outerHeight - window.visualViewport.height - window.visualViewport.offsetTop
      setRevisionPoints(revisionPoints)
    }
    scrollHandler();

    window.visualViewport.addEventListener('resize', resizeHandler)
    if(scrollDOMRef?.current) {
      scrollDOMRef.current.addEventListener('scroll', scrollHandler)
    } else {
      window.addEventListener('scroll', scrollHandler)
    }

    return () => {
      if(!window.visualViewport) return;

      window.visualViewport.removeEventListener('resize', resizeHandler)
      if(scrollDOMRef?.current) {
        scrollDOMRef.current.removeEventListener('scroll', scrollHandler)
      } else {
        window.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRevisionPoints(revisionPoints);
    }, _DANGEROUSLY_HACKY_DEBOUNCE_DURATION)

    return () => {
      clearTimeout(handler);
    };
  }, [revisionPoints]);


  useLayoutEffect(() => {
    if(!buttonEl.current) return;

    if(isInputFocused) {
      const translateY = (debouncedRevisionPoints ?? 0) + buttonEl.current.clientHeight + buttonMarginBottom - _DANGEROUSLY_HACKY_REVISION_POINTS;

      buttonEl.current?.style.setProperty('transition', `transform ${window?.visualViewport?.offsetTop === 0 ? _DANGEROUSLY_HACKY_RESIZE_ANIMATION_DURATION : _DANGEROUSLY_HACKY_SCROLL_ANIMATION_DURATION}s ease-in-out`)
      buttonEl.current?.style.setProperty('transition-delay', `${_DANGEROUSLY_HACKY_DELAY_DURATION}s`)
      buttonEl.current?.style.setProperty('position', 'absolute')
      buttonEl.current?.style.setProperty('transform', `translateY(-${translateY}px)`)
      setIsButtonSticky(true)
      return;
    }

    buttonEl.current?.style.setProperty('transition', `transform 0s ease-in-out`)
    buttonEl.current?.style.setProperty('transition-delay', '0s')
    buttonEl.current?.style.setProperty('transform', `translateY(0px)`)
    setIsButtonSticky(false)
  }, [isInputFocused, debouncedRevisionPoints])

  return { buttonEl, inputEl, isButtonSticky };
}

export default useSticky;