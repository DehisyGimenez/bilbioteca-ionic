import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, ToastController } from '@ionic/angular';
import { Libro } from '../interfaces/libro.interface';
import { LibrosService } from '../servicios/libros.service';
import { FormularioLibroComponent } from './formulario-libro/formulario-libro.component';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.page.html',
  styleUrls: ['./libros.page.scss'],
})
export class LibrosPage implements OnInit {

  @ViewChild(FormularioLibroComponent) formularioLibro!: FormularioLibroComponent;

  public listaLibros: Libro[]= [];
  public cargandoLibros: boolean = false;
  public modalVisible: boolean = false;

  private libroSeleccionado: Libro | null = null;
  public modoFormulario: 'Registar' | 'Editar' = 'Registar';

  constructor(
    private servicioLibros: LibrosService,
    private servicioToast: ToastController
  ) { }

  ngOnInit() {
    this.cargarLibros();
  }

  public cargarLibros(){
    this.refresher?.complete()
    this.cargandoLibros = true;
    this.servicioLibros.get().subscribe({
      next: (libros) => {
        this.listaLibros = libros;
        this.cargandoLibros = false;
      },
      error: (e) => {
        console.error("Error al consultar libros", e);
        this.cargandoLibros = false; 
        this.servicioToast.create({
          header:"Error al cargar libros",
          message: e.message,
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        }).then(toast => toast.present());
      }
    });
  }

  public nuevo(){
    this.modoFormulario = "Registar";
    this.libroSeleccionado = null;
    this.modalVisible = true;
  }

  public editar(libro: Libro){
    this.libroSeleccionado = libro;
    this.formularioLibro.modo = 'Editar';
    this.modalVisible = true;
  }

  public cargarDatosEditar(){
    if(this.modoFormulario === 'Editar'){
      this.formularioLibro.modo = this.modoFormulario;
    this.formularioLibro.form.controls.idCtrl.setValue(this.libroSeleccionado.id);
    this.formularioLibro.form.controls.tituloCtrl.setValue(this.libroSeleccionado.titulo);
    this.formularioLibro.form.controls.idautorCtrl.setValue(this.libroSeleccionado.idautor);
    this.formularioLibro.form.controls.paginasCtrl.setValue(this.libroSeleccionado.paginas);
    }
  }
   
}
