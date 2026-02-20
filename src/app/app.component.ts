import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AuthService } from './Service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthUtils } from './Service/auth.utils';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  );

  private _mobileQueryListener: () => void;
sidebarOpen = false;
submenuOpen: {[key: string]: boolean} = {};

  constructor(
    public _userService: UserService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // console.log(_userService.user$);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}
toggleSubmenu(menu: string) {
  this.submenuOpen[menu] = !this.submenuOpen[menu];
}
  logout() {
    this.auth.signOut();
    this.snackBar.open('Se ha deslogueado correctamente', ':-)');
    // .subscribe(
    //   (dat) => {
    //     this.snackBar.open('Se ha deslogueado correctamente', ':-)', {
    //       duration: 3000,
    //     });
    //   },
    //   (error: HttpErrorResponse) => {}
    // );
  }
  ifgetuser() {
    return this.auth.user;
  }
  ifauthenticadoAuth(rol: any = []) {
    let authval = false;
    rol.forEach((element: string) => {
      if (AuthUtils.ifRolUser(element)) {
        authval = true;
      }
    });
    return authval;
  }
}
