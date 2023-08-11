import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicamentosComponent } from './pages/medicamentos/medicamentos.component';
import { VentasComponent } from './pages/ventas/ventas.component';

const routes: Routes = [
  {
    path: '',
    component: MedicamentosComponent
  },
  {
    path: 'ventas',
    component: VentasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
