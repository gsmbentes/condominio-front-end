import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CondominioStore, Morador } from '../condominio.store';
@Component({
  imports: [MatIconModule],
  selector: 'app-moradores',
  styleUrl: './moradores.css',
  templateUrl: './moradores.html',
})
export class Moradores {
  private readonly store = inject(CondominioStore);
  moradores: Morador[] = this.store.moradores;
  codigoGerado = '';
  erroCadastro = '';
  mensagemSucesso = '';
  mostrarModalConfirmacao = false;
  mostrarModalExclusao = false;
  moradorParaExcluir: Morador | null = null;
  blocoPendente = '';
  apartamentoPendente = '';
  @Output() voltarPainel = new EventEmitter<void>();

  voltarParaPainel() {
    this.voltarPainel.emit();
  }

  confirmarCadastro(bloco: string, apartamento: string) {
    if (bloco.trim() === '' || apartamento.trim() === '') {
      this.erroCadastro = 'Preencha bloco e apartamento.';
      this.codigoGerado = '';
      return;
    }
    const apartamentoJaCadastrado = this.moradores.some(
      (morador) =>
        morador.bloco.trim().toLowerCase() === bloco.trim().toLowerCase() &&
        morador.apartamento.trim() === apartamento.trim(),
    );

    if (apartamentoJaCadastrado) {
      this.erroCadastro = 'Já existe um morador cadastrado neste bloco e apartamento.';
      this.codigoGerado = '';
      return;
    }

    this.erroCadastro = '';
    this.mensagemSucesso = '';
    this.blocoPendente = bloco.trim();
    this.apartamentoPendente = apartamento.trim();
    this.mostrarModalConfirmacao = true;
  }

  cadastrarMorador(bloco: string, apartamento: string) {
    if (bloco.trim() === '' || apartamento.trim() === '') {
      this.erroCadastro = 'Preencha bloco e apartamento.';
      return;
    }

    this.erroCadastro = '';
    const morador = this.store.cadastrarMorador(bloco.trim(), apartamento.trim());
    this.codigoGerado = morador.codigo;
  }
  cancelarConfirmacao() {
    this.mostrarModalConfirmacao = false;
    this.blocoPendente = '';
    this.apartamentoPendente = '';
  }

  confirmarCadastroFinal(
    blocoInput: HTMLInputElement,
    apartamentoInput: HTMLInputElement,
  ) {
    this.cadastrarMorador(this.blocoPendente, this.apartamentoPendente);

    this.mostrarModalConfirmacao = false;
    this.blocoPendente = '';
    this.apartamentoPendente = '';

    blocoInput.value = '';
    apartamentoInput.value = '';
  }

  pedirExclusao(morador: Morador) {
    this.moradorParaExcluir = morador;
    this.mostrarModalExclusao = true;
  }

  cancelarExclusao() {
    this.mostrarModalExclusao = false;
    this.moradorParaExcluir = null;
  }

  confirmarExclusao() {
    if (this.moradorParaExcluir === null) return;

    const nome = this.moradorParaExcluir.nome;
    if (this.store.removerMorador(this.moradorParaExcluir)) {
      this.codigoGerado = '';
      this.erroCadastro = '';
      this.mensagemSucesso = `${nome} foi excluído do cadastro.`;
    }

    this.cancelarExclusao();
  }
}
