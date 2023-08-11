export interface Venta {
    id: string,
    fecha_venta: string,
    medicamento: string,
    cantidad: number,
    valor_unitario: number,
    valor_total: number,
    medicamentoDto: object
}