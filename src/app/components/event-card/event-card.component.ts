import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Evento } from '../../core/services/event.service';
import { IngressoService } from '../../core/services/ingresso.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})

export class EventCardComponent {
  @Input({ required: true }) evento!: Evento;

  constructor(
    private ingressoService: IngressoService,
    public authService: AuthService,
    private router: Router
  ) {}

  comprar(): void {
    if (!this.authService.currentUserValue) {
      alert('Você precisa estar logado para comprar ingressos.');
      this.router.navigate(['/login']);
      return;
    }

    this.ingressoService.comprarIngresso(this.evento.id).subscribe({
      next: (ingressoComprado) => {
        alert(`Ingresso para "${this.evento.nome}" comprado com sucesso!`);
        console.log('Ingresso:', ingressoComprado);
      },
      error: (err) => {
        console.error('Erro ao comprar ingresso:', err);
        alert(`Erro ao comprar ingresso: ${err.error?.message || 'Tente novamente.'}`);
      }
    });
  }
}
