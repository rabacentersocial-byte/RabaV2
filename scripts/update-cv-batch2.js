import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawPrompt = `
#مصطفى محمود
أخصائي ABA 
•  حاصل علي درجة الـ ليسانس من جامعة أسيوط
•  حاصل علي اعتماد ABAT من البورد الأمريكي كفني تحليل سلوم تطبيقي 
•  حاصل على اعتماد QASP-S  كمشرف خدمات توحد معتمد من البورد الأمريكي 
•  حاصل على  VB-MAPP برنامج تقييم معالم تطور السلوك اللفظي
•  خبرة عملية أكثر من ٤ سنوات

# مرام محمد
أخصائية ABA
•  حاصلة على بكالوريوس علم النفس الإكلينيكي من جامعة الرباط الوطني 
•  حاصلة على دورة في الاستشارة النفسية
•  حاصلة على دورة في اعداد العلاج النفسي 
•  حاصلة على دورة في العلاج السلوكي المعرفي 
•  حاصلة على شهادة البورد الاميريكي ABAT
•  خبرة عملية أكثر من ٣ سنوات

#ضحى خالد 
رئيس قسم الـ ABA بنادي رابا
•  حاصلة على بكالوريوس التربية خاصة من الجامعه العربيه المفتوحة
•  حاصلة على اعتماد فني سلوك RBT من منظمة BCAB
•  حاصلة على اعتماد مشرف توحد QASP-S من منظمة QABA
•  حاصلة على اعتماد محلل سلوك دولي IBA من منظمة IBAO
•  حاصلة على شهادة التعامل مع البالغين من منظمة IBAO
•  خبرة عمليه أكثر من ١٠ سنوات

# عبدالاله شقل
 أخصائي العلاج الوظيفي
•  حاصل على بكالوريوس العلاج الوظيفي 
من جامعة الملك سعود بن عبدالعزيز للعلوم الصحية
•  حاصل على شهادة Floortime 101   
•  حاصل على ترخيص الهيئة السعودية للتخصصات الصحية 
•  متخصص في علاج المشاكل الحسية والتحديات النمائية لدى الاطفال ومشاكل الاكل
•  خبرة عملية أكثر من ٣ سنوات

# هشام علي
رئيس قسم النطق والتخاطب
•  حاصل على بكالوريوس التربيه الخاصه من جامعة عين شمس
•  حاصل على تمهيدي ماجستير في إضطرابات النطق والكلام من جامعة عين شمس
•  خبرة أكثر ٢٠ سنه

# علاء الدين ناجى
أخصائي ABA
•  حاصل على ليسانس آداب وتربية قسم تربية خاصة من جامعة العريش
•  حاصل على دبلومة مهنية في التربية الخاصة من جامعة العريش
•  حاصل على إعتماد البورد الأميريكي ABAT 
•  خبرة عملية أكثر من ٨ سنوات

#عامر قادوس
أخصائي التأهيل العصبي
•  حاصل على ليسانس علم النفس من جامعة دمشق
•  باحث ماجستير  متقدم في علم النفس العصبي  
•  حاصل على إعتماد محلل سلوك  دولي IBA من منظمة IBAO
•  حاصل على البورد الدولي بالعلاجات النفسيه ACT - CBT - DBT من جامعة NEVADA
•  حاصل على البورد  البريطاني في اجراء مقاييس  الذكاء والقدرات العقلية 
•  مقدم دورات ABA معتمد 
•  مقدم دورات وساعات تعلم مستمر CME معتمد في SCFHS
•  خبرة عملية أكثر من ١٠ سنوات في مراكز بفرنسا وبريطانيا


# منار وهبة 
مشرفة قسم النطق والتخاطب
•  حاصلة على درجة البكالوريوس من جامعة القاهرة
•  حاصلة على دبلومة التخاطب من جامعة عين شمس
•  حاصلة على دبلومة في التربية الخاصة 
تخصص علوم إعاقة من جامعة الزقازيق 
•  حاصلة على شهادة الـ OPT من منظمة ASHA الأميرية 
•  متخصصة في العلاج بالـ OPT ومشاكل النطق والسمع 
•  خبرة عملية أكثر من ١٠ سنوات

# د.تسنيم صبري
مشرفة قسم الـ ABA
•  حاصلة على بكالوريوس التربية الخاصة والتربية من جامعة قناة السويس 
•  حاصلة على الماجستير المهني من جامعة القاهرة
•  حاصلة على الدكتوراه المهني من جامعة القاهرة  
•  حاصلة على دبلوم التوحد وإضطرابات النطق من الجامعه الامريكية 
•  حاصلة على دبلوم صعوبات التعلم والعلاج الوظيفي ومهارات النمو من الجامعة الأميريكية
•  حاصلة على إعتماد فني تحليل السلوك التطبيقي من البورد الأمريكي QABA 
•  خبرة عملية أكثر من ٨ سنوات

# اثير ال رشيد 
أخصائية ABA
•  حاصلة على بكالوريوس علم النفس من جامعة الإمام  محمد بن سعود الاسلامية
•  حاصلة على تصنيف هيئة التخصصات الصحيه 
•  البورد الامريكي QABA (ABAT)
•  حاصلة على دورة (الحماية من التحرش للافراد ذوي التوحد) من جمعية السعوديه الخيريه للتوحد
•  حاصلة على دورة فعالية العلاج الطبي ومدى تاثيره على ذوي إضطرابات طيف التوحد
•  خبرة عملية أكثر من ٣ سنوات

# سعد الدوسري
أخصائي ABA
•  حاصل على بكالوريوس علم النفس من جامعة الإمام محمد بن سعود الاسلامية
•  حاصل على رخصة الهيئة السعودية للتخصصات الصحية
•  حاصل على رخصة ABAT من البورد الامريكي QABA
•خبرة عملية أكثر من سنة

# ميار السعيد
أخصائية النطق والتخاطب
•  حاصلة على بكالوريوس التربية الخاصة تخصص إعاقة عقلية من جامعة الإمام محمد بن سعود 
•  حاصلة على دوره نطق وتخاطب ٧٠ ساعه من أكادمية علم النفس تحت اشراف وزاره التعليم 
•  خبرة عملية أكثر من ٧ سنوات
`;

function parseArabicNumber(str) {
  const arabicDigits = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  let s = str;
  arabicDigits.forEach((d, idx) => {
    s = s.replaceAll(d, idx.toString());
  });
  if (s.includes("سنتين")) return 2;
  if (s.includes("سنة") || s.includes("عام") || s.includes("سنه") || s.includes("س")) {
    const m = s.match(/(\d+)/);
    if (m) return parseInt(m[1], 10);
    return 1;
  }
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 5;
}

function clean(n) {
  return n.replace(/^(د[\/\.]|أ[\/\.]|دكتور|أخصائي|أستاذ)\s*/, "")
          .replace(/[أإآ]/g, "ا")
          .replace(/ة/g, "ه")
          .replace(/ى/g, "ي")
          .replace(/عبد\s+/g, "عبد")
          .replace(/ابو\s+/g, "ابو")
          .replace(/\s+/g, " ")
          .trim();
}

// Parse blocks
const blocks = rawPrompt.split(/\n#\s*/).filter(b => b.trim().length > 0);
const parsedData = [];

for (const block of blocks) {
  const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) continue;
  
  let rawHeader = lines[0].replace(/^#\s*/, "").trim();
  let title = "";
  let bullets = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("-") || line.startsWith("•") || line.startsWith("*")) {
      bullets.push(line.replace(/^[-•*]\s*/, "").trim());
    } else if (!title && !line.startsWith("حاصل") && !line.startsWith("خبرة") && !line.startsWith("فني") && !line.startsWith("متخصص") && !line.startsWith("مرخص") && !line.startsWith("عضو") && !line.startsWith("ممارس") && !line.startsWith("باحث") && !line.startsWith("مقدم") && !line.startsWith("البورد")) {
      title = line;
    } else {
      bullets.push(line.replace(/^[-•*]\s*/, "").trim());
    }
  }

  // Find experience years
  let expYears = 5;
  const expBullet = bullets.find(b => b.includes("خبرة") || b.includes("خبره"));
  if (expBullet) {
    expYears = parseArabicNumber(expBullet);
  }

  // Filter education vs certifications
  const eduKeywords = ["بكالوريوس", "ليسانس", "ماجستير", "دكتوراه", "دبلوم", "دبلومة", "دراسات عليا", "جامعة", "كلية", "معهد"];
  const education = bullets.filter(b => eduKeywords.some(kw => b.includes(kw)));
  const certifications = bullets.filter(b => !eduKeywords.some(kw => b.includes(kw)) && !b.includes("خبرة") && !b.includes("خبره"));

  // Bio strictly from user bullets
  let bio = `${title || 'أخصائي معتمد'} بمركز رابا. ${bullets.join(' · ')}`;

  parsedData.push({
    rawHeader,
    cleanName: clean(rawHeader),
    title,
    bullets,
    expYears,
    education: education.length > 0 ? education : bullets.slice(0, 2),
    certifications: certifications.length > 0 ? certifications : bullets.slice(1, 4),
    bio
  });
}

console.log(`Parsed ${parsedData.length} specialists from batch 2.`);

// Specific manual mappings if needed
const manualMap = {
  "اثير ال رشيد": "اثير آل رشيد",
  "علاء الدين ناجي": "علاء الدين ناجي",
  "هشام علي": "د.هشام علي"
};

// 1. Update data/specialists.json
const specsPath = path.join(rootDir, 'data', 'specialists.json');
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));

let updatedCount = 0;
for (const p of parsedData) {
  let target = specs.find(s => clean(s.name) === p.cleanName);
  if (!target && manualMap[p.cleanName]) {
    target = specs.find(s => s.name === manualMap[p.cleanName]);
  }
  if (!target) {
    target = specs.find(s => clean(s.name).includes(p.cleanName) || p.cleanName.includes(clean(s.name)));
  }

  if (target) {
    if (p.title) {
      target.title = p.title;
      target.role = p.title;
    }
    target.experienceYears = p.expYears;
    target.specialties = p.bullets;
    target.education = p.education;
    target.certifications = p.certifications;
    target.bio = p.bio;
    updatedCount++;
    console.log(`Updated specialist in specialists.json: ${target.name} (${target.id})`);
  } else {
    console.warn(`Target not found in specialists.json: ${p.rawHeader}`);
  }
}

fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2), 'utf8');
console.log(`Updated ${updatedCount} specialists in data/specialists.json`);

// 2. Update src/data/mockData.ts
const mockDataPath = path.join(rootDir, 'src', 'data', 'mockData.ts');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

const specialistsRegex = /export const SPECIALISTS: Specialist\[\] = \[[\s\S]*?\n\];/;
const newSpecialistsString = `export const SPECIALISTS: Specialist[] = ${JSON.stringify(specs, null, 2)};`;
mockDataContent = mockDataContent.replace(specialistsRegex, newSpecialistsString);
fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
console.log(`Updated SPECIALISTS in src/data/mockData.ts`);

// 3. Update src/components/DoctorCardSlider.tsx DOCTORS_DATA
const doctorSliderPath = path.join(rootDir, 'src', 'components', 'DoctorCardSlider.tsx');
let sliderContent = fs.readFileSync(doctorSliderPath, 'utf8');

const doctorsMatch = sliderContent.match(/export const DOCTORS_DATA: Doctor\[\] = (\[[\s\S]*?\n\];)/);
if (doctorsMatch) {
  let doctorsArray = eval(doctorsMatch[1]);
  let updatedDoctorsCount = 0;

  for (const p of parsedData) {
    let target = doctorsArray.find(d => clean(d.name) === p.cleanName);
    if (!target && manualMap[p.cleanName]) {
      target = doctorsArray.find(d => d.name === manualMap[p.cleanName]);
    }
    if (!target) {
      target = doctorsArray.find(d => clean(d.name).includes(p.cleanName) || p.cleanName.includes(clean(d.name)));
    }

    if (target) {
      if (p.title) {
        target.title = p.title;
        target.specialty = p.title;
      }
      target.experienceYears = p.expYears;
      target.tags = p.bullets;
      target.bio = p.bio;
      updatedDoctorsCount++;
      console.log(`Updated doctor in DOCTORS_DATA: ${target.name} (${target.id})`);
    } else {
      console.warn(`Doctor not found in DOCTORS_DATA: ${p.rawHeader}`);
    }
  }

  const newDoctorsString = `export const DOCTORS_DATA: Doctor[] = ${JSON.stringify(doctorsArray, null, 2)};`;
  sliderContent = sliderContent.replace(/export const DOCTORS_DATA: Doctor\[\] = \[[\s\S]*?\n\];/, newDoctorsString);
  fs.writeFileSync(doctorSliderPath, sliderContent, 'utf8');
  console.log(`Updated ${updatedDoctorsCount} doctors in src/components/DoctorCardSlider.tsx`);
}

console.log("All batch 2 specialist CV updates finished successfully.");
