import { Component, OnInit } from '@angular/core';
import {SubjectService} from '../service/subject.service';
import {GradeCourseService} from '../service/grade-course.service';
import {TeacherService} from '../service/teacher.service';

@Component({
  selector: 'app-grade-course',
  templateUrl: './grade-course.component.html',
  styleUrls: ['./grade-course.component.css']
})
export class GradeCourseComponent implements OnInit {
  title = '年级课程';
  gradeCourses = [];
  subjects: any[] = [];
  pageIndex = 0;
  pageSize = 10;
  loading = true;
  editCache: { [key: string]: any } = {};
  isLoading = false;
  pageCount = 1;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  constructor(private gradeCourseService: GradeCourseService, private subjectService: SubjectService) {}
  ngOnInit(): void {
    this.searchData();
    this.loadMore();
  }
  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.gradeCourseService.getGradeCourses()
      .subscribe(result => this.onSuccess(result));
  }
  onSuccess(result: any) {
    this.loading = false;
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    this.gradeCourses = data.gradeCourses;
    this.updateEditCache();
  }
  startEdit(grade: number): void {
    this.editCache[grade].edit = true;
  }

  cancelEdit(grade: number): void {
    const index = this.gradeCourses.findIndex(item => item.grade === grade);
    this.editCache[grade] = {
      data: { ...this.gradeCourses[index] },
      edit: false
    };
  }

  saveEdit(grade: number): void {
    const subjectIds = [];
    let subjectName = '';
    let subjectId = '';
    let seperator = ',';
    for (let i = 0; i < this.editCache[grade].data.subjects.length; i ++) {
      subjectIds[i] = this.editCache[grade].data.subjects[i].id;
      if (i === this.editCache[grade].data.subjects.length - 1) {
        seperator = '';
      }
      subjectName = subjectName + this.editCache[grade].data.subjects[i].name + seperator;
      subjectId = subjectId + this.editCache[grade].data.subjects[i].id + seperator;
    }
    if (this.editCache[grade].data.courses != null) {
      this.editCache[grade].data.courses.subjectNames = subjectName;
      this.editCache[grade].data.courses.subjectIds = subjectId;
    } else {
      const course = {
        grade,
        subjectIds: subjectId,
        subjectNames: subjectName
      };
      this.editCache[grade].data.courses = course;
    }
    this.gradeCourseService.editGradeCourse(this.editCache[grade].data.grade, subjectIds).subscribe(result => {
      const index = this.gradeCourses.findIndex(item => item.grade === grade);
      Object.assign(this.gradeCourses[index], this.editCache[grade].data);
      this.editCache[grade].edit = false;
    });
  }

  updateEditCache(): void {
    this.gradeCourses.forEach(item => {
      this.editCache[item.grade] = {
        edit: false,
        data: { ...item }
      };
      this.editCache[item.grade].data.subjects = [];
      if (item.courses != null) {
        const array = item.courses.subjectIds.split(',');
        const names = item.courses.subjectNames.split(',');
        for (let i = 0; i < array.length; i ++) {
          this.editCache[item.grade].data.subjects[i] = {
            id: Number(array[i]),
            name: names[i]
          };
        }
      }
    });
  }

  delete(grade: number): void {
    this.gradeCourseService.deleteGradeCourse(grade).subscribe(result => this.searchData());
  }
  loadMore(): void {
    if (this.pageIndex < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.subjectService.getSubjects(this.pageIndex, this.pageSize, '')
        .subscribe(result => {
          const data = result.data;
          this.subjects = [...this.subjects, ...data.subjects];
          this.pageCount = data.pageCount;
          this.pageIndex = this.pageIndex + 1;
          this.isLoading = false;
        });
    }
  }
}
