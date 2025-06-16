import React from "react";

const Log = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-white text-center relative"
         style={{
           background: 'radial-gradient(circle at top, #4338ca 50%, #f59e0b 100%)'
         }}>
      
      <div className="text-9xl typing-text text-end mb-[-20px]">Hello</div>
<div className="text-8xl typing-delay mt-[-10px]">Ambur</div>
      
      <button 
        className="w-18 h-18 bg-white rounded-full flex items-center justify-center text-xl mb-5 mt-15 cursor-pointer border-none text-white hover:bg-gray-200 transition-all duration-400 button-entrance"
        onClick={() => {
            localStorage.setItem('hasVisitedApp', 'true');
            window.location.href = '/beta';
            }
        }x
      >
        <svg 
          className="w-5 h-5 transform translate-x-0.8 text-black" 
          fill="currentColor" 
          viewBox="0 0 320 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
        </svg>
      </button>
      
      <p className="text-sm mt-3 text-entrance">Get Started</p>
      
      <style>{`
        @font-face {
          font-family: 'Ligema';
          src: url('/fonts/Ligema-DEMO.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        /* Ultra smooth typing keyframes */
        @keyframes ultraSmoothTyping {
          0% { 
            width: 0;
            opacity: 0;
            transform: translateY(10px) scale(0.98);
            filter: blur(2px);
          }
          5% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          100% { 
            width: 100%;
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes smoothFadeIn {
          0% { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: blur(5px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes letterGlow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 0.4), 
              0 0 20px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(255, 255, 255, 0.1);
          }
        }
        
        /* Button entrance animation */
        @keyframes buttonEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          70% {
            transform: translateY(-5px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Text entrance animation */
        @keyframes textEntrance {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .typing-text {
          white-space: nowrap;
          overflow: hidden;
          width: 0;
          text-align: center;
          

          font-family: 'Ligema', 'Arial Black', sans-serif !important;
          letter-spacing: -0.01em;
          
          
          /* Ultra smooth animations with perfect timing */
          animation: 
            ultraSmoothTyping 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards,
            smoothFadeIn 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s forwards,
            letterGlow 4s ease-in-out infinite 2s;
          
          /* Performance optimizations */
          transform-origin: center left;
          will-change: width, opacity, transform;
          backface-visibility: hidden;
          perspective: 1000px;
          
          /* Smooth transitions */
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .typing-delay {
          white-space: nowrap;
          overflow: hidden;
          width: 0;
          text-align: center;
          font-family: 'Ligema', 'Arial Black', sans-serif !important;
          letter-spacing: -0.005em;
         
          
          /* Ultra smooth animations with delayed timing */
          animation: 
            ultraSmoothTyping 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.0s forwards,
            smoothFadeIn 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.0s forwards,
            letterGlow 4s ease-in-out infinite 3s;
          
          /* Performance optimizations */
          transform-origin: center left;
          will-change: width, opacity, transform;
          backface-visibility: hidden;
          perspective: 1000px;
          
          /* Smooth transitions */
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Ultra smooth hover effects */
        .typing-text:hover,
        .typing-delay:hover {
          transform: scale(1.02);
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .button-entrance {
          animation: buttonEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 1.5s 1 normal both;
        }
        
        .text-entrance {
          animation: textEntrance 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.8s 1 normal both;
        }
        
        /* Enhanced hover effects */
        .button-entrance:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .button-entrance:active {
          transform: scale(0.95);
          transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Responsive smooth scaling */
        @media (max-width: 768px) {
          .typing-text,
          .typing-delay {
            letter-spacing: -0.02em;
          }
        }

        /* Performance boost for mobile */
        @media (max-width: 480px) {
          .typing-text,
          .typing-delay {
            animation-duration: 2s, 1.5s, 4s;
            transform: translateZ(0); /* Force hardware acceleration */
          }
        }
        
        /* Smooth transitions for all elements */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default function NewUI() {
  return (
    <div id="root" className="mx-auto text-center">
      <Log />
    </div>
  );
}