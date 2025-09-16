import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecaComponent } from './deca.component';

describe('DecaComponent', () => {
  let component: DecaComponent;
  let fixture: ComponentFixture<DecaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
