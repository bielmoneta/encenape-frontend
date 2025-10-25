import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.cadastrar(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Usuário cadastrado!', response);
        alert('Cadastro realizado com sucesso! Faça o login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no cadastro', err);
        alert(`Erro: ${err.error.message || err.error}`);
      },
    });
  }
}