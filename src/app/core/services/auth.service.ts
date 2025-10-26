import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { Router } from '@angular/router';

// 1. Interface que ESPELHA a JwtResponse do backend
export interface JwtResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
}

// 2. Interface simplificada para o usuário logado (armazenado)
export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(private http: HttpClient, private router: Router) {
    // 3. Lê o usuário (incluindo o token) do localStorage ao iniciar
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
      userJson ? JSON.parse(userJson) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  // 4. Método para pegar apenas o token (será usado pelo Interceptor)
  public getToken(): string | null {
    return this.currentUserValue?.token ?? null;
  }

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastrar`, usuario);
  }

  // Método LOGIN
  logar(credenciais: any): Observable<AuthUser> { // Agora retorna AuthUser
    return this.http.post<JwtResponse>(`${this.apiUrl}/logar`, credenciais).pipe(
      map(response => {
        const authUser: AuthUser = {
          id: response.id,
          nome: response.nome,
          email: response.email,
          token: response.token
        };
        // 7. Salva no localStorage E no BehaviorSubject
        localStorage.setItem('currentUser', JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
        return authUser; // Retorna o AuthUser para o componente
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  solicitarRedefinicao(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, novaSenha });
  }

  updatePerfil(id: number, dados: { nome: string; email: string }): Observable<AuthUser> {
    return this.http.put<AuthUser>(`${this.apiUrl}/${id}`, dados).pipe(
      tap(usuarioAtualizado => {
        // ATUALIZA O ESTADO LOGADO COM OS NOVOS DADOS
        const currentUser = this.currentUserValue;
        if(currentUser) {
           // O 'usuarioAtualizado' já vem no formato certo (id, nome, email) do backend
           // Só precisamos manter o token original
          const updatedAuthUser: AuthUser = {
            ...usuarioAtualizado, // Pega id, nome, email da resposta
            token: currentUser.token // Mantém o token que já tínhamos
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedAuthUser));
          this.currentUserSubject.next(updatedAuthUser);
        }
      })
    );
  }
}
