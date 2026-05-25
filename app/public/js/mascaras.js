// Máscaras de entrada usando Cleave.js
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== CPF: ###.###.###-## =====
  const cpfInputs = document.querySelectorAll('input[data-mask="cpf"]');
  cpfInputs.forEach(input => {
    if (typeof Cleave !== 'undefined') {
      new Cleave(input, {
        blocks: [3, 3, 3, 2],
        delimiters: ['.', '.', '-'],
        numericOnly: true
      });
    }
  });

  // ===== CNPJ: ##.###.###/####-## =====
  const cnpjInputs = document.querySelectorAll('input[data-mask="cnpj"]');
  cnpjInputs.forEach(input => {
    if (typeof Cleave !== 'undefined') {
      new Cleave(input, {
        blocks: [2, 3, 3, 4, 2],
        delimiters: ['.', '.', '/', '-'],
        numericOnly: true
      });
    }
  });

  // ===== TELEFONE: (##) #####-#### =====
  const phoneInputs = document.querySelectorAll('input[data-mask="phone"]');
  phoneInputs.forEach(input => {
    if (typeof Cleave !== 'undefined') {
      new Cleave(input, {
        blocks: [0, 2, 5, 4],
        delimiters: ['(', ') ', '-'],
        numericOnly: true
      });
    }
  });

  // ===== RG: #.###.###-## =====
  const rgInputs = document.querySelectorAll('input[data-mask="rg"]');
  rgInputs.forEach(input => {
    if (typeof Cleave !== 'undefined') {
      new Cleave(input, {
        blocks: [1, 3, 3, 2],
        delimiters: ['.', '.', '-'],
        numericOnly: true
      });
    }
  });

});
