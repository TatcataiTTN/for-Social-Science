// Quiz client-side, không backend. Dữ liệu câu hỏi (đã xáo đáp án cố định lúc build) nhúng trong <script type="application/json" id="quiz-data">.
(function(){
  const dataEl = document.getElementById('quiz-data');
  if(!dataEl) return;
  const Q = JSON.parse(dataEl.textContent);
  const root = document.getElementById('quiz-root');
  let score = 0, answered = 0;
  const scoreEl = document.createElement('div');
  scoreEl.className = 'score';
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
  scoreEl.textContent = Q.scoreLabel.replace('{s}', 0).replace('{n}', Q.items.length);
  root.parentElement.insertBefore(scoreEl, root);
})();
