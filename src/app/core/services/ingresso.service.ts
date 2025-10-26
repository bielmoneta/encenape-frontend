import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Precisamos saber o ID do usuário logado

// Interface para a resposta do backend (IngressoResponseDTO)
export interface IngressoDetalhado {
  id: number;
  dataCompra: string;
  eventoId: number;
  eventoNome: string;
  eventoData: string;
  eventoLocal: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngressoService {
  private apiUrl = 'http://localhost:8080/api/ingressos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Conecta com POST /api/ingressos/comprar/{eventoId}
   * O Interceptor adicionará o token JWT automaticamente.
   * A "gambiarra" do X-User-ID NÃO é mais necessária aqui se o Interceptor estiver funcionando.
   */
  comprarIngresso(eventoId: number): Observable<IngressoDetalhado> {
    // ATENÇÃO: Se o Interceptor JWT não estiver funcionando, o backend
    // ainda espera o X-User-ID. Se o Interceptor FUNCIONA,
    // o backend pegará o ID do token e este header não é necessário.
    // Vamos assumir que o Interceptor FUNCIONARÁ no futuro.

    // const userId = this.authService.currentUserValue?.id;
    // if (!userId) {
    //   throw new Error("Usuário não logado para comprar ingresso"); // Ou retorne um Observable de erro
    // }
    // // Código SE precisar da gambiarra temporária:
    // const headers = { 'X-User-ID': userId.toString() };
    // return this.http.post<IngressoDetalhado>(`${this.apiUrl}/comprar/${eventoId}`, null, { headers });

    // Código CORRETO com Interceptor JWT:
    return this.http.post<IngressoDetalhado>(`${this.apiUrl}/comprar/${eventoId}`, null); // Envia corpo vazio
  }

  /**
   * Conecta com GET /api/ingressos/meus-ingressos
   * O Interceptor adicionará o token JWT automaticamente.
   */
  listarMeusIngressos(): Observable<IngressoDetalhado[]> {
    // ATENÇÃO: Mesma lógica do header X-User-ID acima.

    // const userId = this.authService.currentUserValue?.id;
    // if (!userId) {
    //   throw new Error("Usuário não logado para ver ingressos");
    // }
    // // Código SE precisar da gambiarra temporária:
    // const headers = { 'X-User-ID': userId.toString() };
    // return this.http.get<IngressoDetalhado[]>(`${this.apiUrl}/meus-ingressos`, { headers });

    // Código CORRETO com Interceptor JWT:
    return this.http.get<IngressoDetalhado[]>(`${this.apiUrl}/meus-ingressos`);
  }
}
