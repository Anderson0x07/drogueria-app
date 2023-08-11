export interface Medicamento {
    id: string,
    nombre: string,
    lab_fabrica: string,
    fecha_fabricacion: Date,
    fecha_vencimiento: Date,
    stock: number,
    valor_unitario: number

}