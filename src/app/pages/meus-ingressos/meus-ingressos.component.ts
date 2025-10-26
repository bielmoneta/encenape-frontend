import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importe DatePipe
import { Observable } from 'rxjs';
import { IngressoService, IngressoDetalhado } from '../../core/services/ingresso.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-meus-ingressos',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './meus-ingressos.component.html',
  styleUrls: ['./meus-ingressos.component.scss']
})
export class MeusIngressosComponent implements OnInit {

  meusIngressos$!: Observable<IngressoDetalhado[]>;

  constructor(
    private ingressoService: IngressoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Só busca os ingressos se o usuário estiver logado
    if (this.authService.currentUserValue) {
      this.meusIngressos$ = this.ingressoService.listarMeusIngressos();
    } else {
      console.error("Usuário não logado tentou acessar Meus Ingressos");
    }
  }
}
