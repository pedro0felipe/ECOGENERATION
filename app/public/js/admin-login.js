function togglePasswordVisibility() {
  const senhaInput = document.getElementById('senha');
  const toggleBtn = document.querySelector('.btn-toggle-password');

  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    toggleBtn.textContent = 'x';
  } else {
    senhaInput.type = 'password';
    toggleBtn.textContent = '👁️';
  }
}
