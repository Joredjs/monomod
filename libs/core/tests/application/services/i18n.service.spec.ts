import { ServiceI18n } from '@monomod/core/application';
import { EMessageGroup, EMessageType, TRANSLATIONS } from '@monomod/core/domain';

describe('ServiceI18n', () => {
  let service: ServiceI18n;

  beforeEach(() => {
    // Reset service before each test
    service = new ServiceI18n();
  });

  describe('getText', () => {
    it('should return correct translation for existing key', () => {
      const textInfo = {
        group: EMessageGroup.SERVER,
        key: 'listen',
        params: ['TestApp', '3000'],
        type: EMessageType.INFO
      };

      const result = service.getText(textInfo);
      expect(result).toContain('TestApp');
      expect(result).toContain('3000');
    });

    it('should return default message for non-existing key', () => {
      const textInfo = {
        group: EMessageGroup.SERVER,
        key: 'non-existing',
        params: [],
        type: EMessageType.INFO
      };

      const result = service.getText(textInfo);
      expect(result).toContain('default');
    });

    it('should handle missing parameters', () => {
      const textInfo = {
        group: EMessageGroup.SERVER,
        key: 'listen',
        params: [],
        type: EMessageType.INFO
      };

      const result = service.getText(textInfo);
      expect(result).toContain('$1');
    });

    it('should use template parameters correctly', () => {
      const textInfo = {
        group: EMessageGroup.SERVER,
        key: 'create',
        params: ['test error'],
        type: EMessageType.ERROR
      };

      const result = service.getText(textInfo);
      expect(result).toContain('test error');
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return default language when no language is set', () => {
      const language = service.getCurrentLanguage();
      expect(language).toBe('en');
    });

    it('should return set language', () => {
      service.setLanguage('es');
      const language = service.getCurrentLanguage();
      expect(language).toBe('es');
    });
  });

  describe('setLanguage', () => {
    it('should set valid language', () => {
      service.setLanguage('es');
      expect(service.getCurrentLanguage()).toBe('es');
    });

    it('should fallback to default language for invalid language', () => {
      service.setLanguage('invalid' as any);
      expect(service.getCurrentLanguage()).toBe('en');
    });
  });

  describe('translation caching', () => {
    it('should cache translations', () => {
      const textInfo = {
        group: EMessageGroup.SERVER,
        key: 'listen',
        params: ['TestApp', '3000'],
        type: EMessageType.INFO
      };

      // Primera llamada - debería almacenarse en caché
      const firstResult = service.getText(textInfo);

      // Modificamos las traducciones (simulando un cambio que no debería afectar debido al caché)
      const originalTranslations = { ...TRANSLATIONS };
      (TRANSLATIONS as any)[EMessageGroup.SERVER][EMessageType.INFO].listen.en = 'Modified translation';

      // Segunda llamada - debería venir del caché
      const secondResult = service.getText(textInfo);

      // Restauramos las traducciones
      Object.assign(TRANSLATIONS, originalTranslations);

      expect(firstResult).toBe(secondResult);
    });
  });
});
