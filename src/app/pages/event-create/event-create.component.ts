import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, CategoriaEvento} from '../../core/services/event.service';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['../../pages/register/register.component.scss'] 
})
export class EventCreateComponent {
  eventForm: FormGroup;
  categorias = Object.values(CategoriaEvento);

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''], // Descrição é opcional
      data: ['', Validators.required],
      local: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched(); // Mostra erros se o formulário for inválido
      return;
    }

    this.eventService.criarEvento(this.eventForm.value).subscribe({
      next: (response) => {
        alert('Evento criado com sucesso!');
        this.router.navigate(['/']); // Navega para a homepage
      },
      error: (err) => {
        console.error('Erro ao criar evento', err);
        alert('Erro ao criar evento. Verifique o console.');
      }
    });
  }
}
