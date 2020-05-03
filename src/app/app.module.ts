import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SubjectComponent} from './subject/subject.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {MyInterceptor} from './myinterceptor';
import {SubjectFormComponent} from './subject/subjectForm/subjectForm.component';
import { TeacherComponent } from './teacher/teacher.component';
import {TeacherFormComponent} from './teacher/teacherForm/teacherForm.component';
import { GradeCourseComponent } from './grade-course/grade-course.component';
import { ClassComponent } from './class/class.component';
import { ClassFormComponent } from './class/class-form/class-form.component';
import { CourseTeacherComponent } from './class/course-teacher/course-teacher.component';
import { StudentComponent } from './student/student.component';
import { StudentFormComponent } from './student/student-form/student-form.component';
import {RouteReuseStrategy} from '@angular/router';
import {CustomRouteReuseStrategy} from './custom-route-reuse-strategy';

@NgModule({
  declarations: [
    AppComponent,
    SubjectComponent,
    LoginComponent,
    HomeComponent,
    SubjectFormComponent,
    TeacherComponent,
    TeacherFormComponent,
    GradeCourseComponent,
    ClassComponent,
    ClassFormComponent,
    CourseTeacherComponent,
    StudentComponent,
    StudentFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
