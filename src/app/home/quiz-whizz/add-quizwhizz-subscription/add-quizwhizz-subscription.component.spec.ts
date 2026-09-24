import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddQuizwhizzSubscriptionComponent } from './add-quizwhizz-subscription.component';

describe('AddQuizwhizzSubscriptionComponent', () => {
  let component: AddQuizwhizzSubscriptionComponent;
  let fixture: ComponentFixture<AddQuizwhizzSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddQuizwhizzSubscriptionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddQuizwhizzSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
