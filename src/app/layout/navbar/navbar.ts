import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';
import { IUser } from '../../models/iuser';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
  isLogged:boolean=false;
  userName: string = '';
  userRole: string = '';
  constructor(private router:Router,private auth:Auth,private userService: UserService,private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.refreshUserName();
    // Listen for router events to refresh username after login
    this.router.events.subscribe(() => {
      this.refreshUserName();
    });
  }

  refreshUserName() {
    this.updateLoginStatus();
    if (this.isLogged) {
      this.userService.getCurrentUser().subscribe({
        next: (user: any) => {
          this.userName = user.userName;
          this.userRole = user.role || '';
          this.cdr.detectChanges();
        },
        error: () => { this.userName = ''; this.userRole = ''; }
      });
    } else {
      this.userName = '';
      this.userRole = '';
    }
  }

  updateLoginStatus(){
    this.isLogged=this.auth.isLoggedIn();
  }

  logout(){
    this.auth.logout();
    this.refreshUserName();
    this.router.navigate(['/account/login']);
    this.cdr.detectChanges();
  }

}
