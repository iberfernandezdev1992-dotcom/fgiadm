import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
// import { Restangular } from "ngx-restangular";
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/Service/auth.service';
import { routerTransition } from 'src/app/router.animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  // private spinner: NgxSpinnerService;
  // private auth: AuthService;
  // public snackBar: MatSnackBar;
  // public restangular: Restangular;
  loginForm: FormGroup | any;
  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      // username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    // this.loginForm = this._formBuilder.group({
    //     email: ['', Validators.compose([Validators.required])],
    //     password: ['', Validators.compose([Validators.required])]
    // });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    const data = this.loginForm.value;
    // console.log(data);

    // this.user.password = data.password;
    this.spinner.show();
    this.auth.login(data).subscribe({
      next: (position) => {
        this.spinner.hide();
        // console.log(position);
        if (position.mensaje) {
          this.snackBar.open(position.mensaje, ':-(', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Se ha conectado exitosamente', ':-)', {
            duration: 3000,
          });
          this.router.navigate(['/inicio']);
        }
      },
      error: (msg) => {
        this.spinner.hide();
        this.snackBar.open('credenciales no válidas', ':-(', {
          duration: 3000,
        });
      },
      complete: () => {
        this.spinner.hide();
      },
    });
    // () => {
    //   // this.countnot();
    //   this.spinner.hide();
    //   this.snackBar.open('Se ha conectado exitosamente', ':-)', {
    //     duration: 3000,
    //   });
    // },
    // (error: HttpErrorResponse) => {
    //   this.spinner.hide();
    //   this.snackBar.open('credenciales no válidas', ':-(', {
    //     duration: 3000,
    //   });
    // },
    // () => {
    //   this.spinner.hide();
    // }
    // );
  }

  countnot() {
    // return new Promise(resolve => {
    //   this.restangular.one('countnot').get('').subscribe(
    //   (data) => {
    //     // this.cancelar();
    //     console.log(data);
    //     localStorage.setItem('notificacions',JSON.stringify(data.data))
    //     resolve(true);
    //   },
    //   ()=>{
    //     resolve(true);
    //     console.log("error");
    //   });
    // });
  }
}
