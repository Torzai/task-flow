import { CanDeactivateFn } from '@angular/router';


export interface CanLeave {
  canLeave(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanLeave> = (component) => {
  if (component.canLeave()) {
    return true;
  }
  return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
};
