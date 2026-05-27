document.addEventListener('DOMContentLoaded', () => {
  // WCAG 3.3.1 — Validação acessível com feedback em aria-live
  const diagnosticoForm = document.getElementById('diagnostico-form');
  if (!diagnosticoForm) return;

  diagnosticoForm.addEventListener('submit', function(e) {
    const campos = ['frequencia', 'duracao', 'preparacao', 'prioridade', 'moradia', 'orcamento'];
    const naoRespondidas = campos.filter(campo => {
      if (campo === 'preparacao') {
        // preparacao usa checkboxes, então precisa ter pelo menos um marcado
        return document.querySelectorAll(`input[name="${campo}"]:checked`).length === 0;
      }
      // outros campos usam radio buttons
      return !document.querySelector(`input[name="${campo}"]:checked`);
    });
    const feedback = document.getElementById('form-feedback');

    if (naoRespondidas.length > 0) {
      e.preventDefault();
      const msg = `Por favor, responda todas as perguntas antes de continuar. Faltam ${naoRespondidas.length} resposta(s).`;
      feedback.textContent = msg;
      feedback.classList.remove('visually-hidden');
      // Foca no primeiro fieldset sem resposta
      const primeiroVazio = document.querySelector(`fieldset:has(input[name="${naoRespondidas[0]}"])`);
      if (primeiroVazio) primeiroVazio.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      feedback.textContent = '';
      feedback.classList.add('visually-hidden');
    }
  });
});
