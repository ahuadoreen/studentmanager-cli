import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {StudentService} from '../../service/student.service';
import {ClassService} from '../../service/class.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  title = '新增学生';
  studentForm: FormGroup;
  classes: any[] = [];
  isLoading = false;
  pageCount = 1;
  pageIndex = 0;
  pageSize = 10;

  submitForm(): void {
    for (const i in this.studentForm.controls) {
      this.studentForm.controls[i].markAsDirty();
      this.studentForm.controls[i].updateValueAndValidity();
      if (this.studentForm.controls[i].invalid) {
        return;
      }
    }
    this.studentService.addStudent(this.studentForm.value.sno, this.studentForm.value.name, this.studentForm.value.gender,
      this.studentForm.value.age, this.studentForm.value.classId)
      .subscribe(result => this.location.back());
  }

  constructor(private fb: FormBuilder, private router: Router, private studentService: StudentService,
              private location: Location, private classService: ClassService) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      sno: [null, [Validators.required]],
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      age: [15, [Validators.required]],
      classId: [null, [Validators.required]]
    });
    this.loadMore();
  }
  loadMore(): void {
    if (this.pageIndex < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.classService.getClasses(this.pageIndex, this.pageSize, '')
        .subscribe(result => {
          const data = result.data;
          this.classes = [...this.classes, ...data.classes];
          this.pageCount = data.pageCount;
          this.pageIndex = this.pageIndex + 1;
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
