import {Component, OnInit, Inject} from "@angular/core"; 
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"; 
import {NgForm } from "@angular/forms"; 
import {map} from "rxjs/operators"; 
import { environment } from "../../environments/environment"; 
@Component({ 
  selector: 'app-loadimage', 
  templateUrl: './loadimage.component.html', 
}) 
 
export class LoadImage implements OnInit { 
  baseUrl = environment.URLBase;   
  fullimage:string; 
constructor(  
  @Inject(MAT_DIALOG_DATA) 
    public data   
   ,public dialogRef: MatDialogRef<LoadImage>) { }  

  
  ngOnInit() {  

    this.fullimage = this.data.image;
    console.log('image',this.fullimage);
  }
  


}
 //FIM - CONSTRUTOR
