import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import qs from 'qs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentUrl = '/studentmanage/student/';

  getStudents(
    pageIndex: number = 0,
    pageSize: number = 10,
    name: string
  ): Observable<any> {
    const params = new HttpParams()
      .append('index', `${pageIndex}`)
      .append('size', `${pageSize}`)
      .append('name', name);
    return this.http.get(`${this.studentUrl}students`, {
      params
    });
  }

  deleteStudent(
    id: string
  ): Observable<any> {
    const options = {id};
    return this.http.post(`${this.studentUrl}deleteStudent`, qs.stringify(options), httpOptions);
  }

  editStudent(
    id: string,
    sno: string,
    name: string,
    gender: number,
    age: number,
    classId: string
  ): Observable<any> {
    const options = {id, sno, name, gender, age, classId};
    return this.http.post(`${this.studentUrl}editStudent`, qs.stringify(options), httpOptions);
  }

  addStudent(
    sno: string,
    name: string,
    gender: number,
    age: number,
    classId: string
  ): Observable<any> {
    const options = {sno, name, gender, age, classId};
    console.log('addTeacher: ' + qs.stringify(options, {indices: false}));
    return this.http.post(`${this.studentUrl}addStudent`, qs.stringify(options), httpOptions);
  }

  constructor(private http: HttpClient) {
  }
}
