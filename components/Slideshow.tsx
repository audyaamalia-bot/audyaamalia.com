"use client";
import { useEffect, useState } from "react";

export default function Slideshow({ images, interval = 5000 }: { images: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);
  return (
    <>
      {images.map((src, n) => (
        <div key={src + n} className={`slide${n === i ? " active" : ""}`} style={{ backgroundImage: `url("${src}")` }} />
      ))}
    </>
  );
}
