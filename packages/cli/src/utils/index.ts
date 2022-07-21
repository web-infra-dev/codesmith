import { I18CLILanguageDetector } from '@modern-js/plugin-i18n/language-detector';

export function getLocalLanguage() {
  const detector = new I18CLILanguageDetector();
  return detector.detect();
}
