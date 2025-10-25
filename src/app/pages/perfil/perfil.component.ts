import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UsuarioCompleto } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Adicione ReactiveFormsModule
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  
  userProfile: UsuarioCompleto | null = null;
  perfilForm: FormGroup;
  isEditing = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Inicializa o formulário vazio
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // 1. Pega o ID do usuário logado
    const currentUserId = this.authService.currentUserValue?.usuarioId;

    if (currentUserId) {
      // 2. Busca os dados completos no backend
      this.authService.getUsuarioById(currentUserId).subscribe(user => {
        this.userProfile = user;
        // 3. Preenche o formulário com os dados recebidos
        this.perfilForm.patchValue({
          nome: user.nome,
          email: user.email
        });
      });
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
      next: (usuarioAtualizado) => {
        this.userProfile = usuarioAtualizado; // Atualiza os dados de visualização
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