import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';
import { EmailService } from '../email.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  mainForm:FormGroup ;
  wt_array:any []=[];
  submitted=false;
  chosen_grade:any[]=[];
  gpa_array:any []=[];
  gpa_calculated: any []=[];
  gpa_array_summer_cumulative:any []=[];
  gpa_array_withoutsummer_cumulative:any []=[];
  totgpa_with_summer=0;
  totgpa_without_summer=0;
  final_grade_array:any[]=[];
  without_summer_num=0;
  with_summer_num=0;
  num_years:number = 1;
  email_array:any []=[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private fb:FormBuilder,private dialog: MatDialog,
    private service:EmailService,private snackBar: MatSnackBar
    ) { 

    
  }

  ngOnInit(): void {
    this.univ_array=this.category_array1 ;
    this.grade_array_values=this.grade_array_values1;
    this.mainForm = this.fb.group({
      years: this.fb.array([
        this.initYears()
      ])
    }) 
    this.wt_array=this.weight_array ;
    this.category_array1 = this.category_array1.sort();
    this.final_grade_array=this.grade_array ;
    this.grade_changed(0,0,4) ;
    this.grade_changed(0,1,4) ;
  }

  initYears(){
    
    
    return this.fb.group({
      courses:this.fb.array([
        this.initCourses(),
        this.initCourses()
      ])
    })
   
  }
  initCourses(){
    return this.fb.group({
      courseName: ['',Validators.required],
      courseWeight: [0.5,Validators.required],
      grade:4,
      semesterToken: [1],
    })
  }
  addYear(){
    this.num_years = this.num_years+1;
    const control = <FormArray>this.mainForm.controls['years'];
    control.push(this.initYears());
    this.grade_changed(control.length-1,0,4) ;
    this.grade_changed(control.length-1,1,4) ;
  }
  removeYear(e){
    this.num_years = this.num_years-1;
    const control = <FormArray>this.mainForm.controls['years'];
    if(e!=0){
      control.removeAt(e);
    }
    
  }
  addCourse(ix) {
    const control = (<FormArray>this.mainForm.controls['years']).at(ix).get('courses') as FormArray;
    control.push(this.initCourses());
    console.log(control.length) ;
    this.grade_changed(ix,control.length-1,4) ;
    
  }
  removeCourse(ix,iy) {
    const control = (<FormArray>this.mainForm.controls['years']).at(ix).get('courses') as FormArray;
    if(iy!=0){
      control.removeAt(iy); 
    }
   
  }
  onSubmit() {
    
    this.logkeyvaluepairs(this.mainForm);
    this.submitted = true;

    // stop here if form is invalid
    if (this.mainForm.invalid) {
        return;
    }
    
}

logkeyvaluepairs(group:FormGroup):void{
  this.gpa_array=[];
  let local_array:any[]=[] ;
  let indx=0;
  Object.keys(group.controls).forEach((key:string)=>
  {
    this.gpa_array_summer_cumulative=[];
    this.gpa_array_withoutsummer_cumulative=[];
    this.totgpa_with_summer=0;
    this.totgpa_without_summer=0;
    const abstractControl=group.get(key);
  
    if(abstractControl instanceof FormGroup){
      this.logkeyvaluepairs(abstractControl) ;
      
    }else{
      
     if(abstractControl instanceof FormArray){
      for(const control of abstractControl.controls){
      if(control instanceof FormGroup){
        
         local_array.push({
           courses:control.value.courses
         })
       for(const contr of control.value.courses){
           //console.log(contr.courseWeight) ;
           if(contr.courseName!=""){
            this.gpa_array.push({
              indx:indx,
              courseName: contr.courseName,
              courseWeight: contr.courseWeight,
              grade: contr.grade,
              semToken:this.semester_array[contr.semesterToken-1]
       
            })
            
           }
         }
        } 
        indx +=1;
      }
     
      
    }
    
    }
   
  })
 
  for(let item of local_array){
    let gp_loc_summer=0 ;
    let gp_net_summer=0;
    let gp_loc_withoutsummer=0 ;
    let wt_loc=0;
    let wt_loc_without=0;
    for(let course of item.courses){

if(course.courseName!=""){
  
  if(course.semesterToken==2){
    gp_loc_summer += course.grade*course.courseWeight ;
    wt_loc += course.courseWeight ;
    
  }
  else{
    console.log(course.grade) ;
    gp_loc_withoutsummer += course.grade*course.courseWeight ;
    wt_loc_without += course.courseWeight ;
  }
}
    

}

let nettgpa_summer= ((gp_loc_summer+gp_loc_withoutsummer)/(wt_loc+wt_loc_without)).toFixed(2);



let nettgpa_withoutsummer= (gp_loc_withoutsummer/wt_loc_without).toFixed(2);
if(!isNaN(parseInt(nettgpa_withoutsummer))){
  this.gpa_array_withoutsummer_cumulative.push(nettgpa_withoutsummer) ;
  this.totgpa_without_summer +=  parseFloat(nettgpa_withoutsummer);  
  this.without_summer_num +=1;
}
else
{
  this.gpa_array_withoutsummer_cumulative.push((0).toString()) ;
   
}
if(!isNaN(parseInt(nettgpa_summer))){
  this.gpa_array_summer_cumulative.push(nettgpa_summer) ;
  this.totgpa_with_summer +=  parseFloat(nettgpa_summer);
  this.with_summer_num +=1;
}
else{
  this.gpa_array_summer_cumulative.push((0).toString()) ;
}
  
  }
  this.totgpa_without_summer=(this.totgpa_without_summer/this.without_summer_num) ;
  this.totgpa_with_summer=(this.totgpa_with_summer/this.with_summer_num) ;
  
  
  this.without_summer_num=0;
  this.with_summer_num=0;
}
university_changed(e){
  this.mainForm['controls'].years['controls']=[];
  this.mainForm = this.fb.group({
    years: this.fb.array([
      this.initYears()
    ])
  }) 
  this.wt_array=this.weight_array ;
  this.category_array1 = this.category_array1.sort();
  this.final_grade_array=this.grade_array ;
  this.grade_changed(0,0,4) ;
  this.grade_changed(0,1,4) ;
 
if(e==2 ||e==4 || e==6 ||e==8||e==12 ||e==13 ||e==14 ||e==28 ||e==29 ||e==32 ||
  e==35 || e==38 ||e==41 || e==44 ||e==50 ||e==51 || e==57 || e==59 ||e==60|| e==63){
  this.final_grade_array=this.grade_numeric_array ;
  this.grade_array_values=this.grade_array_values1;
}
else if(e==21 ){
  this.final_grade_array=this.grade_numeric_array2 ;
  this.grade_array_values=this.grade_array_values2 ;
}
else if(e==19 || e==36 ){
  this.final_grade_array=this.grade_array3 ;
  this.grade_array_values=this.grade_array_values3 ;
}
else if(e==18 || e==65 ){
  this.final_grade_array=this.grade_array4 ;
  this.grade_array_values=this.grade_array_values4 ;
} 
else{
  this.final_grade_array=this.grade_array ; 
  this.grade_array_values=this.grade_array_values1;
}
console.log(e) ;
}


openDialog() {
  console.log(this.gpa_array_summer_cumulative) ;
  const dialogconfig = new MatDialogConfig();
  dialogconfig.autoFocus = true;
  dialogconfig.disableClose = true;
  dialogconfig.width = "70%";
  dialogconfig.data = {
    isNew: true,
    val: 0
  };
  dialogconfig.position = {
    top: "0"
  };

  const dialogRef = this.dialog.open(EmailDialogComponent,dialogconfig);

  dialogRef.afterClosed().subscribe(result => {
    console.log(this.num_years); 
    this.email_array=[];
    this.email_array=[{
      email:result.email,
      name:result.name,
      vals:this.gpa_array,
      with_summer: this.totgpa_with_summer,
      without_summer: this.totgpa_without_summer,
    arr_with_summer:this.gpa_array_summer_cumulative ,
    arr_without_summer: this.gpa_array_withoutsummer_cumulative,
    years:this.num_years 
    }
    ] ;
    
    this.service.sendEmail(this.email_array).subscribe((data:any)=>{
    if(data.report=='failure')
    {
      this.openSnackBar("Email Not Sent") ;
    }
      else{
        this.openSnackBar("Email Sent") ;
      }
     
    })
  });
}
grade_array=['A+','A','A-', 'B+','B','B-','C+','C','C-', 'D+','D','D-', 'F'];
grade_numeric_array=['90–100',' 85–89','80–84', '77–79','73–76','70–72','67–69','63–66',
'60–62', '57–59','53–56','50–52', ' ≤ 49'];
grade_array_values:any[]=[];
grade_array_values1=[4,3.90,3.70,3.30,3,2.70,2.30,2,1.70,1.30,1,0.70,0];
grade_numeric_array2=['94–100',' 85–93','80–84', '75–79','70–74','65–69','60–64','55–59',
'50–54', ' ≤ 49'];
grade_array_values2=[4,3.90,3.70,3.30,3,2.70,2.30,2,1,0];

grade_array3=['A','A-', 'B+','B','B-','C+','C','C-', 'D+','D','D-', 'E/F'];
grade_array_values3=[4,3.70,3.30,3,2.70,2.30,2,1.70,1.30,1,0.70,0];

grade_array4=['A+','A', 'B+','B','C+','C', 'D+','D', 'E/F'];
grade_array_values4=[4,3.80,3.30,3,2.30,2,1.30,1,0];

weight_array=['Regular','Regular Honors','AP / IB', 'College'];
  univ_array:any []=[];
  category_array1=['Toronto (numerical grades)','Toronto (letter grades)','Western','Queen’s (numerical grades)','Queen’s (letter grades)',
  'Guelph','Dalhousie (numerical grades)','OCAD','Windsor (numerical grades)','Windsor (letter grades)','Waterloo (numerical grades)','Waterloo (letter grades)',
  'Victoria (numerical grades)','Victoria (letter grades)',,'Trent','St. Francis Xavier','Saskatchewan','Regina','Prince Edward Island',
  'Nipissing','Lakehead','Cape Breton','Brock',
  'Bishop\'s','Algoma','New Brunswick','Ontario Tech','Acadia','Alberta','Athabasca',
  'Brandon','University of Calgary','Carleton','Concordia','Dalhousie (letter grades)','Laurentian',
  'Laval','Lethbridge','Quebec','Sherbrooke',
  'Simon Fraser','Memorial','Quest', 'McGill','York', 'Manitoba','Calgary','McMaster','Moncton','Montreal','Mt. Allison','Mt. Royal','Mt. St. Vincent','Ottawa','RMC','Royal Roads','Ryerson','St. Mary\'s','St. Thomas','Ste-Anne','Thompson Rivers','Trinity Western','UBC','UNBC','Wilfrid Laurier','Winnipeg'
];
 
  semester_array=['Fall/Winter','Summer'];
  openSnackBar(str){
    this.snackBar.open(str, '', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  grade_changed(ix,iy,e){
  this.chosen_grade[ix*100 +iy]=e; 
  console.log(iy+"k"+ix+"k"+e)
  }
  }
