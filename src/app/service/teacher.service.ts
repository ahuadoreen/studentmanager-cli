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
    subjectIds: any[],
    file: File
  ): Observable<any> {
    const options = { id, name, gender, age, subjectIds };
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('gender', gender.toString());
    formData.append('subjectIds', subjectIds.toString());
    formData.append('age', age.toString());
    if (file != null) {
      formData.append('file', file);
    }
    return this.http.post(`${this.teacherUrl}editTeacher`, formData, {});
  }

  addTeacher(
    name: string,
    gender: number,
    age: number,
    subjectIds: [],
    file: File
  ): Observable<any> {
    // const options = { name, gender, age, subjectIds };
    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender.toString());
    formData.append('subjectIds', subjectIds.toString());
    formData.append('age', age.toString());
    if (file != null) {
      formData.append('file', file);
    }
    return this.http.post(`${this.teacherUrl}addTeacher`, formData, {});
  }

  getTeacherDetail(
    id: string
  ): Observable<any> {
    const params = new HttpParams()
      .append('id', id);
    return this.http.get(`${this.teacherUrl}teacherDetail`, {
      params
    });
  }

  constructor(private http: HttpClient) {}
}
