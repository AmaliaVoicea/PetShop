import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileItem } from 'ng2-file-upload';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  privateHeader ={
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };
  constructor(private http: HttpClient) { }

  public uploadFiles(files: File[], idAnimal: string): Observable<boolean> {
    console.log(files)
    let form = new FormData();
    files.forEach(p => form.append('files', p));
    return this.http.post<boolean>(environment.apiEndpoint + "file/upload/" + idAnimal, form).pipe(map(result => {
      return result;
    }))
  }

  public getImageNames(animalId: string): Observable<string[]> {
    return this.http.get<string[]>(environment.apiEndpoint + "file/get/images/" + animalId).pipe(map(result => {
      return result;
    }))
  }

  public getFileNames(): Observable<string[]> {
    return this.http.get<string[]>(environment.apiEndpoint + "file/get/files").pipe(map(result => {
      return result;
    }))
  }
}
