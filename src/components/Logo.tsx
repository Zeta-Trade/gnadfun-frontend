export function Logo() {
  return (
    <div className="flex items-center">
      
{/* <svg xmlns="http://www.w3.org/2000/svg"
     width="44" height="44" viewBox="0 0 44 44"
     role="img" aria-label="Neon pink arrow in circle">

  <defs>
    <filter id="pink-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="blur"/>
      <feFlood floodColor="#ff3ec9" floodOpacity="0.85" result="flood"/>
      <feComposite in="flood" in2="blur" operator="in" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g filter="url(#pink-glow)" transform="translate(22,22)">
    <circle r="14"
            fill="none"
            stroke="#ff66d9"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="90"
            strokeDashoffset="7" />

    <line x1="-8" y1="0" x2="6" y2="0"
          stroke="#ff66d9"
          strokeWidth="4"
          strokeLinecap="round" />

    <path d="M6 0 L1.5 4 M6 0 L1.5 -4"
          stroke="#ff66d9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round" />
  </g>

  </svg> */}


      {/* <img src="/imgs/gnad.png" alt="" style={{width: "32px"}}/> */}
      <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ fontFamily: 'cursive' }}>
        <a href="/">GNAD.FUN</a>
      </h1>
    </div>
  );
}

