import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../service/teacher.service';
import {Location} from '@angular/common';
import {SubjectService} from '../service/subject.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  title = '教师';
  teachers = [];
  pageIndex = 1;
  pageSize = 5;
  total = 1;
  loading = true;
  editCache: { [key: string]: any } = {};
  searchValue = '';
  subjects: any[] = [];
  isLoading = false;
  pageCount = 1;
  index = 0;
  size = 10;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  constructor(private teacherService: TeacherService, private subjectService: SubjectService, private router: Router, private route: ActivatedRoute) {
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.searchData();
      console.log(route.routeConfig);
    });
  }
  ngOnInit(): void {
    this.loadMore();
  }
  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.teacherService.getTeachers(this.pageIndex - 1, this.pageSize, this.searchValue)
      .subscribe(result => this.onSuccess(result));
  }
  onSuccess(result: any) {
    this.loading = false;
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    this.teachers = data.teachers;
    this.total = data.total;
    this.updateEditCache();
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.teachers.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.teachers[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const subjectIds = [];
    let subjectName = '';
    let subjectId = '';
    let seperator = ',';
    for (let i = 0; i < this.editCache[id].data.subjects.length; i ++) {
      subjectIds[i] = this.editCache[id].data.subjects[i].id;
      if (i === this.editCache[id].data.subjects.length - 1) {
        seperator = '';
      }
      subjectName = subjectName + this.editCache[id].data.subjects[i].name + seperator;
      subjectId = subjectId + this.editCache[id].data.subjects[i].id + seperator;
    }
    this.editCache[id].data.subjectNames = subjectName;
    this.editCache[id].data.subjectIds = subjectId;
    this.teacherService.editTeacher(id, this.editCache[id].data.name, this.editCache[id].data.gender,
      this.editCache[id].data.age, subjectIds, null).subscribe(result => {
      const index = this.teachers.findIndex(item => item.id === id);
      Object.assign(this.teachers[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.teachers.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
      this.editCache[item.id].data.subjects = [];
      if (item.subjectIds != null) {
        const array = item.subjectIds.split(',');
        const names = item.subjectNames.split(',');
        for (let i = 0; i < array.length; i ++) {
          this.editCache[item.id].data.subjects[i] = {
            id: Number(array[i]),
            name: names[i]
        };
        }
      }
    });
  }

  delete(id: string): void {
    this.teacherService.deleteTeacher(id).subscribe(result => this.searchData());
  }
  reset(): void {
    this.searchValue = '';
    this.searchData();
  }
  loadMore(): void {
    if (this.index < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.subjectService.getSubjects(this.index, this.size, '')
        .subscribe(result => {
          const data = result.data;
          this.subjects = [...this.subjects, ...data.subjects];
          this.pageCount = data.pageCount;
          this.index = this.index + 1;
          this.isLoading = false;
        });
    }
  }
}
