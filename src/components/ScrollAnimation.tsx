'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  animation?: 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' | 'bounceIn' | 'flipIn' | 'slideUp' | 'slideDown'
  delay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  className?: string
  easing?: 'ease-out' | 'ease-in' | 'ease-in-out' | 'cubic-bezier'
}

const animations = {
  fadeInUp: {
    initial: 'opacity-0 translate-y-6',
    final: 'opacity-100 translate-y-0'
  },
  fadeInDown: {
    initial: 'opacity-0 -translate-y-6',
    final: 'opacity-100 translate-y-0'
  },
  slideInLeft: {
    initial: 'opacity-0 -translate-x-6',
    final: 'opacity-100 translate-x-0'
  },
  slideInRight: {
    initial: 'opacity-0 translate-x-6',
    final: 'opacity-100 translate-x-0'
  },
  scaleIn: {
    initial: 'opacity-0 scale-95',
    final: 'opacity-100 scale-100'
  },
  rotateIn: {
    initial: 'opacity-0 -rotate-3',
    final: 'opacity-100 rotate-0'
  },
  bounceIn: {
    initial: 'opacity-0 scale-95',
    final: 'opacity-100 scale-100'
  },
  flipIn: {
    initial: 'opacity-0 rotateY-12',
    final: 'opacity-100 rotateY-0'
  },
  slideUp: {
    initial: 'opacity-0 translate-y-4',
    final: 'opacity-100 translate-y-0'
  },
  slideDown: {
    initial: 'opacity-0 -translate-y-4',
    final: 'opacity-100 translate-y-0'
  }
}

export default function ScrollAnimation({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 1000,
  threshold = 0.1,
  rootMargin = '0px 0px -80px 0px',
  triggerOnce = true,
  className = '',
  easing = 'cubic-bezier'
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const animationConfig = animations[animation]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: easing === 'cubic-bezier' 
          ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          : easing
      }}
    >
      <div
        className={`transform will-change-transform ${
          isVisible ? animationConfig.final : animationConfig.initial
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// 为不同动画类型提供专门的组件
export function FadeInUp({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="fadeInUp" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function SlideInLeft({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="slideInLeft" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function SlideInRight({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="slideInRight" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function ScaleIn({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="scaleIn" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function RotateIn({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="rotateIn" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function BounceIn({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="bounceIn" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function FlipIn({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="flipIn" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function SlideUp({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="slideUp" {...props}>
      {children}
    </ScrollAnimation>
  )
}

export function SlideDown({ children, ...props }: Omit<ScrollAnimationProps, 'animation'>) {
  return (
    <ScrollAnimation animation="slideDown" {...props}>
      {children}
    </ScrollAnimation>
  )
} 