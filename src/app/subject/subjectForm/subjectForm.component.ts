import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SubjectService} from '../../service/subject.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './subjectForm.component.html'
})
export class SubjectFormComponent implements OnInit {
  title = '新增科目';
  subjectForm: FormGroup;

  submitForm(): void {
    for (const i in this.subjectForm.controls) {
      this.subjectForm.controls[i].markAsDirty();
      this.subjectForm.controls[i].updateValueAndValidity();
      if (this.subjectForm.controls[i].invalid) {
        return;
      }
    }
    this.subjectService.addSubject(this.subjectForm.value.name)
      .subscribe(result => this.location.back());
  }

  constructor(private fb: FormBuilder, private router: Router, private subjectService: SubjectService,
              private location: Location) {}

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }
}
