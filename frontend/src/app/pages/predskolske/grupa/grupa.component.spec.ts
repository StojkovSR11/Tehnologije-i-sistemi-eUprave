import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupaComponent } from './grupa.component';

describe('GrupaComponent', () => {
  let component: GrupaComponent;
  let fixture: ComponentFixture<GrupaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrupaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
