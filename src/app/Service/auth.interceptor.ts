import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';
import { ErrorComponent } from '../modal/error/error.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  /**
   * Constructor
   */
  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private _authService: AuthService
  ) {}

  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request object
    let newReq = req.clone();
    // console.log('interceptor');
    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (
      this._authService.accessToken &&
      !AuthUtils.isTokenExpired(this._authService.accessToken)
    ) {
      newReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + this._authService.accessToken
        ),
      });
    }

    // // Response
    // return next.handle(newReq).pipe(
    //   catchError((error) => {
    //     // console.log(error);
    //     let errorMessage = '';
    //     // Catch "401 Unauthorized" responses
    //     if (error instanceof HttpErrorResponse && error.status === 401) {
    //       // return this.handle401Error(newReq, next);
    //       // Sign out
    //       errorMessage = 'Verifique la disponibilidad del token de acceso';
    //       this._authService.signOut();
    //       // Reload the app
    //       // location.reload();
    //     }
    //     if (error.status === 422 || error.status === 400) {
    //       // if (error.error.message.length) {
    //       //   let mensaje = '';
    //       //   for (const errordata of error.error.message) {
    //       //     mensaje += errordata;
    //       //     mensaje += '\n';
    //       //   }
    //       //   errorMessage = mensaje;
    //       // }
    //       let mensaje = '';
    //       for (let errordata in error.error.errors) {
    //         let content = error.error.errors[errordata][0];
    //         for (let a in content) {
    //           mensaje += content[a][0];
    //         }
    //         mensaje += '\n';
    //         // return ToastService.error(response.data.errors[error][0]);
    //       }
    //       errorMessage = mensaje;
    //       // console.log(errorMessage);
    //     }
    //     if (error.status === 500 || error.status === 0) {
    //       errorMessage = error.statusText;
    //     }

    //     if (error.status === 403) {
    //       // logout
    //       if (error.error.message) {
    //         errorMessage = error.error.message;
    //       } else {
    //         errorMessage = 'No tienes permiso para acceder a este recurso';
    //       }
    //     }
    //     this.message(errorMessage);
    //     return throwError(() => new Error(errorMessage));
    //   })
    // );

    return next.handle(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
    
        // Catch "401 Unauthorized" responses
        if (error.status === 401) {
          errorMessage = 'Verifique la disponibilidad del token de acceso';
          this._authService.signOut();
        }
    
        // Handling validation errors (422 or 400)
        if (error.status === 422 || error.status === 400) {
          // Puedes ajustar este bloque para manejar errores específicos como el de la compra existente
          errorMessage = error.error?.error || 'Error de validación'; // Obtiene el mensaje de error específico
        }
    
        // Handling server errors (500)
        if (error.status === 500 || error.status === 0) {
          errorMessage = 'Error interno del servidor';
        }
    
        // Handling forbidden errors (403)
        if (error.status === 403) {
          errorMessage = error.error?.message || 'No tienes permiso para acceder a este recurso';
        }
    
        // Mostrar mensaje de error
        this.message(errorMessage);
        
        // Retornar el error
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this._authService.refreshTokenPos().pipe(
        switchMap((data: any) => {
          // console.log('data refresh token: ', data);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(data.accessToken);
          return next.handle(this.addTokenHeader(request, data.accessToken));
        }),
        catchError((err) => {
          // console.log('salir logout');
          this.isRefreshing = false;
          this._authService.signOut();
          // location.reload();
          // return throwError(err);
          return throwError(() => new Error(err));
        })
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token: string) => token !== null),
      take(1),
      switchMap((token: string) =>
        next.handle(this.addTokenHeader(request, token))
      )
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    /* for Node.js Express back-end */
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
  private message(m: string): void {
    this.snackbar.open(m, 'Cerrar', {
      duration: 4000,
    });
    const dialogRef = this.dialog.open(ErrorComponent, {
      width: '250px',
      data: {
        mensaje: m,
      },
    });
  }
}
