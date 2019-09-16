import { ReviewformModule } from './reviewform.module';

describe('ReviewformModule', () => {
  let reviewformModule: ReviewformModule;

  beforeEach(() => {
    reviewformModule = new ReviewformModule();
  });

  it('should create an instance', () => {
    expect(reviewformModule).toBeTruthy();
  });
});
