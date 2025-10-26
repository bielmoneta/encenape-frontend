import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { EventCreateComponent } from './pages/event-create/event-create.component';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { ResetarSenhaComponent } from './pages/resetar-senha/resetar-senha.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MeusIngressosComponent } from './pages/meus-ingressos/meus-ingressos.component';
import { AjudaComponent } from './pages/ajuda/ajuda.component';

export const routes: Routes = [
  // A rota raiz (/) agora é a nossa Homepage
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'criar-evento', component: EventCreateComponent },
  { path: 'eventos', component: EventListComponent },
  { path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
  { path: 'resetar-senha', component: ResetarSenhaComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'meus-ingressos', component: MeusIngressosComponent },
  { path: 'ajuda', component: AjudaComponent }
];
