import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';
import { IUser } from '../../models/iuser';
import { HttpContext } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
  isLogged:boolean=false;
  userName: string = '';
  userRole!:string|null
  constructor(private router:Router,private auth:Auth,
    private userService: UserService,private cdr: ChangeDetectorRef ){
 
  }

  ngOnInit(): void {
    this.refreshUserName();

    // Listen for router events to refresh username after login
    this.router.events.subscribe(() => {
      this.refreshUserName();
      //  console.log(this.auth.getheaders())
    });
  }

  refreshUserName() {

    this.updateLoginStatus();
    // console.log(this.userRole)
    if (this.isLogged) {
      this.userService.getCurrentUser().subscribe({
        next: (user: any) => {
          // console.log(user)
          this.userName = user.userName;
          this.userRole= localStorage.getItem('userRole');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err); 
          this.userName = ''; 
          this.userRole = '';
       
         }
      });
    } else {
      this.userName = '';
      this.userRole = '';
       this.cdr.detectChanges();
    }
  }

  updateLoginStatus(){
    this.isLogged=this.auth.isLoggedIn();
  }

  logout(){
    this.auth.logout();
    this.refreshUserName();
     this.cdr.detectChanges();
    this.router.navigate(['/home']);
       

    
  }

}
