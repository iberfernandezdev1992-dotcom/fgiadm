import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: ReplaySubject<any> = new ReplaySubject<any>(1);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: any) {
    // Store the value
    this._user.next(value);
  }

  get user$(): Observable<any> {
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the current logged in user data
   */
  // get(): Observable<any> {
  //   return this._httpClient.get<any>('api/common/user').pipe(
  //     tap((user) => {
  //       this._user.next(user);
  //     })
  //   );
  // }

  /**
   * Update the user
   *
   * @param user
   */
  // update(user: any): Observable<any> {
  //   return this._httpClient.patch<any>('api/common/user', { user }).pipe(
  //     map((response) => {
  //       this._user.next(response);
  //     })
  //   );
  // }
}
