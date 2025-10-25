import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from './core/services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'encenape-frontend';

  currentUser$: Observable<AuthUser | null>;

  constructor(private authService: AuthService) {
    // Conecte o Observable do componente ao Observable do serviço
    this.currentUser$ = this.authService.currentUser$;
  }

  // Crie uma função de logout para o botão
  logout(): void {
    this.authService.logout();
  }
}