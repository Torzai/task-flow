import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startedAt = performance.now();
  console.debug(`[HTTP] -> ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap({
      finalize: () => {
        const ms = Math.round(performance.now() - startedAt);
        console.debug(`[HTTP] <- ${req.method} ${req.url} (${ms}ms)`);
      },
    }),
  );
};
