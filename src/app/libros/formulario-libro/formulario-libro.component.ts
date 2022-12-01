import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Autor } from 'src/app/interfaces/autor.interface';
import { Libro } from 'src/app/interfaces/libro.interface';
import { AutoresService } from 'src/app/servicios/autores.service';
import { LibrosService } from 'src/app/servicios/libros.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-formulario-libro',
  templateUrl: './formulario-libro.component.html',
  styleUrls: ['./formulario-libro.component.scss'],
})
export class FormularioLibroComponent implements OnInit {

  @Output()
  recargar = new EventEmitter<boolean>();

  public modo: "Registrar" | "Editar" = "Registrar";
  

  public listaAutores: Autor[] = [];

  public form: FormGroup = new FormGroup({
    idCtrl: new FormControl<number>(null, Validators.required),
    tituloCtrl: new FormControl<string>(null, Validators.required),
    idautorCtrl: new FormControl<number>(null, Validators.required),
    paginasCtrl: new FormControl<number>(null, Validators.required)

  });

  constructor(
    private servicioAutores: AutoresService,
    private servicioToast: ToastController,
    private servicioLibros: LibrosService
  ) { }

  private cargarAutores(){
    this.servicioAutores.get().subscribe({
      next: (autores) => {
        this.listaAutores = autores;
      },
      error: (e) => {
        console.error('Error al cargar Autores', e);
        this.servicioToast.create({
          header: 'Error al cargar Autores',
          message: e.error,
          color: 'danger'
      })

      }
    });
  }
  ngOnInit() {
    this.cargarAutores();
  }

  guardar(){
    this.form.markAsTouched();
    if(this.form.valid){
      if(this.modo === 'Registrar'){
        this.registrar();
      }else{
        this.editar();
      }
  }
}
private registrar(){
  const libro: Libro = {
    id: this.form.controls.idCtrl.value,
    titulo: this.form.controls.tituloCtrl.value,
    idautor: this.form.controls.idautorCtrl.value,
    paginas: this.form.controls.paginasCtrl.value,
    autor: null
  }
  this.servicioLibros.put(libro).subscribe({
    next: () => {
      this.recargar.emit(true);
      this.servicioToast.create({
        header: 'Éxito',
        message: 'Se registro correctamente el libro',
        duration: 2000,
        color: 'success'
      }).then(t =>t.present());
    },
    error: (e) => {
      console.error('Error la registrar libro', e);
      this.servicioToast.create({
        header: 'Error al registrar',
        message: e.message,
        duration: 3500,
        color: 'danger'
      }).then(t => t.present());
    }
  });
}
private editar(){
  const libro: Libro = {
    id: this.form.controls.idCtrl.value,
    titulo: this.form.controls.tituloCtrl.value,
    idautor: this.form.controls.idautorCtrl.value,
    paginas: this.form.controls.paginasCtrl.value,
    autor: null
  }
  this.servicioLibros.post(libro).subscribe({
    next: () => {
      this.recargar.emit(true);
      this.servicioToast.create({
        header: 'Éxito',
        message: 'Se editó correctamente el libro',
        duration: 2000,
        color: 'success'
      }).then(t =>t.present());
    },

    error: (e) => {
      console.error('Error la editar libro', e);
      this.servicioToast.create({
        header: 'Error al editar',
        message: e.error,
        duration: 3500,
        color: 'danger'
      }).then(t => t.present());
    }
  });
}
}