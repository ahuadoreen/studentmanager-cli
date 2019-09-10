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
export class GradeCourseService {
  gradeCourseUrl = '/studentmanage/gradeCourse/';

  getGradeCourses(): Observable<any> {
    return this.http.get(`${this.gradeCourseUrl}gradeCourses`);
  }

  deleteGradeCourse(
    grade: number
  ): Observable<any> {
    const options = { grade };
    return this.http.post(`${this.gradeCourseUrl}deleteGradeCourse`, qs.stringify(options), httpOptions);
  }

  editGradeCourse(
    grade: number,
    subjectIds: any[]
  ): Observable<any> {
    const options = { grade, subjectIds };
    return this.http.post(`${this.gradeCourseUrl}editGradeCourse`, qs.stringify(options, { indices: false }), httpOptions);
  }
  constructor(private http: HttpClient) {}
}
