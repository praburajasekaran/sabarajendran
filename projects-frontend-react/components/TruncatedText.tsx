import React, { useRef, useState, useEffect, useMemo } from 'react';

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
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const fullText = useMemo(() => getTextContent(children), [children]);

  useEffect(() => {
    const checkTruncation = () => {
      if (!textRef.current) return;

      const element = textRef.current;
      
      if (maxLines) {
        // For multi-line truncation (line-clamp)
        // Check if scrollHeight is greater than clientHeight
        const isOverflowing = element.scrollHeight > element.clientHeight + 1; // +1 for rounding errors
        setIsTruncated(isOverflowing);
      } else {
        // For single-line truncation (truncate)
        const isOverflowing = element.scrollWidth > element.clientWidth + 1; // +1 for rounding errors
        setIsTruncated(isOverflowing);
      }
    };

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(checkTruncation);
    
    // Recheck on window resize
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [children, maxLines, fullText]);

  const handleMouseEnter = () => {
    if (!isTruncated || !textRef.current) return;

    const rect = textRef.current.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Update tooltip position on scroll
  useEffect(() => {
    if (!showTooltip || !textRef.current) return;

    const updatePosition = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    };

    window.addEventListener('scroll', updatePosition, true);
    return () => window.removeEventListener('scroll', updatePosition, true);
  }, [showTooltip]);

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
          className="fixed z-50 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg shadow-xl pointer-events-none max-w-md"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, calc(-100% - 8px))',
          }}
        >
          <div className="whitespace-normal break-words">{fullText}</div>
          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-neutral-900"
          />
        </div>
      )}
    </>
  );
};

