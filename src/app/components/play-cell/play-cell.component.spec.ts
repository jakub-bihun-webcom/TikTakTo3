import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayCellComponent } from './play-cell.component';

describe('PlayCellComponent', () => {
  let component: PlayCellComponent;
  let fixture: ComponentFixture<PlayCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayCellComponent]
    });
    fixture = TestBed.createComponent(PlayCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
