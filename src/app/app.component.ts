import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Drogueria Konex';
  items = [
    {
      label: 'Medicamentos',
      icon: 'pi pi-truck',
      routerLink:"/"
    },
    {
      label: 'Ventas',
      icon: 'pi pi-shopping-cart',
      routerLink:"/ventas"
    },
  ];
}
