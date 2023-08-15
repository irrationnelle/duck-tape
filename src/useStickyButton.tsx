import { type RefObject, useLayoutEffect, useRef, useState } from "react"

const _DANGEROUSLY_HACKY_REVISION_POINTS = 23;

const useSticky = ({buttonMarginBottom, inputs}: {
  inputs?: RefObject<HTMLInputElement>[]
  buttonMarginBottom: number;
}) => {
  const buttonEl = useRef<HTMLButtonElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const [isButtonSticky, setIsButtonSticky] = useState(false)

  const [isInputFocused, setIsInputFocused] = useState(false)
  const [revisionPoints, setRevisionPoints] = useState<null | number>(null)

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
    window.addEventListener('scroll', scrollHandler)

    return () => {
      if(!window.visualViewport) return;

      window.visualViewport.removeEventListener('resize', resizeHandler)
      window.addEventListener('scroll', scrollHandler)
    }
  }, [])

  useLayoutEffect(() => {
    if(!buttonEl.current) return;

    if(isInputFocused) {
      const translateY = (revisionPoints ?? 0) + buttonEl.current.clientHeight + buttonMarginBottom - _DANGEROUSLY_HACKY_REVISION_POINTS;

      buttonEl.current?.style.setProperty('position', 'absolute')
      buttonEl.current?.style.setProperty('transform', `translateY(-${translateY}px)`)
      setIsButtonSticky(true)
      return;
    }

    buttonEl.current?.style.setProperty('position', 'relative')
    buttonEl.current?.style.setProperty('transform', `translateY(0px)`)
    setIsButtonSticky(false)
  }, [isInputFocused, revisionPoints])

  return { buttonEl, inputEl, isButtonSticky };
}

export default useSticky;