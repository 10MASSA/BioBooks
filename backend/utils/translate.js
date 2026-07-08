import translate from 'google-translate-api-x';

export async function translateText(text, targetLang) {
  if (!text || text.trim() === '') return '';
  try {
    // Try batch first, then fallback to single
    const res = await translate(text, { to: targetLang, forceBatch: false });
    return res.text || null;
  } catch (error) {
    // Try with a different tld as fallback
    try {
      const res = await translate(text, { to: targetLang, tld: 'fr', forceBatch: false });
      return res.text || null;
    } catch (fallbackError) {
      console.warn(`Translation to ${targetLang} failed for "${text.substring(0, 30)}...", will use null`);
      return null;
    }
  }
}
