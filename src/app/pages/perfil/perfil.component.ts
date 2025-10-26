import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, AuthUser } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userProfile: AuthUser | null = null;
  currentUser$: Observable<AuthUser | null>;

  perfilForm: FormGroup;
  isEditing = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUser$ = this.authService.currentUser$;
    // Inicializa o formulário vazio
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // 3. Pega os dados DIRETAMENTE do usuário logado
    this.userProfile = this.authService.currentUserValue;

    // 4. Preenche o formulário com esses dados
    if (this.userProfile) {
      this.perfilForm.patchValue({
        nome: this.userProfile.nome,
        email: this.userProfile.email
      });
    } else {
        // Se, por algum motivo, o usuário não estiver logado ao chegar aqui
        console.error("Usuário não logado acessou a página de perfil.");
    }
  }

  // Ativa o modo de edição
  onEdit(): void {
    this.isEditing = true;
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }

  // Cancela a edição
  onCancel(): void {
    this.isEditing = false;
    // Reseta o formulário para os valores originais
    if (this.userProfile) {
      this.perfilForm.patchValue({
        nome: this.userProfile.nome,
        email: this.userProfile.email
      });
    }
  }

  // Salva as alterações
  onSubmit(): void {
    if (this.perfilForm.invalid || !this.userProfile) return;

    const { nome, email } = this.perfilForm.value;

    this.authService.updatePerfil(this.userProfile.id, { nome, email }).subscribe({
      next: (usuarioAtualizado: AuthUser) => {
        this.userProfile = usuarioAtualizado; // Atualiza os dados de visualização
        this.perfilForm.patchValue({
             nome: usuarioAtualizado.nome,
             email: usuarioAtualizado.email
        });
        this.isEditing = false; // Sai do modo de edição
        this.mensagemSucesso = 'Perfil atualizado com sucesso!';
      },
      error: (err) => {
        // Pega a mensagem de erro do backend (ex: "Email já em uso")
        this.mensagemErro = err.error.message || 'Erro ao atualizar o perfil.';
      }
    });
  }
}
