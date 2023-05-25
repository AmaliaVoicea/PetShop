import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../services/user.service";

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  isConfirmed = false;

  constructor(private activeRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    const email = this.activeRoute.snapshot.queryParams['email'];
    const code = this.activeRoute.snapshot.queryParams['code'];

    if (email && code) {
      this.userService.confirm(email, code)
        .subscribe(() => this.isConfirmed = true);
    }
  }

}
