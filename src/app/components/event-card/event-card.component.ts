import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Evento } from '../../core/services/event.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, DatePipe], // DatePipe formata a data para nós
  template: `
    <div class="card-container">
      <h3>{{ evento.nome }}</h3>
      <p>{{ evento.descricao }}</p>
      <hr>
      <small>
        <strong>Data:</strong> {{ evento.data | date: 'dd/MM/yyyy HH:mm' }}
      </small>
      <br>
      <small><strong>Local:</strong> {{ evento.local }}</small>
    </div>
  `,
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  // permite que o componente "receba" a informação do evento
  @Input({ required: true }) evento!: Evento;
}