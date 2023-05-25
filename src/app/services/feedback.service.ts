import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedback } from '../models/feedback';
import { Messageinfo } from '../models/messageInfoModel';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  privateHeader ={
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
  };

  constructor(private http: HttpClient) { }

  public updateFeedback(id: string, feedbackData: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(environment.apiEndpoint + "feedbacks/change/" + id, feedbackData).pipe(map(feedback =>{
      return feedback;
    }))
  }

  public addNewFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(environment.apiEndpoint + "feedbacks/create/feedback", feedback, {headers: this.privateHeader.headers}).pipe(map(feedback => {
      return feedback;
    }))
  }

  public getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(environment.apiEndpoint + "feedbacks").pipe(map(feedbacks => {
      return feedbacks;
    }));
  }

  public getFeedback(feedbackId: string): Observable<Feedback> {
    return this.http.get<Feedback>(environment.apiEndpoint + "feedbacks/" + feedbackId).pipe(map(f => {
      return f;
    }));
  }

  public getAllFeedbacksFromOrg(orgId: string): Observable<Feedback[]> {
    console.log();
    return this.http.get<Feedback[]>(environment.apiEndpoint + "feedbacks/all/org/" + orgId).pipe(map( feedbacks => {
      return feedbacks;
    }));
  }

  public getAllFeedbacksForOrgByUser(orgId: string): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(environment.apiEndpoint + "feedbacks/all/user/org/" + orgId).pipe(map( feedbacks => {
      return feedbacks;
    }));
  }

  public SendEmail(message : Messageinfo){
    return this.http.post(environment.apiEndpoint + "feedbacks/sendContactEmail",message);
  }


}
