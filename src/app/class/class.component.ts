import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../service/teacher.service';
import {SubjectService} from '../service/subject.service';
import {ClassService} from '../service/class.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  title = '班级';
  classes = [];
  pageIndex = 1;
  pageSize = 5;
  total = 1;
  loading = true;
  editCache: { [key: string]: any } = {};
  searchValue = '';
  teachers: any[] = [];
  isLoading = false;
  pageCount = 1;
  index = 0;
  size = 10;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  constructor(private teacherService: TeacherService, private classService: ClassService) {}
  ngOnInit(): void {
    this.searchData();
    this.loadMore();
  }
  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.classService.getClasses(this.pageIndex - 1, this.pageSize, this.searchValue)
      .subscribe(result => this.onSuccess(result));
  }
  onSuccess(result: any) {
    this.loading = false;
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    this.classes = data.classes;
    this.total = data.total;
    this.updateEditCache();
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.classes.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.classes[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.classService.editClass(id, this.editCache[id].data.className, this.editCache[id].data.grade,
      this.editCache[id].data.mainTeacher.id).subscribe(result => {
      const index = this.classes.findIndex(item => item.id === id);
      Object.assign(this.classes[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.classes.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  delete(id: string): void {
    this.classService.deleteClass(id).subscribe(result => this.searchData());
  }
  reset(): void {
    this.searchValue = '';
    this.searchData();
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
