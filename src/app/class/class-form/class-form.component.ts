import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TeacherService} from '../../service/teacher.service';
import {Location} from '@angular/common';
import {ClassService} from '../../service/class.service';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css']
})
export class ClassFormComponent implements OnInit {
  title = '新增班级';
  classForm: FormGroup;
  teachers: any[] = [];
  isLoading = false;
  pageCount = 1;
  pageIndex = 0;
  pageSize = 10;

  submitForm(): void {
    for (const i in this.classForm.controls) {
      this.classForm.controls[i].markAsDirty();
      this.classForm.controls[i].updateValueAndValidity();
      if (this.classForm.controls[i].invalid) {
        return;
      }
    }
    this.classService.addClass(this.classForm.value.className, this.classForm.value.grade,
      this.classForm.value.mainTeacherId)
      .subscribe(result => this.location.back());
  }

  constructor(private fb: FormBuilder, private router: Router, private classService: ClassService,
              private location: Location, private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.classForm = this.fb.group({
      className: [null, [Validators.required]],
      grade: [null, [Validators.required]],
      mainTeacherId: [[], [Validators.required]]
    });
    this.loadMore();
  }
  loadMore(): void {
    if (this.pageIndex < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.teacherService.getTeachers(this.pageIndex, this.pageSize, '')
        .subscribe(result => {
          const data = result.data;
          this.teachers = [...this.teachers, ...data.teachers];
          this.pageCount = data.pageCount;
          this.pageIndex = this.pageIndex + 1;
          this.isLoading = false;
        });
    }
  }
}
