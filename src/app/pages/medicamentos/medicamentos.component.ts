import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Medicamento } from 'src/app/models/medicamento.model';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { VentaService } from 'src/app/services/venta.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrimengModule],
  selector: 'app-medicamento',
  templateUrl: './medicamentos.component.html',
})
export class MedicamentosComponent implements OnInit {
  constructor(
    private medicamentoService: MedicamentoService,
    private ventaService: VentaService,
    private _fb: FormBuilder
  ) {}

  visible = false;
  medicineId = '';
  header = '';
  venta = false;

  total_pagar = 0;

  valor_unitario = 0;

  stockDisponible = 0;

  cantidad = 0;

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

  isValidCantidad(field: string): boolean | null {
    return (
      this.saleForm.controls[field].errors &&
      this.saleForm.controls[field].touched
    );
  }

  registrar() {

    const fechaFab = new Date(this.medicineForm.controls['fecha_fabricacion'].value);
    const fechaVencimiento = new Date(this.medicineForm.controls['fecha_vencimiento'].value);

    if(fechaVencimiento < fechaFab){
      Swal.fire({
        title: 'Atención',
        text: 'Fecha de vencimiento debe ser mayor a la fecha de fabricación!!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'my-swal'
        }
      });
    } else {
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
          this.visible = false;
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

    
  }

  editar() {
    const id = this.medicineId;
    const medicineUpdated = {
      nombre: this.medicineForm.controls['nombre'].value,
      lab_fabrica: this.medicineForm.controls['lab_fabrica'].value,
      fecha_fabricacion: this.medicineForm.controls['fecha_fabricacion'].value,
      fecha_vencimiento: this.medicineForm.controls['fecha_vencimiento'].value,
      stock: this.medicineForm.controls['stock'].value,
      valor_unitario: this.medicineForm.controls['valor_unitario'].value,
    };

    console.log(medicineUpdated);

    this.medicamentoService.editMedicine(medicineUpdated, id).subscribe({
      next: (res: any) => {
        console.log('fetch');

        console.log(res);
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

  eliminarMedicamento(id: string) {
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

  delete(id: string) {



    Swal.fire({
      title: 'Atención',
      text: "¿Estás seguro que desea eliminar el medicamento?, se eliminaran las ventas realizadas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, bórralo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarMedicamento(id);
      }
    })

    
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

  saleForm: FormGroup = this._fb.group({
    cantidad: ['', [Validators.required]],
  });

  sell() {

    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    const ventaData = {
      cantidad: this.saleForm.controls['cantidad'].value,
      medicamento: this.medicineId,
    };

    console.log(ventaData);

    this.ventaService.createSale(ventaData).subscribe({
      next: (data: any) => {
        this.venta = false;
        console.log(data);
        this.listar();

        Swal.fire({
          title: 'Información',
          text: data.message,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (err) => {
        console.log(err);
        this.venta = false;
        Swal.fire({
          title: 'Atención',
          text: err.error.error,
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  verTotalPagar() {
    this.total_pagar = this.valor_unitario * this.cantidad;
  }

  abrirVentaModal(id: string) {
    this.medicineId = id;
    this.venta = true;
    this.saleForm.reset();

    this.medicamentoService.getMedicine(id).subscribe({
      next: (data) => {
        this.stockDisponible = data.stock;
        this.valor_unitario = data.valor_unitario;
      },
      error: (err) => console.log(err),
    });
  }

  enviarModal() {
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    if (this.medicineId === '') {
      this.registrar();
    } else {
      this.editar();
    }
  }

  /**
   * Header de la tabla de medicamentos
   */
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
    console.log(this.filteredMedicamentos);
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
      error: (err) => console.log(err),
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
