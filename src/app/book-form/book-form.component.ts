import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookService } from '../services/book.service';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent } from 'primeng/fileupload';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    RouterModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    ButtonModule,
    FileUploadModule  
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  formBody!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  SelectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formBody = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      author: ['', Validators.required],
      pages: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getBookById(+id!);
    }
  }

  onFileSelected(event: FileSelectEvent) {
    this.SelectedFile = event.files[0];
  }

  getBookById(id: number) {
    this.bookService.getBookById(id).subscribe({
      next: (foundBook) => {
        this.formBody.patchValue(foundBook);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No encontrado',
        });
        this.router.navigateByUrl('/');
      },
    });
  }

  createBook() {
    if (this.formBody.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    if (!this.SelectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione una imagen e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.bookService
      .createBook(this.formBody.value, this.SelectedFile)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Libro guardado correctamente',
          });
          this.isSaveInProgress = false;
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.isSaveInProgress = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Revise los campos e intente nuevamente',
          });
        },
      });
  }

  changeImage(event: FileSelectEvent) {
    this.SelectedFile = event.files[0];
    if (!this.SelectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione una imagen e intente nuevamente',
      });
      return;
    }
    this.bookService.updateBookImage(this.formBody.value.id, this.SelectedFile).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro guardado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise el archivo seleccionado',
        });
      },
    });
  }

  //UPDATE
  updateBook() {
    if (this.formBody.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.bookService.updateBook(this.formBody.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro actualizado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      },
    });
  }
}
