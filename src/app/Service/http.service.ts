import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpBackend,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // private api = 'http://127.0.0.1:8000/api/';
   private api = 'https://administrador.fitnessgroupinternational.com/api/';


  // private api: string = '/api/';
  private httpWithoutInterceptor: HttpClient;
  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend); //ignore interceptor
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${this.api + path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body = {}, options = {}): Observable<any> {
    return this.http
      .put(`${this.api + path}`, body, options)
      .pipe(catchError(this.formatErrors));
  }
  patch(path: string, body = {}): Observable<any> {
    return this.http
      .patch(`${this.api + path}`, body)
      .pipe(catchError(this.formatErrors));
  }
  post(path: string, body = {}, options = {}): Observable<any> {
    return this.http
      .post(`${this.api + path}`, body, options)
      .pipe(catchError(this.formatErrors));
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(`${this.api + path}`)
      .pipe(catchError(this.formatErrors));
  }

  _get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpWithoutInterceptor
      .get(`${this.api + path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  _put(path: string, body = {}): Observable<any> {
    return this.httpWithoutInterceptor
      .put(`${this.api + path}`, body)
      .pipe(catchError(this.formatErrors));
  }

  _post(path: string, body = {}, options = {}): Observable<any> {
    return this.httpWithoutInterceptor
      .post(`${this.api + path}`, body, options)
      .pipe(catchError(this.formatErrors));
  }

  _delete(path: string): Observable<any> {
    return this.httpWithoutInterceptor
      .delete(`${this.api + path}`)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any): Observable<any> {
    return throwError(() => error);
  }
  // private errorHandl(error: any): Observable<any> {
  //   console.log(error);
  //   let errorMessage = '';
  //   if (error.status === 422) {
  //     let mensaje = '';
  //     for (let errordata in error.error.errors) {
  //       let content = error.error.errors[errordata][0];
  //       for (let a in content) {
  //         mensaje += content[a][0];
  //       }
  //       mensaje += '\n';
  //       // return ToastService.error(response.data.errors[error][0]);
  //     }
  //     errorMessage = mensaje;
  //   }
  //   if (error.status === 500 || error.status === 0) {
  //     errorMessage = error.statusText;
  //   }
  //   if (error.status === 403 || error.status === 401) {
  //     errorMessage = 'No tienes permiso para acceder a este recurso';
  //   }

  //   if (error.error.error === 'invalid_grant') {
  //     errorMessage = 'Las credenciales de usuario eran incorrectas.';
  //   }
  //   console.log(errorMessage);
  //   return throwError(() => errorMessage);
  // }
}
