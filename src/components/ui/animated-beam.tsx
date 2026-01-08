import { useEffect, useRef, useState, type RefObject } from "react"
import { cn } from "@/lib/utils"

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLDivElement>
  fromRef: RefObject<HTMLDivElement>
  toRef: RefObject<HTMLDivElement>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export const AnimatedBeam = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) => {
  const id = `beam-${Math.random().toString(36).substring(7)}`
  const pathRef = useRef<SVGPathElement>(null)
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

  // Calculate the path
  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const fromRect = fromRef.current.getBoundingClientRect()
        const toRect = toRef.current.getBoundingClientRect()

        const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset
        const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset
        const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset
        const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset

        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2

        const dx = endX - startX
        const dy = endY - startY

        const cp1X = midX - (curvature * dy) / 2
        const cp1Y = midY + (curvature * dx) / 2
        const cp2X = midX + (curvature * dy) / 2
        const cp2Y = midY - (curvature * dx) / 2

        const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`

        setPathD(path)
        setSvgDimensions({
          width: containerRect.width,
          height: containerRect.height,
        })
      }
    }

    updatePath()
    window.addEventListener("resize", updatePath)
    window.addEventListener("scroll", updatePath, true)

    return () => {
      window.removeEventListener("resize", updatePath)
      window.removeEventListener("scroll", updatePath, true)
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  return (
    <svg
      ref={pathRef}
      className={cn("pointer-events-none absolute left-0 top-0 transform-gpu stroke-2", className)}
      width={svgDimensions.width}
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        fill="none"
        className="transition-all duration-300"
      />
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeOpacity="0.4"
        strokeLinecap="round"
        fill="none"
        className="transition-all duration-300 animated-beam-path"
        style={{
          strokeDasharray: "4 4",
          animation: `animated-beam-dash ${duration}s linear ${delay}s infinite ${reverse ? "reverse" : "normal"}`,
        }}
      />
    </svg>
  )
}
