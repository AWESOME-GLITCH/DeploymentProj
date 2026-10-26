// Seed content for the prototype: the A2.1 slice of the framework described
// in the PRD (outcomes, criteria, atoms, items, stories and placement items).
// Copy is British English, calm, no exclamation marks, no em dashes.

import type { Atom, Criterion, Item, Outcome, SubLevel, Strand } from "./types";
import { SUBLEVELS } from "./types";

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
  { criterion_id: "CRI-A2.1-INT-01-01", outcome_id: "OUT-A2.1-INT-01", strand: "INT", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "Order politely with Could I have, and say how many and what size", ar: "اطلب بأدب باستخدام Could I have، وقل الكمية والحجم", es: "Pedir con cortesía usando Could I have, y decir cuántos y de qué tamaño" } },
  { criterion_id: "CRI-A2.1-INT-01-02", outcome_id: "OUT-A2.1-INT-01", strand: "INT", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-INT-01-01"], descriptor: { en: "Understand that something is not available and ask for an alternative with instead", ar: "افهم أن الشيء غير متوفر واطلب بديلًا باستخدام instead", es: "Entender que algo no está disponible y pedir una alternativa con instead" } },
  { criterion_id: "CRI-A2.1-INT-01-03", outcome_id: "OUT-A2.1-INT-01", strand: "INT", type: "communicative", mastery_rule: "keyed", prerequisites: ["CRI-A2.1-INT-01-01"], descriptor: { en: "Ask for the bill and say how you will pay", ar: "اطلب الفاتورة وقل كيف ستدفع", es: "Pedir la cuenta y decir cómo vas a pagar" } },
  { criterion_id: "CRI-A2.1-GRM-02-01", outcome_id: "OUT-A2.1-GRM-02", strand: "GRM", type: "grammar", mastery_rule: "keyed", prerequisites: [], descriptor: { en: "Choose a number plus plural s for things you can count, and some for things you cannot", ar: "استخدم رقمًا مع s للجمع لما يُعد، و some لما لا يُعد", es: "Usar un número más s para lo contable, y some para lo incontable" } },
  { criterion_id: "CRI-A2.1-LST-03-01", outcome_id: "OUT-A2.1-LST-03", strand: "LST", type: "pronunciation", mastery_rule: "keyed", prerequisites: [], descriptor: { en: "Catch the number in a short announcement or price, including fourteen against forty", ar: "التقط الرقم في إعلان قصير أو سعر، بما في ذلك fourteen مقابل forty", es: "Captar el número en un aviso corto o un precio, incluido fourteen frente a forty" } },
  { criterion_id: "CRI-A1.2-SPK-03-01", outcome_id: "OUT-A1.2-SPK-03", strand: "SPK", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "Three to five connected sentences with I am, I live, I work", ar: "ثلاث إلى خمس جمل مترابطة", es: "De tres a cinco frases conectadas" } },
  { criterion_id: "CRI-A2.1-RDG-04-01", outcome_id: "OUT-A2.1-RDG-04", strand: "RDG", type: "communicative", mastery_rule: "keyed", prerequisites: [], descriptor: { en: "Find the rule in a short notice and say what you can and cannot do", ar: "اعرف القاعدة في إشعار قصير وقل ما يمكنك وما لا يمكنك فعله", es: "Encontrar la norma en un aviso corto y decir qué se puede y qué no" } },
  { criterion_id: "CRI-A2.1-WRT-05-01", outcome_id: "OUT-A2.1-WRT-05", strand: "WRT", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "A two-line message that asks a question and gives a reason", ar: "رسالة من سطرين تطرح سؤالًا وتذكر السبب", es: "Un mensaje de dos líneas con una pregunta y un motivo" } },
  { criterion_id: "CRI-A2.1-MED-06-01", outcome_id: "OUT-A2.1-MED-06", strand: "MED", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-RDG-04-01"], descriptor: { en: "Tell someone the three things they must do", ar: "أخبر شخصًا بالأشياء الثلاثة التي يجب فعلها", es: "Decir a alguien las tres cosas que debe hacer" } },
  { criterion_id: "CRI-A2.1-GRM-07-01", outcome_id: "OUT-A2.1-GRM-07", strand: "GRM", type: "grammar", mastery_rule: "keyed", prerequisites: ["CRI-A1.2-SPK-03-01"], descriptor: { en: "Match the time word to the verb: worked, work, will work", ar: "اربط كلمة الزمن بالفعل: worked و work و will work", es: "Unir la palabra de tiempo con el verbo: worked, work, will work" } },
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
  I("ITM-INT-0102", "CRI-A2.1-INT-01-01", "INT", "gap_fill", { stem: { en: "Could I ___ a tea, please?" }, audio: "Could I have a tea, please?", options: ["have", "having", "to have"], key: 0, modality: "recognition", why: { en: "After Could I, the verb stays plain: Could I have.", ar: "بعد Could I يبقى الفعل مجردًا: Could I have.", es: "Después de Could I, el verbo va en infinitivo sin to: Could I have." } }),
  I("ITM-INT-0103", "CRI-A2.1-INT-01-01", "INT", "pick_picture", { stem: { en: "Listen. Which one?" }, audio: "I'd like two large teas, please.", pictures: [{ emoji: "🍵", label: "one large tea" }, { emoji: "🍵🍵", label: "two large teas" }, { emoji: "🍵🍵", label: "two small teas" }], key: 1, modality: "recognition", why: { en: "Two large teas. The number first, then the size, then the drink.", ar: "Two large teas. الرقم أولًا، ثم الحجم، ثم المشروب.", es: "Two large teas. Primero el número, luego el tamaño, luego la bebida." } }),
  I("ITM-INT-0104", "CRI-A2.1-INT-01-01", "INT", "transform", { stem: { en: "Make it polite: I want a sandwich." }, key: "I'd like a sandwich", config: { accept: ["i'd like a sandwich", "i would like a sandwich", "could i have a sandwich", "can i have a sandwich"] }, modality: "typed", why: { en: "I'd like a sandwich, or Could I have a sandwich. Both are polite.", ar: "I'd like a sandwich أو Could I have a sandwich. كلاهما مهذب.", es: "I'd like a sandwich o Could I have a sandwich. Las dos son corteses." } }),
  I("ITM-INT-0105", "CRI-A2.1-INT-01-01", "INT", "say_it_see_it", { stem: { en: "Order two large coffees." }, config: { scene: "cafe", intent: { action: "order", item: "coffee", quantity: 2, size: "large" }, model: "I'd like two large coffees, please." }, modality: "spoken", why: { en: "I'd like two large coffees, please.", ar: "I'd like two large coffees, please.", es: "I'd like two large coffees, please." } }),
  I("ITM-INT-0106", "CRI-A2.1-INT-01-01", "INT", "gap_fill", { stem: { en: "I'd like two ___ coffees, please." }, audio: "I'd like two large coffees, please.", options: ["large", "larges", "large size"], key: 0, modality: "recognition", why: { en: "Two large coffees. The size word never takes an s.", ar: "Two large coffees. كلمة الحجم لا تأخذ s أبدًا.", es: "Two large coffees. La palabra del tamaño nunca lleva s." } }),

  // Atom 2: Two coffees, some water (GRM-02-01)
  I("ITM-GRM-0201", "CRI-A2.1-GRM-02-01", "GRM", "magnet_tiles", { stem: { en: "Build the sentence." }, options: ["coffees", "I'd", "water", "two", "like", "and", "some"], key: "I'd like two coffees and some water", modality: "cued", why: { en: "Two coffees: you can count them, so add s. Some water: you cannot count it.", ar: "Two coffees: يمكن عدّها فنضيف s. Some water: لا يمكن عدّه.", es: "Two coffees: se pueden contar, por eso la s. Some water: no se puede contar." } }),
  I("ITM-GRM-0202", "CRI-A2.1-GRM-02-01", "GRM", "gap_fill", { stem: { en: "I'd like ___ water, please." }, audio: "I'd like some water, please.", options: ["some", "many", "a few"], key: 0, modality: "recognition", why: { en: "Some water. Many and a few go with things you can count.", ar: "Some water. أما many و a few فتأتي مع ما يمكن عدّه.", es: "Some water. Many y a few van con cosas que se pueden contar." } }),
  I("ITM-GRM-0203", "CRI-A2.1-GRM-02-01", "GRM", "error_spot", { stem: { en: "Tap the word that is wrong." }, options: ["I'd", "like", "two", "water,", "please."], key: 2, modality: "recognition", why: { en: "Two water is wrong. Water is not counted. Say some water.", ar: "Two water خطأ. Water لا تُعد. قل some water.", es: "Two water está mal. Water no se cuenta. Di some water." } }),
  I("ITM-GRM-0204", "CRI-A2.1-GRM-02-01", "GRM", "magnet_tiles", { stem: { en: "Build the sentence." }, options: ["have", "sugar", "Could", "I", "some"], key: "Could I have some sugar", modality: "cued", why: { en: "Some sugar: sugar is not counted, so no number.", ar: "Some sugar: السكر لا يُعد، فلا رقم.", es: "Some sugar: el azúcar no se cuenta, así que sin número." } }),
  I("ITM-GRM-0205", "CRI-A2.1-GRM-02-01", "GRM", "say_it_see_it", { stem: { en: "Ask for some water." }, config: { scene: "cafe", intent: { action: "order", item: "water", quantity: 1 }, model: "Could I have some water, please?" }, modality: "spoken", why: { en: "Could I have some water, please?", ar: "Could I have some water, please?", es: "Could I have some water, please?" } }),
  I("ITM-GRM-0206", "CRI-A2.1-GRM-02-01", "GRM", "gap_fill", { stem: { en: "Two ___ and some water, please." }, audio: "Two coffees and some water, please.", options: ["coffees", "coffee", "coffee's"], key: 0, modality: "recognition", why: { en: "Two coffees. For more than one, add s on its own, with no apostrophe.", ar: "Two coffees. للجمع نضيف s فقط بدون فاصلة عليا.", es: "Two coffees. Para más de uno, solo s, sin apóstrofo." } }),

  // Atom 3: Platform 4, not 14 (LST-03-01)
  I("ITM-LST-0401", "CRI-A2.1-LST-03-01", "LST", "pick_picture", { stem: { en: "Listen. Which platform?" }, audio: "The next train leaves from platform fourteen.", pictures: [{ emoji: "4", label: "four" }, { emoji: "14", label: "fourteen" }, { emoji: "40", label: "forty" }], key: 1, modality: "recognition", why: { en: "FourTEEN has the stress at the end. FORty has it at the start.", ar: "FourTEEN النبرة في النهاية. FORty النبرة في البداية.", es: "FourTEEN lleva el acento al final. FORty lo lleva al principio." } }),
  I("ITM-LST-0402", "CRI-A2.1-LST-03-01", "LST", "dictation", { stem: { en: "Listen and type the price." }, audio: "That's three pounds fifty.", key: "3.50", config: { accept: ["3.50", "£3.50", "3,50", "three pounds fifty", "3 pounds 50", "3 pounds fifty"] }, modality: "typed", why: { en: "Three pounds fifty is £3.50.", ar: "Three pounds fifty تعني £3.50.", es: "Three pounds fifty es £3.50." } }),
  I("ITM-LST-0403", "CRI-A2.1-LST-03-01", "LST", "detail_gap", { stem: { en: "The next train is at six ___." }, audio: "The next train is at six thirteen.", options: ["thirteen", "thirty", "three"], key: 0, modality: "recognition", why: { en: "Six thirteen, 6:13. ThirTEEN, not THIRty.", ar: "Six thirteen أي 6:13. ThirTEEN وليس THIRty.", es: "Six thirteen, 6:13. ThirTEEN, no THIRty." } }),
  I("ITM-LST-0404", "CRI-A2.1-LST-03-01", "LST", "pick_picture", { stem: { en: "Listen. How much?" }, audio: "Two coffees and two sandwiches. That's seventeen pounds.", pictures: [{ emoji: "7", label: "seven" }, { emoji: "17", label: "seventeen" }, { emoji: "70", label: "seventy" }], key: 1, modality: "recognition", why: { en: "SevenTEEN, stress at the end, so 17.", ar: "SevenTEEN، النبرة في النهاية، إذن 17.", es: "SevenTEEN, acento al final, así que 17." } }),
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
  I("ITM-RDG-0601", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "You can drink water on the train." }, config: { text: "No eating or drinking on the train. Water is allowed." }, options: ["True", "False", "It does not say"], key: 0, modality: "recognition", why: { en: "Water is allowed, so true.", ar: "Water is allowed، إذن صحيح.", es: "Water is allowed, así que verdadero." } }),
  I("ITM-RDG-0602", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "You can eat a sandwich on the train." }, config: { text: "No eating or drinking on the train. Water is allowed." }, options: ["True", "False", "It does not say"], key: 1, modality: "recognition", why: { en: "No eating. So a sandwich is not allowed. False.", ar: "No eating. إذن الشطيرة غير مسموحة. خطأ.", es: "No eating. Así que un sándwich no está permitido. Falso." } }),
  I("ITM-RDG-0603", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "The notice says how much you must pay." }, config: { text: "No eating or drinking on the train. Water is allowed." }, options: ["True", "False", "It does not say"], key: 2, modality: "recognition", why: { en: "The notice says what you cannot do, but not what it costs. It does not say.", ar: "الإشعار يذكر ما لا يمكنك فعله، لكنه لا يذكر التكلفة. غير مذكور.", es: "El aviso dice qué no se puede hacer, pero no cuánto cuesta. No lo dice." } }),
  I("ITM-RDG-0604", "CRI-A2.1-RDG-04-01", "RDG", "heading_match", { stem: { en: "What is this notice about?" }, config: { text: "Please stand on the right. Walk on the left." }, options: ["Where to stand", "What to pay", "When we open"], key: 0, modality: "recognition", why: { en: "Stand on the right, walk on the left. The notice tells you where to stand.", ar: "قف على اليمين وامشِ على اليسار. الإشعار يخبرك بأين تقف.", es: "De pie a la derecha, andar por la izquierda. El aviso dice dónde ponerse." } }),
  I("ITM-RDG-0605", "CRI-A2.1-RDG-04-01", "RDG", "relay", { stem: { en: "Tell a friend one rule from the notice, in your words." }, config: { source: "No eating or drinking on the train. Water is allowed. Please stand on the right.", questions: [{ q: "Can you eat on the train?", keywords: ["no eat", "not eat", "can't eat", "cannot eat", "no food", "don't eat"] }, { q: "What can you drink?", keywords: ["water"] }, { q: "Where do you stand?", keywords: ["right"] }], need: 1 }, modality: "spoken", why: { en: "You can't eat on the train, but water is OK.", ar: "You can't eat on the train, but water is OK.", es: "You can't eat on the train, but water is OK." } }),
  I("ITM-RDG-0606", "CRI-A2.1-RDG-04-01", "RDG", "tfng", { stem: { en: "You should stand if someone needs the seat." }, config: { text: "Priority seat. Please give this seat to someone who needs it more." }, options: ["True", "False", "It does not say"], key: 0, modality: "recognition", why: { en: "Give the seat to someone who needs it. True.", ar: "أعطِ المقعد لمن يحتاجه. صحيح.", es: "Dar el asiento a quien lo necesite. Verdadero." } }),

  // Atom 6: Where are you? (WRT-05-01)
  I("ITM-WRT-0701", "CRI-A2.1-WRT-05-01", "WRT", "sentence_build", { stem: { en: "Build the message." }, options: ["Where", "Hi", "you?", "are", "Amira."], key: "Hi Amira. Where are you?", modality: "cued", why: { en: "Hi and the name first, then the question. Where are you?", ar: "ابدأ بـ Hi والاسم، ثم السؤال. Where are you?", es: "Primero Hi y el nombre, luego la pregunta. Where are you?" } }),
  I("ITM-WRT-0702", "CRI-A2.1-WRT-05-01", "WRT", "correct_message", { stem: { en: "Fix the message: Where you are?" }, key: "where are you", config: { accept: ["where are you", "where are you?"] }, modality: "typed", why: { en: "In a question, are comes before you. Where are you?", ar: "في السؤال تأتي are قبل you. Where are you?", es: "En una pregunta, are va antes de you. Where are you?" } }),
  I("ITM-WRT-0703", "CRI-A2.1-WRT-05-01", "WRT", "gap_fill", { stem: { en: "I'm at the cafe. ___ you coming?" }, audio: "I'm at the cafe. Are you coming?", options: ["Are", "Do", "Is"], key: 0, modality: "recognition", why: { en: "Are you coming? With coming, use are.", ar: "Are you coming? مع coming نستخدم are.", es: "Are you coming? Con coming se usa are." } }),
  I("ITM-WRT-0704", "CRI-A2.1-WRT-05-01", "WRT", "short_production", { stem: { en: "Amira is late for work. Write two lines: ask where she is and say you are at the cafe." }, config: { targets: ["where", "?"], min_words: 8, max_words: 60, variants: ["Amira is late for work. Write two lines: ask where she is and say you are at the cafe.", "Omar is not at the cafe yet. Write two lines: ask where he is and say the meeting is at nine."] }, modality: "typed", why: { en: "Hi Amira. Where are you? I'm at the cafe.", ar: "Hi Amira. Where are you? I'm at the cafe.", es: "Hi Amira. Where are you? I'm at the cafe." } }),
  I("ITM-WRT-0705", "CRI-A2.1-WRT-05-01", "WRT", "tap_order", { stem: { en: "Are you coming to the cafe?" }, options: ["coming", "Are", "the", "to", "you", "cafe?"], key: "Are you coming to the cafe?", modality: "cued", why: { en: "Are you coming to the cafe? Are first, then you, then coming.", ar: "Are you coming to the cafe? تبدأ بـ Are ثم you ثم coming.", es: "Are you coming to the cafe? Are primero, luego you y coming." } }),

  // Atom 7: The gas bill (MED-06-01)
  I("ITM-MED-0801", "CRI-A2.1-MED-06-01", "MED", "gist_mcq", { stem: { en: "What must your flatmate do?" }, audio: "This is your gas bill. Please pay by the thirtieth of May. You can pay online or at the shop. Use reference number four four seven one.", options: ["Pay before the end of May", "Pay at the end of June", "Phone the gas company"], key: 0, modality: "recognition", why: { en: "Pay by the thirtieth of May means on that day or before it.", ar: "Pay by the thirtieth of May تعني في ذلك اليوم أو قبله.", es: "Pay by the thirtieth of May significa ese día o antes." } }),
  I("ITM-MED-0802", "CRI-A2.1-MED-06-01", "MED", "detail_gap", { stem: { en: "Pay by ___ May." }, audio: "Please pay by the thirtieth of May.", options: ["30", "13", "3"], key: 0, modality: "recognition", why: { en: "THIRtieth. Stress at the start, so 30.", ar: "THIRtieth. النبرة في البداية، إذن 30.", es: "THIRtieth. Acento al principio, así que 30." } }),
  I("ITM-MED-0803", "CRI-A2.1-MED-06-01", "MED", "gap_fill", { stem: { en: "Use the ___ number." }, audio: "Use the reference number.", options: ["reference", "telephone", "account"], key: 0, modality: "recognition", why: { en: "The reference number tells them which bill you are paying.", ar: "رقم المرجع يوضح أي فاتورة تدفع.", es: "El número de referencia indica qué factura pagas." } }),
  I("ITM-MED-0804", "CRI-A2.1-MED-06-01", "MED", "relay", { stem: { en: "Your flatmate cannot read this bill. Tell them the three things they must do." }, config: { source: "Gas bill. Pay by 30 May. Pay online or at the shop. Use reference number 4471.", questions: [{ q: "When must they pay?", keywords: ["30", "thirty", "may"] }, { q: "How can they pay?", keywords: ["online", "shop", "internet"] }, { q: "What number do they need?", keywords: ["reference", "4471", "number"] }], need: 2, character: "Sami" }, modality: "spoken", why: { en: "Pay by 30 May, online or at the shop, with reference 4471.", ar: "Pay by 30 May, online or at the shop, with reference 4471.", es: "Pay by 30 May, online or at the shop, with reference 4471." } }),
  I("ITM-MED-0805", "CRI-A2.1-MED-06-01", "MED", "gist_mcq", { stem: { en: "How can they pay?" }, audio: "You can pay on our website, or at the shop on the corner.", options: ["On the internet or at the shop", "Only with cash at the bank", "Only by phone"], key: 0, modality: "recognition", why: { en: "On our website means on the internet. The shop is the other way to pay.", ar: "On our website تعني على الإنترنت. والمتجر هو الطريقة الأخرى للدفع.", es: "On our website es por internet. La tienda es la otra forma de pagar." } }),

  // Atom 8: We're out of oat milk (INT-01-02)
  I("ITM-INT-0901", "CRI-A2.1-INT-01-02", "INT", "gap_fill", { stem: { en: "Do you have soy milk ___?" }, audio: "Do you have soy milk instead?", options: ["instead", "inside", "outside"], key: 0, modality: "recognition", why: { en: "Instead means in place of the thing you wanted.", ar: "Instead تعني بدلًا من الشيء الذي أردته.", es: "Instead significa en lugar de lo que querías." } }),
  I("ITM-INT-0902", "CRI-A2.1-INT-01-02", "INT", "tap_order", { stem: { en: "That's fine, thank you." }, options: ["thank", "fine,", "That's", "you."], key: "That's fine, thank you.", modality: "cued", why: { en: "That's fine, thank you. A calm way to say OK.", ar: "That's fine, thank you. طريقة هادئة لقول حسنًا.", es: "That's fine, thank you. Una forma tranquila de decir vale." } }),
  I("ITM-INT-0903", "CRI-A2.1-INT-01-02", "INT", "inference_mcq", { stem: { en: "We're out of oat milk means..." }, audio: "Sorry, we're out of oat milk.", options: ["There is no oat milk today", "The oat milk is in the fridge", "The oat milk costs more today"], key: 0, modality: "recognition", why: { en: "Out of something means there is none left.", ar: "Out of شيء تعني لم يبقَ منه.", es: "Out of algo significa que no queda." } }),
  I("ITM-INT-0904", "CRI-A2.1-INT-01-02", "INT", "roleplay", { stem: { en: "Order a drink. The cafe is out of oat milk. Agree an alternative in three turns." }, config: { character: "Leo", turns: [{ say: "Hi. What can I get you?", keywords: ["like", "have", "coffee", "tea", "latte", "milk", "please", "want", "water", "juice"] }, { say: "Sorry, we're out of oat milk.", keywords: ["instead", "soy", "almond", "normal", "regular", "milk", "fine", "ok", "okay", "without", "black", "do you have", "then"] }, { say: "Yes, we have soy milk. Anything else?", keywords: ["no", "that's", "fine", "thanks", "thank", "all", "bill", "nothing", "water", "please"] }], need: 2 }, modality: "spoken", why: { en: "Do you have soy milk instead? That's fine, thank you.", ar: "Do you have soy milk instead? That's fine, thank you.", es: "Do you have soy milk instead? That's fine, thank you." } }),
  I("ITM-INT-0905", "CRI-A2.1-INT-01-02", "INT", "gap_fill", { stem: { en: "Sorry, we're ___ of oat milk." }, audio: "Sorry, we're out of oat milk.", options: ["out", "off", "over"], key: 0, modality: "recognition", why: { en: "Out of: none left.", ar: "Out of: لم يبقَ شيء.", es: "Out of: no queda nada." } }),

  // Atom 9: Yesterday, today, tomorrow (GRM-07-01)
  I("ITM-GRM-0301", "CRI-A2.1-GRM-07-01", "GRM", "time_slider", { stem: { en: "Move the slider to match the time word." }, config: { frame: "I ___ in Dubai.", forms: { past: "worked", present: "work", future: "will work" }, cues: [{ label: "Yesterday", emoji: "⏮️", target: "past" }, { label: "Tomorrow", emoji: "⏭️", target: "future" }, { label: "Today", emoji: "📍", target: "present" }, { label: "Last week", emoji: "📅", target: "past" }], need: 3 }, modality: "cued", why: { en: "Yesterday: worked. Today: work. Tomorrow: will work.", ar: "Yesterday: worked. Today: work. Tomorrow: will work.", es: "Yesterday: worked. Today: work. Tomorrow: will work." } }),
  I("ITM-GRM-0302", "CRI-A2.1-GRM-07-01", "GRM", "gap_fill", { stem: { en: "Yesterday I ___ in the shop." }, audio: "Yesterday I worked in the shop.", options: ["worked", "work", "will work"], key: 0, modality: "recognition", why: { en: "Yesterday is past, so add ed: worked.", ar: "Yesterday في الماضي، فنضيف ed: worked.", es: "Yesterday es pasado, así que añade ed: worked." } }),
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
        { text: "Please pay by the thirtieth of May.", at: 10, target: true },
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
    story: { coverage: 0.98, text: "It is Monday morning. Fatima is at a cafe in Shoreditch. \"I'd like two large coffees, please,\" she says. \"Sorry, we're out of oat milk,\" says Leo. \"That's fine. Normal milk is OK.\" Fatima drinks her coffee. \"Could I have the bill, please?\" \"Here you are. That's five pounds forty.\" Fatima pays by card. \"Have a good day.\"" },
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
    story: { coverage: 0.98, text: "It is nine o'clock. Amira is not at work. Elena writes a message. \"Hi Amira. Where are you? Are you OK?\" Amira writes back. \"I'm on the metro. There was a problem at platform forty. See you soon.\" Elena makes two coffees. Amira arrives at nine thirteen." },
  },
];

export type PlacementItem = { id: string; level: SubLevel; strand: Strand; item: Item };

export const PLACEMENT: PlacementItem[] = [
  { id: "PLC-01", level: "PreA1.1", strand: "LST", item: I("PLC-01", "PLACEMENT", "LST", "pick_picture", { stem: { en: "Listen. Which one?" }, audio: "A cup of coffee.", pictures: [{ emoji: "☕", label: "coffee" }, { emoji: "🍎", label: "apple" }, { emoji: "🚌", label: "bus" }], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-02", level: "A1.1", strand: "GRM", item: I("PLC-02", "PLACEMENT", "GRM", "gap_fill", { stem: { en: "I ___ a student." }, audio: "I am a student.", options: ["am", "is", "are"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-03", level: "A1.2", strand: "LST", item: I("PLC-03", "PLACEMENT", "LST", "pick_picture", { stem: { en: "Listen. Where does she work?" }, audio: "She works in a hospital.", pictures: [{ emoji: "🏥", label: "hospital" }, { emoji: "🏫", label: "school" }, { emoji: "🏪", label: "shop" }], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-04", level: "A2.1", strand: "GRM", item: I("PLC-04", "PLACEMENT", "GRM", "gap_fill", { stem: { en: "Yesterday I ___ to work by metro." }, audio: "Yesterday I went to work by metro.", options: ["went", "go", "going"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-05", level: "A2.2", strand: "RDG", item: I("PLC-05", "PLACEMENT", "RDG", "tfng", { stem: { en: "The shop is open at 10 pm on Friday." }, config: { text: "The shop closes at 9 pm on Fridays." }, options: ["True", "False", "It does not say"], key: 1, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-06", level: "B1.1", strand: "GRM", item: I("PLC-06", "PLACEMENT", "GRM", "gap_fill", { stem: { en: "If I ___ more time, I would travel." }, audio: "If I had more time, I would travel.", options: ["had", "have", "will have"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-07", level: "B1.2", strand: "LST", item: I("PLC-07", "PLACEMENT", "LST", "inference_mcq", { stem: { en: "What does she mean?" }, audio: "I'm afraid we'll have to put the meeting off until next week.", options: ["The meeting is later than planned", "The meeting is cancelled", "The meeting is earlier"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "PLC-08", level: "B2.1", strand: "RDG", item: I("PLC-08", "PLACEMENT", "RDG", "gap_fill", { stem: { en: "The report, ___ was finished late, was still well received." }, options: ["which", "who", "what"], key: 0, modality: "recognition", why: { en: "" } }) },
];

export const CHECKPOINT_ITEMS: PlacementItem[] = [
  { id: "CKP-01", level: "A2.1", strand: "INT", item: I("CKP-01", "CHECKPOINT", "INT", "gap_fill", { stem: { en: "In a cafe: ___ two large teas, please." }, audio: "I'd like two large teas, please.", options: ["I'd like", "I want", "Give me"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-02", level: "A2.1", strand: "LST", item: I("CKP-02", "CHECKPOINT", "LST", "pick_picture", { stem: { en: "Listen. Which platform?" }, audio: "Platform seventeen.", pictures: [{ emoji: "7", label: "seven" }, { emoji: "17", label: "seventeen" }, { emoji: "70", label: "seventy" }], key: 1, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-03", level: "A2.1", strand: "GRM", item: I("CKP-03", "CHECKPOINT", "GRM", "gap_fill", { stem: { en: "Could I have ___ sugar?" }, audio: "Could I have some sugar?", options: ["some", "two", "a"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-04", level: "A2.2", strand: "RDG", item: I("CKP-04", "CHECKPOINT", "RDG", "tfng", { stem: { en: "You can bring a dog into the cafe." }, config: { text: "Dogs are welcome outside. Please do not bring dogs inside." }, options: ["True", "False", "It does not say"], key: 1, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-05", level: "A2.2", strand: "GRM", item: I("CKP-05", "CHECKPOINT", "GRM", "gap_fill", { stem: { en: "Last week we ___ a bigger flat." }, audio: "Last week we found a bigger flat.", options: ["found", "find", "finding"], key: 0, modality: "recognition", why: { en: "" } }) },
  { id: "CKP-06", level: "B1.1", strand: "LST", item: I("CKP-06", "CHECKPOINT", "LST", "inference_mcq", { stem: { en: "What does he mean?" }, audio: "I'll let you know as soon as I hear anything.", options: ["He will tell you when he knows", "He knows now but cannot say", "He will not tell you"], key: 0, modality: "recognition", why: { en: "" } }) },
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

// --- CEFR provenance -------------------------------------------------------
// Audited on LEA-42 against the 2020 Companion Volume descriptor scales, the
// British Council and EAQUALS Core Inventory (grammar and functions) and the
// English Vocabulary Profile (words and phrases). `level` is where the item's
// language actually sits, which is not always the sub-level of its atom: a
// first controlled item may recycle the input one band lower on purpose.
// The full table, with the change made to each item, is docs/content/cefr-map.md.

export type CefrNote = { level: SubLevel; descriptor: string };

export const ITEM_CEFR: Record<string, CefrNote> = {
  // Atom 1, At the cafe. Ordering is Transactions A2; the bare "I'd like a
  // coffee" is Core Inventory A1, so it is revision inside an A2.1 atom.
  "ITM-INT-0101": { level: "A1.2", descriptor: "Transactions to obtain goods and services A1: can ask people for things" },
  "ITM-INT-0102": { level: "A2.1", descriptor: "General linguistic range A2: modal could plus plain verb in a request" },
  "ITM-INT-0103": { level: "A2.1", descriptor: "Understanding a native speaker interlocutor A2: catches quantity and size in an order" },
  "ITM-INT-0104": { level: "A2.1", descriptor: "Sociolinguistic appropriateness A2: can perform basic functions politely" },
  "ITM-INT-0105": { level: "A2.1", descriptor: "Transactions to obtain goods and services A2: can order a meal or drink" },
  "ITM-INT-0106": { level: "A2.1", descriptor: "Grammatical accuracy A2: number plus size plus plural noun" },

  // Atom 2, Two coffees, some water. Countable and uncountable with some is
  // Core Inventory A2; the plural s on its own is A1.
  "ITM-GRM-0201": { level: "A2.1", descriptor: "Grammatical accuracy A2: countable and uncountable in one noun phrase" },
  "ITM-GRM-0202": { level: "A2.1", descriptor: "Grammatical accuracy A2: some with an uncountable noun" },
  "ITM-GRM-0203": { level: "A2.1", descriptor: "Grammatical accuracy A2: notices a number used with an uncountable noun" },
  "ITM-GRM-0204": { level: "A2.1", descriptor: "Transactions A2 plus grammatical accuracy A2: Could I have some ..." },
  "ITM-GRM-0205": { level: "A2.1", descriptor: "Transactions to obtain goods and services A2: asks for an uncountable item" },
  "ITM-GRM-0206": { level: "A1.2", descriptor: "Orthographic control A1 to A2: plural s, no apostrophe" },

  // Atom 3, Platform 4 not 14. Teen against ty is Phonological control; the
  // task around it (public announcements, prices) is A2.
  "ITM-LST-0401": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: catches the number in a short announcement" },
  "ITM-LST-0402": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: writes down a price heard once" },
  "ITM-LST-0403": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: catches a clock time" },
  "ITM-LST-0404": { level: "A2.1", descriptor: "Understanding a native speaker interlocutor A2: catches a total price" },
  "ITM-LST-0405": { level: "A2.1", descriptor: "Phonological control A2: word stress on teen against ty" },
  "ITM-LST-0406": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: tens against teens in a notice" },

  // Atom 4, Meet Fatima. Correctly at A1.2 throughout.
  "ITM-SPK-0501": { level: "A1.2", descriptor: "Phonological control A1: repeats a model sentence intelligibly" },
  "ITM-SPK-0502": { level: "A1.1", descriptor: "Grammatical accuracy A1: present simple with I, no s" },
  "ITM-SPK-0503": { level: "A1.2", descriptor: "Describing experience A1: says what job they do" },
  "ITM-SPK-0504": { level: "A1.2", descriptor: "Describing experience A1: name, city and job in one turn" },
  "ITM-SPK-0505": { level: "A1.2", descriptor: "Describing experience A1: can describe themselves, what they do and where they live" },
  "ITM-SPK-0506": { level: "A1.1", descriptor: "Grammatical accuracy A1: live in with a city" },

  // Atom 5, Metro notices. Regulations in simple language is Reading
  // instructions A2; the single-word signs underneath are A1.
  "ITM-RDG-0601": { level: "A2.1", descriptor: "Reading instructions A2: can understand regulations expressed in simple language" },
  "ITM-RDG-0602": { level: "A2.1", descriptor: "Reading instructions A2: applies a prohibition to a new case" },
  "ITM-RDG-0603": { level: "A2.2", descriptor: "Reading for orientation A2: decides that the notice does not carry the information" },
  "ITM-RDG-0604": { level: "A2.1", descriptor: "Reading for orientation A2: finds what a short public notice is about" },
  "ITM-RDG-0605": { level: "A2.1", descriptor: "Relaying specific information in speech A2: one rule from a notice, in their own words" },
  "ITM-RDG-0606": { level: "A2.1", descriptor: "Reading instructions A2: understands a request on a public sign" },

  // Atom 6, Where are you. The video teaches A1.1 chunks; the items carry the
  // A2.1 work, which is message shape and a question about an arrangement.
  "ITM-WRT-0701": { level: "A2.1", descriptor: "Coherence and cohesion A2: greeting then question in a short message" },
  "ITM-WRT-0702": { level: "A1.2", descriptor: "Grammatical accuracy A2: corrects word order in a question" },
  "ITM-WRT-0703": { level: "A2.1", descriptor: "Grammatical accuracy A2: present continuous for an arrangement" },
  "ITM-WRT-0704": { level: "A2.1", descriptor: "Correspondence A2: can write short simple notes and messages on matters of immediate need" },
  "ITM-WRT-0705": { level: "A2.1", descriptor: "Grammatical accuracy A2: question with are plus ing and a place" },

  // Atom 7, The gas bill. Mediation of a short written text.
  "ITM-MED-0801": { level: "A2.1", descriptor: "Processing text in speech A2: identifies the obligation in a short bill" },
  "ITM-MED-0802": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: catches a date said once" },
  "ITM-MED-0803": { level: "A2.1", descriptor: "Relaying specific information A2: identifies which number the payer needs" },
  "ITM-MED-0804": { level: "A2.1", descriptor: "Relaying specific information in speech A2: can relay specific information from a short simple text" },
  "ITM-MED-0805": { level: "A2.2", descriptor: "Processing text in speech A2: maps website onto internet to answer how" },

  // Atom 8, We're out of oat milk. Dealing with a refusal and settling on an
  // alternative, which is Transactions A2.
  "ITM-INT-0901": { level: "A2.1", descriptor: "Transactions A2: asks for an alternative with instead" },
  "ITM-INT-0902": { level: "A1.2", descriptor: "Sociolinguistic appropriateness A2: accepts an alternative politely" },
  "ITM-INT-0903": { level: "A2.1", descriptor: "Identifying cues and inferring A2: works out out of from the situation" },
  "ITM-INT-0904": { level: "A2.1", descriptor: "Transactions to obtain goods and services A2: settles an alternative in three turns" },
  "ITM-INT-0905": { level: "A2.1", descriptor: "Understanding a native speaker interlocutor A2: hears that an item is unavailable" },

  // Atom 9, Yesterday today tomorrow. Past simple of regular verbs and will
  // are both Core Inventory A2.
  "ITM-GRM-0301": { level: "A2.1", descriptor: "Grammatical accuracy A2: time word chooses the verb form" },
  "ITM-GRM-0302": { level: "A2.1", descriptor: "Grammatical accuracy A2: past simple of a regular verb" },
  "ITM-GRM-0303": { level: "A2.1", descriptor: "Grammatical accuracy A2: will for a future arrangement" },
  "ITM-GRM-0304": { level: "A2.1", descriptor: "Describing experience A2: says what they did and what they will do" },
  "ITM-GRM-0305": { level: "A2.1", descriptor: "Grammatical accuracy A2: will plus plain verb" },

  // Atom 10, The bill please. Paying is the second half of Transactions A2.
  "ITM-INT-1001": { level: "A2.1", descriptor: "Transactions to obtain goods and services A2: asks for the bill" },
  "ITM-INT-1002": { level: "A2.1", descriptor: "Transactions A2: asks about the way of paying, pay by card" },
  "ITM-INT-1003": { level: "A1.2", descriptor: "Understanding a native speaker interlocutor A2: hears card against cash" },
  "ITM-INT-1004": { level: "A2.1", descriptor: "Transactions to obtain goods and services A2: asks for the bill in the scene" },
  "ITM-INT-1005": { level: "A2.1", descriptor: "Understanding announcements A2: hears bill in a minimal pair set" },

  // Day 5 and second session.
  "ITM-TEACH-0001": { level: "A2.1", descriptor: "Relaying specific information in speech A2: teaches the routine back to a classmate" },
  "ITM-VOTE-0001": { level: "A2.1", descriptor: "Sociolinguistic appropriateness A2: picks the polite form for a service encounter" },
  "ITM-FLU-0001": { level: "A2.1", descriptor: "Fluency A2: says a known order at speaking speed" },
  "ITM-FLU-0002": { level: "A1.2", descriptor: "Fluency A1 to A2: says a known self-introduction at speaking speed" },

  // Placement ladder, one item per band, Pre-A1 to B1 plus a B2 ceiling probe.
  "PLC-01": { level: "PreA1.1", descriptor: "Reception, Pre-A1: recognises a very frequent everyday word said slowly" },
  "PLC-02": { level: "A1.1", descriptor: "Grammatical accuracy A1: present of be with I" },
  "PLC-03": { level: "A1.2", descriptor: "Understanding conversation between others A1: catches where someone works" },
  "PLC-04": { level: "A2.1", descriptor: "Grammatical accuracy A2: past simple with a past time marker" },
  "PLC-05": { level: "A2.2", descriptor: "Reading instructions A2: checks a claim against opening times" },
  "PLC-06": { level: "B1.1", descriptor: "General linguistic range B1: second conditional" },
  "PLC-07": { level: "B1.2", descriptor: "Identifying cues and inferring B1: works out put off from context" },
  "PLC-08": { level: "B2.1", descriptor: "Grammatical accuracy B2: non-defining relative clause. Ceiling probe, above launch content" },

  // Checkpoint, scores only, no mic, by product rule.
  "CKP-01": { level: "A2.1", descriptor: "Sociolinguistic appropriateness A2: polite order with quantity and size" },
  "CKP-02": { level: "A2.1", descriptor: "Understanding announcements A2: teen against ty in a platform number" },
  "CKP-03": { level: "A2.1", descriptor: "Grammatical accuracy A2: some with an uncountable noun" },
  "CKP-04": { level: "A2.2", descriptor: "Reading instructions A2: two-part rule, inside against outside" },
  "CKP-05": { level: "A2.2", descriptor: "Grammatical accuracy A2: past simple of an irregular verb" },
  "CKP-06": { level: "B1.1", descriptor: "Identifying cues and inferring B1: reads an intention behind a reply" },
};

/** Level names in plain words, for any badge or progress line the learner sees. */
export const SUBLEVEL_PLAIN: Record<SubLevel, { band: string; step: string }> = {
  "PreA1.1": { band: "Pre-A1 · First words", step: "First half" },
  "PreA1.2": { band: "Pre-A1 · First words", step: "Second half" },
  "A1.1": { band: "A1 · Beginner", step: "First half" },
  "A1.2": { band: "A1 · Beginner", step: "Second half" },
  "A2.1": { band: "A2 · Elementary", step: "First half" },
  "A2.2": { band: "A2 · Elementary", step: "Second half" },
  "B1.1": { band: "B1 · Intermediate", step: "First half" },
  "B1.2": { band: "B1 · Intermediate", step: "Second half" },
  "B2.1": { band: "B2 · Upper intermediate", step: "First half" },
  "B2.2": { band: "B2 · Upper intermediate", step: "Second half" },
  "C1.1": { band: "C1 · Advanced", step: "First half" },
  "C1.2": { band: "C1 · Advanced", step: "Second half" },
  C2: { band: "C2 · Fluent", step: "" },
};

/** Top of the launch content. A learner above it is still placed here. */
export const PLACEMENT_CEILING: SubLevel = "B1.2";

export type PlacementAnswer = { level: SubLevel; correct: boolean };

/**
 * The placement cut score.
 *
 * One item per band and three options each means a single lucky tap has a one
 * in three chance, so the highest correct answer on its own is not evidence.
 * The rule is the staircase used in adaptive placement: take the highest band
 * answered correctly with no miss below it, and count it only if a second
 * correct answer supports it. Otherwise step one band down. Two adjacent
 * correct answers put the chance of a false placement at about one in nine,
 * and the engine's provisional items re-test the band in the first sessions,
 * so the rule only has to land within one band.
 *
 * No correct answer means PreA1.1 and a welcome atom. There is no fail state.
 */
export function placementLevel(answers: PlacementAnswer[]): SubLevel {
  const idx = (l: SubLevel) => SUBLEVELS.indexOf(l);
  const seen = [...answers].sort((a, b) => idx(a.level) - idx(b.level));
  let top = -1;
  for (const a of seen) {
    if (!a.correct) break;
    top = idx(a.level);
  }
  if (top < 0) {
    // The lowest band administered was missed. One band below the lowest band
    // they did answer correctly, if any, so a wobbly start never reads as a fail.
    const lowest = seen.find((a) => a.correct);
    return lowest ? SUBLEVELS[Math.max(0, idx(lowest.level) - 1)] : "PreA1.1";
  }
  const supporting = seen.filter((a) => a.correct && idx(a.level) <= top).length;
  const placed = supporting >= 2 ? top : Math.max(0, top - 1);
  return SUBLEVELS[Math.min(placed, idx(PLACEMENT_CEILING))];
}

export const STRAND_LABEL: Record<Strand, string> = {
  GRM: "Grammar", RDG: "Reading", WRT: "Writing", LST: "Listening", SPK: "Speaking", MED: "Mediation", INT: "Interaction",
};
