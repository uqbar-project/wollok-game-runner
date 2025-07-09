import { useEffect, useRef } from 'react'
import{ LocalGame } from 'wollok-web-tools'
export function Game(props: {settings: ConstructorParameters<typeof LocalGame>[0]}) {
  const canvas = useRef<HTMLDivElement>(null)
  useEffect(() => {
    console.log(canvas.current)
    if(canvas.current)
      new LocalGame(props.settings).start(canvas.current)
  }, [])


  
  return <div ref={canvas}></div>
}