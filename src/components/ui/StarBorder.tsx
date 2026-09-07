"use client";

import React from 'react';

export type StarBorderProps<T extends React.ElementType = 'div'> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

export default function StarBorder<T extends React.ElementType = 'div'>({
  as,
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  backgroundColor = '#07070a',
  textColor = '#ffffff',
  borderColor = 'rgba(255, 255, 255, 0.08)',
  children,
  style,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || 'div';

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] transition-all duration-300 ${className}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px`,
        ...style,
      }}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 12%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className={`relative z-[1] border rounded-[19px] w-full h-full backdrop-blur-md ${innerClassName}`}
        style={{ background: backgroundColor, color: textColor, borderColor }}
      >
        {children}
      </div>
    </Component>
  );
}
