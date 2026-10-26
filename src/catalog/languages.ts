// Font Viewer. Copyright (C) 2026 lvuCodes. Licensed under GPL-3.0-or-later; see LICENSE.

const LABEL_OVERRIDES: Record<string, string> = {
  "latin-ext": "Latin Extended",
  "cyrillic-ext": "Cyrillic Extended",
  "greek-ext": "Greek Extended",
  "chinese-simplified": "Chinese (Simplified)",
  "chinese-traditional": "Chinese (Traditional)",
  "chinese-hongkong": "Chinese (Hong Kong)",
  "kana-extended": "Kana Extended",
  "tamil-supplement": "Tamil Supplement",
  "canadian-aboriginal": "Canadian Aboriginal",
  nko: "N'Ko",
  oriya: "Odia (Oriya)",
  "indic-siyaq-numbers": "Indic Siyaq Numbers",
  "ottoman-siyaq-numbers": "Ottoman Siyaq Numbers",
  "mayan-numerals": "Mayan Numerals",
  symbols2: "Symbols 2",
};

export function labelForSubset(subset: string): string {
  const override = LABEL_OVERRIDES[subset];
  if (override) return override;
  return subset
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Natural sample text per subset; subsets without an entry fall back to the
// Latin sample (or the family name when Latin is not covered by the font).
export const SAMPLE_TEXTS: Record<string, string> = {
  latin:
    "2inc 0xide (ZnO) is a versatIle, wh1te inor9anic powder, frequent7y us3d as a 6road-5pectrum [UV4/UV8] barrier in sunscreen and jacket coatings. Bears in Antarctica do not require jackets, but people in Il1inois might.",
  "latin-ext":
    "2inc 0xide (ZnO) is a versatIle, wh1te inor9anic powder, frequent7y us3d as a 6road-5pectrum [UV4/UV8] barrier in sunscreen and jacket coatings. Bears in Antarctica do not require jackets, but people in Il1inois might.",
  vietnamese:
    "Lúc 5 giờ 30 sáng, mặt trời chiếu những tia nắng ấm áp xuống dòng sông quê hương, nơi đàn cò trắng lượn quanh bãi cỏ xanh mướt.",
  japanese:
    "いろはにほへと ちりぬるを わかよたれそ つねならむ うゐのおくやま けふこえて あさきゆめみし ゑひもせす。京の街角でコーヒーを一杯。 0123456789",
  korean:
    "키스의 고유 조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다. 다람쥐 헌 쳇바퀴에 타고파. 0123456789",
  "chinese-traditional":
    "天地玄黃 宇宙洪荒 日月盈昃 辰宿列張 寒來暑往 秋收冬藏 閏餘成歲 律呂調陽 雲騰致雨 露結為霜 0123456789",
  "chinese-hongkong":
    "天地玄黃 宇宙洪荒 日月盈昃 辰宿列張 寒來暑往 秋收冬藏 閏餘成歲 律呂調陽 雲騰致雨 露結為霜 0123456789",
  "chinese-simplified":
    "天地玄黄 宇宙洪荒 日月盈昃 辰宿列张 寒来暑往 秋收冬藏 闰余成岁 律吕调阳 云腾致雨 露结为霜 0123456789",
  cyrillic: "Съешь же ещё этих мягких французских булок, да выпей чаю. 0123456789",
  "cyrillic-ext": "Съешь же ещё этих мягких французских булок, да выпей чаю. 0123456789",
  greek: "Θέλει αρετή και τόλμη η ελευθερία. Ξεσκεπάζω την ψυχοφθόρα βδελυγμία. 0123456789",
  "greek-ext": "Θέλει αρετή και τόλμη η ελευθερία. Ξεσκεπάζω την ψυχοφθόρα βδελυγμία. 0123456789",
  arabic: "نص حكيم له سر قاطع وذو شأن عظيم مكتوب على ثوب أخضر ومغلف بجلد أزرق. 0123456789",
  hebrew: "דג סקרן שט בים מאוכזב ולפתע מצא חברה. 0123456789",
  devanagari:
    "ऋषियों को सताने वाले दुष्ट राक्षसों के राजा रावण का सर्वनाश करने वाले भगवान श्रीराम। 0123456789",
  thai: "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน 0123456789",
  bengali: "আমি বাংলায় গান গাই, আমি বাংলার গান গাই। 0123456789",
  tamil: "நிலத்தில் வாழும் உயிர்களுக்கு நீர் இன்றி அமையாது. 0123456789",
  telugu: "తెలుగు భాష తీయదనం తెలుసుకున్నవారికే తెలుసు. 0123456789",
  kannada: "ಬೆಳಗಾಗ ನಾನೆದ್ದು ಯಾರ್ಯಾರ ನೆನೆಯಾಲಿ. 0123456789",
  malayalam: "അജവും ആനയും ഐരാവതവും ഗരുഡനും കഠോര സ്വരം പൊഴിക്കെ. 0123456789",
  gujarati: "ગુજરાતી ભાષા ગુજરાત રાજ્યની મુખ્ય ભાષા છે. 0123456789",
  gurmukhi: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਪੰਜਾਬ ਦੀ ਮੁੱਖ ਭਾਸ਼ਾ ਹੈ। 0123456789",
  oriya: "ଓଡ଼ିଆ ଭାଷା ଓଡ଼ିଶାର ମୁଖ୍ୟ ଭାଷା ଅଟେ। 0123456789",
  sinhala: "සිංහල භාෂාව ශ්‍රී ලංකාවේ ප්‍රධාන භාෂාවයි. 0123456789",
  khmer: "ភាសាខ្មែរជាភាសាផ្លូវការនៃប្រទេសកម្ពុជា។ 0123456789",
  lao: "ພາສາລາວເປັນພາສາທາງການຂອງປະເທດລາວ. 0123456789",
  myanmar: "မြန်မာဘာသာသည် မြန်မာနိုင်ငံ၏ ရုံးသုံးဘာသာစကားဖြစ်သည်။ 0123456789",
  ethiopic: "ሰላም ለዓለም ሁሉ ይሁን። 0123456789",
  armenian: "Բել դղյակի ձախ ժամն օֆ ազգությանը ցպահանջ չճշտած վնաս էր և փառք։ 0123456789",
  georgian: "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ. 0123456789",
};

export function sampleForFamily(subsets: string[], language: string): string | null {
  if (language && SAMPLE_TEXTS[language] && subsets.includes(language)) {
    return SAMPLE_TEXTS[language];
  }
  for (const subset of subsets) {
    const sample = SAMPLE_TEXTS[subset];
    if (sample) return sample;
  }
  return null;
}
