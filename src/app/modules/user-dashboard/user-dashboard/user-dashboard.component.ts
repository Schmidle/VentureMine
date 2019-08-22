import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  currentUser: User;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
      console.log("CURRENT USER: ", this.currentUser);
    }
  }

}
