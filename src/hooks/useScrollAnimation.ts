'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      const currentRef = ref.current
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}

// 为不同元素类型提供专门的Hook
export function useFadeInUp(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options)
  return {
    ref,
    className: `transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-12'
    }`
  }
}

export function useSlideInLeft(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options)
  return {
    ref,
    className: `transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 -translate-x-12'
    }`
  }
}

export function useSlideInRight(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options)
  return {
    ref,
    className: `transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 translate-x-0' 
        : 'opacity-0 translate-x-12'
    }`
  }
}

export function useScaleIn(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options)
  return {
    ref,
    className: `transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 scale-100' 
        : 'opacity-0 scale-95'
    }`
  }
}

export function useRotateIn(options?: UseScrollAnimationOptions) {
  const { ref, isVisible } = useScrollAnimation(options)
  return {
    ref,
    className: `transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 rotate-0' 
        : 'opacity-0 -rotate-12'
    }`
  }
} 