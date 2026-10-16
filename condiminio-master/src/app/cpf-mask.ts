export function aplicarMascaraCpf(event: Event): void {
  const input = event.target as HTMLInputElement;
  const digitos = input.value.replace(/\D/g, '').slice(0, 11);
  input.value = digitos
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
}

export function aplicarMascaraTelefone(event: Event): void {
  const input = event.target as HTMLInputElement;
  const digitos = input.value.replace(/\D/g, '').slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const tamanhoInicial = digitos.length === 11 ? 5 : 4;

  input.value = `${ddd ? `(${ddd}${ddd.length === 2 ? ')' : ''}` : ''}${
    numero ? ` ${numero.slice(0, tamanhoInicial)}${numero.length > tamanhoInicial ? `-${numero.slice(tamanhoInicial)}` : ''}` : ''
  }`;
}
