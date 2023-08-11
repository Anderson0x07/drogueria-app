import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Venta } from 'src/app/models/venta.model';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule
  ],
  selector: 'app-ventas',
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit{
  constructor(
    private ventaService: VentaService
  ) {}

  ventas: Venta[] = [];
  filteredVentas: Venta[] = [];

  startDate: Date = new Date();
  endDate: Date = new Date();

  /**
   * Header de la tabla de ventas
   */
  titles: string[] = [
    'Medicamento',
    'Laboratorio',
    'Fecha Venta',
    'Cantidad',
    'Valor Unitario',
    'Valor Total'
  ];

  searchText: string = '';

  searchVenta() {

    this.filteredVentas = this.ventas.filter(
      venta =>
        
        new Date(venta.fecha_venta).setHours(0, 0, 0, 0) >= this.startDate.setHours(0, 0, 0, 0) &&
        new Date(venta.fecha_venta).setHours(0, 0, 0, 0) <= this.endDate.setHours(0, 0, 0, 0)
    );
  }
  


  ngOnInit(): void {
    this.ventaService.getAllSales().subscribe({
      next: (data) => {
        console.log(data)
        this.ventas = data;
        this.filteredVentas = data;
      },
      error: (err) => console.log(err),
    });
  }


  /**
   * Config de paginación
   */
  first = 0;
  rows = 10;

  next() {
    this.first = this.first + this.rows;
  }
  prev() {
    this.first = this.first - this.rows;
  }
  isLastPage(): boolean {
    return this.filteredVentas
      ? this.first === this.filteredVentas.length - this.rows
      : true;
  }
  isFirstPage(): boolean {
    return this.filteredVentas ? this.first === 0 : true;
  }

}
