import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrigAdderComponent } from './trig-adder.component';

describe('TrigAdderComponent', () => {
  let component: TrigAdderComponent;
  let fixture: ComponentFixture<TrigAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrigAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrigAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
