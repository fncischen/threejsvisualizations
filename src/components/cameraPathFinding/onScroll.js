import { useCallback, useEffect } from 'react'
import { useSpring, config} from '@react-spring/core'
import { useGesture } from 'react-use-gesture'

// source https://codesandbox.io/embed/r3f-train-l900i
// 

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

export default function useYScroll(bounds, props) {

   // https://www.react-spring.io/docs/hooks/use-spring
   // "Or: pass a function that returns values, and update using "set"
   // see line 1133, /node_modules/react-spring/web.js
  const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))

  // console.log(y.get());
  // property, and method to set 
  
  // adding a callback function to refrence 
  // when onwheel or ondrag is called 

  // 

  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.get() }) => {
      const newY = clamp(memo + cy - py, ...bounds)
      set({ y: newY }) // set spring to newY
      // console.log(newY);
      return newY
    },
    [bounds, y, set]
  )

  // https://www.npmjs.com/package/react-use-gesture
  // 
   
  const bind = useGesture({ onWheel: fn, onDrag: fn }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])
  return [y, bind]
}
