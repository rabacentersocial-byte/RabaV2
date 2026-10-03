/**
 * Canonical Specialist Photos & Card Assets for Raba Day Care Center
 * 
 * All 40 specialists have permanent, high-resolution photo assets stored directly
 * in the codebase repository under /specialists/cards/ and mirrored in /uploads/.
 */

export interface SpecialistPhotoInfo {
  id: string;
  name: string;
  cardImage: string;
  avatar: string;
}

export const SPECIALIST_PHOTOS_MANIFEST: SpecialistPhotoInfo[] = [
  { id: 'spec-haneen-obaidi', name: 'حنين العبيدي', cardImage: '/specialists/cards/spec_01_haneen-obaidi.jpg', avatar: '/uploads/1790357520279_________________jpg_jpeg.jpg' },
  { id: 'spec-rahaf-doghmani', name: 'رهف الدغماني', cardImage: '/specialists/cards/spec_02_rahaf-doghmani.jpg', avatar: '/uploads/1790357530423_________________jpg_jpeg.jpg' },
  { id: 'spec-doha-khaled', name: 'ضحى خالد', cardImage: '/specialists/cards/spec_03_doha-khaled.jpg', avatar: '/uploads/1790357539758_____________jpg_jpeg.jpg' },
  { id: 'spec-manar-wahba', name: 'منار وهبه', cardImage: '/specialists/cards/spec_04_manar-wahba.jpg', avatar: '/uploads/1790357549806______________jpg_jpeg.jpg' },
  { id: 'spec-ahmed-fathi', name: 'أحمد فتحي', cardImage: '/specialists/cards/spec_05_ahmed-fathi.jpg', avatar: '/uploads/1790357579245_______________jpg_jpeg.jpg' },
  { id: 'spec-mohamed-atef', name: 'محمد عاطف', cardImage: '/specialists/cards/spec_06_mohamed-atef.jpg', avatar: '/uploads/1790357588113______________jpg_jpeg.jpg' },
  { id: 'spec-sadeem-mshari', name: 'سديم احمد المشاري', cardImage: '/specialists/cards/spec_07_sadeem-mshari.jpg', avatar: '/uploads/1790357598308______________________jpg_jpeg.jpg' },
  { id: 'spec-maram-mohamed', name: 'مرام محمد', cardImage: '/specialists/cards/spec_08_maram-mohamed.jpg', avatar: '/uploads/1790357606704______________jpg_jpeg.jpg' },
  { id: 'spec-ahmed-raad', name: 'أحمد رعد', cardImage: '/specialists/cards/spec_09_ahmed-raad.jpg', avatar: '/uploads/1790357615959______________jpg_jpeg.jpg' },
  { id: 'spec-1', name: 'احمد أبو زيد أنور', cardImage: '/specialists/cards/spec_10_1.png', avatar: '/uploads/1790826219680_16_png.png' },
  { id: 'spec-mohamed-saad', name: 'محمد سعد', cardImage: '/specialists/cards/spec_11_mohamed-saad.png', avatar: '/uploads/1790826142955_1_png.png' },
  { id: 'spec-alzahraa-farag', name: 'الزهراء فرج', cardImage: '/specialists/cards/spec_12_alzahraa-farag.png', avatar: '/uploads/1790826125079_2_png.png' },
  { id: 'spec-noura-elbasyouni', name: 'د/ نورا البسيوني', cardImage: '/specialists/cards/spec_13_noura-elbasyouni.png', avatar: '/uploads/1790826321411_3_png.png' },
  { id: 'spec-asmaa-moustafa', name: 'أسماء مصطفى', cardImage: '/specialists/cards/spec_14_asmaa-moustafa.png', avatar: '/uploads/1790826279297_4_png.png' },
  { id: 'spec-ayman-elhoweity', name: 'أيمن عطية الحويطي', cardImage: '/specialists/cards/spec_15_ayman-elhoweity.png', avatar: '/uploads/1790826241596_5_png.png' },
  { id: 'spec-mohamed-bakry', name: 'محمد بكري', cardImage: '/specialists/cards/spec_16_mohamed-bakry.png', avatar: '/uploads/1790826439548_6_png.png' },
  { id: 'spec-anwar-elmaghyouli', name: 'أنوار المغيولي', cardImage: '/specialists/cards/spec_17_anwar-elmaghyouli.png', avatar: '/uploads/1790826509139_7_png.png' },
  { id: 'spec-mohamed-abdelhamid', name: 'محمد عبد الحميد', cardImage: '/specialists/cards/spec_18_mohamed-abdelhamid.png', avatar: '/uploads/1790826577879_9_png.png' },
  { id: 'spec-mohamed-elgayyar', name: 'محمد الجيار', cardImage: '/specialists/cards/spec_19_mohamed-elgayyar.png', avatar: '/uploads/1790826687565_10_png.png' },
  { id: 'spec-elsaeed-diab', name: 'السعيد دياب', cardImage: '/specialists/cards/spec_20_elsaeed-diab.png', avatar: '/uploads/1790826711609_11_png.png' },
  { id: 'spec-sara-abdelhamid', name: 'يارا  أبو حمده', cardImage: '/specialists/cards/spec_21_sara-abdelhamid.png', avatar: '/uploads/1790827397368_38_png.png' },
  { id: 'spec-hanaa-basheer', name: 'هناء بشير', cardImage: '/specialists/cards/spec_22_hanaa-basheer.png', avatar: '/uploads/1790827426491_50_png.png' },
  { id: 'spec-bayan-alnajem', name: 'بيان الناجم', cardImage: '/specialists/cards/spec_23_bayan-alnajem.png', avatar: '/uploads/1790863548373_12_png.png' },
  { id: 'spec-manar-obeid', name: 'منار عبيد', cardImage: '/specialists/cards/spec_24_manar-obeid.png', avatar: '/uploads/1790865956621_13_png.png' },
  { id: 'spec-salma-abouelfadl', name: 'سلمى أبو الفضل', cardImage: '/specialists/cards/spec_25_salma-abouelfadl.png', avatar: '/uploads/1790865973849_14_png.png' },
  { id: 'spec-ahmed-sayed', name: 'أحمد سيد', cardImage: '/specialists/cards/spec_26_ahmed-sayed.png', avatar: '/uploads/1790865993782_15_png.png' },
  { id: 'spec-heshmah-mutairi', name: 'حشمة المطيري', cardImage: '/specialists/cards/spec_27_heshmah-mutairi.png', avatar: '/uploads/1790866017691_17_png.png' },
  { id: 'spec-aseel-yousef', name: 'أسيل يوسف', cardImage: '/specialists/cards/spec_28_aseel-yousef.png', avatar: '/uploads/1790866040732_19_png.png' },
  { id: 'spec-mohammed-shehri-clinical', name: 'محمد الشهري', cardImage: '/specialists/cards/spec_29_mohammed-shehri-clinical.png', avatar: '/uploads/1790866057132_21_png.png' },
  { id: 'spec-saad-dosari', name: 'سعد الدوسري', cardImage: '/specialists/cards/spec_30_saad-dosari.png', avatar: '/uploads/1790866075647_22_png.png' },
  { id: 'spec-fahad-juhani', name: 'فهد الجهني', cardImage: '/specialists/cards/spec_31_fahad-juhani.png', avatar: '/uploads/1790866092167_23_png.png' },
  { id: 'spec-hala-enazi', name: 'هلا العنزي', cardImage: '/specialists/cards/spec_32_hala-enazi.png', avatar: '/uploads/1790866107078_24_png.png' },
  { id: 'spec-taif-subaie', name: 'طيف السبيعي', cardImage: '/specialists/cards/spec_33_taif-subaie.png', avatar: '/uploads/1790866122845_25_png.png' },
  { id: 'spec-raghad-hawarneh', name: 'رغد حوارنه', cardImage: '/specialists/cards/spec_34_raghad-hawarneh.png', avatar: '/uploads/1790866151823_26_png.png' },
  { id: 'spec-eman-bahattab', name: 'إيمان باحطاب', cardImage: '/specialists/cards/spec_35_eman-bahattab.png', avatar: '/uploads/1790866167869_27_png.png' },
  { id: 'spec-omar-saad-speech', name: 'عمر سعد', cardImage: '/specialists/cards/spec_36_omar-saad-speech.png', avatar: '/uploads/1790866182582_28_png.png' },
  { id: 'spec-aliah-mutairi', name: 'عاليه المطيري', cardImage: '/specialists/cards/spec_37_aliah-mutairi.png', avatar: '/uploads/1790866202949_29_png.png' },
  { id: 'spec-haya-faleh', name: 'هياء الفالح', cardImage: '/specialists/cards/spec_38_haya-faleh.png', avatar: '/uploads/1790866269363_30_png.png' },
  { id: 'spec-haya-dosari', name: 'هياء الدوسري', cardImage: '/specialists/cards/spec_39_haya-dosari.png', avatar: '/uploads/1790866288993_31_png.png' },
  { id: 'spec-renad-otaibi', name: 'ريناد العتيبي', cardImage: '/specialists/cards/spec_40_renad-otaibi.png', avatar: '/uploads/1790866298707_32_png.png' }
];

export function getSpecialistCardImage(idOrName: string): string | null {
  const clean = idOrName.trim().replace(/^doc-/, 'spec-');
  const found = SPECIALIST_PHOTOS_MANIFEST.find(
    s => s.id === clean || s.name === idOrName.trim()
  );
  return found ? found.cardImage : null;
}
