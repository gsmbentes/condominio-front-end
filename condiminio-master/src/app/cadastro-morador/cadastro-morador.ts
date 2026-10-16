import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CondominioStore } from '../condominio.store';
import { aplicarMascaraCpf, aplicarMascaraTelefone } from '../cpf-mask';

@Component({
  imports: [],
  selector: 'app-cadastro-morador',
  styleUrl: './cadastro-morador.css',
  templateUrl: './cadastro-morador.html',
})
export class CadastroMorador {
  private readonly store = inject(CondominioStore);
  @Output() voltarLogin = new EventEmitter<void>();
  erroCadastro = '';
  cadastroConcluido = '';
  telaAtual = 'perfil';

  formatarCpf(event: Event): void {
    aplicarMascaraCpf(event);
  }

  formatarTelefone(event: Event): void {
    aplicarMascaraTelefone(event);
  }

  finalizarCadastro(
    nome: string,
    sobrenome: string,
    telefone: string,
    cpf: string,
    codigo: string,
    senha: string,
    confirmarSenha: string,
  ) {
    if (
      nome.trim() === '' ||
      sobrenome.trim() === '' ||
      telefone.trim() === '' ||
      cpf.trim() === '' ||
      codigo.trim() === '' ||
      senha === '' ||
      confirmarSenha === ''
    ) {
      this.erroCadastro = 'Preencha todos os campos.';
      this.cadastroConcluido = '';
      return;
    }

    if (!/^MOR-\d{3}$/i.test(codigo.trim())) {
      this.erroCadastro = 'Use o código no formato MOR-001.';
      this.cadastroConcluido = '';
      return;
    }

    if (!this.store.codigoExiste(codigo)) {
      this.erroCadastro = 'Código de acesso inválido ou ainda não liberado pelo síndico.';
      this.cadastroConcluido = '';
      return;
    }

    if (senha.length !== 6) {
      this.erroCadastro = 'A senha deve ter exatamente 6 caracteres.';
      this.cadastroConcluido = '';
      return;
    }

    if (senha !== confirmarSenha) {
      this.erroCadastro = 'As senhas não são iguais.';
      this.cadastroConcluido = '';
      return;
    }

    this.erroCadastro = '';
    this.cadastroConcluido = 'Cadastro concluído com sucesso. Você já pode entrar no sistema.';
  }

  voltarParaLogin() {
  this.voltarLogin.emit();
}
}
