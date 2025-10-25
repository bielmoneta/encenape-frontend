import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Para ler a URL
import { Observable, switchMap } from 'rxjs';
import { Evento, EventService } from '../../core/services/event.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';

@Component({
  selector: 'app-event-category-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent], // Importe o card
  templateUrl: './event-category-list.component.html',
  styleUrls: ['./event-category-list.component.scss']
})
export class EventCategoryListComponent implements OnInit {
  eventos$!: Observable<Evento[]>;
  categoriaTitulo: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventos$ = this.route.paramMap.pipe(
      switchMap(params => {
        const categoria = params.get('categoria');
        if (categoria) {
          this.categoriaTitulo = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
          return this.eventService.listarEventosPorCategoria(categoria.toUpperCase());
        }
        return [];
      })
    );
  }
}