/* eslint-disable @next/next/no-img-element */
"use client"
import React, { forwardRef, useEffect, useRef, useState } from "react"

type PlaceholderValue = "blur" | "empty"
type OnLoadingComplete = (img: HTMLImageElement) => void
type StaticImport = string // For compatibility, treat as string

type ResponsiveImageBase = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  "height" | "width" | "loading" | "ref" | "alt" | "src" | "srcSet"
>

type ResponsiveImageProps = ResponsiveImageBase & {
  /** Fallback single-source mode (kept for backwards-compat) */
  src?: string | StaticImport

  /** Responsive mode */
  mobileSrc?: string | StaticImport
  desktopSrc?: string | StaticImport
  /** Media query for the desktop source; defaults to "(min-width: 768px)" */
  desktopMedia?: string

  /** Standard props */
  alt: string
  width?: number | `${number}`
  height?: number | `${number}`
  fill?: boolean
  priority?: boolean
  loading?: "eager" | "lazy"
  placeholder?: PlaceholderValue
  blur?: boolean
  absolute?: boolean
  blurDataURL?: string
  unoptimized?: boolean
  onLoadingComplete?: OnLoadingComplete

  /** Width descriptors used for generated srcset */
  srcSetWidths?: number[]

  /** Optional per-breakpoint sizes (falls back to `sizes` or a sensible default) */
  mobileSizes?: string
  desktopSizes?: string

  /** Legacy single `sizes` fallback if you don’t want separate mobile/desktop values */
  sizes?: string
} & React.RefAttributes<HTMLImageElement | null>

const getImageVariants = (src: string) => {
  const base = src.replace(/\.[a-zA-Z0-9]+$/, "") // remove extension
  return {
    small: {
      jpg: `${base}_small.jpg`,
      webp: `${base}_small.webp`,
      avif: `${base}_small.avif`,
    },
    medium: {
      jpg: `${base}_medium.jpg`,
      webp: `${base}_medium.webp`,
      avif: `${base}_medium.avif`,
    },
    large: {
      jpg: `${base}.jpg`,
      webp: `${base}.webp`,
      avif: `${base}.avif`,
    },
  }
}

const isGoogleStorage = (s?: string | StaticImport) =>
  typeof s === "string" && s.includes("storage.googleapis.com")

const toMediumJpg = (url: string) => {
  const match = url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/)
  const pathPart = match?.[1] ?? url
  const searchPart = match?.[2] ?? ""
  const hashPart = match?.[3] ?? ""

  const withoutExtension = pathPart.replace(/\.[a-zA-Z0-9]+$/, "")
  const withoutSizeSuffix = withoutExtension.replace(
    /_(small|medium|large)$/i,
    "",
  )

  return `${withoutSizeSuffix}_medium.jpg${searchPart}${hashPart}`
}

const checkImageExists = (url: string) =>
  new Promise<boolean>((resolve) => {
    const probe = new Image()
    probe.onload = () => resolve(true)
    probe.onerror = () => resolve(false)
    probe.src = url
  })

export const ResponsiveImage = forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(function Image(
  {
    // responsive (preferred)
    mobileSrc,
    desktopSrc,
    desktopMedia = "(min-width: 768px)",

    // legacy single source (optional)
    src,

    alt,
    width,
    height,
    fill,
    className = "",
    loading = "lazy",
    priority = false,
    sizes,
    mobileSizes,
    desktopSizes,
    absolute,
    blur = false,
    blurDataURL,
    srcSetWidths = [312, 624, 1248],
    style,
    onLoad,
    onError,
    ...rest
  },
  ref,
) {
  const internalImgRef = useRef<HTMLImageElement | null>(null)
  const didScheduleCheckRef = useRef(false)
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null)
  const [shouldRunCheck, setShouldRunCheck] = useState(false)

  const defaultSizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  const mobileSizesFinal = mobileSizes ?? sizes ?? defaultSizes
  const desktopSizesFinal = desktopSizes ?? sizes ?? defaultSizes

  // Choose effective mobile/desktop sources (fallback to `src` if needed)
  const mobile = (mobileSrc ?? src) as string | undefined
  const desktop = (desktopSrc ?? src) as string | undefined

  // Aspect ratio style if requested
  const aspectRatioStyle =
    fill && width && height
      ? { aspectRatio: `${Number(width) / Number(height)}` }
      : undefined

  // Build variant sets when we can
  const mIsGCS = isGoogleStorage(mobile)
  const dIsGCS = isGoogleStorage(desktop)
  const mVariants = mobile && !mIsGCS ? getImageVariants(mobile) : undefined
  const dVariants = desktop && !dIsGCS ? getImageVariants(desktop) : undefined

  // Fallback <img> src (mobile-first)
  const imgSrc =
    // If blur placeholder is enabled and provided, use it for the <img> initially
    blur && blurDataURL
      ? blurDataURL
      : mIsGCS
        ? (mobile as string | undefined)
        : (mVariants?.large.jpg ?? (mobile as string | undefined) ?? "")

  const imgLoading = priority ? "eager" : loading
  const fetchPriority = priority ? "high" : undefined
  const shouldUseFallbackOnly = Boolean(fallbackSrc)
  const finalImgSrc = fallbackSrc ?? imgSrc

  useEffect(() => {
    if (didScheduleCheckRef.current) return
    didScheduleCheckRef.current = true

    const timeoutId = window.setTimeout(() => {
      setShouldRunCheck(true)
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!shouldRunCheck) return

    const runCheck = async () => {
      const activeSrc =
        internalImgRef.current?.currentSrc || internalImgRef.current?.src || ""
      if (!activeSrc || activeSrc.startsWith("data:")) return

      const exists = await checkImageExists(activeSrc)
      if (exists) return

      setFallbackSrc(toMediumJpg(activeSrc))
    }

    void runCheck()
  }, [shouldRunCheck])

  const setImageRef = (node: HTMLImageElement | null) => {
    internalImgRef.current = node
    if (typeof ref === "function") {
      ref(node)
      return
    }
    if (ref) {
      ref.current = node
    }
  }

  const triggerCheck = () => {
    setShouldRunCheck(true)
  }

  return (
    <picture
      className={`
        ${absolute ? "absolute inset-0" : "relative"}

        h-full w-full

        ${blur ? "blur-md" : ""}
      `}
      style={{ ...aspectRatioStyle, ...style }}
      {...rest}
    >
      {/* DESKTOP SOURCES (served when media matches) */}
      {!shouldUseFallbackOnly && desktop && (
        <>
          {dVariants ? (
            <>
              <source
                media={desktopMedia}
                type="image/avif"
                srcSet={`${dVariants.small.avif} ${srcSetWidths[0]}w, ${dVariants.medium.avif} ${srcSetWidths[1]}w, ${dVariants.large.avif} ${srcSetWidths[2]}w`}
                sizes={desktopSizesFinal}
              />
              <source
                media={desktopMedia}
                type="image/webp"
                srcSet={`${dVariants.small.webp} ${srcSetWidths[0]}w, ${dVariants.medium.webp} ${srcSetWidths[1]}w, ${dVariants.large.webp} ${srcSetWidths[2]}w`}
                sizes={desktopSizesFinal}
              />
            </>
          ) : (
            // GCS or non-variant: single source line is still valid
            <source media={desktopMedia} srcSet={`${desktop}`} />
          )}
        </>
      )}

      {/* MOBILE / DEFAULT SOURCES */}
      {!shouldUseFallbackOnly && mobile && (
        <>
          {mVariants ? (
            <>
              <source
                type="image/avif"
                srcSet={`${mVariants.small.avif} ${srcSetWidths[0]}w, ${mVariants.medium.avif} ${srcSetWidths[1]}w, ${mVariants.large.avif} ${srcSetWidths[2]}w`}
                sizes={mobileSizesFinal}
              />
              <source
                type="image/webp"
                srcSet={`${mVariants.small.webp} ${srcSetWidths[0]}w, ${mVariants.medium.webp} ${srcSetWidths[1]}w, ${mVariants.large.webp} ${srcSetWidths[2]}w`}
                sizes={mobileSizesFinal}
              />
            </>
          ) : (
            // GCS or non-variant: omit type to let browser pick it as default
            <source srcSet={`${mobile}`} />
          )}
        </>
      )}

      {/* FALLBACK JPEG/IMG */}
      {finalImgSrc && finalImgSrc.trim() !== "" && (
        <img
          src={finalImgSrc}
          alt={alt}
          ref={setImageRef}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          loading={imgLoading}
          decoding="async"
          onLoad={(event) => {
            triggerCheck()
            onLoad?.(event)
          }}
          onError={(event) => {
            triggerCheck()
            onError?.(event)
          }}
          fetchPriority={fetchPriority}
          sizes={mobileSizesFinal}
          className={
            fill
              ? `
                h-full w-full object-cover

                ${className}
              `
              : `
                ${className}
              `
          }
        />
      )}
    </picture>
  )
})

export default ResponsiveImage
