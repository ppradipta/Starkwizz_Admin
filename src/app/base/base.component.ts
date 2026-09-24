import { Component } from '@angular/core';
import { ApplicationMessage, ApplicationMessageConstants } from '../model/application-message';
import { BoardOfEducation } from '../model/board';
import { Classes } from '../model/classes';
import { Module } from '../model/module';
import { Subjects } from '../model/subject';
import { BoardService } from '../services/board.service';
import { ClassesService } from '../services/classes.service';
import { ModuleService } from '../services/module.service';
import { SubjectService } from '../services/subject.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {

  boardEducations: BoardOfEducation[];
  classesList: Classes[] = [];
  subjectList: Subjects[] = [];
  moduleList: Module[] = [];

  appMessage: ApplicationMessage;

  constructor(
    public classesService: ClassesService,
    public subjectService: SubjectService,
    public boardService: BoardService,
    public moduleService: ModuleService,
  ) {
    this.getClasses();
    this.getSubject();
    this.getBoardOfEducation();
    this.getModules();
  }

  getClasses() {
    this.classesService.classes$.subscribe(classesList => {
      this.classesList = classesList;
    });
  }

  getSubject() {
    this.subjectService.subjects$.subscribe(subjectList => {
      this.subjectList = subjectList
    });
  }

  getBoardOfEducation() {
    this.boardService.boardEducations$.subscribe(boardEducations => {
      this.boardEducations = boardEducations
    });
  }

 
  getModules() {
    this.moduleService.modules$.subscribe(moduleList => {
      this.moduleList = moduleList
    });
  }

  buildInfoMessage(msg: string) {
    this.appMessage = new ApplicationMessage();
    this.appMessage.displayText = msg;
    this.appMessage.id = Math.floor(50000 + Math.random() * 900000).toString();
    this.appMessage.type = ApplicationMessageConstants.INFO;
  }
}
