/*=============== MJ REALISTIC LIQUID SPLASH LOADER ===============*/
(function initRealisticLoader() {
   const style = document.createElement('style');
   style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@900&display=swap');

      #mj-loader {
         position: fixed;
         inset: 0;
         background: #030405;
         z-index: 99999;
         display: flex;
         align-items: center;
         justify-content: center;
         overflow: hidden;
      }

      .loader__container {
         position: relative;
         width: 400px;
         height: 400px;
         display: flex;
         align-items: center;
         justify-content: center;
      }

      /* Gooey Filter for Liquid Phase */
      .liquid-wrapper {
         position: absolute;
         inset: 0;
         filter: url('#liquid-goo');
         display: flex;
         align-items: center;
         justify-content: center;
      }

      /* Realistic Multi-Directional Blobs */
      .blob {
         position: absolute;
         width: 40px;
         height: 40px;
         border-radius: 50%;
         background: #b4ff39;
      }

      .blob--p { background: #8b5cf6; }

      /* Erratic, Realistic Motion Paths */
      .blob--1 { animation: flow1 2s infinite ease-in-out; }
      .blob--2 { animation: flow2 2.3s infinite ease-in-out; }
      .blob--3 { animation: flow3 1.8s infinite ease-in-out; }

      @keyframes flow1 {
         0%, 100% { transform: translate(-80px, -20px) scale(1); }
         33% { transform: translate(70px, 40px) scale(1.4); }
         66% { transform: translate(20px, -90px) scale(0.8); }
      }
      @keyframes flow2 {
         0%, 100% { transform: translate(80px, 20px) scale(1.2); }
         33% { transform: translate(-50px, -60px) scale(0.9); }
         66% { transform: translate(-30px, 80px) scale(1.5); }
      }
      @keyframes flow3 {
         0%, 100% { transform: translate(0, 0) scale(1.5); }
         50% { transform: translate(10px, 10px) scale(0.5); }
      }

      /* Hard Text Design */
      .loader__text {
         position: relative;
         font-family: 'Outfit', sans-serif;
         font-size: 6rem;
         font-weight: 900;
         opacity: 0;
         z-index: 10;
         /* Purple Gradient */
         background: linear-gradient(to bottom, #d8b4fe, #7c3aed);
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
      }

      /* Splash Particles */
      .splash {
         position: absolute;
         width: 8px;
         height: 8px;
         background: #8b5cf6;
         border-radius: 50%;
         opacity: 0;
      }

      /* Triggered States */
      #mj-loader.reveal-text .liquid-wrapper { display: none; }
      
      #mj-loader.reveal-text .loader__text {
         animation: textPopHard 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }

      @keyframes textPopHard {
         0% { opacity: 0; transform: scale(0.5) translateY(20px); }
         100% { opacity: 1; transform: scale(1) translateY(0); }
      }

      /* Splash Animation */
      #mj-loader.reveal-text .splash {
         animation: splashOut 0.8s ease-out forwards;
      }

      @keyframes splashOut {
         0% { opacity: 1; transform: translate(0, 0) scale(1); }
         100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
      }

      #mj-loader.hide {
         transition: opacity 0.5s ease;
         opacity: 0;
         pointer-events: none;
      }

      .svg-filter { position: absolute; visibility: hidden; }
   `;
   document.head.appendChild(style);

   const loader = document.createElement('div');
   loader.id = 'mj-loader';
   loader.innerHTML = `
      <svg class="svg-filter">
         <defs>
            <filter id="liquid-goo">
               <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
               <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            </filter>
         </defs>
      </svg>
      <div class="loader__container">
         <div class="liquid-wrapper">
            <div class="blob blob--1"></div>
            <div class="blob blob--2 blob--p"></div>
            <div class="blob blob--3"></div>
         </div>
         <div class="loader__text">MJ</div>
         </div>
   `;
   document.body.prepend(loader);

   // Create splash particles
   const container = loader.querySelector('.loader__container');
   for(let i=0; i<12; i++) {
      const s = document.createElement('div');
      s.className = 'splash';
      s.style.setProperty('--tx', `${(Math.random()-0.5) * 200}px`);
      s.style.setProperty('--ty', `${(Math.random()-0.5) * 200}px`);
      container.appendChild(s);
   }

   document.body.style.overflow = 'hidden';

   // Sequence
   setTimeout(() => {
      const loader = document.getElementById('mj-loader');
      if(loader) loader.classList.add('reveal-text');
      
      setTimeout(() => {
         loader.classList.add('hide');
         document.body.style.overflow = '';
         setTimeout(() => { loader.remove(); window.dispatchEvent(new Event('loaderDone')); }, 500);
      }, 2000);
   }, 3000);
})();