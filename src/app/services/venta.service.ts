import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../environment/api.dev';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  constructor(private http: HttpClient) {}

  /**
   * Método para crear una nueva venta
   * @param venta Venta con todos los campos requeridos
   * @returns msj y status de created
   */
  public createSale(venta: any) {
    return this.http.post(`${API_URL}ventas`, venta);
  }

  /**
   * Método para obtener el listado de las ventas
   * @returns una lista de las ventas realizadas.
   */
  public getAllSales() {
    return this.http.get<Venta[]>(`${API_URL}ventas`);
  }
}
