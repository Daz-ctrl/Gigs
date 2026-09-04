"use client";

import React, { useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  className?: string;
}

export function UserAvatar({
  src,
  alt = "User Avatar",
  name = "User",
  className = "",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initial = (name || "U").trim().charAt(0).toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center font-black bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white shrink-0 select-none shadow-xs ${className}`}
        title={name}
      >
        <span>{initial}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={() => setHasError(true)}
      className={`object-cover shrink-0 ${className}`}
    />
  );
}
