import { OtFormMoudle } from './ot-form-moudle.module';

describe('OtFormMoudleModule', () => {
  let otFormMoudleModule: OtFormMoudle;

  beforeEach(() => {
    otFormMoudleModule = new OtFormMoudle();
  });

  it('should create an instance', () => {
    expect(otFormMoudleModule).toBeTruthy();
  });
});
