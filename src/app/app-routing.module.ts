import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {SubjectComponent} from './subject/subject.component';
import {LoginGuard} from './login.guard';
import {SubjectFormComponent} from './subject/subjectForm/subjectForm.component';
import {TeacherComponent} from './teacher/teacher.component';
import {TeacherFormComponent} from './teacher/teacherForm/teacherForm.component';
import {GradeCourseComponent} from './grade-course/grade-course.component';
import {ClassComponent} from './class/class.component';
import {ClassFormComponent} from './class/class-form/class-form.component';
import {CourseTeacherComponent} from './class/course-teacher/course-teacher.component';
import {StudentComponent} from './student/student.component';
import {StudentFormComponent} from './student/student-form/student-form.component';

const routes: Routes = [{path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, data: {breadcrumb: '首页'
}, children: [
  {path: 'subject', component: SubjectComponent, data: {breadcrumb: '科目'}},
      {path: 'subject/addSubject', component: SubjectFormComponent, data: {breadcrumb: '新增科目'}},
      {path: 'teacher', component: TeacherComponent, data: {breadcrumb: '教师'}},
      {path: 'teacher/addTeacher', component: TeacherFormComponent, data: {breadcrumb: '新增教师'}},
      {path: 'teacher/editTeacher/:id', component: TeacherFormComponent, data: {breadcrumb: '编辑教师'}},
      {path: 'gradeCourse', component: GradeCourseComponent, data: {breadcrumb: '年级课程'}},
      {path: 'class', component: ClassComponent, data: {breadcrumb: '班级'}},
      {path: 'class/addClass', component: ClassFormComponent, data: {breadcrumb: '新增班级'}},
      {path: 'class/courseTeacher/:id/:grade', component: CourseTeacherComponent, data: {breadcrumb: '课程及任课老师'}},
      {path: 'student', component: StudentComponent, data: {breadcrumb: '学生'}},
      {path: 'student/addStudent', component: StudentFormComponent, data: {breadcrumb: '新增学生'}},
      ], canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
