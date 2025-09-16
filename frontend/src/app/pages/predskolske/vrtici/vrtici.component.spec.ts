import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrticiComponent } from './vrtici.component';

describe('VrticiComponent', () => {
  let component: VrticiComponent;
  let fixture: ComponentFixture<VrticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrticiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VrticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
