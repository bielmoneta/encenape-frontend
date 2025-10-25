import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Evento, EventService } from '../../core/services/event.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { RouterOutlet, RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  // EventCardComponent para usá-lo no HTML
  imports: [CommonModule, EventCardComponent, RouterOutlet, RouterLinkWithHref], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // O '$' é uma convenção para indicar que a variável é um Observable
  eventos$!: Observable<Evento[]>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    // Quando o componente carregar, pedimos os eventos ao serviço
    this.eventos$ = this.eventService.listarEventos();
  }
}