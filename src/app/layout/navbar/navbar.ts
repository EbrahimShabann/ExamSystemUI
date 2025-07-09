import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
  isLogged:boolean=false;
  constructor(private router:Router,private auth:Auth){}

  ngOnInit(): void {
    this.updateLoginStatus();
  }

  updateLoginStatus(){
    this.isLogged=this.auth.isLoggedIn();
  }

  logout(){
    this.auth.logout();
    this.updateLoginStatus();
    this.router.navigate(['/account/login']);
  }

}
