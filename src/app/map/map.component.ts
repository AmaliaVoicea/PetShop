import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { Observable, Observer } from 'rxjs';
import { Coordonate } from '../models/Coordonate.model';
import { Org } from '../models/org';
import { OrgService } from '../services/org.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map') mapElement: any;
  map: google.maps.Map;
  mapClick: EventEmitter<google.maps.MouseEvent | google.maps.IconMouseEvent>;
  mapDblClick: EventEmitter<google.maps.MouseEvent>;
  allOrgs: Org[]=[];
  coordinates: Coordonate[] = [];
  coordonataActuala : Coordonate;
  mapType = 'satellite';
  constructor(private httpClient: HttpClient, private orgService: OrgService) { }
  lat = 45.9311814003738;
  lng = 24.81480915769083;
  lat1 = 45.155674;
  lng1 = 26.822751;
  
  googleMapType = 'SATELLITE';
  ngOnInit(): void {
    this.orgService.getAllOrgs().subscribe(res => {
      this.allOrgs = res;
      var count = 0 
      this.allOrgs.forEach((elem) =>{
        this.coordonataActuala = new Coordonate( {
          lat :0,
          long: 0
        })
        this.locationToCoordonates(elem.address, count,this.coordonataActuala);
        console.log(this.coordonataActuala)
        var x = this.coordonataActuala;
        this.coordinates.push(x);
      })
    })

  }

  initMap(): void {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 8,
        center: { lat: 35.717, lng: 139.731 },
      }
    );
  }

  locationToCoordonates(loc : string, count: number, coor : Coordonate){
   
    var geo = new google.maps.Geocoder();
    geo.geocode({'address': loc}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        coor.lat = results[0].geometry.location.lat();
        coor.long = results[0].geometry.location.lng();
        }
      });
  }

  

}