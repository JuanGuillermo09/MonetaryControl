import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTitleHelpLink } from './custom-title-help-link';

describe('CustomTitleHelpLink', () => {
  let component: CustomTitleHelpLink;
  let fixture: ComponentFixture<CustomTitleHelpLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTitleHelpLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTitleHelpLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
