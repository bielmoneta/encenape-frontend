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
  currentUser$: Observable<AuthUser | null>;
  dropdownOpen = false;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown(); // Fecha o dropdown ao sair
  }

  // Método para abrir/fechar o dropdown
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para fechar o dropdown (usado nos links)
  closeDropdown(): void {
    this.dropdownOpen = false;
  }
}
