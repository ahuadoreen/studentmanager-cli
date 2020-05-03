import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {TeacherService} from '../../service/teacher.service';
import {SubjectService} from '../../service/subject.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Observable, Observer} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-form',
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
  loading = false;
  avatarUrl: string;
  avatarFile: File;
  teacherId: string;

  submitForm(): void {
    for (const i in this.teacherForm.controls) {
      this.teacherForm.controls[i].markAsDirty();
      this.teacherForm.controls[i].updateValueAndValidity();
      if (this.teacherForm.controls[i].invalid) {
        return;
      }
    }
    if (this.teacherId == null) {
      this.teacherService.addTeacher(this.teacherForm.value.name, this.teacherForm.value.gender,
        this.teacherForm.value.age, this.teacherForm.value.subjectIds, this.avatarFile)
        .subscribe(result => this.location.back());
    } else {
      this.teacherService.editTeacher(this.teacherId, this.teacherForm.value.name, this.teacherForm.value.gender,
        this.teacherForm.value.age, this.teacherForm.value.subjectIds, this.avatarFile)
        .subscribe(result => {
          this.location.back()});
    }
  }

  constructor(private fb: FormBuilder, private router: Router, private teacherService: TeacherService,
              private location: Location, private subjectService: SubjectService, private msg: NzMessageService,
              public domSanitizer: DomSanitizer, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id');
    this.teacherForm = this.fb.group({
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      age: [25, [Validators.required]],
      subjectIds: [[], [Validators.required]]
    });
    if (this.teacherId != null) {
      this.title = '编辑教师';
    }
    this.loadMore();
  }

  loadMore(): void {
    if (this.pageIndex < this.pageCount && !this.isLoading) {
      this.isLoading = true;
      this.subjectService.getSubjects(this.pageIndex, this.pageSize, '')
        .subscribe(result => {
          if (this.teacherId != null) {
            this.getTeacherDetail(this.teacherId);
          }
          const data = result.data;
          this.subjects = [...this.subjects, ...data.subjects];
          this.pageCount = data.pageCount;
          this.pageIndex = this.pageIndex + 1;
          this.isLoading = false;
        });
    }
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image only 300x300 above');
          observer.complete();
          return;
        }

        this.avatarUrl = window.URL.createObjectURL(file);
        this.avatarFile = file;
        // observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width === height && width >= 300);
      };
    });
  }

  getTeacherDetail(id: string): void {
    this.teacherService.getTeacherDetail(id)
      .subscribe(result => {
        const data = result.data.teacher;
        let array = [];
        if (data.subjectIds != null) {
          const subjectIds = data.subjectIds.split(',');
          subjectIds.map((item) => {
            array.push(Number(item));
          });
        }
        this.teacherForm.setValue({
          name: data.name,
          gender: data.gender,
          age: data.age,
          subjectIds: array
        });
        if (data.imageUrl != null) {
          this.avatarUrl = data.imageUrl;
        }
      });
  }
}
