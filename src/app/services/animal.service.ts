import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Animal } from '../models/animal';
import { Product } from '../models/product';

@Injectable()
export class AnimalService {

  currentAnimalSubject: BehaviorSubject<Animal>;
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

  public updateAnimalInfo(animalData: Animal): Observable<Animal> {
    return this.http.put<Animal>(environment.apiEndpoint + "animals/change/" + animalData.id, animalData, {
      headers: this.privateHeader.headers }).pipe(map( animal => {
        //this.currentAnimalSubject.next(animal);
        return animal;
      }))
  }

  public addNewAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(environment.apiEndpoint + "animals/create/animal", animal, {headers: this.privateHeader.headers}).pipe(map( animal => {
      return animal;
    }));
  }

  public getAllAnimalsFromOrg(id:string): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiEndpoint + "animals/org/all/"+id, {headers: this.privateHeader.headers}).pipe(map( animals => {
      console.log(animals)
      return animals;
    }));
  }

  public getLatestAnimalsForOrg(): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiEndpoint + "animals/org/all/latest", {headers: this.privateHeader.headers}).pipe(map( animals => {
      console.log(animals);
      return animals;
    }));
  }

  public getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.apiEndpoint + "latestProducts").pipe(map( products => {
      console.log(products);
      return products;
    }));
  }

  public getTopRatedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.apiEndpoint + "topRatedProducts").pipe(map( products => {
      console.log(products);
      return products;
    }));
  }

  public getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(environment.apiEndpoint + "animals").pipe(map( animals => {
      return animals;
    }));
  }

  public getAnimal(animalId: string): Observable<Animal> {
    return this.http.get<Animal>(environment.apiEndpoint + "animals/" + animalId).pipe(map( an => {
      return an;
    }));
  }

  public deleteAnimal(animalId: string): Observable<Animal> {
    return this.http.delete<Animal>(environment.apiEndpoint + "animals/" + animalId, {headers: this.privateHeader.headers})
  }
}
