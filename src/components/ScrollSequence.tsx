'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // We have 120 frames in public/bg-frames
    const frameCount = 120;
    const currentFrame = (index: number) => 
      `/bg-frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const seq = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = render;

    function render() {
      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Lesser opacity as requested
      context.globalAlpha = 0.5;
      
      // Draw image to fit canvas while maintaining aspect ratio
      const img = images[seq.frame];
      if (img && img.complete) {
        // Calculate crop to fill 800x800 canvas
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let renderWidth = img.width;
        let renderHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (canvasAspect > imgAspect) {
           renderHeight = img.width / canvasAspect;
           sy = (img.height - renderHeight) / 2;
        } else {
           renderWidth = img.height * canvasAspect;
           sx = (img.width - renderWidth) / 2;
        }

        context.drawImage(img, sx, sy, renderWidth, renderHeight, 0, 0, canvas.width, canvas.height);
      }
    }

    // Create the scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-track",
        start: "top top",
        end: "bottom bottom", // Scroll distance mapped to the track
        scrub: 1.5, // Increased scrub for smoother frame interpolation
        pin: false, // Using CSS sticky instead for robust layout
      }
    });

    tl.to(seq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 md:relative flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={800}
        className="w-full h-auto object-cover rounded-3xl mix-blend-lighten pointer-events-none"
      />
      {/* Overlay gradient to fade the image edges into the dark background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,var(--color-surface)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
