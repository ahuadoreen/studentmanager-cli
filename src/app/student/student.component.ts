import { Component, OnInit } from '@angular/core';
import {StudentService} from '../service/student.service';
import {ClassService} from '../service/class.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  title = '学生';
  students = [];
  pageIndex = 1;
  pageSize = 5;
  total = 1;
  loading = true;
  editCache: { [key: string]: any } = {};
  searchValue = '';
  classes: any[] = [];
  isLoading = false;
  pageCount = 1;
  index = 0;
  size = 10;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);
  constructor(private studentService: StudentService, private classService: ClassService) {}
  ngOnInit(): void {
    this.searchData();
    this.loadMore();
  }
  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.studentService.getStudents(this.pageIndex - 1, this.pageSize, this.searchValue)
      .subscribe(result => this.onSuccess(result));
  }
  onSuccess(result: any) {
    this.loading = false;
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    this.students = data.students;
    this.total = data.total;
    this.updateEditCache();
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.students.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.students[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.studentService.editStudent(id, this.editCache[id].data.sno, this.editCache[id].data.name, this.editCache[id].data.gender,
      this.editCache[id].data.age, this.editCache[id].data.classes.id).subscribe(result => {
      const index = this.students.findIndex(item => item.id === id);
      Object.assign(this.students[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.students.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  delete(id: string): void {
    this.studentService.deleteStudent(id).subscribe(result => this.searchData());
  }
  reset(): void {
    this.searchValue = '';
    this.searchData();
  }
  loadMore(): void {
    if (this.index < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.classService.getClasses(this.index, this.size, '')
        .subscribe(result => {
          const data = result.data;
          this.classes = [...this.classes, ...data.classes];
          this.pageCount = data.pageCount;
          this.index = this.index + 1;
          this.isLoading = false;
        });
    }
  }
  formatClass(classes: any) {
    let str = '';
    switch (classes.grade) {
      case 1:
        str = '一年级';
        break;
      case 2:
        str = '二年级';
        break;
    }
    str = str + classes.className;
    return str;
  }
}
