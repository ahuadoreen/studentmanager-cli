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
export class ClassService {
  classUrl = '/studentmanage/class/';

  getClasses(
    pageIndex: number = 0,
    pageSize: number = 10,
    name: string
  ): Observable<any> {
    const params = new HttpParams()
      .append('index', `${pageIndex}`)
      .append('size', `${pageSize}`)
      .append('name', name);
    return this.http.get(`${this.classUrl}classes`, {
      params
    });
  }

  deleteClass(
    id: string
  ): Observable<any> {
    const options = { id };
    return this.http.post(`${this.classUrl}deleteClass`, qs.stringify(options), httpOptions);
  }

  editClass(
    id: string,
    className: string,
    grade: number,
    mainTeacherId: string
  ): Observable<any> {
    const options = { id, className, grade, mainTeacherId };
    return this.http.post(`${this.classUrl}editClass`, qs.stringify(options), httpOptions);
  }
  addClass(
    className: string,
    grade: number,
    mainTeacherId: number
  ): Observable<any> {
    const options = { className, grade, mainTeacherId };
    return this.http.post(`${this.classUrl}addClass`, qs.stringify(options), httpOptions);
  }

  getCourseTeachers(
    id: string,
    grade: number
  ): Observable<any> {
    const params = new HttpParams()
      .append('id', `${id}`)
      .append('grade', `${grade}`);
    return this.http.get(`${this.classUrl}courseTeachers`, {
      params
    });
  }

  editCourseTeacher(
    id: string,
    subjectId: string,
    teacherId: string
  ): Observable<any> {
    const options = { id, subjectId, teacherId };
    return this.http.post(`${this.classUrl}editCourseTeacher`, qs.stringify(options), httpOptions);
  }
  constructor(private http: HttpClient) {}
}
