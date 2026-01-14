import { useEffect, useRef } from 'react'
import type { LocalGame } from 'wollok-web-tools'
export function Game(props: {
  settings: ConstructorParameters<typeof LocalGame>[0]
}) {
  const canvas = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let p5Instance: ReturnType<InstanceType<typeof LocalGame>['start']> | null =
      null
    let cancelled = false

    const load = async () => {
      if (typeof window === 'undefined' || !canvas.current) return
      // Dynamically import to avoid SSR issues (p5 depends on window and messes up the form on home.tsx)
      const { LocalGame } = await import('wollok-web-tools')
      if (cancelled || !canvas.current) return
      p5Instance = new LocalGame(props.settings).start(canvas.current)
    }

    load()

    return () => {
      cancelled = true
      if (p5Instance) {
        p5Instance.remove()
      }
    }
  }, [props.settings])

  return <div ref={canvas}></div>
}
