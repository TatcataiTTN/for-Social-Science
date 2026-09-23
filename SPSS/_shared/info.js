// Modal "Thông tin trang & liên hệ góp ý" — mở từ icon "i" cố định góc trên-trái, hoặc từ
// nút ở chân trang. Không backend, không lưu trạng thái, chỉ toggle hiển thị.
(function(){
  const modal = document.getElementById('info-modal');
  if(!modal) return;
  const closeBtn = modal.querySelector('.info-modal-close');
  const backdrop = modal.querySelector('.info-modal-backdrop');

  function open(){
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('#info-fab,[data-info-open]').forEach(function(el){
    el.addEventListener('click', open);
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();
