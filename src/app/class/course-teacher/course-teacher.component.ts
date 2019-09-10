import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../../service/teacher.service';
import {ClassService} from '../../service/class.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-course-teacher',
  templateUrl: './course-teacher.component.html',
  styleUrls: ['./course-teacher.component.css']
})
export class CourseTeacherComponent implements OnInit {
  title = '课程及任课老师';
  courseTeachers = [];
  loading = true;
  editCache: { [key: string]: any } = {};
  teachers: any[] = [];
  isLoading = false;
  pageCount = 1;
  index = 0;
  size = 10;
  classId: string;
  grade: number;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  constructor(private route: ActivatedRoute, private teacherService: TeacherService, private classService: ClassService) {}
  ngOnInit(): void {
    this.searchData();
    this.loadMore();
  }
  searchData(reset: boolean = false): void {
    this.loading = true;
    this.classId = this.route.snapshot.paramMap.get('id');
    this.grade = +this.route.snapshot.paramMap.get('grade');
    this.classService.getCourseTeachers(this.classId, this.grade)
      .subscribe(result => this.onSuccess(result));
  }
  onSuccess(result: any) {
    this.loading = false;
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    this.courseTeachers = data.courseTeachers;
    this.updateEditCache();
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.courseTeachers.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.courseTeachers[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.classService.editCourseTeacher(this.classId, id,
      this.editCache[id].data.teacher.id).subscribe(result => {
      const index = this.courseTeachers.findIndex(item => item.course.subject.id === id);
      Object.assign(this.courseTeachers[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.courseTeachers.forEach(item => {
      this.editCache[item.course.subject.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  loadMore(): void {
    if (this.index < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.teacherService.getTeachers(this.index, this.size, '')
        .subscribe(result => {
          const data = result.data;
          this.teachers = [...this.teachers, ...data.teachers];
          this.pageCount = data.pageCount;
          this.index = this.index + 1;
          this.isLoading = false;
        });
    }
  }
}
