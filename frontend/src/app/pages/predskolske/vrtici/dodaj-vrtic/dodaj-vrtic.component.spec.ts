import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajVrticComponent } from './dodaj-vrtic.component';

describe('DodajVrticComponent', () => {
  let component: DodajVrticComponent;
  let fixture: ComponentFixture<DodajVrticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajVrticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DodajVrticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
