import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-choice',
  templateUrl: './text-choice.component.html',
  styleUrls: ['./text-choice.component.scss'],
})
export class TextChoiceComponent implements OnInit {
  @Input() questionType;
  constructor() { }

  ngOnInit() { }

}
