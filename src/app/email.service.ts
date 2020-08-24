import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpclient: HttpClient) { }
  sendEmail(info) {
    
    return this.httpclient.post(
      "./mail/sendmail.php",
      info
    );
  }

}
