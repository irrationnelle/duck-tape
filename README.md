# ducktape-button

sticky button for webview environment in iOS

## installation

```shell
yarn add ducktape-button
```

## usage

```jsx
import { useRef } from 'react'
import createStickyButton from 'ducktape-button';

const useStickyButton = createStickyButton();

const ExampleComponent = () => {
  const inputEl = useRef();

  const { buttonEl, isButtonSticky } = useSticky({
    inputs: [inputEl],
    buttonMarginBottom: 0 // Control margin-bottom from virtual keyboard, if you need
  })

  return (
    <div>
      <input ref={inputEl} />
      <button 
        style={{ border: isButtonSticky ? '1px solid red' : '1px solid black' }} 
        ref={buttonEl}>
          click
      </button>
    </div>
  )
}
```
