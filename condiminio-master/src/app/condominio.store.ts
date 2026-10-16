import { Injectable } from '@angular/core';

export type Morador = {
  nome: string;
  bloco: string;
  apartamento: string;
  codigo: string;
};

export type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  gravidade: number;
  status: 'aberto' | 'andamento' | 'resolvido';
  criadoPor: string;
  excluidoPor?: string;
  perfilCriador: string;
};

export type Assembleia = {
  id: number;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  pauta: string;
  status: 'agendada' | 'realizada';
};

export type VotoProjeto = { morador: string; voto: 'favor' | 'contra' };
export type ProjetoCondominio = {
  id: number;
  titulo: string;
  descricao: string;
  mediaPreco: number;
  enviadoPor: string;
  status: 'em_analise' | 'aprovado' | 'recusado';
  progresso: number;
  votos: VotoProjeto[];
};
export type DenunciaProjeto = {
  id: number;
  projetoId: number;
  projetoTitulo: string;
  morador: string;
  motivo: string;
  status: 'pendente' | 'analisada';
};

@Injectable({ providedIn: 'root' })
export class CondominioStore {
  readonly moradores: Morador[] = [];
  readonly chamados: Chamado[] = [
    { id: 1, titulo: 'Lâmpada quebrada no corredor', descricao: 'A lâmpada do corredor está queimada.', categoria: 'Manutenção', gravidade: 4, status: 'aberto', criadoPor: 'sindico@veritas.com', perfilCriador: 'sindico' },
    { id: 2, titulo: 'Vazamento de água', descricao: 'Há um vazamento de água próximo à garagem.', categoria: 'Manutenção', gravidade: 9, status: 'andamento', criadoPor: 'sindico@veritas.com', perfilCriador: 'sindico' },
    { id: 3, titulo: 'Portão da garagem', descricao: 'O portão precisou de manutenção.', categoria: 'Segurança', gravidade: 8, status: 'resolvido', criadoPor: 'sindico@veritas.com', perfilCriador: 'sindico' },
  ];
  readonly chamadosExcluidos: Chamado[] = [];
  readonly assembleias: Assembleia[] = [];
  readonly projetos: ProjetoCondominio[] = [];
  readonly denunciasProjetos: DenunciaProjeto[] = [];
  private proximoCodigo = 1;
  private proximoChamadoId = 4;
  private proximaAssembleiaId = 1;
  private proximoProjetoId = 1;
  private proximaDenunciaId = 1;

  enviarProjeto(titulo: string, descricao: string, mediaPreco: number, enviadoPor: string): ProjetoCondominio {
    const projeto: ProjetoCondominio = {
      id: this.proximoProjetoId++, titulo, descricao, mediaPreco, enviadoPor,
      status: 'em_analise', progresso: 0, votos: [],
    };
    this.projetos.unshift(projeto);
    return projeto;
  }

  denunciarProjeto(projetoId: number, morador: string, motivo: string): boolean {
    const projeto = this.projetos.find((item) => item.id === projetoId);
    if (!projeto || projeto.enviadoPor === morador ||
        this.denunciasProjetos.some((item) => item.projetoId === projetoId && item.morador === morador)) return false;
    this.denunciasProjetos.unshift({
      id: this.proximaDenunciaId++, projetoId, projetoTitulo: projeto.titulo,
      morador, motivo, status: 'pendente',
    });
    return true;
  }

  marcarDenunciaAnalisada(id: number): void {
    const denuncia = this.denunciasProjetos.find((item) => item.id === id);
    if (denuncia) denuncia.status = 'analisada';
  }

  votarProjeto(id: number, morador: string, voto: 'favor' | 'contra'): boolean {
    const projeto = this.projetos.find((item) => item.id === id);
    if (!projeto || projeto.status !== 'em_analise' || projeto.enviadoPor === morador ||
        projeto.votos.some((item) => item.morador === morador)) return false;
    projeto.votos.push({ morador, voto });
    return true;
  }

  decidirProjeto(id: number, aprovado: boolean): void {
    const projeto = this.projetos.find((item) => item.id === id);
    if (!projeto || projeto.status !== 'em_analise') return;
    projeto.status = aprovado ? 'aprovado' : 'recusado';
  }

  atualizarProgressoProjeto(id: number, progresso: number): void {
    const projeto = this.projetos.find((item) => item.id === id && item.status === 'aprovado');
    if (projeto) projeto.progresso = Math.max(0, Math.min(100, Math.round(progresso)));
  }

  criarAssembleia(titulo: string, data: string, horario: string, local: string, pauta: string): Assembleia {
    const assembleia: Assembleia = {
      id: this.proximaAssembleiaId++, titulo, data, horario, local, pauta, status: 'agendada',
    };
    this.assembleias.unshift(assembleia);
    return assembleia;
  }

  marcarAssembleiaRealizada(assembleia: Assembleia): void {
    assembleia.status = 'realizada';
  }

  cadastrarMorador(bloco: string, apartamento: string): Morador {
    const apartamentoJaCadastrado = this.moradores.some(
      (morador) =>
        morador.bloco.toLocaleLowerCase() === bloco.toLocaleLowerCase() &&
        morador.apartamento.toLocaleLowerCase() === apartamento.toLocaleLowerCase(),
    );

    if (apartamentoJaCadastrado) {
      throw new Error('Já existe um morador cadastrado neste bloco e apartamento.');
    }

    const codigo = `MOR-${String(this.proximoCodigo++).padStart(3, '0')}`;
    const morador = { nome: 'Cadastro pendente', bloco, apartamento, codigo };
    this.moradores.push(morador);
    return morador;
  }

  codigoExiste(codigo: string): boolean {
    return this.moradores.some((morador) => morador.codigo === codigo.trim().toUpperCase());
  }

  removerMorador(morador: Morador): boolean {
    const indice = this.moradores.indexOf(morador);
    if (indice === -1) return false;

    this.moradores.splice(indice, 1);
    return true;
  }

  criarChamado(titulo: string, descricao: string, categoria: string, gravidade: number, criadoPor: string, perfilCriador: string): void {
    this.chamados.push({ id: this.proximoChamadoId++, titulo, descricao, categoria, gravidade, status: 'aberto', criadoPor, perfilCriador });
  }
}
