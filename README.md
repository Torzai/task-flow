# TaskFlow

Gestor de tareas construido con **Angular 22**.

---

## Como arrancar

```bash
npm install
npm start          # equivale a: ng serve  -> http://localhost:4200
```

> **Requisito del CLI:** Angular 22 pide **Node >= 22.22.3** (o 24.15+). Si `ng`
> se queja de la version de Node, actualiza Node (con nvm: `nvm install 22 && nvm use 22`).
> El codigo compila perfectamente; es solo el binario del CLI el que exige ese minimo.

Otros comandos:

```bash
npm run build      # build de produccion
npx ng generate component features/tasks/algo   # andamiaje de nuevos componentes
```

Los datos se guardan en `localStorage` (clave `taskflow.tasks.v1`), asi que no
hace falta backend para probar la app.

---

## Arquitectura

Estructura **por features**, separando lo transversal (`core`) de cada dominio
funcional (`features`):

```
src/app/
|- app.ts / app.html / app.scss     # shell: barra superior + <router-outlet>
|- app.config.ts                    # providers (router, http, interceptor)
|- app.routes.ts                    # rutas lazy (loadComponent)
|
|- core/                            # singletons y cosas transversales
|  |- models/task.ts                # tipos del dominio (interfaces puras)
|  |- services/task-store.ts        # estado global con signals + persistencia
|  |- interceptors/                 # interceptor HTTP funcional
|  |- guards/                       # guard funcional (cambios sin guardar)
|
|- features/
   |- tasks/                        # la "vertical slice" de referencia
      |- task-list/                 # CONTENEDOR: orquesta store + filtros
      |- task-card/                 # PRESENTACIONAL: recibe input, emite eventos
      |- task-form/                 # FORMULARIO con Signal Forms (crear/editar)
```

### Contenedor vs presentacional

Es la separacion mas importante del proyecto:

- **Presentacional** (`task-card`): no conoce el store ni el router. Recibe
  datos por `input()` y comunica intenciones por `output()`. Trivial de testear
  y reutilizar.
- **Contenedor** (`task-list`): inyecta el store, mantiene el estado de la UI
  (filtros) y traduce los eventos de las tarjetas en llamadas al store.
  

*Generado como base de mentoria. Verificado con el compilador AOT de Angular
22.0.2 (ngc, sin errores de tipos ni de plantillas).*
