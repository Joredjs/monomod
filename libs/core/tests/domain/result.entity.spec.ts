import { Result } from '@monomod/core/domain';

describe('Result', () => {
  describe('resOk', () => {
    it('should create successful result', () => {
      const value = 'test';
      const result = Result.resOk(value);

      expect(result.type).toBe('ok');
      expect(result.value).toBe(value);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });

    it('should unwrap successful result', () => {
      const value = 'test';
      const result = Result.resOk(value);

      expect(result.unwrap()).toBe(value);
    });
  });

  describe('resErr', () => {
    it('should create error result', () => {
      const error = new Error('test error');
      const result = Result.resErr(error);

      expect(result.type).toBe('error');
      expect(result.value).toBe(error);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
    });

    it('should unwrap error result', () => {
      const error = new Error('test error');
      const result = Result.resErr(error);

      expect(result.unwrap()).toBe(error);
    });
  });
});
