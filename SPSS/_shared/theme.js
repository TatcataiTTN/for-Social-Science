// Theme switcher (dark/light/pink/blue/green) + font switcher (Times New Roman/Montserrat).
// Không backend — chỉ lưu lựa chọn trong localStorage của trình duyệt người xem
// (per-viewer, không đồng bộ giữa thiết bị).
(function(){
  function apply(theme){
    if(!theme || theme === 'light'){ document.documentElement.removeAttribute('data-theme'); theme = 'light'; }
    else { document.documentElement.setAttribute('data-theme', theme); }
    document.querySelectorAll('.theme-menu button[data-theme]').forEach(function(b){
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }
  function current(){
    try { return localStorage.getItem('spss-theme') || 'light'; } catch(e){ return 'light'; }
  }
  window.setSiteTheme = function(theme){
    try { localStorage.setItem('spss-theme', theme); } catch(e){}
    apply(theme);
    document.querySelectorAll('.themesw[open]').forEach(function(d){ d.removeAttribute('open'); });
  };

  function applyFont(font){
    if(!font || font === 'times'){ document.documentElement.removeAttribute('data-font'); font = 'times'; }
    else { document.documentElement.setAttribute('data-font', font); }
    document.querySelectorAll('.theme-menu button[data-font]').forEach(function(b){
      b.classList.toggle('active', b.dataset.font === font);
    });
  }
  function currentFont(){
    try { return localStorage.getItem('spss-font') || 'times'; } catch(e){ return 'times'; }
  }
  window.setSiteFont = function(font){
    try { localStorage.setItem('spss-font', font); } catch(e){}
    applyFont(font);
    document.querySelectorAll('.fontsw[open]').forEach(function(d){ d.removeAttribute('open'); });
  };

  function init(){
    apply(current());
    applyFont(currentFont());
    document.querySelectorAll('.theme-menu button[data-theme]').forEach(function(b){
      b.addEventListener('click', function(){ window.setSiteTheme(b.dataset.theme); });
    });
    document.querySelectorAll('.theme-menu button[data-font]').forEach(function(b){
      b.addEventListener('click', function(){ window.setSiteFont(b.dataset.font); });
    });
    document.addEventListener('click', function(e){
      document.querySelectorAll('.themesw[open],.fontsw[open]').forEach(function(d){
        if(!d.contains(e.target)) d.removeAttribute('open');
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
