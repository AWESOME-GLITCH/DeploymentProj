// Seed content for the prototype: the A2.1 slice of the framework described
// in the PRD (outcomes, criteria, atoms, items, stories and placement items).
// Copy is British English, calm, no exclamation marks, no em dashes.

import type { Atom, Criterion, Item, Outcome, SubLevel, Strand } from "./types";

export const OUTCOMES: Outcome[] = [
  { outcome_id: "OUT-A2.1-INT-01", strand: "INT", sublevel: "A2.1", icon: "☕", can_do: { en: "Can order food and drink in a cafe", ar: "يمكنني طلب الطعام والشراب في المقهى", es: "Puedo pedir comida y bebida en una cafetería", hi: "मैं कैफ़े में खाना और पेय ऑर्डर कर सकता हूँ", ru: "Могу заказать еду и напитки в кафе", tr: "Kafede yiyecek ve içecek sipariş edebilirim", zh: "我能在咖啡馆点餐和饮品" }, criteria: ["CRI-A2.1-INT-01-01", "CRI-A2.1-INT-01-02", "CRI-A2.1-INT-01-03"] },
  { outcome_id: "OUT-A2.1-GRM-02", strand: "GRM", sublevel: "A2.1", icon: "🔢", can_do: { en: "Can say how much and how many", ar: "يمكنني قول الكمية والعدد", es: "Puedo decir cuánto y cuántos", hi: "मैं कितना और कितने कह सकता हूँ", ru: "Могу сказать сколько", tr: "Ne kadar ve kaç tane diyebilirim", zh: "我能表达数量" }, criteria: ["CRI-A2.1-GRM-02-01"] },
  { outcome_id: "OUT-A2.1-LST-03", strand: "LST", sublevel: "A2.1", icon: "🚇", can_do: { en: "Can understand numbers, prices and platform announcements", ar: "يمكنني فهم الأرقام والأسعار وإعلانات المحطة", es: "Puedo entender números, precios y avisos de andén", hi: "मैं नंबर, दाम और प्लेटफ़ॉर्म की घोषणाएँ समझ सकता हूँ", ru: "Понимаю числа, цены и объявления на платформе", tr: "Sayıları, fiyatları ve peron anonslarını anlayabilirim", zh: "我能听懂数字、价格和站台广播" }, criteria: ["CRI-A2.1-LST-03-01"] },
  { outcome_id: "OUT-A1.2-SPK-03", strand: "SPK", sublevel: "A1.2", icon: "🙋", can_do: { en: "Can describe myself, where I live and what I do", ar: "يمكنني وصف نفسي وأين أعيش وماذا أعمل", es: "Puedo describirme, decir dónde vivo y qué hago", hi: "मैं अपने बारे में, कहाँ रहता हूँ और क्या करता हूँ बता सकता हूँ", ru: "Могу рассказать о себе, где живу и чем занимаюсь", tr: "Kendimi, nerede yaşadığımı ve ne iş yaptığımı anlatabilirim", zh: "我能介绍自己、住在哪里和做什么工作" }, criteria: ["CRI-A1.2-SPK-03-01"] },
  { outcome_id: "OUT-A2.1-RDG-04", strand: "RDG", sublevel: "A2.1", icon: "🪧", can_do: { en: "Can understand short notices and signs", ar: "يمكنني فهم الإشعارات واللافتات القصيرة", es: "Puedo entender avisos y carteles cortos", hi: "मैं छोटे नोटिस और संकेत समझ सकता हूँ", ru: "Понимаю короткие объявления и знаки", tr: "Kısa duyuruları ve tabelaları anlayabilirim", zh: "我能看懂简短的告示和标志" }, criteria: ["CRI-A2.1-RDG-04-01"] },
  { outcome_id: "OUT-A2.1-WRT-05", strand: "WRT", sublevel: "A2.1", icon: "💬", can_do: { en: "Can write a short message to a colleague", ar: "يمكنني كتابة رسالة قصيرة لزميل", es: "Puedo escribir un mensaje corto a un compañero", hi: "मैं सहकर्मी को छोटा संदेश लिख सकता हूँ", ru: "Могу написать короткое сообщение коллеге", tr: "Bir iş arkadaşıma kısa mesaj yazabilirim", zh: "我能给同事写简短的消息" }, criteria: ["CRI-A2.1-WRT-05-01"] },
  { outcome_id: "OUT-A2.1-MED-06", strand: "MED", sublevel: "A2.1", icon: "🧾", can_do: { en: "Can tell a friend the key points of a simple notice", ar: "يمكنني إخبار صديق بالنقاط الرئيسية في إشعار بسيط", es: "Puedo contar a un amigo los puntos clave de un aviso sencillo", hi: "मैं दोस्त को सरल नोटिस की मुख्य बातें बता सकता हूँ", ru: "Могу передать другу главное из простого уведомления", tr: "Basit bir bildirimin ana noktalarını bir arkadaşa aktarabilirim", zh: "我能向朋友转述简单通知的要点" }, criteria: ["CRI-A2.1-MED-06-01"] },
  { outcome_id: "OUT-A2.1-GRM-07", strand: "GRM", sublevel: "A2.1", icon: "📅", can_do: { en: "Can talk about yesterday, today and tomorrow", ar: "يمكنني التحدث عن الأمس واليوم والغد", es: "Puedo hablar de ayer, hoy y mañana", hi: "मैं कल, आज और कल के बारे में बात कर सकता हूँ", ru: "Могу говорить о вчера, сегодня и завтра", tr: "Dün, bugün ve yarın hakkında konuşabilirim", zh: "我能谈论昨天、今天和明天" }, criteria: ["CRI-A2.1-GRM-07-01"] },
];

export const CRITERIA: Criterion[] = [
  { criterion_id: "CRI-A2.1-INT-01-01", outcome_id: "OUT-A2.1-INT-01", strand: "INT", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "Ask for something politely with I'd like or Could I have", ar: "اطلب شيئًا بأدب", es: "Pedir algo con cortesía" } },
  { criterion_id: "CRI-A2.1-INT-01-02", outcome_id: "OUT-A2.1-INT-01", strand: "INT", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-INT-01-01"], descriptor: { en: "Respond when something is not available", ar: "الرد عندما لا يتوفر شيء", es: "Responder cuando algo no está disponible" } },
  { criterion_id: "CRI-A2.1-INT-01-03", outcome_id: "OUT-A2.1-INT-01", strand: "INT", type: "communicative", mastery_rule: "keyed", prerequisites: ["CRI-A2.1-INT-01-01"], descriptor: { en: "Ask for the bill and pay", ar: "اطلب الفاتورة وادفع", es: "Pedir la cuenta y pagar" } },
  { criterion_id: "CRI-A2.1-GRM-02-01", outcome_id: "OUT-A2.1-GRM-02", strand: "GRM", type: "grammar", mastery_rule: "keyed", prerequisites: [], descriptor: { en: "Quantity with countable and uncountable nouns", ar: "الكمية مع الأسماء المعدودة وغير المعدودة", es: "Cantidad con nombres contables e incontables" } },
  { criterion_id: "CRI-A2.1-LST-03-01", outcome_id: "OUT-A2.1-LST-03", strand: "LST", type: "communicative", mastery_rule: "keyed", prerequisites: [], descriptor: { en: "Hear the difference between fourteen and forty", ar: "التمييز بين fourteen و forty", es: "Distinguir fourteen de forty" } },
  { criterion_id: "CRI-A1.2-SPK-03-01", outcome_id: "OUT-A1.2-SPK-03", strand: "SPK", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "Three to five connected sentences with I am, I live, I work", ar: "ثلاث إلى خمس جمل مترابطة", es: "De tres a cinco frases conectadas" } },
  { criterion_id: "CRI-A2.1-RDG-04-01", outcome_id: "OUT-A2.1-RDG-04", strand: "RDG", type: "communicative", mastery_rule: "keyed", prerequisites: [], descriptor: { en: "True, false or not given on a short notice", ar: "صحيح أم خطأ أم غير مذكور", es: "Verdadero, falso o no se dice" } },
  { criterion_id: "CRI-A2.1-WRT-05-01", outcome_id: "OUT-A2.1-WRT-05", strand: "WRT", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "A two-line message that asks a question", ar: "رسالة من سطرين تطرح سؤالًا", es: "Un mensaje de dos líneas con una pregunta" } },
  { criterion_id: "CRI-A2.1-MED-06-01", outcome_id: "OUT-A2.1-MED-06", strand: "MED", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-RDG-04-01"], descriptor: { en: "Tell someone the three things they must do", ar: "أخبر شخصًا بالأشياء الثلاثة التي يجب فعلها", es: "Decir a alguien las tres cosas que debe hacer" } },
  { criterion_id: "CRI-A2.1-GRM-07-01", outcome_id: "OUT-A2.1-GRM-07", strand: "GRM", type: "grammar", mastery_rule: "keyed", prerequisites: ["CRI-A1.2-SPK-03-01"], descriptor: { en: "Past, present and future of regular verbs", ar: "الماضي والحاضر والمستقبل للأفعال المنتظمة", es: "Pasado, presente y futuro de verbos regulares" } },
];

const I = (
  item_id: string,
  criterion_id: string,
  strand: Strand,
  item_type: Item["item_type"],
  rest: Omit<Item, "item_id" | "criterion_id" | "strand" | "item_type">,
): Item => ({ item_id, criterion_id, strand, item_type, ...rest });

export const ITEMS: Item[] = [
  // Atom 1: At the cafe (INT-01-01)
  I("ITM-INT-0101", "CRI-A2.1-INT-01-01", "INT", "tap_order", { stem: { en: "I'd like a coffee, please." }, options: ["please", "I'd", "coffee", "like", "a"], key: "I'd like a coffee please", modality: "cued", why: { en: "I'd like comes first, then what you want, then please.", ar: "تبدأ بـ I'd like ثم ما تريده ثم please.", es: "Primero I'd like, luego lo que quieres y después please." } }),
  I("ITM-INT-0102", "CRI-A2.1-INT-01-01", "INT", "gap_fill", { stem: { en: "___ I have a tea, please?" }, audio: "Could I have a tea, please?", options: ["Could", "Want", "Give"], key: 0, modality: "recognition", why: { en: "Could I have is a polite question. Want and give sound rude here.", ar: "Could I have سؤال مهذب. Want و Give تبدوان فظّتين هنا.", es: "Could I have es una pregunta cortés. Want y give suenan bruscos aquí." } }),
  I("ITM-INT-0103", "CRI-A2.1-INT-01-01", "INT", "pick_picture", { stem: { en: "Listen. Which one?" }, audio: "I'd like two teas, please.", pictures: [{ emoji: "☕", label: "one coffee" }, { emoji: "🍵🍵", label: "two teas" }, { emoji: "🍵", label: "one tea" }], key: 1, modality: "recognition", why: { en: "Two teas: the number comes before the drink.", ar: "Two teas: الرقم يأتي قبل المشروب.", es: "Two teas: el número va antes de la bebida." } }),
  I("ITM-INT-0104", "CRI-A2.1-INT-01-01", "INT", "transform", { stem: { en: "Make it polite: I want a sandwich." }, key: "I'd like a sandwich", config: { accept: ["i'd like a sandwich", "i would like a sandwich", "could i have a sandwich", "can i have a sandwich"] }, modality: "typed", why: { en: "I'd like a sandwich, or Could I have a sandwich. Both are polite.", ar: "I'd like a sandwich أو Could I have a sandwich. كلاهما مهذب.", es: "I'd like a sandwich o Could I have a sandwich. Las dos son corteses." } }),
  I("ITM-INT-0105", "CRI-A2.1-INT-01-01", "INT", "say_it_see_it", { stem: { en: "Order two large coffees." }, config: { scene: "cafe", intent: { action: "order", item: "coffee", quantity: 2, size: "large" }, model: "I'd like two large coffees, please." }, modality: "spoken", why: { en: "I'd like two large coffees, please.", ar: "I'd like two large coffees, please.", es: "I'd like two large coffees, please." } }),
  I("ITM-INT-0106", "CRI-A2.1-INT-01-01", "INT", "gap_fill", { stem: { en: "I'd ___ a coffee, please." }, audio: "I'd like a coffee, please.", options: ["like", "want", "have"], key: 0, modality: "recognition", why: { en: "I'd like. The d is short for would.", ar: "I'd like. حرف d اختصار لـ would.", es: "I'd like. La d es la abreviatura de would." } }),

  // Atom 2: Two coffees, some water (GRM-02-01)
  I("ITM-GRM-0201", "CRI-A2.1-GRM-02-01", "GRM", "magnet_tiles", { stem: { en: "Build the sentence." }, options: ["coffees", "I'd", "please", "two", "like"], key: "I'd like two coffees please", modality: "cued", why: { en: "Two coffees: add s when you can count them.", ar: "Two coffees: أضف s عندما يمكن العد.", es: "Two coffees: añade s cuando se pueden contar." } }),
  I("ITM-GRM-0202", "CRI-A2.1-GRM-02-01", "GRM", "gap_fill", { stem: { en: "I'd like ___ water, please." }, audio: "I'd like some water, please.", options: ["some", "two", "a"], key: 0, modality: "recognition", why: { en: "Water has no plural. Say some water or a bottle of water.", ar: "Water لا جمع لها. قل some water أو a bottle of water.", es: "Water no tiene plural. Di some water o a bottle of water." } }),
  I("ITM-GRM-0203", "CRI-A2.1-GRM-02-01", "GRM", "error_spot", { stem: { en: "Tap the word that is wrong." }, options: ["I'd", "like", "two", "water,", "please."], key: 2, modality: "recognition", why: { en: "Two water is wrong. Water is not counted. Say some water.", ar: "Two water خطأ. Water لا تُعد. قل some water.", es: "Two water está mal. Water no se cuenta. Di some water." } }),
  I("ITM-GRM-0204", "CRI-A2.1-GRM-02-01", "GRM", "magnet_tiles", { stem: { en: "Build the sentence." }, options: ["have", "sugar", "Could", "I", "some"], key: "Could I have some sugar", modality: "cued", why: { en: "Some sugar: sugar is not counted, so no number.", ar: "Some sugar: السكر لا يُعد، فلا رقم.", es: "Some sugar: el azúcar no se cuenta, así que sin número." } }),
  I("ITM-GRM-0205", "CRI-A2.1-GRM-02-01", "GRM", "say_it_see_it", { stem: { en: "Ask for some water." }, config: { scene: "cafe", intent: { action: "order", item: "water", quantity: 1 }, model: "Could I have some water, please?" }, modality: "spoken", why: { en: "Could I have some water, please?", ar: "Could I have some water, please?", es: "Could I have some water, please?" } }),
  I("ITM-GRM-0206", "CRI-A2.1-GRM-02-01", "GRM", "gap_fill", { stem: { en: "Two ___ and some water, please." }, audio: "Two coffees and some water, please.", options: ["coffees", "coffee", "coffeys"], key: 0, modality: "recognition", why: { en: "Two coffees. One coffee, two coffees.", ar: "Two coffees. واحدة coffee، اثنتان coffees.", es: "Two coffees. Uno coffee, dos coffees." } }),

  // Atom 3: Platform 4, not 14 (LST-03-01)
  I("ITM-LST-0401", "CRI-A2.1-LST-03-01", "LST", "pick_picture", { stem: { en: "Listen. Which platform?" }, audio: "Platform fourteen, not four.", pictures: [{ emoji: "4", label: "four" }, { emoji: "14", label: "fourteen" }, { emoji: "40", label: "forty" }], key: 1, modality: "recognition", why: { en: "FourTEEN has the stress at the end. FORty has it at the start.", ar: "FourTEEN النبرة في النهاية. FORty النبرة في البداية.", es: "FourTEEN lleva el acento al final. FORty lo lleva al principio." } }),
  I("ITM-LST-0402", "CRI-A2.1-LST-03-01", "LST", "dictation", { stem: { en: "Listen and type the price." }, audio: "That's three pounds fifty.", key: "3.50", config: { accept: ["3.50", "£3.50", "3,50", "three pounds fifty", "3 pounds 50", "3 pounds fifty"] }, modality: "typed", why: { en: "Three pounds fifty is £3.50.", ar: "Three pounds fifty تعني £3.50.", es: "Three pounds fifty es £3.50." } }),
  I("ITM-LST-0403", "CRI-A2.1-LST-03-01", "LST", "detail_gap", { stem: { en: "The next train is at six ___." }, audio: "The next train is at six thirteen.", options: ["thirteen", "thirty", "three"], key: 0, modality: "recognition", why: { en: "Six thirteen, 6:13. ThirTEEN, not THIRty.", ar: "Six thirteen أي 6:13. ThirTEEN وليس THIRty.", es: "Six thirteen, 6:13. ThirTEEN, no THIRty." } }),
  I("ITM-LST-0404", "CRI-A2.1-LST-03-01", "LST", "pick_picture", { stem: { en: "Listen. How much?" }, audio: "Two coffees. That's seventeen dirhams.", pictures: [{ emoji: "7", label: "seven" }, { emoji: "17", label: "seventeen" }, { emoji: "70", label: "seventy" }], key: 1, modality: "recognition", why: { en: "SevenTEEN, stress at the end, so 17.", ar: "SevenTEEN، النبرة في النهاية، إذن 17.", es: "SevenTEEN, acento al final, así que 17." } }),
  I("ITM-LST-0405", "CRI-A2.1-LST-03-01", "LST", "read_aloud", { stem: { en: "Say it. Stress the end of fourteen." }, key: "Platform fourteen, not forty.", modality: "spoken", why: { en: "Platform fourTEEN, not FORty.", ar: "Platform fourTEEN, not FORty.", es: "Platform fourTEEN, not FORty." } }),
  I("ITM-LST-0406", "CRI-A2.1-LST-03-01", "LST", "pick_picture", { stem: { en: "Listen. Which platform?" }, audio: "Platform thirty.", pictures: [{ emoji: "13", label: "thirteen" }, { emoji: "30", label: "thirty" }, { emoji: "3", label: "three" }], key: 1, modality: "recognition", why: { en: "THIRty, stress at the start, so 30.", ar: "THIRty، النبرة في البداية، إذن 30.", es: "THIRty, acento al principio, así que 30." } }),

  // Atom 4: Meet Fatima (A1.2 SPK-03-01)
  I("ITM-SPK-0501", "CRI-A1.2-SPK-03-01", "SPK", "shadow", { stem: { en: "Speak along with Fatima." }, key: "I live in Dubai and I work in a shop.", modality: "spoken", why: { en: "I LIVE in DuBAI and I WORK in a SHOP.", ar: "I LIVE in DuBAI and I WORK in a SHOP.", es: "I LIVE in DuBAI and I WORK in a SHOP." } }),
  I("ITM-SPK-0502", "CRI-A1.2-SPK-03-01", "SPK", "gap_fill", { stem: { en: "I ___ in London." }, audio: "I live in London.", options: ["live", "living", "lives"], key: 0, modality: "recognition", why: { en: "I live. With I, the verb has no s.", ar: "I live. مع I لا نضيف s للفعل.", es: "I live. Con I, el verbo no lleva s." } }),
  I("ITM-SPK-0503", "CRI-A1.2-SPK-03-01", "SPK", "tap_order", { stem: { en: "I work as a nurse." }, options: ["nurse", "I", "a", "work", "as"], key: "I work as a nurse", modality: "cued", why: { en: "I work as a nurse. Work as, then the job.", ar: "I work as a nurse. بعد work as تأتي الوظيفة.", es: "I work as a nurse. Work as y después el trabajo." } }),
  I("ITM-SPK-0504", "CRI-A1.2-SPK-03-01", "SPK", "read_aloud", { stem: { en: "Read it aloud." }, key: "I'm Yusuf. I live in Riyadh and I work as an engineer.", modality: "spoken", why: { en: "I'm YUsuf. I live in RiYADH and I work as an engiNEER.", ar: "I'm YUsuf. I live in RiYADH and I work as an engiNEER.", es: "I'm YUsuf. I live in RiYADH and I work as an engiNEER." } }),
  I("ITM-SPK-0505", "CRI-A1.2-SPK-03-01", "SPK", "open_response", { stem: { en: "Say who you are, where you live and what you do. 30 seconds." }, config: { targets: ["i'm", "i live", "i work", "and"], min_sentences: 3, seconds: 30, variants: ["Say who you are, where you live and what you do. 30 seconds.", "Tell a new classmate about yourself: name, city, job. 30 seconds."] }, modality: "spoken", why: { en: "I'm Fatima. I live in Dubai and I work in a shop.", ar: "I'm Fatima. I live in Dubai and I work in a shop.", es: "I'm Fatima. I live in Dubai and I work in a shop." } }),
  I("ITM-SPK-0506", "CRI-A1.2-SPK-03-01", "SPK", "gap_fill", { stem: { en: "I live ___ Dubai." }, audio: "I live in Dubai.", options: ["in", "on", "at"], key: 0, modality: "recognition", why: { en: "Live in a city: I live in Dubai.", ar: "نقول live in مع المدينة: I live in Dubai.", es: "Live in con una ciudad: I live in Dubai." } }),

  // Atom 5: Metro notices (RDG-04-01)
  I("ITM-RDG-0601", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "You can drink water on the train." }, config: { text: "No eating or drinking on the train. Water is allowed." }, options: ["True", "False", "Not given"], key: 0, modality: "recognition", why: { en: "Water is allowed, so true.", ar: "Water is allowed، إذن صحيح.", es: "Water is allowed, así que verdadero." } }),
  I("ITM-RDG-0602", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "You can eat a sandwich on the train." }, config: { text: "No eating or drinking on the train. Water is allowed." }, options: ["True", "False", "Not given"], key: 1, modality: "recognition", why: { en: "No eating. So a sandwich is not allowed. False.", ar: "No eating. إذن الشطيرة غير مسموحة. خطأ.", es: "No eating. Así que un sándwich no está permitido. Falso." } }),
  I("ITM-RDG-0603", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "The fine is 100 dirhams." }, config: { text: "No eating or drinking on the train. Water is allowed." }, options: ["True", "False", "Not given"], key: 2, modality: "recognition", why: { en: "The notice says nothing about a fine. Not given.", ar: "الإشعار لا يذكر غرامة. غير مذكور.", es: "El aviso no dice nada de una multa. No se dice." } }),
  I("ITM-RDG-0604", "CRI-A2.1-RDG-04-01", "RDG", "heading_match", { stem: { en: "Choose the best title." }, config: { text: "Please stand on the right. Walk on the left." }, options: ["Escalator rules", "Ticket prices", "Opening hours"], key: 0, modality: "recognition", why: { en: "Stand on the right, walk on the left: that is the escalator rule.", ar: "قف على اليمين وامشِ على اليسار: هذه قاعدة السلم المتحرك.", es: "De pie a la derecha, andar por la izquierda: es la regla de la escalera." } }),
  I("ITM-RDG-0605", "CRI-A2.1-RDG-04-01", "RDG", "relay", { stem: { en: "Tell a friend one rule from the notice, in your words." }, config: { source: "No eating or drinking on the train. Water is allowed. Please stand on the right.", questions: [{ q: "Can you eat on the train?", keywords: ["no eat", "not eat", "can't eat", "cannot eat", "no food", "don't eat"] }, { q: "What can you drink?", keywords: ["water"] }, { q: "Where do you stand?", keywords: ["right"] }], need: 1 }, modality: "spoken", why: { en: "You can't eat on the train, but water is OK.", ar: "You can't eat on the train, but water is OK.", es: "You can't eat on the train, but water is OK." } }),
  I("ITM-RDG-0606", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "You should stand if someone needs the seat." }, config: { text: "Priority seat. Please give this seat to someone who needs it more." }, options: ["True", "False", "Not given"], key: 0, modality: "recognition", why: { en: "Give the seat to someone who needs it. True.", ar: "أعطِ المقعد لمن يحتاجه. صحيح.", es: "Dar el asiento a quien lo necesite. Verdadero." } }),

  // Atom 6: Where are you? (WRT-05-01)
  I("ITM-WRT-0701", "CRI-A2.1-WRT-05-01", "WRT", "sentence_build", { stem: { en: "Build the question." }, options: ["you", "Where", "are"], key: "Where are you", modality: "cued", why: { en: "Question word, then are, then you. Where are you?", ar: "كلمة السؤال ثم are ثم you. Where are you?", es: "Palabra interrogativa, luego are, luego you. Where are you?" } }),
  I("ITM-WRT-0702", "CRI-A2.1-WRT-05-01", "WRT", "correct_message", { stem: { en: "Fix the message: Where you are?" }, key: "where are you", config: { accept: ["where are you", "where are you?"] }, modality: "typed", why: { en: "In a question, are comes before you. Where are you?", ar: "في السؤال تأتي are قبل you. Where are you?", es: "En una pregunta, are va antes de you. Where are you?" } }),
  I("ITM-WRT-0703", "CRI-A2.1-WRT-05-01", "WRT", "gap_fill", { stem: { en: "Hi Amira. ___ you OK?" }, audio: "Hi Amira. Are you OK?", options: ["Are", "Is", "Do"], key: 0, modality: "recognition", why: { en: "Are you OK? With you, use are.", ar: "Are you OK? مع you نستخدم are.", es: "Are you OK? Con you se usa are." } }),
  I("ITM-WRT-0704", "CRI-A2.1-WRT-05-01", "WRT", "short_production", { stem: { en: "Your colleague Amira is late. Write a two-line message asking where she is." }, config: { targets: ["where", "?"], min_words: 6, max_words: 60, variants: ["Your colleague Amira is late. Write a two-line message asking where she is.", "Your friend Omar is not at the cafe yet. Write a two-line message asking where he is."] }, modality: "typed", why: { en: "Hi Amira. Where are you? Are you OK?", ar: "Hi Amira. Where are you? Are you OK?", es: "Hi Amira. Where are you? Are you OK?" } }),
  I("ITM-WRT-0705", "CRI-A2.1-WRT-05-01", "WRT", "tap_order", { stem: { en: "Are you OK?" }, options: ["OK", "you", "Are"], key: "Are you OK", modality: "cued", why: { en: "Are you OK? Are first, then you.", ar: "Are you OK? تبدأ بـ Are ثم you.", es: "Are you OK? Are primero, luego you." } }),

  // Atom 7: The gas bill (MED-06-01)
  I("ITM-MED-0801", "CRI-A2.1-MED-06-01", "MED", "gist_mcq", { stem: { en: "What is the bill for?" }, audio: "This is your gas bill. Please pay by thirty May. You can pay online or at the shop. Use reference number four four seven one.", options: ["Gas", "Water", "Internet"], key: 0, modality: "recognition", why: { en: "This is your gas bill.", ar: "This is your gas bill.", es: "This is your gas bill." } }),
  I("ITM-MED-0802", "CRI-A2.1-MED-06-01", "MED", "detail_gap", { stem: { en: "Pay by ___ May." }, audio: "Please pay by thirty May.", options: ["30", "13", "3"], key: 0, modality: "recognition", why: { en: "THIRty May. Stress at the start.", ar: "THIRty May. النبرة في البداية.", es: "THIRty May. Acento al principio." } }),
  I("ITM-MED-0803", "CRI-A2.1-MED-06-01", "MED", "gap_fill", { stem: { en: "Use the ___ number." }, audio: "Use the reference number.", options: ["reference", "telephone", "bus"], key: 0, modality: "recognition", why: { en: "The reference number tells them which bill you are paying.", ar: "رقم المرجع يوضح أي فاتورة تدفع.", es: "El número de referencia indica qué factura pagas." } }),
  I("ITM-MED-0804", "CRI-A2.1-MED-06-01", "MED", "relay", { stem: { en: "Your flatmate cannot read this bill. Tell them the three things they must do." }, config: { source: "Gas bill. Pay by 30 May. Pay online or at the shop. Use reference number 4471.", questions: [{ q: "When must they pay?", keywords: ["30", "thirty", "may"] }, { q: "How can they pay?", keywords: ["online", "shop", "internet"] }, { q: "What number do they need?", keywords: ["reference", "4471", "number"] }], need: 2, character: "Sami" }, modality: "spoken", why: { en: "Pay by 30 May, online or at the shop, with reference 4471.", ar: "Pay by 30 May, online or at the shop, with reference 4471.", es: "Pay by 30 May, online or at the shop, with reference 4471." } }),
  I("ITM-MED-0805", "CRI-A2.1-MED-06-01", "MED", "gist_mcq", { stem: { en: "How can they pay?" }, audio: "You can pay online or at the shop.", options: ["Online or at the shop", "Only by post", "Only in cash"], key: 0, modality: "recognition", why: { en: "Online or at the shop.", ar: "Online or at the shop.", es: "Online or at the shop." } }),

  // Atom 8: We're out of oat milk (INT-01-02)
  I("ITM-INT-0901", "CRI-A2.1-INT-01-02", "INT", "gap_fill", { stem: { en: "Do you have soy milk ___?" }, audio: "Do you have soy milk instead?", options: ["instead", "inside", "outside"], key: 0, modality: "recognition", why: { en: "Instead means in place of the thing you wanted.", ar: "Instead تعني بدلًا من الشيء الذي أردته.", es: "Instead significa en lugar de lo que querías." } }),
  I("ITM-INT-0902", "CRI-A2.1-INT-01-02", "INT", "tap_order", { stem: { en: "That's fine, thank you." }, options: ["thank", "fine,", "That's", "you."], key: "That's fine, thank you.", modality: "cued", why: { en: "That's fine, thank you. A calm way to say OK.", ar: "That's fine, thank you. طريقة هادئة لقول حسنًا.", es: "That's fine, thank you. Una forma tranquila de decir vale." } }),
  I("ITM-INT-0903", "CRI-A2.1-INT-01-02", "INT", "inference_mcq", { stem: { en: "We're out of oat milk means..." }, audio: "Sorry, we're out of oat milk.", options: ["There is no oat milk today", "The oat milk is outside", "Oat milk is free"], key: 0, modality: "recognition", why: { en: "Out of something means there is none left.", ar: "Out of شيء تعني لم يبقَ منه.", es: "Out of algo significa que no queda." } }),
  I("ITM-INT-0904", "CRI-A2.1-INT-01-02", "INT", "roleplay", { stem: { en: "Order a drink. The cafe is out of oat milk. Agree an alternative in three turns." }, config: { character: "Leo", turns: [{ say: "Hi. What can I get you?", keywords: ["like", "have", "coffee", "tea", "latte", "milk", "please", "want", "water", "juice"] }, { say: "Sorry, we're out of oat milk.", keywords: ["instead", "soy", "almond", "normal", "regular", "milk", "fine", "ok", "okay", "without", "black", "do you have", "then"] }, { say: "Yes, we have soy milk. Anything else?", keywords: ["no", "that's", "fine", "thanks", "thank", "all", "bill", "nothing", "water", "please"] }], need: 2 }, modality: "spoken", why: { en: "Do you have soy milk instead? That's fine, thank you.", ar: "Do you have soy milk instead? That's fine, thank you.", es: "Do you have soy milk instead? That's fine, thank you." } }),
  I("ITM-INT-0905", "CRI-A2.1-INT-01-02", "INT", "gap_fill", { stem: { en: "Sorry, we're ___ of oat milk." }, audio: "Sorry, we're out of oat milk.", options: ["out", "off", "over"], key: 0, modality: "recognition", why: { en: "Out of: none left.", ar: "Out of: لم يبقَ شيء.", es: "Out of: no queda nada." } }),

  // Atom 9: Yesterday, today, tomorrow (GRM-07-01)
  I("ITM-GRM-0301", "CRI-A2.1-GRM-07-01", "GRM", "time_slider", { stem: { en: "Move the slider to match the time word." }, config: { frame: "I ___ in Dubai.", forms: { past: "worked", present: "work", future: "will work" }, cues: [{ label: "Yesterday", emoji: "⏮️", target: "past" }, { label: "Tomorrow", emoji: "⏭️", target: "future" }, { label: "Today", emoji: "📍", target: "present" }, { label: "Last week", emoji: "📅", target: "past" }], need: 3 }, modality: "cued", why: { en: "Yesterday: worked. Today: work. Tomorrow: will work.", ar: "Yesterday: worked. Today: work. Tomorrow: will work.", es: "Yesterday: worked. Today: work. Tomorrow: will work." } }),
  I("ITM-GRM-0302", "CRI-A2.1-GRM-07-01", "GRM", "gap_fill", { stem: { en: "Yesterday I ___ at home." }, audio: "Yesterday I worked at home.", options: ["worked", "work", "will work"], key: 0, modality: "recognition", why: { en: "Yesterday is past, so add ed: worked.", ar: "Yesterday في الماضي، فنضيف ed: worked.", es: "Yesterday es pasado, así que añade ed: worked." } }),
  I("ITM-GRM-0303", "CRI-A2.1-GRM-07-01", "GRM", "magnet_tiles", { stem: { en: "Build the sentence." }, options: ["visit", "I", "Tomorrow", "will", "London"], key: "Tomorrow I will visit London", modality: "cued", why: { en: "Tomorrow needs will: I will visit.", ar: "Tomorrow تحتاج will: I will visit.", es: "Tomorrow necesita will: I will visit." } }),
  I("ITM-GRM-0304", "CRI-A2.1-GRM-07-01", "GRM", "open_response", { stem: { en: "Say one thing you did yesterday and one thing you will do tomorrow." }, config: { targets: ["yesterday", "tomorrow", "will", "ed"], min_sentences: 2, seconds: 30, variants: ["Say one thing you did yesterday and one thing you will do tomorrow.", "Say what you did last weekend and what you will do next weekend."] }, modality: "spoken", why: { en: "Yesterday I worked. Tomorrow I will visit a friend.", ar: "Yesterday I worked. Tomorrow I will visit a friend.", es: "Yesterday I worked. Tomorrow I will visit a friend." } }),
  I("ITM-GRM-0305", "CRI-A2.1-GRM-07-01", "GRM", "gap_fill", { stem: { en: "Tomorrow I ___ in London." }, audio: "Tomorrow I will work in London.", options: ["will work", "worked", "working"], key: 0, modality: "recognition", why: { en: "Tomorrow is future: will work.", ar: "Tomorrow في المستقبل: will work.", es: "Tomorrow es futuro: will work." } }),

  // Atom 10: The bill, please (INT-01-03)
  I("ITM-INT-1001", "CRI-A2.1-INT-01-03", "INT", "tap_order", { stem: { en: "Could I have the bill, please?" }, options: ["the", "please?", "Could", "have", "I", "bill,"], key: "Could I have the bill, please?", modality: "cued", why: { en: "Could I have the bill, please? The bill is the paper with the price.", ar: "Could I have the bill, please? الفاتورة هي ورقة الحساب.", es: "Could I have the bill, please? The bill es la cuenta." } }),
  I("ITM-INT-1002", "CRI-A2.1-INT-01-03", "INT", "gap_fill", { stem: { en: "Can I pay ___ card?" }, audio: "Can I pay by card?", options: ["by", "on", "in"], key: 0, modality: "recognition", why: { en: "Pay by card, pay by phone, pay in cash.", ar: "Pay by card, pay by phone, pay in cash.", es: "Pay by card, pay by phone, pay in cash." } }),
  I("ITM-INT-1003", "CRI-A2.1-INT-01-03", "INT", "pick_picture", { stem: { en: "Listen. Which one?" }, audio: "Can I pay by card?", pictures: [{ emoji: "💳", label: "card" }, { emoji: "💵", label: "cash" }, { emoji: "🧾", label: "bill" }], key: 0, modality: "recognition", why: { en: "Card. The small plastic card.", ar: "Card. البطاقة البلاستيكية.", es: "Card. La tarjeta de plástico." } }),
  I("ITM-INT-1004", "CRI-A2.1-INT-01-03", "INT", "say_it_see_it", { stem: { en: "Ask for the bill." }, config: { scene: "cafe", intent: { action: "bill" }, model: "Could I have the bill, please?" }, modality: "spoken", why: { en: "Could I have the bill, please?", ar: "Could I have the bill, please?", es: "Could I have the bill, please?" } }),
  I("ITM-INT-1005", "CRI-A2.1-INT-01-03", "INT", "gap_fill", { stem: { en: "Could I have the ___, please?" }, audio: "Could I have the bill, please?", options: ["bill", "bell", "ball"], key: 0, modality: "recognition", why: { en: "The bill. In the US they say the check.", ar: "The bill. في أمريكا يقولون the check.", es: "The bill. En EE. UU. dicen the check." } }),

  // Teach it back (day 5) and vote item
  I("ITM-TEACH-0001", "CRI-A2.1-INT-01-01", "INT", "open_response", { stem: { en: "Tell Maya how to order in a cafe. 30 seconds." }, config: { targets: ["i'd like", "please", "could i have", "bill", "instead"], need: 3, min_sentences: 2, seconds: 30, teach_back: true }, modality: "spoken", why: { en: "Say I'd like, then what you want, then please. Ask for the bill at the end.", ar: "Say I'd like, then what you want, then please. Ask for the bill at the end.", es: "Say I'd like, then what you want, then please. Ask for the bill at the end." } }),
  I("ITM-VOTE-0001", "CRI-A2.1-INT-01-01", "INT", "vote_see_revote", { stem: { en: "Which one is polite in a cafe?" }, options: ["Give me a coffee.", "I'd like a coffee, please.", "Coffee."], key: 1, config: { peers: [12, 71, 17] }, modality: "recognition", why: { en: "I'd like a coffee, please. Polite, and clear.", ar: "I'd like a coffee, please. مهذبة وواضحة.", es: "I'd like a coffee, please. Cortés y clara." } }),

  // Fluency (second session) items, known material under light time pressure
  I("ITM-FLU-0001", "CRI-A2.1-INT-01-01", "INT", "read_aloud", { stem: { en: "Say it three times, a little faster each time." }, key: "I'd like two coffees and some water, please.", config: { fluency: true, seconds: 8 }, modality: "spoken", why: { en: "I'd like two coffees and some water, please.", ar: "I'd like two coffees and some water, please.", es: "I'd like two coffees and some water, please." } }),
  I("ITM-FLU-0002", "CRI-A1.2-SPK-03-01", "SPK", "read_aloud", { stem: { en: "Say it three times, a little faster each time." }, key: "I live in Dubai and I work in a shop.", config: { fluency: true, seconds: 8 }, modality: "spoken", why: { en: "I live in Dubai and I work in a shop.", ar: "I live in Dubai and I work in a shop.", es: "I live in Dubai and I work in a shop." } }),
];

export const ATOMS: Atom[] = [
  {
    atom_id: "ATM-A2-INT-0001", version: 1, criterion_id: "CRI-A2.1-INT-01-01", strand: "INT", sublevel: "A2.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "At the cafe", ar: "في المقهى", es: "En la cafetería", hi: "कैफ़े में", ru: "В кафе", tr: "Kafede", zh: "在咖啡馆" },
    target_items: ["ITM-INT-0101", "ITM-INT-0102", "ITM-INT-0103", "ITM-INT-0104", "ITM-INT-0105", "ITM-INT-0106"],
    prerequisites: [],
    phases: [
      { kind: "input", media: { kind: "video", title: "At the cafe", presenter: "Maya, Shoreditch", duration_sec: 50, l1_card: { en: "How to ask for a drink politely", ar: "كيف تطلب مشروبًا بأدب", es: "Cómo pedir una bebida con cortesía", hi: "विनम्रता से पेय कैसे माँगें", ru: "Как вежливо попросить напиток", tr: "Nazikçe içecek nasıl istenir", zh: "如何礼貌地点饮品" }, lines: [
        { text: "Monday morning. Shoreditch. Coffee first.", at: 0 },
        { text: "I'd like a coffee, please.", at: 5, target: true },
        { text: "I'd like two coffees, please.", at: 10, target: true },
        { text: "Could I have a tea?", at: 15, target: true },
        { text: "I'd like means I want, but polite.", at: 20 },
        { text: "Say it with me. I'd like a coffee, please.", at: 28, target: true },
        { text: "I'd like ... please.", at: 40, target: true },
      ] } },
      { kind: "noticing", highlight: "I'd like", why: { en: "I'd like is softer than I want. Use it in shops and cafes.", ar: "I'd like ألطف من I want. استخدمها في المتاجر والمقاهي.", es: "I'd like es más suave que I want. Úsalo en tiendas y cafeterías.", hi: "I'd like, I want से नरम है। दुकानों और कैफ़े में इसका प्रयोग करें।", ru: "I'd like мягче, чем I want. Используйте в магазинах и кафе.", tr: "I'd like, I want'tan daha naziktir. Dükkan ve kafelerde kullanın.", zh: "I'd like 比 I want 更委婉。在商店和咖啡馆里用它。" } },
      { kind: "controlled", items: ["ITM-INT-0101", "ITM-INT-0102", "ITM-INT-0103", "ITM-INT-0104"] },
      { kind: "free_use", items: ["ITM-INT-0105"] },
      { kind: "check", items: ["ITM-INT-0106"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-GRM-0002", version: 1, criterion_id: "CRI-A2.1-GRM-02-01", strand: "GRM", sublevel: "A2.1", type: "word_tutorial", variant: "standard", language_use: false, status: "published",
    title: { en: "Two coffees, some water", ar: "قهوتان وبعض الماء", es: "Dos cafés, algo de agua", hi: "दो कॉफ़ी, थोड़ा पानी", ru: "Два кофе, немного воды", tr: "İki kahve, biraz su", zh: "两杯咖啡，一些水" },
    target_items: ["ITM-GRM-0201", "ITM-GRM-0202", "ITM-GRM-0203", "ITM-GRM-0204", "ITM-GRM-0205", "ITM-GRM-0206"],
    prerequisites: ["CRI-A2.1-INT-01-01"],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "a coffee, two coffees", emoji: "☕", meaning: { en: "You can count coffees.", ar: "يمكن عدّ القهوة.", es: "Los cafés se pueden contar.", hi: "कॉफ़ी गिनी जा सकती है।", ru: "Кофе можно сосчитать.", tr: "Kahveler sayılabilir.", zh: "咖啡可以数。" }, examples: ["Two coffees, please.", "A coffee for my colleague.", "Three coffees for the class."] },
        { word: "some water", emoji: "💧", meaning: { en: "You cannot count water. Say some.", ar: "لا يمكن عدّ الماء. قل some.", es: "El agua no se cuenta. Di some.", hi: "पानी गिना नहीं जाता। some कहें।", ru: "Воду нельзя сосчитать. Говорите some.", tr: "Su sayılmaz. Some deyin.", zh: "水不可数。用 some。" }, examples: ["Some water, please.", "A bottle of water for the office.", "Some water for the student."] },
        { word: "some sugar", emoji: "🧂", meaning: { en: "Sugar is not counted either.", ar: "السكر أيضًا لا يُعد.", es: "El azúcar tampoco se cuenta.", hi: "चीनी भी नहीं गिनी जाती।", ru: "Сахар тоже не считают.", tr: "Şeker de sayılmaz.", zh: "糖也不可数。" }, examples: ["Some sugar, please.", "No sugar at work.", "Some sugar in my tea."] },
        { word: "a sandwich, two sandwiches", emoji: "🥪", meaning: { en: "Add es after ch.", ar: "أضف es بعد ch.", es: "Añade es después de ch.", hi: "ch के बाद es जोड़ें।", ru: "После ch добавьте es.", tr: "ch'den sonra es ekleyin.", zh: "ch 后面加 es。" }, examples: ["Two sandwiches, please.", "A sandwich at my desk.", "Sandwiches for the group."] },
        { word: "a juice, two juices", emoji: "🧃", meaning: { en: "In a cafe, a juice means one glass.", ar: "في المقهى a juice تعني كوبًا واحدًا.", es: "En una cafetería, a juice es un vaso.", hi: "कैफ़े में a juice का मतलब एक गिलास।", ru: "В кафе a juice значит один стакан.", tr: "Kafede a juice bir bardak demektir.", zh: "在咖啡馆 a juice 指一杯。" }, examples: ["Two juices, please.", "A juice after work.", "Juices for the children."] },
      ] } },
      { kind: "noticing", highlight: "two coffees, some water", why: { en: "Count it: a number and s. Cannot count it: some.", ar: "إذا كان معدودًا: رقم و s. غير معدود: some.", es: "Si se cuenta: número y s. Si no: some.", hi: "गिन सकते हैं: संख्या और s। नहीं गिन सकते: some।", ru: "Считаем: число и s. Не считаем: some.", tr: "Sayılıyorsa: sayı ve s. Sayılmıyorsa: some.", zh: "可数：数字加 s。不可数：some。" } },
      { kind: "controlled", items: ["ITM-GRM-0201", "ITM-GRM-0202", "ITM-GRM-0203", "ITM-GRM-0204"] },
      { kind: "free_use", items: ["ITM-GRM-0205"] },
      { kind: "check", items: ["ITM-GRM-0206"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-LST-0004", version: 1, criterion_id: "CRI-A2.1-LST-03-01", strand: "LST", sublevel: "A2.1", type: "video", variant: "standard", language_use: false, status: "published",
    title: { en: "Platform 4, not 14", ar: "الرصيف 4 وليس 14", es: "Andén 4, no 14", hi: "प्लेटफ़ॉर्म 4, 14 नहीं", ru: "Платформа 4, не 14", tr: "Peron 4, 14 değil", zh: "4 号站台，不是 14 号" },
    target_items: ["ITM-LST-0401", "ITM-LST-0402", "ITM-LST-0403", "ITM-LST-0404", "ITM-LST-0405", "ITM-LST-0406"],
    prerequisites: [],
    phases: [
      { kind: "input", media: { kind: "video", title: "Platform 4, not 14", presenter: "Arjun, Dubai Metro", duration_sec: 55, l1_card: { en: "Hearing 14 and 40", ar: "سماع 14 و 40", es: "Oír 14 y 40", hi: "14 और 40 सुनना", ru: "Слышим 14 и 40", tr: "14 ve 40'ı duymak", zh: "听清 14 和 40" }, lines: [
        { text: "Dubai Metro, Friday evening.", at: 0 },
        { text: "Platform fourteen.", at: 5, target: true },
        { text: "Platform four.", at: 9, target: true },
        { text: "Platform forty.", at: 13, target: true },
        { text: "FourTEEN. Stress at the end. FORty. Stress at the start.", at: 18 },
        { text: "Say it with me. Fourteen. Forty.", at: 30, target: true },
        { text: "thirTEEN, THIRty.", at: 44, target: true },
      ] } },
      { kind: "noticing", highlight: "fourTEEN, FORty", why: { en: "Teen numbers are stressed at the end. Tens at the start.", ar: "الأرقام المنتهية بـ teen نبرتها في النهاية، والعشرات في البداية.", es: "Los teen se acentúan al final. Las decenas al principio.", hi: "teen वाले नंबर अंत में ज़ोर, दहाई वाले शुरू में।", ru: "Числа на teen ударяются в конце, десятки в начале.", tr: "Teen sayılar sonda, onluklar başta vurgulanır.", zh: "teen 结尾的数重音在后，整十数重音在前。" } },
      { kind: "controlled", items: ["ITM-LST-0401", "ITM-LST-0402", "ITM-LST-0403", "ITM-LST-0404"] },
      { kind: "free_use", items: ["ITM-LST-0405"] },
      { kind: "check", items: ["ITM-LST-0406"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A1-SPK-0005", version: 1, criterion_id: "CRI-A1.2-SPK-03-01", strand: "SPK", sublevel: "A1.2", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "Meet Fatima", ar: "تعرّف على فاطمة", es: "Conoce a Fatima", hi: "फ़ातिमा से मिलिए", ru: "Знакомьтесь, Фатима", tr: "Fatima ile tanışın", zh: "认识 Fatima" },
    target_items: ["ITM-SPK-0501", "ITM-SPK-0502", "ITM-SPK-0503", "ITM-SPK-0504", "ITM-SPK-0505", "ITM-SPK-0506"],
    prerequisites: [],
    phases: [
      { kind: "input", media: { kind: "video", title: "Meet Fatima", presenter: "Fatima, Dubai", duration_sec: 45, l1_card: { en: "Saying who you are", ar: "التعريف بنفسك", es: "Decir quién eres", hi: "अपना परिचय देना", ru: "Рассказать о себе", tr: "Kendinizi tanıtmak", zh: "自我介绍" }, lines: [
        { text: "Hello. I'm Fatima.", at: 0, target: true },
        { text: "I live in Dubai.", at: 5, target: true },
        { text: "I work in a shop.", at: 10, target: true },
        { text: "I like tea and I don't like coffee.", at: 15, target: true },
        { text: "I'm, I live, I work. Three sentences. That is you.", at: 22 },
        { text: "Say it with me. I live in Dubai and I work in a shop.", at: 30, target: true },
        { text: "I'm ... I live in ... I work in ...", at: 40, target: true },
      ] } },
      { kind: "noticing", highlight: "I live in, I work in", why: { en: "Live in a city. Work in a place, or work as a job.", ar: "live in مع المدينة. work in مع المكان، أو work as مع الوظيفة.", es: "Live in con la ciudad. Work in con un lugar, o work as con un trabajo.", hi: "शहर के साथ live in। जगह के साथ work in, या नौकरी के साथ work as।", ru: "Live in с городом. Work in с местом, work as с профессией.", tr: "Şehirle live in. Yerle work in, meslekle work as.", zh: "城市用 live in。地点用 work in，职业用 work as。" } },
      { kind: "controlled", items: ["ITM-SPK-0501", "ITM-SPK-0502", "ITM-SPK-0503", "ITM-SPK-0504"] },
      { kind: "free_use", items: ["ITM-SPK-0505"] },
      { kind: "check", items: ["ITM-SPK-0506"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-RDG-0006", version: 1, criterion_id: "CRI-A2.1-RDG-04-01", strand: "RDG", sublevel: "A2.1", type: "word_tutorial", variant: "standard", language_use: false, status: "published",
    title: { en: "Metro notices", ar: "إشعارات المترو", es: "Avisos del metro", hi: "मेट्रो के नोटिस", ru: "Объявления в метро", tr: "Metro duyuruları", zh: "地铁告示" },
    target_items: ["ITM-RDG-0601", "ITM-RDG-0602", "ITM-RDG-0603", "ITM-RDG-0604", "ITM-RDG-0605", "ITM-RDG-0606"],
    prerequisites: [],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "No eating or drinking", emoji: "🚫", meaning: { en: "You cannot eat or drink here.", ar: "لا يمكنك الأكل أو الشرب هنا.", es: "No puedes comer ni beber aquí.", hi: "यहाँ खाना-पीना मना है।", ru: "Здесь нельзя есть и пить.", tr: "Burada yiyip içemezsiniz.", zh: "这里不能吃喝。" }, examples: ["No eating on the train.", "No drinking in the office lift.", "No eating in the library."] },
        { word: "allowed", emoji: "✅", meaning: { en: "You can do it.", ar: "مسموح.", es: "Está permitido.", hi: "अनुमति है।", ru: "Разрешено.", tr: "İzin verilir.", zh: "允许。" }, examples: ["Water is allowed.", "Phones are allowed at work.", "Laptops are allowed in class."] },
        { word: "Stand on the right", emoji: "➡️", meaning: { en: "On an escalator, stand on the right side.", ar: "على السلم المتحرك، قف على الجانب الأيمن.", es: "En la escalera, de pie a la derecha.", hi: "एस्केलेटर पर दाईं ओर खड़े हों।", ru: "На эскалаторе стойте справа.", tr: "Yürüyen merdivende sağda durun.", zh: "乘扶梯时靠右站。" }, examples: ["Stand on the right, walk on the left.", "Stand on the right at the station.", "Stand on the right at the mall."] },
        { word: "Priority seat", emoji: "💺", meaning: { en: "A seat for people who need it more.", ar: "مقعد لمن يحتاجه أكثر.", es: "Un asiento para quien lo necesita más.", hi: "ज़रूरतमंद के लिए सीट।", ru: "Место для тех, кому нужнее.", tr: "Daha çok ihtiyacı olanlar için koltuk.", zh: "优先座位。" }, examples: ["Priority seat: please give it up.", "A priority seat near the door.", "Priority seats on the bus."] },
        { word: "Mind the gap", emoji: "⚠️", meaning: { en: "Be careful of the space between train and platform.", ar: "انتبه للفراغ بين القطار والرصيف.", es: "Cuidado con el hueco entre tren y andén.", hi: "ट्रेन और प्लेटफ़ॉर्म के बीच की जगह से सावधान।", ru: "Осторожно, зазор между поездом и платформой.", tr: "Tren ile peron arasındaki boşluğa dikkat.", zh: "小心列车与站台间的空隙。" }, examples: ["Mind the gap.", "Mind the step at work.", "Mind the door at school."] },
      ] } },
      { kind: "noticing", highlight: "No eating or drinking", why: { en: "No plus ing means do not do it.", ar: "No مع ing تعني لا تفعل ذلك.", es: "No más ing significa no lo hagas.", hi: "No के साथ ing का मतलब मत करो।", ru: "No плюс ing значит нельзя.", tr: "No artı ing yapma demektir.", zh: "No 加 ing 表示禁止。" } },
      { kind: "controlled", items: ["ITM-RDG-0601", "ITM-RDG-0602", "ITM-RDG-0603", "ITM-RDG-0604"] },
      { kind: "free_use", items: ["ITM-RDG-0605"] },
      { kind: "check", items: ["ITM-RDG-0606"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-WRT-0007", version: 1, criterion_id: "CRI-A2.1-WRT-05-01", strand: "WRT", sublevel: "A2.1", type: "word_tutorial", variant: "standard", language_use: true, status: "published",
    title: { en: "Where are you?", ar: "أين أنت؟", es: "¿Dónde estás?", hi: "तुम कहाँ हो?", ru: "Где ты?", tr: "Neredesin?", zh: "你在哪里？" },
    target_items: ["ITM-WRT-0701", "ITM-WRT-0702", "ITM-WRT-0703", "ITM-WRT-0704", "ITM-WRT-0705"],
    prerequisites: [],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "Hi Amira", emoji: "👋", meaning: { en: "Start a message with Hi and the name.", ar: "ابدأ الرسالة بـ Hi والاسم.", es: "Empieza el mensaje con Hi y el nombre.", hi: "संदेश Hi और नाम से शुरू करें।", ru: "Начните сообщение с Hi и имени.", tr: "Mesaja Hi ve isimle başlayın.", zh: "用 Hi 加名字开头。" }, examples: ["Hi Amira.", "Hi Omar.", "Hi Mrs Khan."] },
        { word: "Where are you?", emoji: "📍", meaning: { en: "Ask for the place.", ar: "اسأل عن المكان.", es: "Pregunta por el lugar.", hi: "जगह पूछें।", ru: "Спросите, где.", tr: "Yeri sorun.", zh: "问在哪里。" }, examples: ["Where are you? The meeting started.", "Where are you? I'm at the cafe.", "Where are you? Class is at 9."] },
        { word: "Are you OK?", emoji: "🙂", meaning: { en: "Ask if the person is fine.", ar: "اسأل إن كان الشخص بخير.", es: "Pregunta si está bien.", hi: "पूछें कि सब ठीक है।", ru: "Спросите, всё ли в порядке.", tr: "İyi olup olmadığını sorun.", zh: "问对方是否还好。" }, examples: ["Are you OK? You are late.", "Are you OK? Call me.", "Are you OK? See you soon."] },
        { word: "See you soon", emoji: "🕒", meaning: { en: "A friendly ending.", ar: "خاتمة ودّية.", es: "Un final amistoso.", hi: "दोस्ताना अंत।", ru: "Дружеское окончание.", tr: "Samimi bir kapanış.", zh: "友好的结尾。" }, examples: ["See you soon.", "See you at work.", "See you in class."] },
      ] } },
      { kind: "noticing", highlight: "Where are you?", why: { en: "Question word first, then are, then you.", ar: "كلمة السؤال أولًا ثم are ثم you.", es: "Primero la palabra interrogativa, luego are, luego you.", hi: "पहले प्रश्न शब्द, फिर are, फिर you।", ru: "Сначала вопросительное слово, потом are, потом you.", tr: "Önce soru kelimesi, sonra are, sonra you.", zh: "先疑问词，再 are，再 you。" } },
      { kind: "controlled", items: ["ITM-WRT-0701", "ITM-WRT-0702", "ITM-WRT-0703"] },
      { kind: "free_use", items: ["ITM-WRT-0704"] },
      { kind: "check", items: ["ITM-WRT-0705"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-MED-0008", version: 1, criterion_id: "CRI-A2.1-MED-06-01", strand: "MED", sublevel: "A2.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "The gas bill", ar: "فاتورة الغاز", es: "La factura del gas", hi: "गैस का बिल", ru: "Счёт за газ", tr: "Gaz faturası", zh: "燃气账单" },
    target_items: ["ITM-MED-0801", "ITM-MED-0802", "ITM-MED-0803", "ITM-MED-0804", "ITM-MED-0805"],
    prerequisites: ["CRI-A2.1-RDG-04-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "The gas bill", presenter: "Sami, a flat share in London", duration_sec: 40, l1_card: { en: "Telling a friend what a letter says", ar: "إخبار صديق بما في الرسالة", es: "Contar a un amigo lo que dice una carta", hi: "दोस्त को बताना कि पत्र में क्या लिखा है", ru: "Рассказать другу, что в письме", tr: "Bir arkadaşa mektupta ne yazdığını söylemek", zh: "告诉朋友信里说了什么" }, lines: [
        { text: "Sami has a letter. He cannot read it.", at: 0 },
        { text: "This is your gas bill.", at: 5, target: true },
        { text: "Please pay by thirty May.", at: 10, target: true },
        { text: "You can pay online or at the shop.", at: 15, target: true },
        { text: "Use reference number four four seven one.", at: 21, target: true },
        { text: "Three things: when, how, and the number.", at: 28 },
        { text: "Pay by ... Pay online or ... Use the reference number.", at: 34, target: true },
      ] } },
      { kind: "noticing", highlight: "Pay by 30 May", why: { en: "Pay by a date means on or before that date.", ar: "Pay by مع تاريخ تعني في ذلك التاريخ أو قبله.", es: "Pay by con una fecha significa ese día o antes.", hi: "Pay by तारीख़ का मतलब उस दिन या उससे पहले।", ru: "Pay by с датой значит не позже этой даты.", tr: "Pay by bir tarih: o gün ya da öncesi.", zh: "Pay by 加日期表示在该日期或之前。" } },
      { kind: "controlled", items: ["ITM-MED-0801", "ITM-MED-0802", "ITM-MED-0803"] },
      { kind: "free_use", items: ["ITM-MED-0804"] },
      { kind: "check", items: ["ITM-MED-0805"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-INT-0009", version: 1, criterion_id: "CRI-A2.1-INT-01-02", strand: "INT", sublevel: "A2.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "We're out of oat milk", ar: "نفد حليب الشوفان", es: "No queda leche de avena", hi: "ओट मिल्क ख़त्म है", ru: "Овсяное молоко закончилось", tr: "Yulaf sütü bitti", zh: "燕麦奶没了" },
    target_items: ["ITM-INT-0901", "ITM-INT-0902", "ITM-INT-0903", "ITM-INT-0904", "ITM-INT-0905"],
    prerequisites: ["CRI-A2.1-INT-01-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "We're out of oat milk", presenter: "Leo, cafe owner", duration_sec: 45, l1_card: { en: "When the cafe does not have what you want", ar: "عندما لا يتوفر ما تريده في المقهى", es: "Cuando la cafetería no tiene lo que quieres", hi: "जब कैफ़े में आपकी चीज़ न हो", ru: "Когда в кафе нет того, что вы хотите", tr: "Kafede istediğiniz şey yoksa", zh: "咖啡馆没有你要的东西时" }, lines: [
        { text: "A latte with oat milk, please.", at: 0 },
        { text: "Sorry, we're out of oat milk.", at: 5, target: true },
        { text: "Do you have soy milk instead?", at: 10, target: true },
        { text: "Yes, we do.", at: 15 },
        { text: "That's fine, thank you.", at: 18, target: true },
        { text: "Out of means none left. Instead means in its place.", at: 23 },
        { text: "Say it with me. Do you have soy milk instead?", at: 31, target: true },
        { text: "Do you have ... instead? That's fine.", at: 40, target: true },
      ] } },
      { kind: "noticing", highlight: "instead", why: { en: "Instead goes at the end of the question.", ar: "Instead تأتي في نهاية السؤال.", es: "Instead va al final de la pregunta.", hi: "Instead प्रश्न के अंत में आता है।", ru: "Instead ставится в конец вопроса.", tr: "Instead sorunun sonuna gelir.", zh: "Instead 放在问句末尾。" } },
      { kind: "controlled", items: ["ITM-INT-0901", "ITM-INT-0902", "ITM-INT-0903"] },
      { kind: "free_use", items: ["ITM-INT-0904"] },
      { kind: "check", items: ["ITM-INT-0905"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-GRM-0003", version: 1, criterion_id: "CRI-A2.1-GRM-07-01", strand: "GRM", sublevel: "A2.1", type: "video", variant: "standard", language_use: false, status: "published",
    title: { en: "Yesterday, today, tomorrow", ar: "أمس، اليوم، غدًا", es: "Ayer, hoy, mañana", hi: "कल, आज, कल", ru: "Вчера, сегодня, завтра", tr: "Dün, bugün, yarın", zh: "昨天、今天、明天" },
    target_items: ["ITM-GRM-0301", "ITM-GRM-0302", "ITM-GRM-0303", "ITM-GRM-0304", "ITM-GRM-0305"],
    prerequisites: ["CRI-A1.2-SPK-03-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "Yesterday, today, tomorrow", presenter: "Yusuf, Riyadh", duration_sec: 45, l1_card: { en: "One verb, three times", ar: "فعل واحد، ثلاثة أزمنة", es: "Un verbo, tres tiempos", hi: "एक क्रिया, तीन समय", ru: "Один глагол, три времени", tr: "Bir fiil, üç zaman", zh: "一个动词，三个时间" }, lines: [
        { text: "Yesterday I worked in Riyadh.", at: 0, target: true },
        { text: "Today I work in Dubai.", at: 5, target: true },
        { text: "Tomorrow I will work in London.", at: 10, target: true },
        { text: "Past: add ed. Future: add will.", at: 16 },
        { text: "Say it with me. Worked. Work. Will work.", at: 24, target: true },
        { text: "worked, work, will work", at: 38, target: true },
      ] } },
      { kind: "noticing", highlight: "worked, work, will work", why: { en: "Time word first, then the verb changes.", ar: "كلمة الزمن أولًا، ثم يتغير الفعل.", es: "Primero la palabra de tiempo, luego cambia el verbo.", hi: "पहले समय शब्द, फिर क्रिया बदलती है।", ru: "Сначала слово времени, потом меняется глагол.", tr: "Önce zaman kelimesi, sonra fiil değişir.", zh: "先说时间词，动词随之变化。" } },
      { kind: "controlled", items: ["ITM-GRM-0301", "ITM-GRM-0302", "ITM-GRM-0303"] },
      { kind: "free_use", items: ["ITM-GRM-0304"] },
      { kind: "check", items: ["ITM-GRM-0305"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-INT-0010", version: 1, criterion_id: "CRI-A2.1-INT-01-03", strand: "INT", sublevel: "A2.1", type: "word_tutorial", variant: "standard", language_use: true, status: "published",
    title: { en: "The bill, please", ar: "الفاتورة من فضلك", es: "La cuenta, por favor", hi: "बिल, कृपया", ru: "Счёт, пожалуйста", tr: "Hesap, lütfen", zh: "请结账" },
    target_items: ["ITM-INT-1001", "ITM-INT-1002", "ITM-INT-1003", "ITM-INT-1004", "ITM-INT-1005"],
    prerequisites: ["CRI-A2.1-INT-01-01"],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "the bill", emoji: "🧾", meaning: { en: "The paper with the price.", ar: "الورقة التي فيها السعر.", es: "El papel con el precio.", hi: "दाम वाला काग़ज़।", ru: "Бумага с ценой.", tr: "Fiyatın yazdığı kağıt.", zh: "写着价格的单子。" }, examples: ["Could I have the bill, please?", "The bill for the office lunch.", "The bill is on the table."] },
        { word: "pay by card", emoji: "💳", meaning: { en: "Pay with a bank card.", ar: "الدفع ببطاقة البنك.", es: "Pagar con tarjeta.", hi: "बैंक कार्ड से भुगतान।", ru: "Оплата банковской картой.", tr: "Banka kartıyla ödemek.", zh: "用银行卡支付。" }, examples: ["Can I pay by card?", "We pay by card at work.", "Students pay by card."] },
        { word: "pay in cash", emoji: "💵", meaning: { en: "Pay with notes and coins.", ar: "الدفع بالأوراق النقدية والعملات.", es: "Pagar con billetes y monedas.", hi: "नोट और सिक्कों से भुगतान।", ru: "Оплата наличными.", tr: "Nakit ödemek.", zh: "用现金支付。" }, examples: ["I'll pay in cash.", "Cash only at the market.", "Pay in cash at the door."] },
        { word: "keep the change", emoji: "🪙", meaning: { en: "The extra money is for you.", ar: "النقود الزائدة لك.", es: "El dinero extra es para ti.", hi: "बाक़ी पैसे आप रखें।", ru: "Сдачу оставьте себе.", tr: "Üstü kalsın.", zh: "不用找零。" }, examples: ["Keep the change.", "Keep the change, thank you.", "Here you are. Keep the change."] },
      ] } },
      { kind: "noticing", highlight: "Could I have the bill, please?", why: { en: "Same shape as ordering: Could I have ... please.", ar: "نفس شكل الطلب: Could I have ... please.", es: "La misma forma que al pedir: Could I have ... please.", hi: "ऑर्डर जैसा ही ढाँचा: Could I have ... please।", ru: "Та же форма, что при заказе: Could I have ... please.", tr: "Sipariş gibi: Could I have ... please.", zh: "和点餐一样的句型：Could I have ... please。" } },
      { kind: "controlled", items: ["ITM-INT-1001", "ITM-INT-1002", "ITM-INT-1003"] },
      { kind: "free_use", items: ["ITM-INT-1004"] },
      { kind: "check", items: ["ITM-INT-1005"], delayed: true },
    ],
  },
  // Day 5 teach it back
  {
    atom_id: "ATM-A2-INT-0011", version: 1, criterion_id: "CRI-A2.1-INT-01-01", strand: "INT", sublevel: "A2.1", type: "practice", variant: "standard", language_use: true, status: "published",
    title: { en: "Teach it back", ar: "علّمها لغيرك", es: "Enséñalo tú", hi: "इसे सिखाओ", ru: "Объясни другому", tr: "Sen öğret", zh: "教给别人" },
    target_items: ["ITM-TEACH-0001"], prerequisites: [],
    phases: [{ kind: "free_use", items: ["ITM-TEACH-0001"] }],
  },
  // Fluency atom for the second session
  {
    atom_id: "ATM-A2-FLU-0001", version: 1, criterion_id: "CRI-A2.1-INT-01-01", strand: "SPK", sublevel: "A2.1", type: "practice", variant: "standard", language_use: true, status: "published",
    title: { en: "Fluency: say it faster", ar: "الطلاقة: قلها أسرع", es: "Fluidez: dilo más rápido", hi: "प्रवाह: तेज़ बोलो", ru: "Беглость: скажи быстрее", tr: "Akıcılık: daha hızlı söyle", zh: "流利度：说得更快" },
    target_items: ["ITM-FLU-0001", "ITM-FLU-0002"], prerequisites: [],
    phases: [{ kind: "controlled", items: ["ITM-FLU-0001", "ITM-FLU-0002"] }],
  },
  // Stories (no items, 98% known words)
  {
    atom_id: "STO-A2-0001", version: 1, criterion_id: "CRI-A2.1-INT-01-01", strand: "RDG", sublevel: "A2.1", type: "story", variant: "standard", language_use: true, status: "published",
    title: { en: "Monday at the cafe", ar: "الاثنين في المقهى", es: "Lunes en la cafetería", hi: "सोमवार कैफ़े में", ru: "Понедельник в кафе", tr: "Pazartesi kafede", zh: "星期一在咖啡馆" },
    target_items: [], prerequisites: [], phases: [],
    story: { coverage: 0.98, text: "It is Monday morning. Fatima is at a cafe in Shoreditch. \"I'd like two coffees, please,\" she says. \"Sorry, we're out of oat milk,\" says Leo. \"That's fine. Normal milk is OK.\" Fatima pays by card. \"Could I have the bill, please?\" \"Here you are. Have a good day.\"" },
  },
  {
    atom_id: "STO-A2-0002", version: 1, criterion_id: "CRI-A2.1-LST-03-01", strand: "LST", sublevel: "A2.1", type: "story", variant: "standard", language_use: false, status: "published",
    title: { en: "Platform fourteen", ar: "الرصيف أربعة عشر", es: "Andén catorce", hi: "प्लेटफ़ॉर्म चौदह", ru: "Платформа четырнадцать", tr: "Peron on dört", zh: "十四号站台" },
    target_items: [], prerequisites: [], phases: [],
    story: { coverage: 0.98, text: "Arjun is at the station. \"Platform fourteen,\" says the man. Arjun goes to platform four. The train is not there. He listens again. \"FourTEEN.\" He smiles and walks to platform fourteen. The train is at six thirteen. He is on time." },
  },
  {
    atom_id: "STO-A2-0003", version: 1, criterion_id: "CRI-A2.1-WRT-05-01", strand: "RDG", sublevel: "A2.1", type: "story", variant: "standard", language_use: true, status: "published",
    title: { en: "Amira is late", ar: "أميرة متأخرة", es: "Amira llega tarde", hi: "अमीरा देर से", ru: "Амира опаздывает", tr: "Amira geç kaldı", zh: "Amira 迟到了" },
    target_items: [], prerequisites: [], phases: [],
    story: { coverage: 0.98, text: "It is nine o'clock. Amira is not at work. Elena writes a message. \"Hi Amira. Where are you? Are you OK?\" Amira writes back. \"I'm on the metro. Platform forty was closed. See you soon.\" Elena makes two coffees. Amira arrives at nine thirteen." },
  },
];

export type PlacementItem = { id: string; level: SubLevel; strand: Strand; item: Item };

export const PLACEMENT: PlacementItem[] = [
  { id: "PLC-01", level: "PreA1.1", strand: "LST", item: I("PLC-01", "PLACEMENT", "LST", "pick_picture", { stem: { en: "Listen. Which one?" }, audio: "A cup of coffee.", pictures: [{ emoji: "☕", label: "coffee" }, { emoji: "🍎", label: "apple" }, { emoji: "🚌", label: "bus" }], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-02", level: "A1.1", strand: "GRM", item: I("PLC-02", "PLACEMENT", "GRM", "gap_fill", { stem: { en: "I ___ a student." }, audio: "I am a student.", options: ["am", "is", "are"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-03", level: "A1.2", strand: "LST", item: I("PLC-03", "PLACEMENT", "LST", "pick_picture", { stem: { en: "Listen. Where does she work?" }, audio: "She works in a hospital.", pictures: [{ emoji: "🏥", label: "hospital" }, { emoji: "🏫", label: "school" }, { emoji: "🏪", label: "shop" }], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-04", level: "A2.1", strand: "GRM", item: I("PLC-04", "PLACEMENT", "GRM", "gap_fill", { stem: { en: "Yesterday I ___ to work by metro." }, audio: "Yesterday I went to work by metro.", options: ["went", "go", "going"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-05", level: "A2.2", strand: "RDG", item: I("PLC-05", "PLACEMENT", "RDG", "tfng", { stem: { en: "The shop is open at 10 pm on Friday." }, config: { text: "The shop closes at 9 pm on Fridays." }, options: ["True", "False", "Not given"], key: 1, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-06", level: "B1.1", strand: "GRM", item: I("PLC-06", "PLACEMENT", "GRM", "gap_fill", { stem: { en: "If I ___ more time, I would travel." }, audio: "If I had more time, I would travel.", options: ["had", "have", "will have"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-07", level: "B1.2", strand: "LST", item: I("PLC-07", "PLACEMENT", "LST", "inference_mcq", { stem: { en: "What does she mean?" }, audio: "I'm afraid the meeting has been pushed back.", options: ["The meeting is later than planned", "The meeting is cancelled", "The meeting is earlier"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-08", level: "B2.1", strand: "RDG", item: I("PLC-08", "PLACEMENT", "RDG", "gap_fill", { stem: { en: "The report, ___ was finished late, was still well received." }, options: ["which", "who", "what"], key: 0, modality: "recognition", why: { en: "" } }) },
];

export const CHECKPOINT_ITEMS: PlacementItem[] = [
  { id: "CKP-01", level: "A2.1", strand: "INT", item: I("CKP-01", "CHECKPOINT", "INT", "gap_fill", { stem: { en: "___ like a tea, please." }, audio: "I'd like a tea, please.", options: ["I'd", "I", "Me"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-02", level: "A2.1", strand: "LST", item: I("CKP-02", "CHECKPOINT", "LST", "pick_picture", { stem: { en: "Listen. Which platform?" }, audio: "Platform seventeen.", pictures: [{ emoji: "7", label: "seven" }, { emoji: "17", label: "seventeen" }, { emoji: "70", label: "seventy" }], key: 1, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-03", level: "A2.1", strand: "GRM", item: I("CKP-03", "CHECKPOINT", "GRM", "gap_fill", { stem: { en: "Could I have ___ sugar?" }, audio: "Could I have some sugar?", options: ["some", "two", "a"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-04", level: "A2.2", strand: "RDG", item: I("CKP-04", "CHECKPOINT", "RDG", "tfng", { stem: { en: "You can bring a dog into the cafe." }, config: { text: "Dogs are welcome outside. Please do not bring dogs inside." }, options: ["True", "False", "Not given"], key: 1, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-05", level: "A2.2", strand: "GRM", item: I("CKP-05", "CHECKPOINT", "GRM", "gap_fill", { stem: { en: "Last week we ___ a new flat." }, audio: "Last week we visited a new flat.", options: ["visited", "visit", "will visit"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-06", level: "B1.1", strand: "LST", item: I("CKP-06", "CHECKPOINT", "LST", "inference_mcq", { stem: { en: "What does he mean?" }, audio: "I'll get back to you by Friday.", options: ["He will reply before Friday", "He will return on Friday", "He is going back on Friday"], key: 0, modality: "recognition", why: { en: "" } }) },
];

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.item_id, i]));
export const ATOM_BY_ID: Record<string, Atom> = Object.fromEntries(ATOMS.map((a) => [a.atom_id, a]));
export const CRITERION_BY_ID: Record<string, Criterion> = Object.fromEntries(CRITERIA.map((c) => [c.criterion_id, c]));
export const OUTCOME_BY_ID: Record<string, Outcome> = Object.fromEntries(OUTCOMES.map((o) => [o.outcome_id, o]));

export const STORIES = ATOMS.filter((a) => a.type === "story");
export const LEARNING_ATOMS = ATOMS.filter((a) => a.type !== "story" && a.atom_id !== "ATM-A2-INT-0011" && a.atom_id !== "ATM-A2-FLU-0001");

/** Items that can be retrieved in a recall echo (not scenes, stories, votes or roleplays). */
export function isRecallable(item: Item): boolean {
  return !["roleplay", "story", "vote_see_revote", "shadow", "say_it_see_it", "relay", "time_slider"].includes(item.item_type);
}

export const STRAND_LABEL: Record<Strand, string> = {
  GRM: "Grammar", RDG: "Reading", WRT: "Writing", LST: "Listening", SPK: "Speaking", MED: "Mediation", INT: "Interaction",
};
