// Quiz client-side, không backend. Dữ liệu câu hỏi (đã xáo đáp án cố định lúc build) nhúng trong <script type="application/json" id="quiz-data">.
// Có nút "Làm lại từ đầu" để tự luyện tập nhiều lần trên cùng một trang, không cần tải lại trang.
(function(){
  const dataEl = document.getElementById('quiz-data');
  if(!dataEl) return;
  const Q = JSON.parse(dataEl.textContent);
  const root = document.getElementById('quiz-root');

  const LANG = (location.pathname.match(/\/SPSS\/(vi|en|zh)\//) || [null,'vi'])[1];
  const RESET_LABEL = {vi:'↺ Làm lại từ đầu', en:'↺ Restart quiz', zh:'↺ 重新开始'}[LANG];
  const CONFIRM_TXT = {
    vi:'Làm lại từ đầu sẽ xoá toàn bộ lựa chọn đã bấm ở lượt này. Tiếp tục?',
    en:'Restarting will clear every answer you picked this round. Continue?',
    zh:'重新开始将清除本轮已选择的全部答案。是否继续？',
  }[LANG];

  const toolbar = document.createElement('div');
  toolbar.className = 'quiz-toolbar';
  const scoreEl = document.createElement('div');
  scoreEl.className = 'score';
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'quiz-reset';
  resetBtn.textContent = RESET_LABEL;
  toolbar.appendChild(scoreEl);
  toolbar.appendChild(resetBtn);

  function build(){
    root.innerHTML = '';
    let score = 0, answered = 0;
    scoreEl.textContent = Q.scoreLabel.replace('{s}', 0).replace('{n}', Q.items.length);
    Q.items.forEach((q, qi) => {
      const box = document.createElement('div');
      box.className = 'qitem';
      const h = document.createElement('div');
      h.innerHTML = `<b>${qi+1}. ${q.q}</b>`;
      box.appendChild(h);
      const explain = document.createElement('div');
      explain.className = 'explain';
      explain.textContent = q.explain;
      q.opts.forEach((opt, oi) => {
        const b = document.createElement('button');
        b.className = 'opt'; b.type='button'; b.textContent = opt;
        b.addEventListener('click', () => {
          if (b.dataset.done) return;
          [...box.querySelectorAll('.opt')].forEach(x => x.dataset.done = '1');
          const correct = oi === q.correct;
          b.classList.add(correct ? 'correct' : 'wrong');
          if(!correct) box.querySelector(`.opt:nth-of-type(${q.correct+1})`)?.classList.add('correct');
          explain.classList.add('show');
          answered++; if(correct) score++;
          scoreEl.textContent = Q.scoreLabel.replace('{s}', score).replace('{n}', Q.items.length);
        });
        box.appendChild(b);
      });
      box.appendChild(explain);
      root.appendChild(box);
    });
  }

  resetBtn.addEventListener('click', () => {
    if (root.querySelector('.opt[data-done]') && !window.confirm(CONFIRM_TXT)) return;
    build();
    root.scrollIntoView({behavior:'smooth', block:'start'});
  });

  root.parentElement.insertBefore(toolbar, root);
  build();
})();
