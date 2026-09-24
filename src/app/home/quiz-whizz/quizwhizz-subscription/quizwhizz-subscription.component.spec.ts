import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuizwhizzSubscriptionComponent } from './quizwhizz-subscription.component';

describe('QuizwhizzSubscriptionComponent', () => {
  let component: QuizwhizzSubscriptionComponent;
  let fixture: ComponentFixture<QuizwhizzSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizwhizzSubscriptionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizwhizzSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
