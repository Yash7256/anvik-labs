import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

let splitTextPromise
let morphSvgPromise

export function loadSplitText() {
  if (!splitTextPromise) {
    splitTextPromise = import('gsap/SplitText').then(({ SplitText }) => {
      gsap.registerPlugin(SplitText)
      return SplitText
    })
  }

  return splitTextPromise
}

export function loadMorphSVG() {
  if (!morphSvgPromise) {
    morphSvgPromise = import('gsap/MorphSVGPlugin').then(({ MorphSVGPlugin }) => {
      gsap.registerPlugin(MorphSVGPlugin)
      return MorphSVGPlugin
    })
  }

  return morphSvgPromise
}

export { gsap, ScrollTrigger, useGSAP }
