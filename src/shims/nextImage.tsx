import React, { forwardRef } from 'react';

export interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'width' | 'height' | 'loading'
  > {
  src: string;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  sizes?: string;
  quality?: number | `${number}`;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  placeholder?: 'blur' | 'empty' | `data:image/${string}`;
  blurDataURL?: string;
  unoptimized?: boolean;
  onLoadingComplete?: (img: HTMLImageElement) => void;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(function NextImage(
  {
    src,
    alt,
    width,
    height,
    fill = false,
    sizes,
    quality: _quality,
    priority = false,
    loading,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    unoptimized: _unoptimized,
    onLoadingComplete,
    onLoad,
    decoding = 'async',
    fetchPriority,
    style,
    ...rest
  },
  ref
) {
  const numericWidth = width !== undefined ? Number(width) : undefined;
  const numericHeight = height !== undefined ? Number(height) : undefined;

  const hasIntrinsicDimensions =
    typeof numericWidth === 'number' &&
    typeof numericHeight === 'number' &&
    Number.isFinite(numericWidth) &&
    Number.isFinite(numericHeight) &&
    numericWidth > 0 &&
    numericHeight > 0;

  const preCalculatedAspectRatio = hasIntrinsicDimensions
    ? `${numericWidth} / ${numericHeight}`
    : undefined;

  const computedStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: 0,
        ...style,
      }
    : {
        ...(preCalculatedAspectRatio ? { aspectRatio: preCalculatedAspectRatio } : {}),
        ...style,
      };

  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedFetchPriority = priority ? 'high' : fetchPriority ?? 'auto';

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onLoadingComplete && e.currentTarget) {
      onLoadingComplete(e.currentTarget);
    }
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={fill ? undefined : numericWidth}
      height={fill ? undefined : numericHeight}
      sizes={sizes}
      loading={resolvedLoading}
      fetchPriority={resolvedFetchPriority}
      decoding={decoding}
      style={computedStyle}
      onLoad={onLoadingComplete || onLoad ? handleLoad : undefined}
      data-nimg={fill ? 'fill' : 'intrinsic'}
      {...rest}
    />
  );
});

export default Image;
