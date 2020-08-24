import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent implements OnInit {
emailForm:FormGroup ;
submitted=false;
  constructor(private fb:FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
) { }

  ngOnInit(): void {
    this.emailForm= this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required, Validators.email]]
    })
  }
  get f() { return this.emailForm.controls; }
onSubmit(){
  this.submitted = true;

  // stop here if form is invalid
  if (this.emailForm.invalid) {
      return;
  }

 
  this.dialogRef.close(this.emailForm.value);
}
}
