'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Transition } from 'motion/react'
import { useIsInView, type UseIsInViewOptions } from '@/hooks/useIsInView'

const characterStyle: React.CSSProperties = {
  position: 'absolute',
  display: 'inline-block',
  backfaceVisibility: 'hidden',
}

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export type RollingTextProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  text: string
  transition?: Transition
  delay?: number
} & UseIsInViewOptions

export function RollingText({
  ref,
  text,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  transition = { duration: 0.5, delay: 0.05, ease: 'easeOut' },
  delay = 0,
  ...props
}: RollingTextProps) {
  const { ref: localRef, isInView } = useIsInView(ref as React.Ref<HTMLElement>, {
    inView,
    inViewOnce,
    inViewMargin,
  })
  const prefersReducedMotion = useReducedMotion()
  const parts = React.useMemo(() => text.split(/(\s+)/), [text])
  const stepDelay = transition.delay ?? 0
  const shouldAnimate = isInView && !prefersReducedMotion
  let characterIndex = 0

  return (
    <span ref={localRef} data-animate-ui="rolling-text" {...props}>
      {parts.map((part, wordIndex) => {
        if (/^\s+$/.test(part)) return <span key={`space-${wordIndex}`}>{part}</span>

        return (
          <span key={`word-${wordIndex}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(part).map((character, characterInWordIndex) => {
              const currentIndex = characterIndex++
              const characterDelay = delay / 1000 + currentIndex * Number(stepDelay)

              return (
                <span
                  aria-hidden="true"
                  key={`character-${wordIndex}-${characterInWordIndex}`}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    perspective: '9999999px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.span
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: shouldAnimate ? 90 : 0 }}
                    transition={{ ...transition, delay: characterDelay }}
                    style={{ ...characterStyle, transformOrigin: '50% 25%' }}
                  >
                    {character}
                  </motion.span>
                  <motion.span
                    initial={{ rotateX: 90 }}
                    animate={{ rotateX: shouldAnimate ? 0 : 90 }}
                    transition={{ ...transition, delay: characterDelay + 0.3 }}
                    style={{ ...characterStyle, transformOrigin: '50% 100%' }}
                  >
                    {character}
                  </motion.span>
                  <span style={{ visibility: 'hidden' }}>{character}</span>
                </span>
              )
            })}
          </span>
        )
      })}
      <span style={visuallyHidden}>{text}</span>
    </span>
  )
}
