import {Component, OnInit} from '@angular/core';
import {SubjectService} from '../service/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  title = '科目';
  subjects = [];
  pageIndex = 1;
  pageSize = 5;
  total = 1;
  loading = true;
  editCache: { [key: string]: any } = {};
  searchValue = '';
  constructor(private subjectService: SubjectService) {}
  ngOnInit(): void {
    this.searchData();
  }
  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.subjectService.getSubjects(this.pageIndex - 1, this.pageSize, this.searchValue)
      .subscribe(result => this.onSuccess(result));
  }
  onSuccess(result: any) {
    this.loading = false;
    console.log('result: ' + JSON.stringify(result));
    const data = result.data;
    this.subjects = data.subjects;
    this.total = data.total;
    this.updateEditCache();
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.subjects.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.subjects[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.subjectService.editSubject(id, this.editCache[id].data.name).subscribe(result => {
      const index = this.subjects.findIndex(item => item.id === id);
      Object.assign(this.subjects[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.subjects.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  delete(id: string): void {
    this.subjectService.deleteSubject(id).subscribe(result => this.searchData());
  }
  reset(): void {
    this.searchValue = '';
    this.searchData();
  }
}
