import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../environment/api.dev';
import { Medicamento } from '../models/medicamento.model';

@Injectable({
  providedIn: 'root',
})
export class MedicamentoService {
  constructor(private http: HttpClient) {}

  /**
   * Método para obtener el listado de los medicamentos
   * @returns una lista de los medicamentos guardados.
   */
  public getAllMedicines() {
    return this.http.get<Medicamento[]>(`${API_URL}medicamentos`);
  }

  /**
   * Método para obtener un medicamento por id
   * @param id Identificador del medicamento
   * @returns Medicamento
   */
  public getMedicine(id: string) {
    return this.http.get<Medicamento>(`${API_URL}medicamentos/${id}`);
  }

  /**
   * Método para crear un nuevo medicamento en el inventario
   * @param medicamento Medicamento con todos los campos requeridos
   * @returns msj y status de created
   */
  public createMedicine(medicamento: any) {
    return this.http.post(`${API_URL}medicamentos`, medicamento);
  }

  /**
   * Método para editar un medicamento existente
   * @param medicamento Medicamento con todos los campos requeridos
   * @param id Identificador del medicamento
   * @returns El nuevo medicamento actualizado
   */
  public editMedicine(medicamento: any, id: string) {
    return this.http.put<Medicamento>(`${API_URL}medicamentos/${id}`, medicamento);
  }

  /**
   * Método para eliminar un registro de medicamento
   * @param id Identificador del medicamento
   * @returns msj de eliminado
   */
  public delete(id: string) {
    return this.http.delete(`${API_URL}medicamentos/${id}`);
  }
}
