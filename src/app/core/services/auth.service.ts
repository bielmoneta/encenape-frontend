import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

// 1. Interface para o usuário logado (o que o backend nos devolve)
export interface AuthUser {
  usuarioId: number;
  nome: string;
}

export interface UsuarioCompleto {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  // BehaviorSubject guarda o valor ATUAL do usuário logado (null = deslogado)
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Ao iniciar o serviço, verifica se o usuário já estava logado
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
      userJson ? JSON.parse(userJson) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Método público para pegar o valor atual (se precisar)
  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // Conecta com POST /api/usuarios/cadastrar
  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastrar`, usuario);
  }

   //Conecta com POST /api/usuarios/logar
  logar(credenciais: any): Observable<any> {
    return this.http.post<AuthUser>(`${this.apiUrl}/logar`, credenciais).pipe(
      // "tap" (bisbilhotar) a resposta ANTES de devolvê-la ao componente
      tap((user) => {
        // Salva o usuário no localStorage E no BehaviorSubject
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }
  
  logout(): void {
    // Remove o usuário do localStorage e do BehaviorSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // Leva o usuário de volta para a tela de login
    this.router.navigate(['/login']);
  }

  solicitarRedefinicao(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/esqueceu-senha`, { email });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetar-senha`, { token, novaSenha });
  }

  //Busca os dados completos do usuário
  getUsuarioById(id: number): Observable<UsuarioCompleto> {
    return this.http.get<UsuarioCompleto>(`${this.apiUrl}/${id}`);
  }

  //Atualiza nome e email do usuário
  updatePerfil(id: number, dados: { nome: string; email: string }): Observable<UsuarioCompleto> {
    return this.http.put<UsuarioCompleto>(`${this.apiUrl}/${id}`, dados).pipe(
      tap(usuarioAtualizado => {
        // Atualiza o estado de login (navbar) com o novo nome
        const authUser: AuthUser = {
          usuarioId: usuarioAtualizado.id,
          nome: usuarioAtualizado.nome
        };
        localStorage.setItem('currentUser', JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
      })
    );
  }
}