
import { useState, useEffect } from "react"

// Define los breakpoints para diferentes tamaños de pantalla
export type ScreenSize = "mobile" | "tablet" | "desktop" | "large";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initially
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}

export function useResponsive() {
  const [screenSize, setScreenSize] = useState<ScreenSize>("desktop")

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize("mobile")
      } else if (width < 1024) {
        setScreenSize("tablet")
      } else if (width < 1280) {
        setScreenSize("desktop")
      } else {
        setScreenSize("large")
      }
    }

    // Comprobar inicialmente
    checkSize()

    // Añadir event listener
    window.addEventListener("resize", checkSize)

    // Limpiar
    return () => {
      window.removeEventListener("resize", checkSize)
    }
  }, [])

  return {
    screenSize,
    isMobile: screenSize === "mobile",
    isTablet: screenSize === "tablet",
    isDesktop: screenSize === "desktop" || screenSize === "large",
    isLarge: screenSize === "large"
  }
}
