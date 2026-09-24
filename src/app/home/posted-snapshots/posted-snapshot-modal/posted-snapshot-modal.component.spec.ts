import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostedSnapshotModalComponent } from './posted-snapshot-modal.component';

describe('PostedSnapshotModalComponent', () => {
  let component: PostedSnapshotModalComponent;
  let fixture: ComponentFixture<PostedSnapshotModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedSnapshotModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostedSnapshotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
