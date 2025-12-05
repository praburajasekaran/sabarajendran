import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';

interface TruncatedTextProps {
  children: React.ReactNode;
  className?: string;
  maxLines?: number;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

// Helper function to extract text content from React node
const getTextContent = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (React.isValidElement(node)) {
    if (node.props.children) {
      return getTextContent(node.props.children);
    }
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join('');
  }
  return '';
};

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  className = '',
  maxLines,
  as: Component = 'span',
}) => {
  const textRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: 'top' as 'top' | 'bottom' });

  const fullText = useMemo(() => getTextContent(children), [children]);

  // Improved truncation detection with better tolerance and Tamil text handling
  const checkTruncation = useCallback(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const computedStyle = window.getComputedStyle(element);
    
    if (maxLines) {
      // For multi-line truncation (line-clamp)
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      // Get computed line-height for better detection
      const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2;
      const expectedHeight = lineHeight * maxLines;
      
      // Check if line-clamp is actually applied (check computed style)
      const webkitLineClamp = computedStyle.webkitLineClamp;
      const display = computedStyle.display;
      
      // More robust detection: check both scrollHeight and if we're actually clamping
      const isOverflowing = scrollHeight > clientHeight + 3; // Increased tolerance to 3px
      
      // Additional check: if line-clamp is set but content exceeds expected height
      const exceedsExpectedLines = scrollHeight > expectedHeight + 3;
      
      // For Tamil text, sometimes line-height calculations can be off, so be more lenient
      const isTruncatedResult = isOverflowing || (webkitLineClamp !== 'none' && exceedsExpectedLines);
      
      setIsTruncated(isTruncatedResult);
    } else {
      // For single-line truncation (truncate)
      const scrollWidth = element.scrollWidth;
      const clientWidth = element.clientWidth;
      
      // Increased tolerance to 3px for better reliability
      const isOverflowing = scrollWidth > clientWidth + 3;
      
      setIsTruncated(isOverflowing);
    }
  }, [maxLines]);

  // Multiple check timings for reliability
  useEffect(() => {
    if (!textRef.current) return;

    // Immediate check
    requestAnimationFrame(() => {
      checkTruncation();
    });

    // Delayed check after 100ms (for font loading and layout stabilization)
    const delayedCheck = setTimeout(() => {
      checkTruncation();
    }, 100);

    // Check after fonts are loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Small delay after fonts load to ensure layout has updated
        setTimeout(() => {
          checkTruncation();
        }, 50);
      });
    }

    // ResizeObserver for reliable size change detection
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Debounce resize checks slightly
        requestAnimationFrame(() => {
          checkTruncation();
        });
      });

      resizeObserverRef.current.observe(textRef.current);

      return () => {
        if (resizeObserverRef.current && textRef.current) {
          resizeObserverRef.current.unobserve(textRef.current);
        }
        clearTimeout(delayedCheck);
      };
    } else {
      // Fallback to window resize if ResizeObserver not available
      window.addEventListener('resize', checkTruncation);
      return () => {
        window.removeEventListener('resize', checkTruncation);
        clearTimeout(delayedCheck);
      };
    }
  }, [children, maxLines, fullText, checkTruncation]);

  // Viewport-aware tooltip positioning
  const updateTooltipPosition = useCallback(() => {
    if (!textRef.current) return;

    const elementRect = textRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Estimate tooltip dimensions (will be updated after render)
    const estimatedTooltipHeight = 100;
    const estimatedTooltipWidth = 300;
    
    // Calculate position for tooltip above text
    let top = elementRect.top + window.scrollY;
    let left = elementRect.left + elementRect.width / 2 + window.scrollX;
    let placement: 'top' | 'bottom' = 'top';
    
    // Check if tooltip would go off-screen at the top
    const spaceAbove = elementRect.top;
    
    if (spaceAbove < estimatedTooltipHeight + 20) {
      // Not enough space above, show below instead
      placement = 'bottom';
      top = elementRect.bottom + window.scrollY + 8;
    } else {
      // Show above
      top = elementRect.top + window.scrollY - 8;
    }
    
    // Ensure tooltip doesn't go off-screen horizontally
    if (left - estimatedTooltipWidth / 2 < 10) {
      left = estimatedTooltipWidth / 2 + 10;
    } else if (left + estimatedTooltipWidth / 2 > viewportWidth - 10) {
      left = viewportWidth - estimatedTooltipWidth / 2 - 10;
    }

    setTooltipPosition({ top, left, placement });
    
    // After tooltip renders, update position with actual dimensions
    if (tooltipRef.current) {
      requestAnimationFrame(() => {
        if (tooltipRef.current && textRef.current) {
          const actualTooltipRect = tooltipRef.current.getBoundingClientRect();
          const actualElementRect = textRef.current.getBoundingClientRect();
          
          // Recalculate with actual dimensions
          let newTop = placement === 'top' 
            ? actualElementRect.top + window.scrollY - actualTooltipRect.height - 8
            : actualElementRect.bottom + window.scrollY + 8;
          
          let newLeft = actualElementRect.left + actualElementRect.width / 2 + window.scrollX;
          
          // Horizontal boundary check with actual width
          if (newLeft - actualTooltipRect.width / 2 < 10) {
            newLeft = actualTooltipRect.width / 2 + 10;
          } else if (newLeft + actualTooltipRect.width / 2 > viewportWidth - 10) {
            newLeft = viewportWidth - actualTooltipRect.width / 2 - 10;
          }
          
          setTooltipPosition({ top: newTop, left: newLeft, placement });
        }
      });
    }
  }, []);

  const handleMouseEnter = () => {
    if (!isTruncated || !textRef.current) return;

    // Update position before showing
    requestAnimationFrame(() => {
      updateTooltipPosition();
      setShowTooltip(true);
    });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Update tooltip position on scroll and when tooltip is shown
  useEffect(() => {
    if (!showTooltip) return;

    const updatePosition = () => {
      updateTooltipPosition();
    };

    // Update immediately when shown
    requestAnimationFrame(updatePosition);

    // Update on scroll
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showTooltip, updateTooltipPosition]);

  // Map maxLines to Tailwind classes (Tailwind doesn't support dynamic class names)
  const getTruncateClass = () => {
    if (maxLines) {
      const lineClampClasses: Record<number, string> = {
        1: 'line-clamp-1',
        2: 'line-clamp-2',
        3: 'line-clamp-3',
        4: 'line-clamp-4',
        5: 'line-clamp-5',
        6: 'line-clamp-6',
      };
      return lineClampClasses[maxLines] || 'line-clamp-2';
    }
    return 'truncate';
  };

  return (
    <>
      <Component
        ref={textRef as any}
        className={`${getTruncateClass()} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Component>
      
      {isTruncated && showTooltip && fullText && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg shadow-xl pointer-events-none max-w-md"
          style={{
            top: tooltipPosition.placement === 'top' 
              ? `${tooltipPosition.top}px` 
              : `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: tooltipPosition.placement === 'top'
              ? 'translate(-50%, -100%)'
              : 'translate(-50%, 0)',
          }}
        >
          <div className="whitespace-normal break-words">{fullText}</div>
          {/* Tooltip arrow - position based on placement */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] ${
              tooltipPosition.placement === 'top'
                ? 'top-full border-t-[6px] border-transparent border-t-neutral-900'
                : 'bottom-full border-b-[6px] border-transparent border-b-neutral-900'
            }`}
          />
        </div>
      )}
    </>
  );
};
