import { describe, expect, it } from 'vitest';
import { languages, resolveLanguage, translations } from '../src/i18n.js';

describe('translations', () => {
  it('ships all eight requested languages', () => {
    expect(languages.map(([code]) => code)).toEqual(['en', 'de', 'fr', 'ru', 'es', 'pt', 'zh', 'tr']);
  });

  it('contains every English key in every language', () => {
    const required = Object.keys(translations.en);
    for (const [code] of languages) {
      expect(Object.keys(translations[code])).toEqual(expect.arrayContaining(required));
      expect(required.every((key) => String(translations[code][key]).length > 0)).toBe(true);
    }
  });

  it('resolves regional locales and falls back to English', () => {
    expect(resolveLanguage('pt-BR')).toBe('pt');
    expect(resolveLanguage('zh-CN')).toBe('zh');
    expect(resolveLanguage('ja-JP')).toBe('en');
  });
});
