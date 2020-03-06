import { DesignPageModule } from './design-page.module';

describe('DesignPageModule', () => {
  let designPageModule: DesignPageModule;

  beforeEach(() => {
    designPageModule = new DesignPageModule();
  });

  it('should create an instance', () => {
    expect(designPageModule).toBeTruthy();
  });
});
