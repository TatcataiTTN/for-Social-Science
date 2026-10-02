// Slide deck nhúng — mỗi module 1 <div class="mdeck" data-deck="ID"> chứa các <div class="mdeck-slide">.
(function(){
  document.querySelectorAll('.mdeck').forEach(function(deck){
    const slides = [...deck.querySelectorAll('.mdeck-slide')];
    const bar = deck.querySelector('.mdeck-bar');
    const prevBtn = bar.querySelector('.mdeck-prev');
    const nextBtn = bar.querySelector('.mdeck-next');
    const count = bar.querySelector('.mdeck-count');
    const dotsWrap = bar.querySelector('.mdeck-dots');
    const fsBtn = bar.querySelector('.mdeck-fs');
    let i = 0;
    slides.forEach((s,idx)=>{
      const d = document.createElement('button'); d.type='button';
      d.addEventListener('click', ()=>go(idx));
      dotsWrap.appendChild(d);
    });
    const dots = [...dotsWrap.children];
    function isFs(){ return document.fullscreenElement===deck || document.webkitFullscreenElement===deck; }
    function fit(){
      slides.forEach(s=>{ s.style.fontSize=''; });
      const s = slides[i]; if (!s) return;
      const fs = isFs();
      const w = window.innerWidth;
      // Phóng to/thu nhỏ theo kích cỡ màn hình: điện thoại nhỏ → trần cỡ chữ thấp hơn (tránh chữ to
      // tràn ngang), màn hình rộng/Toàn màn hình → trần cỡ chữ cao hơn hẳn.
      let lo = fs ? 13 : (w < 420 ? 12.5 : 14);
      let hi = fs ? 40 : (w < 420 ? 17 : w < 700 ? 19 : w < 1100 ? 21 : 24);
      while (hi - lo > 0.5){
        const mid = (lo+hi)/2;
        s.style.fontSize = mid+'px';
        if (s.scrollHeight <= s.clientHeight + 1) lo = mid; else hi = mid;
      }
      s.style.fontSize = lo+'px';
    }
    function fitSoon(){ requestAnimationFrame(()=>requestAnimationFrame(fit)); }
    function render(){
      slides.forEach((s,idx)=>s.classList.toggle('active', idx===i));
      dots.forEach((d,idx)=>d.classList.toggle('on', idx===i));
      count.textContent = (i+1)+'/'+slides.length;
      prevBtn.disabled = i===0; nextBtn.disabled = i===slides.length-1;
      fitSoon();
    }
    function go(n){ i = Math.max(0, Math.min(slides.length-1, n)); render(); }
    prevBtn.addEventListener('click', ()=>go(i-1));
    nextBtn.addEventListener('click', ()=>go(i+1));
    deck.tabIndex = 0;
    deck.addEventListener('keydown', (e)=>{
      if (e.key==='ArrowRight') go(i+1);
      if (e.key==='ArrowLeft') go(i-1);
    });
    deck.addEventListener('toggle', fitSoon, true);
    document.addEventListener('fullscreenchange', fitSoon);
    document.addEventListener('webkitfullscreenchange', fitSoon);
    window.addEventListener('resize', fitSoon);
    if (fsBtn) fsBtn.addEventListener('click', ()=>{
      if (!document.fullscreenElement) deck.requestFullscreen?.(); else document.exitFullscreen?.();
    });
    render();
  });
})();
