export const WaveDivider = ({ 
  variant = 'wave', 
  flip = false, 
  color = 'white', 
  gradient = false,
  gradientFrom = '#4A1FB8',
  gradientTo = '#ffffff',
  animated = false,
  className = '' 
}) => {
  
  // ID único para cada gradiente
  const gradientId = `wave-gradient-${Math.random().toString(36).substr(2, 9)}`
  const fill = gradient ? `url(#${gradientId})` : color

  const gradientDefs = gradient && (
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={gradientFrom} />
        <stop offset="100%" stopColor={gradientTo} />
      </linearGradient>
    </defs>
  )

  // Keyframes inyectados una vez si animated=true
  const animatedStyles = animated && (
    <style>{`
      @keyframes waveShift1 {
        0%,100% { d: path("M0,90 C180,70 360,108 540,90 C720,72 900,105 1080,90 C1260,75 1380,95 1440,90 L1440,120 L0,120 Z"); }
        50%      { d: path("M0,82 C200,100 400,72 600,88 C800,104 1000,76 1200,86 C1340,92 1400,80 1440,82 L1440,120 L0,120 Z"); }
      }
      @keyframes waveShift2 {
        0%,100% { d: path("M0,80 C240,50 480,105 720,80 C960,55 1200,95 1440,80 L1440,120 L0,120 Z"); }
        50%      { d: path("M0,65 C220,95 460,45 700,72 C940,99 1180,55 1440,68 L1440,120 L0,120 Z"); }
      }
      @keyframes waveShift3 {
        0%,100% { d: path("M0,70 C200,40 400,100 600,70 C800,40 1000,90 1200,65 C1300,52 1380,75 1440,70 L1440,120 L0,120 Z"); }
        50%      { d: path("M0,60 C180,90 380,30 580,65 C780,100 980,40 1180,72 C1320,90 1400,55 1440,60 L1440,120 L0,120 Z"); }
      }
    `}</style>
  )

  // Cuando animated=true, reemplaza el SVG por la versión con 3 capas animadas
  const animatedWave = (
    <svg
      viewBox="0 0 1440 120"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={`w-full h-[60px] sm:h-[80px] lg:h-[120px] ${className}`}
    >
      {gradientDefs}
      {/* Capa 3 — fondo, lenta */}
      <path fill={gradient ? fill : `${color}26`} style={{ animation: "waveShift3 9s ease-in-out infinite" }}>
        <animate attributeName="d" dur="9s" repeatCount="indefinite"
          values="
            M0,70 C200,40 400,100 600,70 C800,40 1000,90 1200,65 C1300,52 1380,75 1440,70 L1440,120 L0,120 Z;
            M0,60 C180,90 380,30 580,65 C780,100 980,40 1180,72 C1320,90 1400,55 1440,60 L1440,120 L0,120 Z;
            M0,70 C200,40 400,100 600,70 C800,40 1000,90 1200,65 C1300,52 1380,75 1440,70 L1440,120 L0,120 Z
          "
        />
      </path>
      {/* Capa 2 — media */}
      <path fill={gradient ? fill : `${color}59`} >
        <animate attributeName="d" dur="6s" repeatCount="indefinite"
          values="
            M0,80 C240,50 480,105 720,80 C960,55 1200,95 1440,80 L1440,120 L0,120 Z;
            M0,65 C220,95 460,45 700,72 C940,99 1180,55 1440,68 L1440,120 L0,120 Z;
            M0,80 C240,50 480,105 720,80 C960,55 1200,95 1440,80 L1440,120 L0,120 Z
          "
        />
      </path>
      {/* Capa 1 — frente, rápida, sólida */}
      <path fill={fill}>
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="
            M0,90 C180,70 360,108 540,90 C720,72 900,105 1080,90 C1260,75 1380,95 1440,90 L1440,120 L0,120 Z;
            M0,82 C200,100 400,72 600,88 C800,104 1000,76 1200,86 C1340,92 1400,80 1440,82 L1440,120 L0,120 Z;
            M0,90 C180,70 360,108 540,90 C720,72 900,105 1080,90 C1260,75 1380,95 1440,90 L1440,120 L0,120 Z
          "
        />
      </path>
    </svg>
  )

  const waves = {
    wave: (
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[60px] sm:h-[80px] lg:h-[120px] ${className}`}>
        {gradientDefs}
        <path d="M0 60L60 55C120 50 240 40 360 45C480 50 600 70 720 65C840 60 960 30 1080 35C1200 40 1320 80 1380 100L1440 120V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V60Z" fill={fill} />
      </svg>
    ),
    waveStrong: (
      <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[60px] sm:h-[80px] lg:h-[150px] ${className}`}>
        {gradientDefs}
        <path d="M0 75L48 68C96 61 192 47 288 55C384 63 480 93 576 90C672 87 768 51 864 48C960 45 1056 75 1152 80C1248 85 1344 65 1392 55L1440 45V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V75Z" fill={fill} />
      </svg>
    ),
    waveSmooth: (
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[50px] sm:h-[70px] lg:h-[100px] ${className}`}>
        {gradientDefs}
        <path d="M0 50C120 20 240 80 360 50C480 20 600 80 720 50C840 20 960 80 1080 50C1200 20 1320 80 1440 50V0H0V50Z" fill={fill} />
      </svg>
    ),
    diagonal: (
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[40px] sm:h-[60px] lg:h-[100px] ${className}`}>
        {gradientDefs}
        <polygon points="0,0 1440,0 1440,100 0,0" fill={fill} />
      </svg>
    ),
    curve: (
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[50px] sm:h-[80px] lg:h-[120px] ${className}`}>
        {gradientDefs}
        <path d="M0 0H1440V120C1320 80 1200 20 1080 40C960 60 840 120 720 100C600 80 480 20 360 40C240 60 120 100 0 80V0Z" fill={fill} />
      </svg>
    ),
    triangles: (
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[40px] sm:h-[60px] lg:h-[100px] ${className}`}>
        {gradientDefs}
        <path d="M0 100L60 60L120 100L180 40L240 100L300 50L360 100L420 30L480 100L540 55L600 100L660 45L720 100L780 35L840 100L900 50L960 100L1020 40L1080 100L1140 55L1200 100L1260 45L1320 100L1380 35L1440 100V0H0V100Z" fill={fill} />
      </svg>
    ),
    bubbles: (
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className={`w-full h-[60px] sm:h-[80px] lg:h-[120px] ${className}`}>
        {gradientDefs}
        <path d="M0 80C80 60 160 20 240 40C320 60 400 100 480 90C560 80 640 40 720 35C800 30 880 60 960 70C1040 80 1120 60 1200 45C1280 30 1360 50 1440 60V0H0V80Z" fill={fill} />
        <circle cx="120" cy="55" r="15" fill={fill} opacity="0.8" />
        <circle cx="380" cy="70" r="20" fill={fill} opacity="0.8" />
        <circle cx="650" cy="50" r="12" fill={fill} opacity="0.8" />
        <circle cx="900" cy="65" r="18" fill={fill} opacity="0.8" />
        <circle cx="1150" cy="40" r="14" fill={fill} opacity="0.8" />
      </svg>
    ),
  }

  const wave = animated ? animatedWave : (waves[variant] || waves.wave)

  return (
    <>
      {animatedStyles}
      {flip ? <div className="rotate-180">{wave}</div> : wave}
    </>
  )
}
