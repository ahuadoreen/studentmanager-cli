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
export class TeacherService {
  teacherUrl = '/studentmanage/teacher/';

  getTeachers(
    pageIndex: number = 0,
    pageSize: number = 10,
    name: string
  ): Observable<any> {
    const params = new HttpParams()
      .append('index', `${pageIndex}`)
      .append('size', `${pageSize}`)
      .append('name', name);
    return this.http.get(`${this.teacherUrl}teachers`, {
      params
    });
  }

  deleteTeacher(
    id: string
  ): Observable<any> {
    const options = { id };
    return this.http.post(`${this.teacherUrl}deleteTeacher`, qs.stringify(options), httpOptions);
  }

  editTeacher(
    id: string,
    name: string,
    gender: number,
    age: number,
    subjectIds: any[]
  ): Observable<any> {
    const options = { id, name, gender, age, subjectIds };
    return this.http.post(`${this.teacherUrl}editTeacher`, qs.stringify(options, { indices: false }), httpOptions);
  }
  addTeacher(
    name: string,
    gender: number,
    age: number,
    subjectIds: []
  ): Observable<any> {
    const options = { name, gender, age, subjectIds };
    console.log('addTeacher: ' + qs.stringify(options, { indices: false }));
    return this.http.post(`${this.teacherUrl}addTeacher`, qs.stringify(options, { indices: false }), httpOptions);
  }
  constructor(private http: HttpClient) {}
}
