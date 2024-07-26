import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Ability } from '@casl/ability';

@Injectable({
    providedIn: 'root',
})
export class ManagerGuard implements CanActivate {
    constructor(private ability: Ability, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const manage = next.data['manage'] as string;
        const userCanManage = this.ability.can('manage', manage);

        if (!userCanManage) {
            // Si el usuario no tiene permisos para gestionar el recurso, redirige a una página de error o inicio
            this.router.navigate(['/accessdenied']); // Asegúrate de tener una ruta para manejar accesos no autorizados
            return false;
        }

        return true; // El usuario tiene permisos, permite el acceso
    }
}