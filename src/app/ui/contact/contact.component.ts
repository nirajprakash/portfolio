import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MdlDialogService, MdlSnackbarService } from '@angular-mdl/core';
import { MdlDatePickerService } from '@angular-mdl/datepicker/datepicker.service';
import * as moment from 'moment';
import { ServiceWindow, ServicePortfolioApi, ModelRequestProject } from './../../services';

import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

const emailValidator = Validators.pattern('^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$');
@Component({
  selector: 'contact-view',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @ViewChild('contactContainer')
  public contactContainer: ElementRef;

  _mRequestProject: ModelRequestProject;
  public _mMapOptions = {
    draggable: true,
    gestureHandling: false,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    styles: [
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e9e9e9"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dedede"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": 36
          },
          {
            "color": "#333333"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f2f2f2"
          },
          {
            "lightness": 19
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#fefefe"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#fefefe"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      }
    ]
    /* styles: [{
       "featureType": "all",
       "elementType": "all",
       "stylers": [
         { "hue": "#22e2e2" },
         { "visibility": "simplified" },
         { "lightness": "16" }
       ]
     }]*/
  };


  public number1: number = null;
  public text4: number = null;

  idBtnGPS: number = 101;
  idBtnMobile: number = 102;
  idBtnEmail: number = 103;


  public _mContactMobile: string = "+918348522963";
  public _mContactEmail: string = "nirajprakash13@gmail.com";
  public _mCopyToClipboard: string = "copy to clipboard";
  public _mLocateOnMap: string = "locate on map";

  projectTypes: string[] = ['wireframe', 'design', 'development'];
  projectBudgets: string[] = ['below 1000', '1000- 2000', '2000-5000', 'above 5000'];





  returnUrl: string;

  nativeWindow: any;


  public _mFormGroup: FormGroup;

  public name = new FormControl('', Validators.required);
  public email = new FormControl('', [Validators.required, emailValidator]);

  public message = new FormControl('', Validators.required);


  constructor(
    private dialogService: MdlDialogService,
    private datePicker: MdlDatePickerService,
    private pageScrollService: PageScrollService,
    private mdlSnackbarService: MdlSnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private serviceWindow: ServiceWindow,
    @Inject(DOCUMENT) private document: any) {
    //this._mMapOptions.styles = this._mMapStyle;
    this.nativeWindow = this.serviceWindow.getNativeWindow();
  }









  ngOnInit() {

    //super.ngOnInit();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this._mFormGroup = this.fb.group({
      'name': this.name,
      'email': this.email,
      'message': this.message,
    });

    //console.log(this.email.value);

    this._mFormGroup.valueChanges
      .map((formValues) => {
        console.log(formValues);
        if (formValues.name != null) {
          formValues.name = formValues.name.toUpperCase();
        }
        return formValues;
      })
      // .filter((formValues) => this.form.valid)
      .subscribe((formValues) => {
        console.log(`Model Driven Form valid: ${this._mFormGroup.valid} value:`, JSON.stringify(formValues));
      });

  }

  public onSubmit() {
    let body: string = "";
    body = "name: " + this._mFormGroup.get('name').value;
    body += + " | " + "email: " + this._mFormGroup.get('email').value;

    body += + " | " + "message: " + this._mFormGroup.get('message').value;
    console.log(body);
  }

  onClickBtn(id: number) {
    console.log("clickBtn: ", id);
    if (Number(id)) {
      switch (id) {
        case this.idBtnGPS:
          // code...
          console.log("click locateGPS", this.document);
          let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#map-section');
          this.pageScrollService.start(pageScrollInstance);
          break;

        default:
          // code...
          break;
      }
    }
  }

  onCopied(value: string) {
    this.mdlSnackbarService.showToast(value + "   copied", 4000);
  }


}
