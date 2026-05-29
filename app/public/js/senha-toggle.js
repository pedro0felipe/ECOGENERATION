// Toggle mostrar/ocultar senha via checkbox
function toggleSenha(inputId, checkbox) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = checkbox.checked ? 'text' : 'password';
}
