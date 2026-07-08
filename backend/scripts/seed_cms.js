import pool from '../config/db.js';

async function seed() {
  try {
    console.log('Starting CMS seeding...');

    // 1. Seed site_texts
    console.log('Seeding site_texts...');
    const texts = [
      {
        key: 'hero.badge',
        fr: 'Pack promo : les deux livres ensemble avec économie',
        en: 'Promo pack: both books together with savings',
        ar: 'عرض الحزمة: الكتابان معاً بتوفير'
      },
      {
        key: 'hero.bonus',
        fr: 'Pack bonus : les deux livres + support pratique + livraison rapide',
        en: 'Bonus pack: both books + practical support + fast delivery',
        ar: 'حزمة المكافأة: الكتابين + الدعم العملي + التوصيل السريع'
      },
      {
        key: 'hero.bonusDescription',
        fr: 'Bénéficiez d’un guide complet, d’une remise attractive et d’une commande facile avec livraison à domicile.',
        en: 'Enjoy a complete guide, an attractive discount, and easy ordering with home delivery.',
        ar: 'استفد من دليل كامل، وخصم مغرٍ، وطلب سهل مع التوصيل إلى غاية المنزل.'
      },
      {
        key: 'description.title',
        fr: 'Contenu des livres',
        en: 'Book contents',
        ar: 'محتوى الكتب'
      },
      {
        key: 'description.subtitle',
        fr: 'Deux ouvrages complets pour maîtriser et savoir tous sur les prélèvements sanguins et techniques de dosage des analyses biochimiques, hématologiques et sérologiques — 100 % pratique — et matériel et outils utilisés dans les laboratoires d\'analyse médicale',
        en: 'Two comprehensive books to master and know everything about blood sampling, biochemical, haematological and serological analysis techniques — 100% practical — and materials and tools used in medical analysis laboratories',
        ar: 'كتابان شاملان لإتقان تقنيات سحب الدم والتحاليل الكيميائية الحيوية والدموية والمصلية — 100% تطبيقي — والمعدات والأدوات المستخدمة في مختبرات التحليل الطبي'
      },
      {
        key: 'description.promo',
        fr: 'Ne vous contentez pas de la théorie, passez à la pratique ! Les Séries Akou sont votre référence pour maîtriser les analyses médicales, le prélèvement sanguin et le matériel de labo. Boostez vos compétences et gagnez en expérience !',
        en: 'Don\'t just stick to theory, put it into practice! The Akou Series is your reference to master medical analyses, blood sampling, and laboratory equipment. Boost your skills and gain experience now!',
        ar: 'لا تكتف بالنظرية.. تعلّم التطبيق! سلسلة عكو للأستاذ محمود عكو هي رفيقك لاحتراف التحاليل الطبية، تقنيات سحب الدم، وفهم كل الوسائل المخبرية. استثمر في مهاراتك واكتسب الخبرة الآن!'
      },
      {
        key: 'showcase.title',
        fr: 'Aperçu des Livres',
        en: 'Books Preview',
        ar: 'معاينة الكتب'
      },
      {
        key: 'showcase.subtitle',
        fr: 'Photos réelles et illustrations détaillées de nos ouvrages de biologie médicale',
        en: 'Real photos and detailed illustrations of our medical biology books',
        ar: 'صور حقيقية ورسوم توضيحية مفصلة لكتب علم الأحياء الطبية الخاصة بنا'
      },
      {
        key: 'feedback.title',
        fr: 'Avis de nos Acheteurs',
        en: 'Customer Feedback',
        ar: 'آراء المشترين'
      },
      {
        key: 'feedback.subtitle',
        fr: 'Ce que pensent nos clients de leur expérience avec nos livres',
        en: 'What our buyers say about their experience with our books',
        ar: 'ما يقوله عملاؤنا عن تجربتهم مع كتبنا'
      },
      {
        key: 'contact.title',
        fr: 'Contactez-nous',
        en: 'Contact us',
        ar: 'اتصل بنا'
      }
    ];

    for (const t of texts) {
      await pool.execute(
        'INSERT IGNORE INTO site_texts (key_name, fr_value, en_value, ar_value) VALUES (?, ?, ?, ?)',
        [t.key, t.fr, t.en, t.ar]
      );
    }

    // 2. Seed FAQ
    console.log('Seeding faq...');
    const faqs = [
      {
        q_fr: 'Comment payer ?',
        q_en: 'How to pay?',
        q_ar: 'كيفية الدفع؟',
        a_fr: 'Le paiement se fait à la livraison en espèces. Vous payez uniquement lorsque vous recevez vos livres.',
        a_en: 'Payment is made in cash upon delivery. You only pay when you receive your books.',
        a_ar: 'الدفع يكون نقداً عند الاستلام. تدفع فقط عندما تستلم كتبك.',
        display_order: 1
      },
      {
        q_fr: 'Quel est le délai de livraison ?',
        q_en: 'What is the delivery time?',
        q_ar: 'ما هي modة التوصيل؟',
        a_fr: 'La livraison prend au maximum 48 heures selon votre wilaya.',
        a_en: 'Delivery takes a maximum of 48 hours depending on your province.',
        a_ar: 'التوصيل يستغرق 48 ساعة كحد أقصى حسب ولايتك.',
        display_order: 2
      },
      {
        q_fr: 'Le livre est-il en couleur ?',
        q_en: 'Is the book in color?',
        q_ar: 'هل الكتاب ملون؟',
        a_fr: 'Oui ! Les deux livres contiennent des illustrations et photos en couleur de haute qualité.',
        a_en: 'Yes! Both books contain high-quality color illustrations and photos.',
        a_ar: 'نعم! يحتوي كلا الكتابين على رسوم توضيحية وصور ملونة عالية الجودة.',
        display_order: 3
      },
      {
        q_fr: 'Pour quels étudiants est-ce adapté ?',
        q_en: 'Which students is it suitable for?',
        q_ar: 'ما هي الفئة الطلابية المناسبة؟',
        a_fr: 'Ces livres sont conçus pour les étudiants en biologie, biochimie, pharmacie, médecine, paramédical, chimie, immunologie, virologie, génétique et SNV.',
        a_en: 'These books are designed for students in biology, biochemistry, pharmacy, medicine, paramedical, chemistry, immunology, virology, genetics, and SNV.',
        a_ar: 'هذه الكتب مصممة لطلاب علم الأحياء، الكيمياء الحيوية، الصيدلة، الطب، العلوم الطبية المساعدة، الكيمياء، علم المناعة، علم الفيروسات، علم الوراثة، وعلوم الطبيعة والحياة.',
        display_order: 4
      }
    ];

    const [faqCount] = await pool.execute('SELECT COUNT(*) as count FROM faq');
    if (faqCount[0].count === 0) {
      for (const f of faqs) {
        await pool.execute(
          'INSERT INTO faq (question_fr, question_en, question_ar, answer_fr, answer_en, answer_ar, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [f.q_fr, f.q_en, f.q_ar, f.a_fr, f.a_en, f.a_ar, f.display_order]
        );
      }
      console.log('Seeded FAQs.');
    } else {
      console.log('FAQ table already has data, skipping seeding.');
    }

    // 3. Seed features
    console.log('Seeding features...');
    const features = [
      // Book 1 features
      {
        pid: 'book1',
        fr: 'Guide complet du matériel et des outils de laboratoire',
        en: 'Complete guide to laboratory equipment and tools',
        ar: 'دليل كامل لمعدات وأدوات المختبر الطبي',
        display_order: 1
      },
      {
        pid: 'book1',
        fr: 'Présentation des automates (FNS, Ionogramme, Biochimie, etc.)',
        en: 'Overview of automated systems (FNS, Ionogramme, Biochemistry, etc.)',
        ar: 'عرض مفصل للأجهزة الآلية (FNS، قياس الشوارد، الكيمياء الحيوية، إلخ.)',
        display_order: 2
      },
      {
        pid: 'book1',
        fr: 'Utilisation des appareils (spectrophotomètre, centrifugeuse, bain-marie, etc.)',
        en: 'How to use equipment (spectrophotometer, centrifuge, water bath, etc.)',
        ar: 'طريقة تشغيل واستخدام الأجهزة (المطياف الضوئي, جهاز الطرد المركزي, الحمام المائي, إلخ.)',
        display_order: 3
      },
      {
        pid: 'book1',
        fr: 'Maîtrise des pipettes, cellules de numération (Malassez, Nageotte) et tubes',
        en: 'Mastering pipettes, counting cells (Malassez, Nageotte), and tubes',
        ar: 'إتقان استخدام الماصات، خلايا الحساب (Malassez، Nageotte) وأnaبيب التحليل',
        display_order: 4
      },
      {
        pid: 'book1',
        fr: 'Illustrations réelles et photos en couleur de haute qualité',
        en: 'Real illustrations and high-quality color photos',
        ar: 'رسوم توضيحية وصور حقيقية ملونة عالية الجودة',
        display_order: 5
      },
      {
        pid: 'book1',
        fr: '100% pratique pour les laboratoires — 2ème Édition',
        en: '100% practical for laboratory work — 2nd Edition',
        ar: '100% عملي وتطبيقي للمخابر — الطبعة الثانية',
        display_order: 6
      },
      // Book 2 features
      {
        pid: 'book2',
        fr: 'Plus de 110 techniques de dosage et analyses détaillées',
        en: 'Over 110 detailed dosage techniques and analyses',
        ar: 'أكثر من 110 تقنية قياس وتحليل مفصلة',
        display_order: 1
      },
      {
        pid: 'book2',
        fr: 'Techniques de prélèvement sanguin et choix des anticoagulants',
        en: 'Blood collection techniques and selection of anticoagulants',
        ar: 'تقنيات سحب الدم واختيار مضادات التخثر المناسبة',
        display_order: 2
      },
      {
        pid: 'book2',
        fr: 'Numération et Formule Sanguine (Hémogramme FNS) et frottis sanguins',
        en: 'Complete Blood Count (FNS Hémogramme) and blood smears',
        ar: 'صيغة وتعداد الدم الكامل (Hémogramme FNS) ولطاخة الدم',
        display_order: 3
      },
      {
        pid: 'book2',
        fr: 'Dosages biochimiques complets (Glycémie, HGPO, Urée, Créatinine, Cholestérol, etc.)',
        en: 'Comprehensive biochemistry assays (Glucose, HGPO, Urea, Creatinine, Cholesterol, etc.)',
        ar: 'التحاليل الكيميائية الحيوية الشاملة (السكر، HGPO، اليوريا، الكرياتينين، الكوليسترول، إلخ.)',
        display_order: 4
      },
      {
        pid: 'book2',
        fr: 'Analyses immunologiques, tests rapides par bandelettes et techniques ELISA',
        en: 'Immunological analyses, rapid strip tests, and ELISA methods',
        ar: 'التحاليل المناعية، الاختبارات السريعة بالشرائط وتقنيات الـ ELISA',
        display_order: 5
      },
      {
        pid: 'book2',
        fr: 'Examens sérologiques (Toxoplasmose, Rubéole, Hépatites, HIV, Syphilis, etc.)',
        en: 'Serological exams (Toxoplasmosis, Rubella, Hepatitis, HIV, Syphilis, etc.)',
        ar: 'الفحوصات المصلية (التوكسوبلازموز، الحصبة الألمانية، التهاب الكبد، السيدا، الزهري، إلخ.)',
        display_order: 6
      }
    ];

    const [featuresCount] = await pool.execute('SELECT COUNT(*) as count FROM features');
    if (featuresCount[0].count === 0) {
      for (const f of features) {
        await pool.execute(
          'INSERT INTO features (product_id, text_fr, text_en, text_ar, display_order) VALUES (?, ?, ?, ?, ?)',
          [f.pid, f.fr, f.en, f.ar, f.display_order]
        );
      }
      console.log('Seeded features.');
    } else {
      console.log('Features table already has data, skipping seeding.');
    }

    // 4. Seed gallery images for the default homepage books
    console.log('Creating gallery_images table if not exists...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        album_id VARCHAR(100) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        alt_fr VARCHAR(500),
        alt_en VARCHAR(500),
        alt_ar VARCHAR(500),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Seeding default gallery images...');
    const galleryImages = [
      {
        album_id: 'hero',
        image_url: '/images/books-cover-real.jpg',
        alt_fr: 'Image de la première page d’accueil',
        alt_en: 'Homepage hero image',
        alt_ar: 'صورة الصفحة الأولى الرئيسية',
        display_order: 1
      },
      {
        album_id: 'book1',
        image_url: '/images/book1-cover-real.jpg',
        alt_fr: 'Couverture — Matériels et outils de laboratoire',
        alt_en: 'Cover — Laboratory materials and tools',
        alt_ar: 'الغلاف — المواد والأدوات المخبرية',
        display_order: 1
      },
      {
        album_id: 'book1',
        image_url: '/images/book1-back-real.jpg',
        alt_fr: 'Dos du livre — Matériels et outils de laboratoire',
        alt_en: 'Back cover — Laboratory materials and tools',
        alt_ar: 'الظهر — المواد والأدوات المخبرية',
        display_order: 2
      },
      {
        album_id: 'book1',
        image_url: '/images/book1-page1-real.jpg',
        alt_fr: 'Page 1 — Liste des matériels et consommables',
        alt_en: 'Page 1 — List of materials and consumables',
        alt_ar: 'الصفحة 1 — قائمة المواد واللوازم',
        display_order: 3
      },
      {
        album_id: 'book1',
        image_url: '/images/book1-page2-real.jpg',
        alt_fr: 'Page 2 — Suite de la liste & milieux de cultures',
        alt_en: 'Page 2 — Continuation of the list and culture media',
        alt_ar: 'الصفحة 2 — استكمال القائمة ووسط النمو',
        display_order: 4
      },
      {
        album_id: 'book1',
        image_url: '/images/book1-page3-real.jpg',
        alt_fr: 'Page 3 — Équipements et technologies',
        alt_en: 'Page 3 — Equipment and technologies',
        alt_ar: 'الصفحة 3 — المعدات والتقنيات',
        display_order: 5
      },
      {
        album_id: 'book1',
        image_url: '/images/book1-page4-real.jpg',
        alt_fr: 'Page 4 — Formes & importance des milieux de culture & Milieu BCP',
        alt_en: 'Page 4 — Forms and importance of culture media and BCP medium',
        alt_ar: 'الصفحة 4 — أشكال وأهمية أوساط الزراعة ووسط BCP',
        display_order: 6
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-cover-real.jpg',
        alt_fr: 'Couverture — Guide pratique des techniques des analyses médicales',
        alt_en: 'Cover — Practical guide to medical analysis techniques',
        alt_ar: 'الغلاف — دليل عملي لتقنيات التحاليل الطبية',
        display_order: 1
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-sommaire1-real.jpg',
        alt_fr: 'Sommaire Page 3 — Généralités, prélèvements sanguins & anticoagulants',
        alt_en: 'Contents Page 3 — Generalities, blood sampling and anticoagulants',
        alt_ar: 'الصفحة 3 — العموميات وسحب الدم ومضادات التخثر',
        display_order: 2
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-sommaire2-real.jpg',
        alt_fr: 'Sommaire Page 3 & Droits Réservés',
        alt_en: 'Contents Page 3 and reserved rights',
        alt_ar: 'الصفحة 3 والحقوق محفوظة',
        display_order: 3
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-sommaire3-real.jpg',
        alt_fr: 'Sommaire Page 4 & 5 — Dosages biochimiques, analyses immunologiques',
        alt_en: 'Contents Pages 4 & 5 — Biochemical assays and immunological analyses',
        alt_ar: 'الصفحات 4 و5 — التحاليل الكيميائية الحيوية والتحاليل المناعية',
        display_order: 4
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-page1-real.jpg',
        alt_fr: 'Page 26-27 — Retrait d\'aiguille, étiquetage des tubes & préparation du sérum/plasma',
        alt_en: 'Pages 26-27 — Needle withdrawal, tube labeling and serum/plasma preparation',
        alt_ar: 'الصفحات 26-27 — سحب الإبرة، وتوسيم الأنابيب وإعداد المصل/البلازما',
        display_order: 5
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-page2-real.jpg',
        alt_fr: 'Page 80-81 — Dosage de l\'Urée colorimétrique & Créatinine',
        alt_en: 'Pages 80-81 — Colorimetric urea and creatinine assays',
        alt_ar: 'الصفحات 80-81 — قياس اليوريا والكراتينين اللوني',
        display_order: 6
      },
      {
        album_id: 'book2',
        image_url: '/images/book2-back-real.jpg',
        alt_fr: 'Dos du livre — Guide pratique des techniques des analyses médicales',
        alt_en: 'Back cover — Practical guide to medical analysis techniques',
        alt_ar: 'الظهر — دليل عملي لتقنيات التحاليل الطبية',
        display_order: 7
      }
    ];

    const [galleryCount] = await pool.execute('SELECT COUNT(*) as count FROM gallery_images');
    if (galleryCount[0].count === 0) {
      for (const img of galleryImages) {
        await pool.execute(
          'INSERT INTO gallery_images (album_id, image_url, alt_fr, alt_en, alt_ar, display_order) VALUES (?, ?, ?, ?, ?, ?)',
          [img.album_id, img.image_url, img.alt_fr, img.alt_en, img.alt_ar, img.display_order]
        );
      }
      console.log('Seeded default gallery images.');
    } else {
      console.log('Gallery images already exist, skipping seeding.');
    }

    // 5. Create testimonials table if not exists and Seed
    console.log('Creating testimonials table if not exists...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL DEFAULT 'Acheteur',
        text_fr TEXT NOT NULL,
        text_en TEXT,
        text_ar TEXT,
        rating TINYINT DEFAULT 5,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Seeding testimonials...');
    const testimonials = [
      {
        name: 'Acheteur Biologie',
        rating: 5,
        fr: 'السلام عليكم كتاب ماشاء الله فيه تفصيل مختصر لكل تحليل ابتداءا من مراحله الأولى...',
        en: 'Peace be upon you. An amazing book! It contains a brief detail of each analysis starting from its first stages...',
        ar: 'السلام عليكم كتاب ماشاء الله فيه تفصيل مختصر لكل تحليل ابتداءا من مراحله الأولى...',
        display_order: 1
      },
      {
        name: 'Étudiante en Biochimie',
        rating: 5,
        fr: 'J\'ai vraiment adoré ce livre ! Il contient une richesse d\'informations précieuses et claires...',
        en: 'I really loved this book! It contains a wealth of valuable and clear information...',
        ar: 'لقد أحببت هذا الكتاب حقًا! يحتوي على ثروة من المعلومات القيمة والواضحة...',
        display_order: 2
      }
    ];

    const [testimonialsCount] = await pool.execute('SELECT COUNT(*) as count FROM testimonials');
    if (testimonialsCount[0].count === 0) {
      for (const t of testimonials) {
        await pool.execute(
          'INSERT INTO testimonials (name, rating, text_fr, text_en, text_ar, display_order) VALUES (?, ?, ?, ?, ?, ?)',
          [t.name, t.rating, t.fr, t.en, t.ar, t.display_order]
        );
      }
      console.log('Seeded testimonials.');
    } else {
      console.log('Testimonials table already has data, skipping seeding.');
    }

    console.log('CMS Seeding completed successfully! ✅');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
