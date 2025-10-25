import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importe ActivatedRoute
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './resetar-senha.component.html',
  styleUrls: ['../../pages/register/register.component.scss']
})
export class ResetarSenhaComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Para ler a URL
  ) {
    this.resetForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // 1. Lê o token da URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.mensagemErro = "Token inválido ou não fornecido.";
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;

    this.mensagemSucesso = '';
    this.mensagemErro = '';

    this.authService.redefinirSenha(this.token, this.resetForm.value.novaSenha).subscribe({
      next: (response) => {
        this.mensagemSucesso = "Senha redefinida com sucesso! Você será redirecionado para o login.";
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // Espera 3 segundos
      },
      error: (err) => {
        this.mensagemErro = err.error.message || err.error;
      }
    });
  }
}