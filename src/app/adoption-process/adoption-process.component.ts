import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { Observable, of } from 'rxjs';
import { Adoption } from '../models/adoption';
import { Animal } from '../models/animal';
import { AdoptionsService } from '../services/adoptions.service';
import { AnimalService } from '../services/animal.service';
import { OrgService } from '../services/org.service';
import { UploadFileService } from '../services/upload-file.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-adoption-process',
  templateUrl: './adoption-process.component.html',
  styleUrls: ['./adoption-process.component.css']
})
export class AdoptionProcessComponent implements OnInit {

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
 
  config: NgWizardConfig;

  statusMapping: Map<number, string> = 
    new Map([
      [0, "new"],
      [1, "in review"],
      [2, "awaiting physical meeting"],
      [3, "requirements met"],
      [4, "closed - accepted"],
      [5, "closed - rejected"]
  ]);

  adoptionId: string;
  currentAdoption: Adoption;
  currentAdoptionMultipleDetails: any;
  adoptionForm: FormGroup;
  requirementMet: boolean;
  requestResponse: boolean;
  meetingFinalised: boolean;
  currentState: Observable<any>;
  displayErrorAlert: boolean = false;
  displaySuccessAlert: boolean = false;
  errors = null;
  currentUserValue: any;
  currentOrgValue: any;
  contractPaths: string[] = [];
  currentAnimal: Animal;
  adoptionContractPath: string = "";
  adoptionSuccessfullyClosed : boolean = false;
  adoptionRejectedClosed: boolean = false;
 
  constructor(private uploadService: UploadFileService, private router: Router, private route: ActivatedRoute, private animalService: AnimalService, private ngWizardService: NgWizardService, private adoptionService: AdoptionsService, private fb : FormBuilder, private userService: UserService, private orgService: OrgService) {
  }
 
  ngOnInit() {
    this.adoptionId = this.route.snapshot.paramMap.get('id');
    this.currentUserValue = this.userService.currentUserValue;
    this.currentOrgValue = this.orgService.currentOrgValue;
    this.config = {
      selected: 2,
      theme: THEME.arrows,
      toolbarSettings: {
        showNextButton : this.currentUserValue ? false : true,
        showPreviousButton : this.currentUserValue ? false : true
      }
    };
    this.currentState = this.adoptionService.getStateOfAdoption();
    this.adoptionService.getAdoption(this.adoptionId).subscribe(res => {
      let temp: any;
      this.currentAdoption = res;
      console.log(res);
      temp = Object.assign({}, res);
      console.log(res.statusRequest);
      temp.statusOfRequest = 0;
      if(res.statusRequest == "closed - rejected" || res.statusRequest == "closed - accepted") {
        temp.statusOfRequest = 4;
      }
      else {
        for (let [key, value] of this.statusMapping.entries()) {
          if (value === res.statusRequest)
            temp.statusOfRequest = key
        }
      }
      console.log(temp.statusOfRequest);
      this.config.selected = temp.statusOfRequest;
      this.currentAdoptionMultipleDetails = temp;
      this.animalService.getAnimal(res.animalId).subscribe(res => {
        this.currentAnimal = res;
      })
    })
  }

  initializeForm() {
    this.adoptionForm = this.fb.group({
      status: [''],
      documentPath: ['']
    });
  }
 
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
    console.log('previous')
  }
 
  showNextStep(event?: Event) {
    this.ngWizardService.next();
    console.log('next')
  }
 
  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }
 
  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }
 
  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
    if (this.currentAdoptionMultipleDetails.statusOfRequest < args.step.index ) {
      if(args.step.index !=4){
      
      this.adoptionService.updateAdoptionRequest(<Adoption>{
        closedAt: null,
        documentPath: "",
        statusRequest: this.statusMapping.get(args.step.index),
        userId: this.currentAdoption.userId,
        animalId: this.currentAdoption.animalId,
        id: this.currentAdoption.id
      }).subscribe({ next: updated => {
        this.displaySuccessAlert = true;
        this.currentAdoption = updated;
      }, 
      error: error => {
        this.errors = error;
        this.displayErrorAlert = true;
        setTimeout(()=>{this.displayErrorAlert = false;}, 5000);
      }})
    }
    }
  }
 
  isValidTypeBoolean: boolean = true;
 
  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }
 
  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  requestRejected() {
    
    this.adoptionService.updateAdoptionRequest(<Adoption>{
      closedAt: new Date(),
      documentPath: "",
      statusRequest: this.statusMapping.get(5),
      userId: this.currentAdoption.userId,
      animalId: this.currentAdoption.animalId,
      id: this.currentAdoption.id
    }).subscribe({ next: updated => {
      this.requestResponse = false;
      this.currentAdoption = updated;
      setTimeout(()=>{this.requestResponse = null; this.router.navigateByUrl("/dashboard")}, 5000);
    }, 
    error: error => {
      this.errors = error;
      this.displayErrorAlert = true;
      setTimeout(()=>{this.displayErrorAlert = false;}, 5000);
    }})
  }

  requestAccepted() {
    
    this.adoptionService.createContract(this.currentAdoption.id).subscribe(created => {
      let contractCreated = created;
      this.uploadService.getFileNames().subscribe(res => {
        this.contractPaths = res;
        this.contractPaths.forEach((elem) => {
          if (elem.includes(this.adoptionId)) {
            this.adoptionContractPath = elem;
            this.adoptionService.updateAdoptionRequest(<Adoption>{
              closedAt: new Date(),
              documentPath: this.adoptionContractPath,
              statusRequest: this.statusMapping.get(4),
              userId: this.currentAdoption.userId,
              animalId: this.currentAdoption.animalId,
              id: this.currentAdoption.id
            }).subscribe({ next: updated => {
              this.adoptionSuccessfullyClosed = true;
              console.log(this.adoptionSuccessfullyClosed);
              this.currentAdoption = updated;
            }, 
            error: error => {
              this.errors = error;
              this.displayErrorAlert = true;
              setTimeout(()=>{this.displayErrorAlert = false;}, 5000);
            }})
          }
        });
      })
    });
   
  }
}