import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum CategoriaEvento {
  TEATRO = 'TEATRO',
  MUSICA = 'MUSICA',
  DANCA = 'DANCA',
  FESTIVAL = 'FESTIVAL',
  STANDUP = 'STANDUP',
  OUTRO = 'OUTRO'
}

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string; // O backend envia a data como uma string ISO (com o 'T')
  local: string;
  categoria: CategoriaEvento;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/eventos';

  constructor(private http: HttpClient) { }


   // Conecta com GET /api/eventos
  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }


   //Conecta com POST /api/eventos
  criarEvento(evento: any): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  // Conecta com GET /api/eventos/categoria/{categoria}
  listarEventosPorCategoria(categoria: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/categoria/${categoria}`);
  }
}