import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import {TeacherService} from '../../service/teacher.service';
import {SubjectService} from '../../service/subject.service';

@Component({
  selector: 'app-login',
  templateUrl: './teacherForm.component.html'
})
export class TeacherFormComponent implements OnInit {
  title = '新增教师';
  teacherForm: FormGroup;
  subjects: any[] = [];
  isLoading = false;
  pageCount = 1;
  pageIndex = 0;
  pageSize = 10;

  submitForm(): void {
    for (const i in this.teacherForm.controls) {
      this.teacherForm.controls[i].markAsDirty();
      this.teacherForm.controls[i].updateValueAndValidity();
      if (this.teacherForm.controls[i].invalid) {
        return;
      }
    }
    this.teacherService.addTeacher(this.teacherForm.value.name, this.teacherForm.value.gender,
      this.teacherForm.value.age, this.teacherForm.value.subjectIds)
      .subscribe(result => this.location.back());
  }

  constructor(private fb: FormBuilder, private router: Router, private teacherService: TeacherService,
              private location: Location, private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      age: [25, [Validators.required]],
      subjectIds: [[], [Validators.required]]
    });
    this.loadMore();
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
