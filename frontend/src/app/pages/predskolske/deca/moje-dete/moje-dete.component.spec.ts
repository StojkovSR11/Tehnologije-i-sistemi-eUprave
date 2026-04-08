import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojeDeteComponent } from './moje-dete.component';

describe('MojeDeteComponent', () => {
  let component: MojeDeteComponent;
  let fixture: ComponentFixture<MojeDeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojeDeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MojeDeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
