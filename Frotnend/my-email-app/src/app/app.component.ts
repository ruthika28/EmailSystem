import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  model: any = {
    name: '',
    email: ''
  }
  constructor(private http: HttpClient) {}
  users:any[] =[];
  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/allUsers').subscribe(users => {
      this.users = users;
      console.log('users are :', this.users);
    }, error => {
      console.error('Failed to retrieve users', error);
    });
  };
  sendEmail(email: any, name:any) {
    console.log("form submitted");
    console.log(email,name);
    let data = {
      email:email,
      name: name,
    }
    this.http.post('http://localhost:3000/email', data).subscribe(
      (response) => {
        alert('Please check your inbox');
      },
      (error) => {
        console.log(error);
      }
    );
  }
  submitForm(ref:any) {
    console.log(ref);
    console.log("form submitted", this.model.username, this.model.email);
    this.http.post('http://localhost:3000/users', this.model).subscribe(
      (response) => {
        console.log(response);
        this.ngOnInit(); 
        alert('Your Information is successfully stored! Check your inbox!');
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
