import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicContentPage } from './dynamic-content.page';

describe('DynamicContentPage', () => {
  let component: DynamicContentPage;
  let fixture: ComponentFixture<DynamicContentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DynamicContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
