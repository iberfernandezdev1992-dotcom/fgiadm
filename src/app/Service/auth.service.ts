import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthService {
  // private _api = 'http://127.0.0.1:8000/api/';
  // private _api = 'https://api-fgi.namnamapp.com/api/';
  private _api = 'https://administrador.fitnessgroupinternational.com/api/';

  // private _api: string = '/api/';
  private _authenticated: boolean = false;
  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _httpBackend: HttpBackend,
    private _userService: UserService,
    private _router: Router
  ) {
    this._httpClient = new HttpClient(this._httpBackend);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  set refreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  get refreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  set user(userval: any) {
    localStorage.setItem('user', JSON.stringify(userval));
  }

  get user(): any {
    let user = localStorage.getItem('user') ?? '';
    return user ? JSON.parse(user) : '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    // Lanza error, si el usuario ya ha iniciado sesión
    if (this._authenticated) {
      return throwError(() => 'El usuario ya ha iniciado sesión.');
    }

    return this._httpClient.post(this._api + 'auth/login', credentials).pipe(
      switchMap((response: any) => {
        // console.log(response);
        if (response.access_token) {
          // Almacene el token de acceso en el almacenamiento local
          this.accessToken = response.access_token;
          // this.refreshToken = response.refreshToken;

          // Establecer el indicador autenticado en verdadero
          this._authenticated = true;

          // Almacenar a la usuario en el servicio de usuario.
          this._userService.user = response.user;
          this.user = response.user;
          // Devolver un nuevo observable con la respuesta.
        }

        return of(response);
      })
    );
  }

  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Iniciar sesión usando el token
    return this._httpClient
      .post('api/auth/sign-in-with-token', {
        accessToken: this.accessToken,
      })
      .pipe(
        catchError(() =>
          // Return false
          of(false)
        ),
        switchMap((response: any) => {
          // Replace the access token with the new one if it's available on
          // the response object.
          //
          // This is an added optional step for better security. Once you sign
          // in using the token, you should generate a new one on the server
          // side and attach it to the response object. Then the following
          // piece of code can replace the token with the refreshed one.
          if (response.accessToken) {
            this.accessToken = response.accessToken;
          }

          // Set the authenticated flag to true
          this._authenticated = true;

          // Store the user on the user service
          this._userService.user = response;

          // Return true
          return of(true);
        })
      );
  }
  /**
   * Sign in using the refresh token
   */
  refreshTokenPos(): Observable<any> {
    // return this.httpClient.post(
    //     this.REST_API + 'refresh',
    //     {
    //         refresh_token: refreshtoken,
    //     },
    //     httpOptions
    // );
    const httpOptionsRefresh = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.refreshToken,
      }),
    };
    return (
      this._httpClient
        .get(this._api + 'public/refresh', httpOptionsRefresh)
        // .post(this._api + '/public/refresh', {
        //     refresh_token: this.refreshToken,
        // })
        .pipe(
          catchError(() =>
            // Return false
            of(false)
          ),
          switchMap((response: any) => {
            // console.log(response);

            this.accessToken = response.accessToken;
            this.refreshToken = response.refreshToken;

            // Set the authenticated flag to true
            this._authenticated = true;

            // Return response
            return of(response);
          })
        )
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Set the authenticated flag to false
    this._authenticated = false;
    this._router.navigate(['/']);
    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: {
    name: string;
    email: string;
    password: string;
    company: string;
  }): Observable<any> {
    return this._httpClient.post('api/auth/sign-up', user);
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Compruebe si el usuario ha iniciado sesión
    if (this._authenticated) {
      console.log('Compruebe si el usuario ha iniciado sesión');
      return of(true);
    }

    // Verifique la disponibilidad del token de acceso
    if (!this.accessToken) {
      console.log('Verifique la disponibilidad del token de acceso');
      return of(false);
    }

    // Verifique la fecha de caducidad del token de acceso
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      console.log('Verifique la fecha de caducidad del token de acceso');
      return of(false);
    }
    return of(true);
    // Si el token de acceso existe y no expiró, inicie sesión en usarlo
    // return this.signOut();
    // return this.signInUsingToken();
  }
}
