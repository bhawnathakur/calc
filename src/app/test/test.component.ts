import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  category_array1=['Toronto (numerical grades)','Western','Queen’s (numerical grades)',
  'Guelph','Dalhousie (numerical grades)','OCAD','Windsor (numerical grades)','Waterloo (numerical grades)',
  'Victoria (numerical grades)','Trent','St. Francis Xavier','Saskatchewan','Regina','Prince Edward Island',
  'Nipissing','Lakehead','Cape Breton','Brock',
  'Bishop\'s','Algoma','New Brunswick','Ontario Tech','Acadia','Alberta','Athabasca',
  'Brandon','University of Calgary','Carleton','Concordia','Dalhousie (letter grades)','Laurentian',
  'Laval','Lethbridge','Quebec','Sherbrooke','Simon Fraser','Memorial','Quest', 'McGill','York', 'Manitoba'];
  
  univ_array:any[]=[];
  mainForm:FormGroup ;
  constructor(private fb:FormBuilder){

  }
 
  ngOnInit(): void {
    this.univ_array=this.category_array1 ;
  this.mainForm = this.fb.group({
    years: this.fb.array([
      this.initYears()
    ])
  }) 
  
  }
  initYears(){
    return this.fb.group({
      courses:this.fb.array([
        this.initCourses()
      ])
    })
  }
  initCourses(){
    return this.fb.group({
      courseName: ['',Validators.required],
      courseWeight: ['',Validators.required],
      grade:[''],
      semesterToken: [''],
    })
  }
  addYears(){
    const control = <FormArray>this.mainForm.controls['years'];
    control.push(this.initYears());
  }
  addCourses(ix) {
    const control = (<FormArray>this.mainForm.controls['years']).at(ix).get('courses') as FormArray;
    control.push(this.initCourses());
  }



}