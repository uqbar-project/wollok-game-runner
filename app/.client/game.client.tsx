import { useEffect, useRef } from 'react'
import{ LocalGame } from 'wollok-web-tools'

export function Game(props: {settings: ConstructorParameters<typeof LocalGame>[0]}) {
  const canvas = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if(canvas.current){
      let p5Instance = new LocalGame(props.settings).start(canvas.current)
      return p5Instance.remove.bind(p5Instance)
    }
  }, [])


  
  return <div ref={canvas}></div>
}