import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messageinfo } from '../models/messageInfoModel';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  constructor( private formBuilder: FormBuilder, private feedbackService : FeedbackService) { }
  contactForm: FormGroup;
  
  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  get f() { return this.contactForm.controls; }

  sendMessage(){
    var msg : Messageinfo ={
      name : this.f['name'].value,
      email : this.f['email'].value,
      message : this.f['message'].value
    }
    console.log(msg);
    this.feedbackService.SendEmail(msg).subscribe();
  }
}
