import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajDeteComponent } from './dodaj-dete.component';

describe('DodajDeteComponent', () => {
  let component: DodajDeteComponent;
  let fixture: ComponentFixture<DodajDeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajDeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DodajDeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
