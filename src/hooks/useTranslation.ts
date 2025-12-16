import { useGlobalContext } from '../context/GlobalContext';
import { translations } from '../constants/translations';

export function useTranslation() {
  const { language } = useGlobalContext();
  return translations[language];
}
