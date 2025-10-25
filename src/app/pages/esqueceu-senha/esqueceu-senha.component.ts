import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink
  ],
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['../../pages/register/register.component.scss']
})
export class EsqueceuSenhaComponent {
  forgotForm: FormGroup;
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.mensagemSucesso = '';
    this.mensagemErro = '';
    
    this.authService.solicitarRedefinicao(this.forgotForm.value.email).subscribe({
      next: (response) => {
        this.mensagemSucesso = "Se o email estiver cadastrado, um link de redefinição foi enviado.";
      },
      error: (err) => {
        this.mensagemErro = "Ocorreu um erro. Tente novamente mais tarde.";
      }
    });
  }
}