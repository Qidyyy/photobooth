'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";

interface DraggablePhotoProps {
  src: string;
  zoom: number;
  pan: { x: number; y: number };
  onUpdate: (zoom: number, pan: { x: number; y: number }) => void;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
}

export function DraggablePhoto({ src, zoom, pan, onUpdate, className, style, interactive = true }: DraggablePhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imgSize, setImgSize] = useState<{ width: number, height: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number, height: number } | null>(null);
  
  // Drag state
  const dragStartRef = useRef<{ x: number, y: number, initialPan: { x: number, y: number } } | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
        if (containerRef.current) {
            setContainerSize({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
    };
    
    updateSize();
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Calculate Constraints
  const constraints = useMemo(() => {
    if (!containerSize || !imgSize) return null;
    const { width: cW, height: cH } = containerSize;
    if (cW === 0 || cH === 0) return null; 

    const imgRatio = imgSize.width / imgSize.height;
    const containerRatio = cW / cH;

    // Calculate "Cover" Dimensions (Base Size at Zoom=1)
    let baseW, baseH;
    if (imgRatio > containerRatio) {
        // Image is Wider: Match Height
        baseH = cH;
        baseW = cH * imgRatio;
    } else {
        // Image is Taller: Match Width
        baseW = cW;
        baseH = cW / imgRatio;
    }

    // Scaled Size
    const scaledW = baseW * zoom;
    const scaledH = baseH * zoom;

    // Max Pan (in Pixels) from Center
    const maxPxX = Math.max(0, (scaledW - cW) / 2);
    const maxPxY = Math.max(0, (scaledH - cH) / 2);

    return {
        maxPanX: maxPxX / cW,
        maxPanY: maxPxY / cH,
        baseW, 
        baseH
    };
  }, [imgSize, zoom, containerSize]); 


  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactive) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setIsDragging(true);
    dragStartRef.current = {
        x: clientX,
        y: clientY,
        initialPan: { ...pan }
    };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactive || !isDragging || !dragStartRef.current || !containerSize || !constraints) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    const { width, height } = containerSize;
    
    // Convert Delta (Pixels) -> Delta (Percentage of Container)
    const deltaPanX = deltaX / width;
    const deltaPanY = deltaY / height;

    let newX = dragStartRef.current.initialPan.x + deltaPanX;
    let newY = dragStartRef.current.initialPan.y + deltaPanY;

    // Apply strict bounds
    newX = Math.max(-constraints.maxPanX, Math.min(constraints.maxPanX, newX));
    newY = Math.max(-constraints.maxPanY, Math.min(constraints.maxPanY, newY));

    onUpdate(zoom, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    if (!interactive) return;
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleZoomChange = (vals: number[]) => {
      onUpdate(vals[0], pan);
  };
  
  // Snap back effect when constraints change
  useEffect(() => {
      if (!interactive) return;
      if (!isDragging && constraints) {
          let newX = pan.x;
          let newY = pan.y;
          let changed = false;

          if (Math.abs(newX) > constraints.maxPanX + 0.001) { 
              newX = Math.sign(newX) * constraints.maxPanX;
              changed = true;
          }
          if (Math.abs(newY) > constraints.maxPanY + 0.001) {
              newY = Math.sign(newY) * constraints.maxPanY;
              changed = true;
          }

          if (changed) {
              onUpdate(zoom, { x: newX, y: newY });
          }
      }
  }, [zoom, constraints?.maxPanX, constraints?.maxPanY, isDragging, interactive, pan.x, pan.y, onUpdate]);


  return (
    <div 
        ref={containerRef}
        className={cn("relative overflow-hidden group select-none touch-none", interactive && "cursor-grab active:cursor-grabbing", className)}
        style={style}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
            handlePointerUp();
            setIsHovering(false);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
    >
        {/* The Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
                ref={imgRef}
                src={src} 
                alt="Photo"
                onLoad={handleImageLoad}
                className="max-w-none origin-center will-change-transform"
                style={{
                    width: constraints ? constraints.baseW : '100%',
                    height: constraints ? constraints.baseH : '100%',
                    objectFit: constraints ? undefined : 'cover',
                    
                    transform: constraints && containerSize 
                        ? `translate(${pan.x * containerSize.width}px, ${pan.y * containerSize.height}px) scale(${zoom})`
                        : `scale(${zoom})`, 
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
             />
        </div>

        {/* Overlay Controls (Slider) */}
        {interactive && (
        <div 
            className={cn(
                "absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] max-w-[120px] transition-all duration-300 z-10 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20",
                (isHovering || isDragging) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
            onMouseDown={(e) => e.stopPropagation()} 
            onTouchStart={(e) => e.stopPropagation()}
        >
            <ZoomIn className="w-3 h-3 text-white/80 flex-shrink-0" />
            <Slider 
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={handleZoomChange}
                className="flex-1 h-4"
            />
        </div>
        )}
        
    </div>
  );
}
