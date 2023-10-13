import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayFieldComponent } from './play-field.component';
import { PlayCellComponent  } from '../play-cell/play-cell.component';

describe('PlayFieldComponent', () => {
  let component: PlayFieldComponent;
  let fixture: ComponentFixture<PlayFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayFieldComponent]
    });
    fixture = TestBed.createComponent(PlayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
