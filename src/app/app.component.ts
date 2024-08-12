import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Toast, ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend-crud';
}
