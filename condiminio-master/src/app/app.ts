import { Component, signal } from '@angular/core';
import { Chamados } from './chamados/chamados';
import { Moradores } from './moradores/moradores';
import { CadastroMorador } from './cadastro-morador/cadastro-morador';
import { MatIconModule } from '@angular/material/icon';
import { inject } from '@angular/core';
import { CondominioStore } from './condominio.store';
import { Assembleia } from './assembleia/assembleia';
import { aplicarMascaraCpf } from './cpf-mask';

@Component({
  imports: [Chamados, Moradores, CadastroMorador, Assembleia, MatIconModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(CondominioStore);
  protected readonly title = signal('Veritas Condomínio');
  telaAtual = 'perfil';
  perfil_selecionado = '';
  erroLogin = '';
  usuarioLogado = '';
  telaChamadosAtual = 'lista';

  escolherPerfil(perfil: string) {
    this.perfil_selecionado = perfil;
  }
  ir_paralogin() {
    this.telaAtual = 'login';
  }
  fazerLogin(identificador: string, senha: string) {
    const cpf = identificador.replace(/\D/g, '');
    if (cpf === '' || senha.trim() === '') {
      this.erroLogin = 'Preencha os campos para realizar o login.';
    } else {
      this.erroLogin = '';
      this.usuarioLogado = cpf;

      this.telaAtual = 'inicio';
    }
  }
  formatarCpf(event: Event) {
    aplicarMascaraCpf(event);
  }
  voltarParaPerfil() {
    this.telaAtual = 'perfil';
    this.perfil_selecionado = '';
    this.erroLogin = '';
    this.usuarioLogado = '';
  }
  sair() {
    this.telaAtual = 'perfil';
    this.perfil_selecionado = '';
    this.erroLogin = '';
    this.usuarioLogado = '';
  }

  abrirChamados() {
    this.telaAtual = this.perfil_selecionado === 'sindico' ? 'painelSindico' : 'sistema';
  }

  abrirTodosChamadosSindico() {
    this.telaAtual = 'chamadosSindico';
  }

  abrirMoradores() {
    this.telaAtual = 'moradores';
  }
  abrirAssembleia() {
    this.telaAtual = 'assembleia';
  }
  abrirAnaliseProjetos() {
    this.telaAtual = 'analiseProjetos';
  }
  voltarParaPainelSindico() {
    this.telaAtual = 'painelSindico';
  }
  abrirCadastroMorador() {
    this.telaAtual = 'cadastroMorador';
  }

  abrirInicio() {
    this.telaAtual = 'inicio';
  }

  abrirPerfilUsuario() {
    this.telaAtual = 'perfilUsuario';
  }
  voltarParaLogin() {
    this.telaAtual = 'login';
  }

  atualizarTelaChamados(tela: string) {
    this.telaChamadosAtual = tela;
  }

  quantidadeAbertos() {
    return this.store.chamados.filter((chamado) => chamado.status === 'aberto').length;
  }

  quantidadeEmAndamento() {
    return this.store.chamados.filter((chamado) => chamado.status === 'andamento').length;
  }

  quantidadeConcluidos() {
    return this.store.chamados.filter((chamado) => chamado.status === 'resolvido').length;
  }
}
