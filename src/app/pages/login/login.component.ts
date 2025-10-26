import { Component } from '@angular/core';
// 1. Importações necessárias
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.authService.logar(this.loginForm.value).subscribe({
      next: (user: AuthUser) => { 
        console.log('Login bem-sucedido!', user);
        alert(`Bem-vindo(a), ${user.nome}!`); 
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Erro no login', err);
        alert(err.error.message || err.error);
      },
    });
  }
}