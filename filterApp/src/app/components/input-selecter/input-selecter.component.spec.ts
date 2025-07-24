import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelecterComponent } from './input-selecter.component';

describe('InputSelecterComponent', () => {
  let component: InputSelecterComponent;
  let fixture: ComponentFixture<InputSelecterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelecterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSelecterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
