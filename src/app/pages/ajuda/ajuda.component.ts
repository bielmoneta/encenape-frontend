import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajuda.component.html',
  styleUrls: ['./ajuda.component.scss']
})
export class AjudaComponent {

  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // 3. Crie o formulário de contato
    this.contactForm = this.fb.group({
      // Poderíamos pegar nome/email do usuário logado se AuthService estivesse aqui
      nome: [''],
      email: ['', [Validators.required, Validators.email]],
      assunto: [''],
      mensagem: ['', Validators.required]
    });
  }

  // 4. Lógica de envio (simulada)
  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched(); // Mostra erros
      return;
    }

    console.log('Dados do formulário:', this.contactForm.value);

    // TODO: No futuro, chamar um serviço que envia para o backend POST /api/ajuda/mensagem

    alert('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
    this.contactForm.reset();
  }
}
