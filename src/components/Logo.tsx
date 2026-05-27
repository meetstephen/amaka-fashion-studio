"use client";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Amaka Fashion Atelier logo"
      role="img"
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="19" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Inner decorative ring */}
      <circle cx="20" cy="20" r="16" stroke="#006B3F" strokeWidth="0.5" opacity="0.5" />
      {/* Stylized AFA monogram */}
      {/* Central A */}
      <path
        d="M20 8L28 30H24.5L23 26H17L15.5 30H12L20 8Z"
        fill="#006B3F"
      />
      <path
        d="M18 23H22L20 15L18 23Z"
        fill="#FDF8F0"
      />
      {/* Left F serif accent */}
      <path
        d="M10 14H14V15.5H11.5V19H13.5V20.5H11.5V26H10V14Z"
        fill="#D4AF37"
        opacity="0.8"
      />
      {/* Right A accent */}
      <path
        d="M27 14L31 26H29.5L28.5 23.5H26L25 26H23.5L27 14Z"
        fill="#D4AF37"
        opacity="0.8"
      />
      <path
        d="M26.5 21.5H28L27.25 18L26.5 21.5Z"
        fill="#FDF8F0"
      />
    </svg>
  );
}
