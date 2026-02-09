import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한' },
  { code: 'es', label: 'ES' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('pl-lang', code);
  };

  return (
    <div className="lang-selector">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
