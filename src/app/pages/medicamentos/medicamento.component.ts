import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medicamento } from 'src/app/models/medicamento.model';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
})
export class MedicamentoComponent implements OnInit {
  constructor(
    private medicamentoService: MedicamentoService,
    private _fb: FormBuilder
  ) {}

  visible = false;
  medicineId = '';
  header = '';
  venta = false;

  title = 'Drogueria Konex';

  medicamentos: Medicamento[] = [];
  filteredMedicamentos: Medicamento[] = [];

  medicineForm: FormGroup = this._fb.group({
    nombre: ['', [Validators.required]],
    lab_fabrica: ['', [Validators.required]],
    fecha_fabricacion: ['', [Validators.required]],
    fecha_vencimiento: ['', [Validators.required]],
    stock: ['', [Validators.required]],
    valor_unitario: ['', [Validators.required]],
  });

  isValidField(field: string): boolean | null {
    return (
      this.medicineForm.controls[field].errors &&
      this.medicineForm.controls[field].touched
    );
  }

  onSave(): void {
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }
  }

  registrar() {
    const medicineData = {
      nombre: this.medicineForm.controls['nombre'].value,
      lab_fabrica: this.medicineForm.controls['lab_fabrica'].value,
      fecha_fabricacion: this.medicineForm.controls['fecha_fabricacion'].value,
      fecha_vencimiento: this.medicineForm.controls['fecha_vencimiento'].value,
      stock: parseInt(this.medicineForm.controls['stock'].value),
      valor_unitario: parseFloat(
        this.medicineForm.controls['valor_unitario'].value
      ),
    };

    console.log(medicineData);

    this.medicamentoService.createMedicine(medicineData).subscribe({
      next: (res: any) => {
        this.visible = false;
        this.listar();
        Swal.fire({
          title: `${res.message}`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (err) => {
        Swal.fire({
          title: `${err}`,
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  editar() {
    const id = this.medicineId;
    const medicineUpdated = {
      nombre: this.medicineForm.controls['nombre'].value,
      lab_fabrica: this.medicineForm.controls['lab_fabrica'].value,
      fecha_fabricacion: this.medicineForm.controls['fecha_fabricacion'].value,
      fecha_vencimiento: this.medicineForm.controls['fecha_vencimiento'].value,
      stock: parseInt(this.medicineForm.controls['stock'].value),
      valor_unitario: parseFloat(
        this.medicineForm.controls['valor_unitario'].value
      ),
    };

    this.medicamentoService.editMedicine(medicineUpdated, id).subscribe({
      next: (res: any) => {
        this.visible = false;
        this.listar();
        Swal.fire({
          title: 'Información',
          text: 'Medicamento actualizado exitosamente',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  delete(id: string) {
    this.medicamentoService.delete(id).subscribe({
      next: (res: any) => {
        this.visible = false;
        Swal.fire({
          title: 'Información',
          text: res.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
        this.listar();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  abrirModal(id: string) {
    this.medicineId = id;
    this.visible = true;
    if (id === '') {
      this.medicineForm.reset();
      this.header = 'Añadir nuevo medicamento';
    } else {
      this.medicamentoService.getMedicine(this.medicineId).subscribe({
        next: (data) => {
          console.log('MEDICINA UNO');

          console.log(data);

          if (data != null) {
            this.medicineForm.get('nombre')?.setValue(data?.nombre);
            this.medicineForm.get('lab_fabrica')?.setValue(data?.lab_fabrica);
            this.medicineForm
              .get('fecha_fabricacion')
              ?.setValue(data?.fecha_fabricacion);
            this.medicineForm
              .get('fecha_vencimiento')
              ?.setValue(data?.fecha_vencimiento);
            this.medicineForm.get('stock')?.setValue(data?.stock);
            this.medicineForm
              .get('valor_unitario')
              ?.setValue(data?.valor_unitario);
          }
        },
        error: (err) => console.log(err),
      });
      this.header = 'Editar medicamento';
    }
  }

  listar() {
    this.medicamentoService.getAllMedicines().subscribe({
      next: (data) => {
        console.log(data);
        this.medicamentos = data;
        this.filteredMedicamentos = data;
      },
      error: (err) => console.log(err),
    });
  }

  sell(id: string) {
    this.venta = true;

    const ventaData = {
      cantidad: parseInt(this.medicineForm.controls['cantidad'].value),
      medicamento: id,
    }

    this.medicamentoService.getAllMedicines().subscribe({
      next: (data) => {
        console.log(data);
        this.medicamentos = data;
        this.filteredMedicamentos = data;
      },
      error: (err) => console.log(err)
    });
  }

  enviarModal() {
    this.visible = true;
    if (this.medicineId === '') {
      this.registrar();
    } else {
      this.editar();
    }
  }

  titles: string[] = [
    'Nombre',
    'Lab. Fabrica',
    'Fecha Fabricación',
    'Fecha Vencimiento',
    'Stock',
    'Valor Unitario',
  ];

  searchText: string = '';

  searchMedicamento() {
    this.filteredMedicamentos = this.medicamentos.filter(
      (medicamento) =>
        medicamento.nombre
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        medicamento.lab_fabrica
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.medicamentoService.getAllMedicines().subscribe({
      next: (data) => {
        console.log(data);
        this.medicamentos = data;
        this.filteredMedicamentos = data;
      },
      error: (err) => console.log(err)
    });
  }

  first = 0;
  rows = 10;

  next() {
    this.first = this.first + this.rows;
  }
  prev() {
    this.first = this.first - this.rows;
  }
  isLastPage(): boolean {
    return this.filteredMedicamentos
      ? this.first === this.filteredMedicamentos.length - this.rows
      : true;
  }
  isFirstPage(): boolean {
    return this.filteredMedicamentos ? this.first === 0 : true;
  }
}