import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Evento, EventService } from '../../core/services/event.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  // 1. Importe o ReactiveFormsModule para o formulário de filtro
  imports: [CommonModule, EventCardComponent, ReactiveFormsModule], 
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  
  filterForm: FormGroup;
  allEvents: Evento[] = [];      // Guarda a lista original
  filteredEvents: Evento[] = []; // Guarda a lista que será exibida

  constructor(
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    // 2. Cria o formulário de filtro
    this.filterForm = this.fb.group({
      nome: [''],
      data: [''],
      local: [''] // Este campo será usado para filtrar por "Cidade"
    });
  }

  ngOnInit(): void {
    // 3. Busca todos os eventos na API quando a página carrega
    this.eventService.listarEventos().subscribe(eventos => {
      this.allEvents = eventos;
      this.filteredEvents = eventos; // No início, a lista filtrada é igual à lista completa
    });
  }

  // 4. Lógica de filtro (chamada pelo botão "Filtrar")
  applyFilters(): void {
    const filters = this.filterForm.value;
    
    // Começa com a lista completa
    let events = this.allEvents;

    if (filters.nome) {
      events = events.filter(evento => 
        evento.nome.toLowerCase().includes(filters.nome.toLowerCase())
      );
    }
    
    if (filters.local) {
      events = events.filter(evento => 
        evento.local.toLowerCase().includes(filters.local.toLowerCase())
      );
    }
    
    if (filters.data) {
      events = events.filter(evento => {
        // Compara apenas a parte da data (YYYY-MM-DD), ignorando a hora
        const dataEvento = evento.data.split('T')[0];
        return dataEvento === filters.data;
      });
    }

    this.filteredEvents = events;
  }

  // 5. Lógica para limpar os filtros
  clearFilters(): void {
    this.filterForm.reset({ nome: '', data: '', local: '' });
    this.filteredEvents = this.allEvents;
  }
}