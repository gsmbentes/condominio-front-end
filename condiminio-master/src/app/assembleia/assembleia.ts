import { Component, inject, Input } from '@angular/core';
import { Assembleia as Reuniao, CondominioStore, ProjetoCondominio } from '../condominio.store';

@Component({
  selector: 'app-assembleia',
  templateUrl: './assembleia.html',
  styleUrl: './assembleia.css',
})
export class Assembleia {
  @Input() perfil = 'morador';
  @Input() usuarioLogado = '';
  @Input() secao: 'votacoes' | 'analise' = 'votacoes';
  private readonly store = inject(CondominioStore);
  mensagemErro = '';
  mensagemSucesso = '';
  denunciaAbertaId: number | null = null;

  assembleias(): Reuniao[] {
    return this.store.assembleias;
  }

  projetos(): ProjetoCondominio[] { return this.store.projetos; }
  projetosEmAnalise(): ProjetoCondominio[] { return this.store.projetos.filter((projeto) => projeto.status === 'em_analise'); }
  projetosAprovados(): ProjetoCondominio[] { return this.store.projetos.filter((projeto) => projeto.status === 'aprovado'); }
  votosFavor(projeto: ProjetoCondominio): number { return projeto.votos.filter((voto) => voto.voto === 'favor').length; }
  votosContra(projeto: ProjetoCondominio): number { return projeto.votos.filter((voto) => voto.voto === 'contra').length; }
  jaVotou(projeto: ProjetoCondominio): boolean { return projeto.votos.some((voto) => voto.morador === this.usuarioLogado); }
  denunciasPendentes() { return this.store.denunciasProjetos.filter((denuncia) => denuncia.status === 'pendente'); }
  jaDenunciou(projeto: ProjetoCondominio): boolean { return this.store.denunciasProjetos.some((denuncia) => denuncia.projetoId === projeto.id && denuncia.morador === this.usuarioLogado); }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  enviarProjeto(tituloInput: HTMLInputElement, descricaoInput: HTMLTextAreaElement, precoInput: HTMLInputElement): void {
    if (this.perfil !== 'morador') return;
    const titulo = tituloInput.value;
    const descricao = descricaoInput.value;
    const mediaPreco = Number(precoInput.value);
    if (!titulo.trim() || !descricao.trim() || !Number.isFinite(mediaPreco) || mediaPreco <= 0) {
      this.mensagemErro = 'Informe o nome, a descrição e uma média de preço válida.';
      this.mensagemSucesso = '';
      return;
    }
    this.store.enviarProjeto(titulo.trim(), descricao.trim(), mediaPreco, this.usuarioLogado);
    tituloInput.value = '';
    descricaoInput.value = '';
    precoInput.value = '';
    this.mensagemErro = '';
    this.mensagemSucesso = 'Projeto enviado para análise do síndico.';
  }

  votar(projeto: ProjetoCondominio, voto: 'favor' | 'contra'): void {
    if (this.perfil !== 'morador') return;
    this.store.votarProjeto(projeto.id, this.usuarioLogado, voto);
  }

  abrirDenuncia(projeto: ProjetoCondominio): void {
    if (this.perfil !== 'morador' || projeto.enviadoPor === this.usuarioLogado || this.jaDenunciou(projeto)) return;
    this.denunciaAbertaId = this.denunciaAbertaId === projeto.id ? null : projeto.id;
  }

  denunciar(projeto: ProjetoCondominio, motivoInput: HTMLTextAreaElement): void {
    if (this.perfil !== 'morador') return;
    const motivo = motivoInput.value.trim();
    if (!motivo) {
      this.mensagemErro = 'Descreva o motivo da denúncia.';
      this.mensagemSucesso = '';
      return;
    }
    if (this.store.denunciarProjeto(projeto.id, this.usuarioLogado, motivo)) {
      this.mensagemErro = '';
      this.mensagemSucesso = 'Denúncia enviada ao síndico.';
      this.denunciaAbertaId = null;
    }
  }

  marcarDenunciaAnalisada(id: number): void {
    if (this.perfil === 'sindico') this.store.marcarDenunciaAnalisada(id);
  }

  decidir(projeto: ProjetoCondominio, aprovado: boolean): void {
    if (this.perfil !== 'sindico') return;
    this.store.decidirProjeto(projeto.id, aprovado);
  }

  atualizarProgresso(projeto: ProjetoCondominio, progresso: string): void {
    if (this.perfil !== 'sindico') return;
    this.store.atualizarProgressoProjeto(projeto.id, Number(progresso));
  }

  criar(titulo: string, data: string, horario: string, local: string, pauta: string): void {
    if (this.perfil !== 'sindico') return;
    if (!titulo.trim() || !data || !horario || !local.trim() || !pauta.trim()) {
      this.mensagemErro = 'Preencha todos os campos para agendar a assembleia.';
      this.mensagemSucesso = '';
      return;
    }
    if (new Date(`${data}T${horario}`).getTime() < Date.now()) {
      this.mensagemErro = 'Escolha uma data e horário futuros.';
      this.mensagemSucesso = '';
      return;
    }

    this.store.criarAssembleia(titulo.trim(), data, horario, local.trim(), pauta.trim());
    this.mensagemErro = '';
    this.mensagemSucesso = 'Assembleia agendada com sucesso.';
  }

  marcarRealizada(assembleia: Reuniao): void {
    if (this.perfil !== 'sindico') return;
    this.store.marcarAssembleiaRealizada(assembleia);
  }

  formatarData(data: string): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' })
      .format(new Date(`${data}T12:00:00Z`));
  }
}
