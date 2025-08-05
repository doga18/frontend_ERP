export const validCPF = (cpf: string | number): boolean => {
  // Garante que o CPF seja tratado como string
  if (typeof cpf === "number") {
    cpf = cpf.toString().padStart(11, "0"); // Reinsere zeros à esquerda, se necessário
  }

  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // CPF deve ter 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11 é inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  // Cálculo do primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;

  // Cálculo do segundo dígito verificador
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};
