import { useTranslation } from 'react-i18next';
import './AboutPage.css';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <h2 className="section-title">{t('about.title')}</h2>
      <div className="card about-content">
        <h3>{t('about.siteTitle')}</h3>
        <p>{t('about.description')}</p>

        <h4>{t('about.dataSources')}</h4>
        <ul>
          <li><strong>{t('about.apiFootball')}</strong> - {t('about.apiFootballDesc')}</li>
          <li><strong>{t('about.openWeatherMap')}</strong> - {t('about.openWeatherMapDesc')}</li>
        </ul>

        <h4>{t('about.seasonInfo')}</h4>
        <ul>
          <li>{t('about.season34th')}</li>
          <li>{t('about.promoted')}</li>
          <li>{t('about.relegated')}</li>
        </ul>

        <h4>{t('about.keyStorylines')}</h4>
        <ul>
          <li>{t('about.story1')}</li>
          <li>{t('about.story2')}</li>
          <li>{t('about.story3')}</li>
          <li>{t('about.story4')}</li>
          <li>{t('about.story5')}</li>
          <li>{t('about.story6')}</li>
        </ul>
      </div>
    </div>
  );
}
