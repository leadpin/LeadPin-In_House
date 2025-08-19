import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTextFilterComponent } from './upload-text-filter.component';

describe('UploadTextFilterComponent', () => {
  let component: UploadTextFilterComponent;
  let fixture: ComponentFixture<UploadTextFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTextFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTextFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
