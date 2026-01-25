import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Perfil } from '../../service/perfil';
import { signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Alert } from '../../service/alert';

@Component({
    selector: 'app-show-user',
    imports: [
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        CurrencyPipe,
        DatePipe
    ],
    templateUrl: './show-user.html',
    styleUrl: './show-user.scss'
})
export class ShowUser {
    private perfilService = inject(Perfil);
    private alertService = inject(Alert);

    @Input() perfilId!: number | null;
    @Output() close = new EventEmitter<void>();

    perfil: any;
    loading = true;

    ngOnInit() {
        console.log('ShowUser ngOnInit - perfilId recibido:', this.perfilId);
        console.log('Tipo de perfilId:', typeof this.perfilId);
        
        // Permitir cualquier número (incluyendo 0), solo bloquear null/undefined
        if (typeof this.perfilId === 'number') {
            console.log('ID numérico válido, cargando usuario...');
            this.perfilService.ListUserId(this.perfilId).subscribe({
                next: (res) => {
                    console.log('Respuesta del servicio:', res);
                    this.perfil = res;
                    this.loading = false;
                },
                error: (err) => {
                    console.log('Error al cargar usuario:', err);
                    this.alertService.loadingError();
                    this.loading = false;
                    console.error(err);
                }
            });
        } else {
            console.log('ID no es un número válido:', this.perfilId);
            this.loading = false;
        }
    }

    onClose() {
        this.close.emit();
    }
}
