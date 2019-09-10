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
export class SubjectService {
  subjectUrl = '/studentmanage/subject/';

  getSubjects(
    pageIndex: number = 0,
    pageSize: number = 10,
    name: string
  ): Observable<any> {
    const params = new HttpParams()
      .append('index', `${pageIndex}`)
      .append('size', `${pageSize}`)
      .append('name', name);
    return this.http.get(`${this.subjectUrl}subjects`, {
      params
    });
  }

  deleteSubject(
    id: string
  ): Observable<any> {
    const options = { id };
    return this.http.post(`${this.subjectUrl}deleteSubject`, qs.stringify(options), httpOptions);
  }

  editSubject(
    id: string,
    name: string
  ): Observable<any> {
    const options = { id, name };
    return this.http.post(`${this.subjectUrl}editSubject`, qs.stringify(options), httpOptions);
  }
  addSubject(
    name: string
  ): Observable<any> {
    const options = { name };
    return this.http.post(`${this.subjectUrl}addSubject`, qs.stringify(options), httpOptions);
  }
  constructor(private http: HttpClient) {}
}
