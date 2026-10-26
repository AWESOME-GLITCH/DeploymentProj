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
  // Week two of A2.1: an appointment, and getting to it. Appended, not inserted,
  // so pickWeekCanDo keeps offering the week one outcomes first (stable sort).
  { outcome_id: "OUT-A2.1-INT-08", strand: "INT", sublevel: "A2.1", icon: "📞", can_do: { en: "Can make an appointment on the phone", ar: "يمكنني تحديد موعد على الهاتف", es: "Puedo pedir una cita por teléfono", hi: "मैं फ़ोन पर अपॉइंटमेंट ले सकता हूँ", ru: "Могу записаться на приём по телефону", tr: "Telefonda randevu alabilirim", zh: "我能打电话预约" }, criteria: ["CRI-A2.1-INT-08-01"] },
  { outcome_id: "OUT-A2.1-GRM-09", strand: "GRM", sublevel: "A2.1", icon: "⚖️", can_do: { en: "Can compare two things", ar: "يمكنني المقارنة بين شيئين", es: "Puedo comparar dos cosas", hi: "मैं दो चीज़ों की तुलना कर सकता हूँ", ru: "Могу сравнить две вещи", tr: "İki şeyi karşılaştırabilirim", zh: "我能比较两样东西" }, criteria: ["CRI-A2.1-GRM-09-01"] },
  { outcome_id: "OUT-A2.1-SPK-10", strand: "SPK", sublevel: "A2.1", icon: "🧭", can_do: { en: "Can ask the way and check I understood", ar: "يمكنني السؤال عن الطريق والتأكد أنني فهمت", es: "Puedo preguntar el camino y comprobar que lo he entendido", hi: "मैं रास्ता पूछ सकता हूँ और अपनी समझ जाँच सकता हूँ", ru: "Могу спросить дорогу и проверить, что понял", tr: "Yol sorabilir ve anladığımı kontrol edebilirim", zh: "我能问路并确认听懂了" }, criteria: ["CRI-A2.1-SPK-10-01"] },
  { outcome_id: "OUT-A2.1-LST-11", strand: "LST", sublevel: "A2.1", icon: "🕧", can_do: { en: "Can catch the day and the time in a message", ar: "يمكنني التقاط اليوم والوقت في رسالة", es: "Puedo captar el día y la hora en un mensaje", hi: "मैं संदेश में दिन और समय पकड़ सकता हूँ", ru: "Могу уловить день и время в сообщении", tr: "Bir mesajdaki günü ve saati yakalayabilirim", zh: "我能听出留言里的日子和时间" }, criteria: ["CRI-A2.1-LST-11-01"] },
  { outcome_id: "OUT-A2.1-WRT-12", strand: "WRT", sublevel: "A2.1", icon: "✉️", can_do: { en: "Can write a message to change a time", ar: "يمكنني كتابة رسالة لتغيير الموعد", es: "Puedo escribir un mensaje para cambiar la hora", hi: "मैं समय बदलने के लिए संदेश लिख सकता हूँ", ru: "Могу написать сообщение, чтобы перенести время", tr: "Saati değiştirmek için mesaj yazabilirim", zh: "我能写消息改时间" }, criteria: ["CRI-A2.1-WRT-12-01"] },
  { outcome_id: "OUT-A2.1-MED-13", strand: "MED", sublevel: "A2.1", icon: "🗒️", can_do: { en: "Can pass on an appointment to someone else", ar: "يمكنني نقل موعد إلى شخص آخر", es: "Puedo transmitir una cita a otra persona", hi: "मैं किसी और को अपॉइंटमेंट की बात बता सकता हूँ", ru: "Могу передать другому время приёма", tr: "Bir randevuyu başkasına aktarabilirim", zh: "我能把预约转告别人" }, criteria: ["CRI-A2.1-MED-13-01"] },
  // Pre-A1 to A1.1 starter slice: the three things a learner with no English
  // needs before the A1.2 and A2.1 content above can be met at all.
  { outcome_id: "OUT-PreA1.1-SPK-14", strand: "SPK", sublevel: "PreA1.1", icon: "👋", can_do: { en: "Can say hello and give my name", ar: "يمكنني قول مرحبًا وذكر اسمي", es: "Puedo saludar y decir mi nombre", hi: "मैं नमस्ते कह सकता हूँ और अपना नाम बता सकता हूँ", ru: "Могу поздороваться и назвать своё имя", tr: "Merhaba deyip adımı söyleyebilirim", zh: "我能打招呼并说出名字" }, criteria: ["CRI-PreA1.1-SPK-14-01"] },
  { outcome_id: "OUT-PreA1.2-INT-15", strand: "INT", sublevel: "PreA1.2", icon: "🛍️", can_do: { en: "Can ask for one thing in a shop", ar: "يمكنني طلب شيء واحد في المتجر", es: "Puedo pedir una cosa en una tienda", hi: "मैं दुकान में एक चीज़ माँग सकता हूँ", ru: "Могу попросить одну вещь в магазине", tr: "Bir dükkanda bir şey isteyebilirim", zh: "我能在商店要一样东西" }, criteria: ["CRI-PreA1.2-INT-15-01"] },
  { outcome_id: "OUT-A1.1-GRM-16", strand: "GRM", sublevel: "A1.1", icon: "🙂", can_do: { en: "Can say who I am and where I am from", ar: "يمكنني قول من أنا ومن أين أنا", es: "Puedo decir quién soy y de dónde soy", hi: "मैं बता सकता हूँ कि मैं कौन हूँ और कहाँ से हूँ", ru: "Могу сказать, кто я и откуда", tr: "Kim olduğumu ve nereli olduğumu söyleyebilirim", zh: "我能说我是谁、我来自哪里" }, criteria: ["CRI-A1.1-GRM-16-01"] },
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
  // Week two and the starter slice. Every criterion here is `ai`, including the
  // two grammar ones, because the lesson spine of learning-model.md §1.7 makes
  // the delayed check a spoken say-it and `complete_session` (store.tsx) drops
  // spoken attempts from a keyed sitting. A keyed criterion would therefore need
  // three non-spoken items in one session to pass a sitting, which the new spine
  // does not have. AI sittings are also what the PRD asks for: grammar mastery is
  // inferred from correct use in communicative production, not from taps.
  { criterion_id: "CRI-A2.1-INT-08-01", outcome_id: "OUT-A2.1-INT-08", strand: "INT", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-INT-01-01"], descriptor: { en: "Ask for an appointment, then take the time offered or ask for another one", ar: "اطلب موعدًا، ثم اقبل الوقت المعروض أو اطلب وقتًا آخر", es: "Pedir una cita y luego aceptar la hora ofrecida o pedir otra" } },
  { criterion_id: "CRI-A2.1-GRM-09-01", outcome_id: "OUT-A2.1-GRM-09", strand: "GRM", type: "grammar", mastery_rule: "ai", prerequisites: ["CRI-A2.1-INT-08-01"], descriptor: { en: "Compare two things with the er form and than", ar: "قارن بين شيئين باستخدام صيغة er و than", es: "Comparar dos cosas con la forma er y than" } },
  { criterion_id: "CRI-A2.1-SPK-10-01", outcome_id: "OUT-A2.1-SPK-10", strand: "SPK", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-INT-08-01"], descriptor: { en: "Ask the way, then say the directions back to check them", ar: "اسأل عن الطريق، ثم أعد الاتجاهات للتأكد منها", es: "Preguntar el camino y repetir las indicaciones para comprobarlas" } },
  { criterion_id: "CRI-A2.1-LST-11-01", outcome_id: "OUT-A2.1-LST-11", strand: "LST", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-LST-03-01"], descriptor: { en: "Catch the day and the clock time, and ask again when you are not sure", ar: "التقط اليوم والوقت، واسأل مرة أخرى عندما لا تكون متأكدًا", es: "Captar el día y la hora, y volver a preguntar cuando no estás seguro" } },
  { criterion_id: "CRI-A2.1-WRT-12-01", outcome_id: "OUT-A2.1-WRT-12", strand: "WRT", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-WRT-05-01"], descriptor: { en: "A short message that says sorry, gives a reason and asks for a later time", ar: "رسالة قصيرة تعتذر وتذكر السبب وتطلب وقتًا لاحقًا", es: "Un mensaje corto que pide perdón, da un motivo y pide una hora más tarde" } },
  { criterion_id: "CRI-A2.1-MED-13-01", outcome_id: "OUT-A2.1-MED-13", strand: "MED", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-A2.1-MED-06-01"], descriptor: { en: "Tell someone the day, the time and the place of an appointment", ar: "أخبر شخصًا بيوم الموعد ووقته ومكانه", es: "Decir a alguien el día, la hora y el lugar de una cita" } },
  { criterion_id: "CRI-PreA1.1-SPK-14-01", outcome_id: "OUT-PreA1.1-SPK-14", strand: "SPK", type: "communicative", mastery_rule: "ai", prerequisites: [], descriptor: { en: "Say hello, give your name, and answer What is your name?", ar: "قل مرحبًا، اذكر اسمك، وأجب على What is your name؟", es: "Saludar, decir tu nombre y responder a What is your name?" } },
  { criterion_id: "CRI-PreA1.2-INT-15-01", outcome_id: "OUT-PreA1.2-INT-15", strand: "INT", type: "communicative", mastery_rule: "ai", prerequisites: ["CRI-PreA1.1-SPK-14-01"], descriptor: { en: "Ask for a thing with a number and please, and say thank you", ar: "اطلب شيئًا مع رقم و please، وقل thank you", es: "Pedir algo con un número y please, y decir thank you" } },
  { criterion_id: "CRI-A1.1-GRM-16-01", outcome_id: "OUT-A1.1-GRM-16", strand: "GRM", type: "grammar", mastery_rule: "ai", prerequisites: ["CRI-PreA1.2-INT-15-01"], descriptor: { en: "Use I'm and you're to say who you are and where you are from", ar: "استخدم I'm و you're لتقول من أنت ومن أين أنت", es: "Usar I'm y you're para decir quién eres y de dónde eres" } },
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
  I("ITM-INT-0103", "CRI-A2.1-INT-01-01", "INT", "pick_picture", { stem: { en: "Listen. Which one?" }, audio: "I'd like two large teas, please.", pictures: [{ emoji: "🍵", label: "one large tea" }, { emoji: "🍵🍵", label: "two large teas" }, { emoji: "🍵🍵🍵", label: "three large teas" }], key: 1, modality: "recognition", why: { en: "Two large teas. The number first, then the size, then the drink.", ar: "Two large teas. الرقم أولًا، ثم الحجم، ثم المشروب.", es: "Two large teas. Primero el número, luego el tamaño, luego la bebida." } }),
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

  // ===== A2.1, week two: an appointment, and getting to it ==================
  // Authored to the lesson spine of docs/learning-model.md §1.2: the first item
  // of every atom is the learner's spoken turn with the coach, the scaffolds come
  // after it, the use-it item is the whole exchange with one problem to repair,
  // and the delayed check is a say-it of the whole sentence.

  // Atom 11: Monday at ten (INT-08-01). Target: Could I make an appointment, please?
  I("ITM-INT-1201", "CRI-A2.1-INT-08-01", "INT", "dialogue_turn", { stem: { en: "Ask for an appointment." }, config: { character: "Noor", turns: [{ say: "Good morning, Hillside Health Centre.", keywords: ["appointment", "could i", "can i", "doctor", "please", "make", "see"] }], need: 1 }, modality: "spoken", why: { en: "Could I make an appointment, please?", ar: "Could I make an appointment, please?", es: "Could I make an appointment, please?" } }),
  I("ITM-INT-1202", "CRI-A2.1-INT-08-01", "INT", "tap_order", { stem: { en: "Could I make an appointment, please?" }, options: ["an", "Could", "please?", "appointment,", "I", "make"], key: "Could I make an appointment, please?", modality: "cued", why: { en: "Could I, then what you want, then please.", ar: "Could I أولًا، ثم ما تريده، ثم please.", es: "Primero Could I, luego lo que quieres y después please." } }),
  I("ITM-INT-1203", "CRI-A2.1-INT-08-01", "INT", "transform", { stem: { en: "Make it polite: I want to see the doctor." }, key: "Could I see the doctor, please", config: { accept: ["could i see the doctor please", "could i see the doctor, please", "could i see the doctor", "can i see the doctor please", "can i see the doctor"] }, modality: "typed", why: { en: "Could I see the doctor, please? The same words as the cafe.", ar: "Could I see the doctor, please? نفس كلمات المقهى.", es: "Could I see the doctor, please? Las mismas palabras que en la cafetería." } }),
  I("ITM-INT-1204", "CRI-A2.1-INT-08-01", "INT", "roleplay", { stem: { en: "Make an appointment. Monday is full, so agree another day." }, config: { character: "Noor", turns: [{ say: "Good morning, Hillside Health Centre.", keywords: ["appointment", "could i", "can i", "doctor", "please", "make", "see"] }, { say: "I'm sorry, Monday is full. Tuesday at nine?", keywords: ["tuesday", "nine", "fine", "ok", "okay", "yes", "thank", "later", "earlier", "anything", "afternoon"] }, { say: "Tuesday at nine, then. What is your name?", keywords: ["i'm", "my name", "name is", "it's", "thank"] }], need: 2 }, modality: "spoken", why: { en: "Tuesday at nine is fine, thank you.", ar: "Tuesday at nine is fine, thank you.", es: "Tuesday at nine is fine, thank you." } }),
  I("ITM-INT-1205", "CRI-A2.1-INT-08-01", "INT", "read_aloud", { stem: { en: "Say it. Ask for an appointment." }, key: "Could I make an appointment, please? Monday at ten is fine.", modality: "spoken", why: { en: "Could I make an appointment, please? Monday at ten is fine.", ar: "Could I make an appointment, please? Monday at ten is fine.", es: "Could I make an appointment, please? Monday at ten is fine." } }),

  // Atom 12: Earlier or later? (GRM-09-01). Target: the er form plus than.
  I("ITM-GRM-1301", "CRI-A2.1-GRM-09-01", "GRM", "dialogue_turn", { stem: { en: "The taxi is £12. The bus is £2. Tell Maya." }, config: { character: "Maya", turns: [{ say: "The taxi is twelve pounds. The bus is two pounds.", keywords: ["cheaper", "bus", "than", "less"] }], need: 1 }, modality: "spoken", why: { en: "The bus is cheaper than the taxi.", ar: "The bus is cheaper than the taxi.", es: "The bus is cheaper than the taxi." } }),
  I("ITM-GRM-1302", "CRI-A2.1-GRM-09-01", "GRM", "magnet_tiles", { stem: { en: "Build the sentence." }, options: ["than", "The", "cheaper", "bus", "the", "is", "taxi"], key: "The bus is cheaper than the taxi", modality: "cued", why: { en: "Cheaper, then than, then the second thing.", ar: "cheaper ثم than ثم الشيء الثاني.", es: "Cheaper, luego than, luego la segunda cosa." } }),
  I("ITM-GRM-1303", "CRI-A2.1-GRM-09-01", "GRM", "error_spot", { stem: { en: "Tap the word that is wrong." }, options: ["The", "bus", "is", "more", "cheap."], key: 3, modality: "recognition", why: { en: "Short words add er: cheaper. Not more cheap.", ar: "الكلمات القصيرة تأخذ er: cheaper، وليس more cheap.", es: "Las palabras cortas añaden er: cheaper, no more cheap." } }),
  I("ITM-GRM-1304", "CRI-A2.1-GRM-09-01", "GRM", "tap_order", { stem: { en: "Is there anything earlier?" }, options: ["anything", "Is", "earlier?", "there"], key: "Is there anything earlier?", modality: "cued", why: { en: "Is there anything earlier? Ask this for a better time.", ar: "Is there anything earlier? اسأل هكذا عن وقت أفضل.", es: "Is there anything earlier? Pregunta así por una hora mejor." } }),
  I("ITM-GRM-1305", "CRI-A2.1-GRM-09-01", "GRM", "open_response", { stem: { en: "Compare two ways to get to work. Say two sentences." }, config: { targets: ["than", "cheaper", "quicker", "nearer", "earlier", "later"], need: 2, min_sentences: 2, seconds: 30, variants: ["Compare two ways to get to work. Say two sentences.", "Compare two shops near you. Say two sentences."] }, modality: "spoken", why: { en: "The bus is cheaper than the taxi, but the taxi is quicker.", ar: "The bus is cheaper than the taxi, but the taxi is quicker.", es: "The bus is cheaper than the taxi, but the taxi is quicker." } }),
  I("ITM-GRM-1306", "CRI-A2.1-GRM-09-01", "GRM", "read_aloud", { stem: { en: "Say it. Compare the two." }, key: "The bus is cheaper than the taxi, but the train is quicker.", modality: "spoken", why: { en: "The bus is cheaper than the taxi, but the train is quicker.", ar: "The bus is cheaper than the taxi, but the train is quicker.", es: "The bus is cheaper than the taxi, but the train is quicker." } }),

  // Atom 13: Which way to the health centre? (SPK-10-01). Target: how do I get to ...
  I("ITM-SPK-1401", "CRI-A2.1-SPK-10-01", "SPK", "dialogue_turn", { stem: { en: "You are lost. Ask the way." }, config: { character: "Sami", turns: [{ say: "Are you all right? You look lost.", keywords: ["excuse me", "how do i get", "where is", "health centre", "way", "please"] }], need: 1 }, modality: "spoken", why: { en: "Excuse me, how do I get to the health centre?", ar: "Excuse me, how do I get to the health centre?", es: "Excuse me, how do I get to the health centre?" } }),
  I("ITM-SPK-1402", "CRI-A2.1-SPK-10-01", "SPK", "tap_order", { stem: { en: "How do I get to the station?" }, options: ["get", "How", "to", "do", "I", "the", "station?"], key: "How do I get to the station?", modality: "cued", why: { en: "How do I get to, then the place you want.", ar: "How do I get to ثم المكان الذي تريده.", es: "How do I get to y después el lugar." } }),
  I("ITM-SPK-1403", "CRI-A2.1-SPK-10-01", "SPK", "dictation", { stem: { en: "Listen and type the directions." }, audio: "Go straight on and take the second left.", key: "Go straight on and take the second left", config: { accept: ["go straight on and take the second left", "go straight on and take the second left.", "straight on and take the second left", "go straight on, take the second left"] }, modality: "typed", why: { en: "Go straight on and take the second left.", ar: "Go straight on and take the second left.", es: "Go straight on and take the second left." } }),
  I("ITM-SPK-1404", "CRI-A2.1-SPK-10-01", "SPK", "roleplay", { stem: { en: "Ask the way to the health centre. Say the directions back." }, config: { character: "Sami", turns: [{ say: "Hello. Can I help you?", keywords: ["excuse me", "how do i get", "health centre", "way", "please", "where is"] }, { say: "Go straight on and take the second left.", keywords: ["second left", "straight", "thank", "so", "again", "sorry", "left"] }, { say: "That's right. It is next to the chemist.", keywords: ["thank", "thanks", "chemist", "next to", "ok", "got it"] }], need: 2 }, modality: "spoken", why: { en: "The second left, next to the chemist. Thank you.", ar: "The second left, next to the chemist. Thank you.", es: "The second left, next to the chemist. Thank you." } }),
  I("ITM-SPK-1405", "CRI-A2.1-SPK-10-01", "SPK", "read_aloud", { stem: { en: "Say it. Ask the way." }, key: "Excuse me, how do I get to the health centre?", modality: "spoken", why: { en: "Excuse me, how do I get to the health centre?", ar: "Excuse me, how do I get to the health centre?", es: "Excuse me, how do I get to the health centre?" } }),

  // Atom 14: Thursday at half past six (LST-11-01). Target: the day plus the clock time.
  I("ITM-LST-1501", "CRI-A2.1-LST-11-01", "LST", "dialogue_turn", { stem: { en: "Listen. Say the day and the time back." }, config: { character: "Noor", turns: [{ say: "Your appointment is on Thursday at half past six.", keywords: ["thursday", "half past six", "six thirty", "half six", "6.30"] }], need: 1 }, modality: "spoken", why: { en: "Thursday at half past six.", ar: "Thursday at half past six.", es: "Thursday at half past six." } }),
  I("ITM-LST-1502", "CRI-A2.1-LST-11-01", "LST", "dictation", { stem: { en: "Listen and type the day and the time." }, audio: "Your appointment is on Thursday at half past six.", key: "Thursday half past six", config: { accept: ["thursday half past six", "thursday at half past six", "thursday, half past six", "thursday 6.30", "thursday 6:30", "thursday 18.30", "thursday 18:30", "thursday six thirty"] }, modality: "typed", why: { en: "Half past six is 6.30.", ar: "Half past six تعني 6.30.", es: "Half past six es 6.30." } }),
  I("ITM-LST-1503", "CRI-A2.1-LST-11-01", "LST", "detail_gap", { stem: { en: "The dentist can see you on ___." }, audio: "The dentist can see you on Tuesday at nine.", options: ["Tuesday", "Thursday", "Saturday"], key: 0, modality: "recognition", why: { en: "TUESday starts with a t sound and a long oo.", ar: "TUESday تبدأ بصوت t ثم oo طويلة.", es: "TUESday empieza con t y una u larga." } }),
  I("ITM-LST-1504", "CRI-A2.1-LST-11-01", "LST", "dictation", { stem: { en: "Listen and type the time." }, audio: "Quarter to five, please.", key: "4.45", config: { accept: ["4.45", "4:45", "quarter to five", "16.45", "16:45", "four forty five"] }, modality: "typed", why: { en: "Quarter to five is 4.45, fifteen minutes before five.", ar: "Quarter to five تعني 4.45، أي ربع ساعة قبل الخامسة.", es: "Quarter to five es 4.45, un cuarto antes de las cinco." } }),
  I("ITM-LST-1505", "CRI-A2.1-LST-11-01", "LST", "roleplay", { stem: { en: "Listen and check the day and the time. Ask again if you are not sure." }, config: { character: "Noor", turns: [{ say: "Hello, this is Hillside Health Centre. Your appointment is on Thursday at half past six.", keywords: ["sorry", "again", "repeat", "pardon", "say that", "thursday", "half past"] }, { say: "Of course. Thursday, half past six.", keywords: ["thursday", "half past six", "six thirty", "half six", "thank", "yes", "got it"] }, { say: "That's right. Please come ten minutes early.", keywords: ["ten minutes", "early", "twenty past", "thank", "ok", "yes"] }], need: 2 }, modality: "spoken", why: { en: "Sorry, could you say that again? Thursday at half past six.", ar: "Sorry, could you say that again? Thursday at half past six.", es: "Sorry, could you say that again? Thursday at half past six." } }),
  I("ITM-LST-1506", "CRI-A2.1-LST-11-01", "LST", "read_aloud", { stem: { en: "Say it. The day and the time." }, key: "My appointment is on Thursday at half past six.", modality: "spoken", why: { en: "My appointment is on Thursday at half past six.", ar: "My appointment is on Thursday at half past six.", es: "My appointment is on Thursday at half past six." } }),

  // Atom 15: Sorry, I can't come at ten (WRT-12-01). Target: sorry, reason, new time.
  I("ITM-WRT-1601", "CRI-A2.1-WRT-12-01", "WRT", "shadow", { stem: { en: "Speak along with Maya." }, key: "I'm sorry, I can't come at ten.", modality: "spoken", why: { en: "I'm SORry, I CAN'T come at TEN.", ar: "I'm SORry, I CAN'T come at TEN.", es: "I'm SORry, I CAN'T come at TEN." } }),
  I("ITM-WRT-1602", "CRI-A2.1-WRT-12-01", "WRT", "tap_order", { stem: { en: "Could we make it later?" }, options: ["make", "Could", "later?", "we", "it"], key: "Could we make it later?", modality: "cued", why: { en: "Could we make it later? This asks for a new time.", ar: "Could we make it later? هذا سؤال عن وقت جديد.", es: "Could we make it later? Así pides una hora nueva." } }),
  I("ITM-WRT-1603", "CRI-A2.1-WRT-12-01", "WRT", "correct_message", { stem: { en: "Fix the message: I no can come at ten." }, key: "I can't come at ten", config: { accept: ["i can't come at ten", "i cannot come at ten", "i can't come at ten.", "i'm sorry i can't come at ten"] }, modality: "typed", why: { en: "I can't come. Can't goes after I, before the verb.", ar: "I can't come. تأتي can't بعد I وقبل الفعل.", es: "I can't come. Can't va después de I y antes del verbo." } }),
  I("ITM-WRT-1604", "CRI-A2.1-WRT-12-01", "WRT", "dictation", { stem: { en: "Listen and type it." }, audio: "I can't come at ten because I'm at work.", key: "I can't come at ten because I'm at work", config: { accept: ["i can't come at ten because i'm at work", "i can't come at ten because i am at work", "i cannot come at ten because i'm at work", "i can't come at ten because i'm at work."] }, modality: "typed", why: { en: "Because gives the reason: because I'm at work.", ar: "because تذكر السبب: because I'm at work.", es: "Because da el motivo: because I'm at work." } }),
  I("ITM-WRT-1605", "CRI-A2.1-WRT-12-01", "WRT", "short_production", { stem: { en: "You cannot come at ten. Write two lines: say sorry with a reason, and ask for a later time." }, config: { targets: ["sorry", "because", "later"], min_words: 12, max_words: 60, variants: ["You cannot come at ten. Write two lines: say sorry with a reason, and ask for a later time.", "You cannot come on Monday. Write two lines: say sorry with a reason, and ask for another day."] }, modality: "typed", why: { en: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?", ar: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?", es: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?" } }),
  I("ITM-WRT-1606", "CRI-A2.1-WRT-12-01", "WRT", "read_aloud", { stem: { en: "Say it. Sorry, the reason, the new time." }, key: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?", modality: "spoken", why: { en: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?", ar: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?", es: "I'm sorry, I can't come at ten because I'm at work. Could we make it later?" } }),

  // Atom 16: Pass on the appointment (MED-13-01). Target: the day, the time and the place.
  I("ITM-MED-1701", "CRI-A2.1-MED-13-01", "MED", "dialogue_turn", { stem: { en: "Sami cannot read the card. Tell him the day." }, config: { character: "Sami", turns: [{ say: "What does the card say? When do I go?", keywords: ["thursday", "half past six", "six thirty", "18.30", "appointment", "on"] }], need: 1 }, modality: "spoken", why: { en: "Your appointment is on Thursday at half past six.", ar: "Your appointment is on Thursday at half past six.", es: "Your appointment is on Thursday at half past six." } }),
  I("ITM-MED-1702", "CRI-A2.1-MED-13-01", "MED", "tfng", { stem: { en: "Sami must come at six o'clock." }, config: { text: "Appointment card. Hillside Health Centre. Thursday 18.30. Please arrive ten minutes early." }, options: ["True", "False", "It does not say"], key: 1, modality: "recognition", why: { en: "18.30 is half past six, not six o'clock. False.", ar: "18.30 تعني السادسة والنصف وليس السادسة. خطأ.", es: "18.30 es las seis y media, no las seis. Falso." } }),
  I("ITM-MED-1703", "CRI-A2.1-MED-13-01", "MED", "tfng", { stem: { en: "Sami can bring his brother." }, config: { text: "Appointment card. Hillside Health Centre. Thursday 18.30. Please arrive ten minutes early." }, options: ["True", "False", "It does not say"], key: 2, modality: "recognition", why: { en: "The card says nothing about other people. It does not say.", ar: "البطاقة لا تذكر أشخاصًا آخرين. غير مذكور.", es: "La tarjeta no dice nada de otras personas. No lo dice." } }),
  I("ITM-MED-1704", "CRI-A2.1-MED-13-01", "MED", "relay", { stem: { en: "Tell Sami the three things on the card." }, config: { source: "Appointment card. Hillside Health Centre. Thursday 18.30. Please arrive ten minutes early.", questions: [{ q: "Which day?", keywords: ["thursday"] }, { q: "What time?", keywords: ["half past six", "6.30", "six thirty", "18.30", "half six"] }, { q: "When must he arrive?", keywords: ["ten minutes", "early", "twenty past", "6.20"] }], need: 2, character: "Sami" }, modality: "spoken", why: { en: "Thursday, half past six, and be there ten minutes early.", ar: "Thursday, half past six, and be there ten minutes early.", es: "Thursday, half past six, and be there ten minutes early." } }),
  I("ITM-MED-1705", "CRI-A2.1-MED-13-01", "MED", "read_aloud", { stem: { en: "Say it. The day, the time, the place." }, key: "Your appointment is on Thursday at half past six, at the health centre.", modality: "spoken", why: { en: "Your appointment is on Thursday at half past six, at the health centre.", ar: "Your appointment is on Thursday at half past six, at the health centre.", es: "Your appointment is on Thursday at half past six, at the health centre." } }),

  // ===== Pre-A1 to A1.1 starter slice =====================================
  // Instructions are five words or fewer, every item ends in the learner saying
  // the whole sentence, and nothing is tested that the scene has not shown.

  // Atom 17: Hello, I'm Ana (PreA1.1 SPK-14-01). Target: Hello. I'm + name.
  I("ITM-SPK-1801", "CRI-PreA1.1-SPK-14-01", "SPK", "dialogue_turn", { stem: { en: "Say hello. Say your name." }, config: { character: "Ana", turns: [{ say: "Hello. I'm Ana. What is your name?", keywords: ["i'm", "im", "hello", "hi", "my name", "name is"] }], need: 1 }, modality: "spoken", why: { en: "Hello. I'm and then your name.", ar: "Hello. I'm ثم اسمك.", es: "Hello. I'm y después tu nombre." } }),
  I("ITM-SPK-1802", "CRI-PreA1.1-SPK-14-01", "SPK", "tap_order", { stem: { en: "Hello. I'm Omar." }, options: ["I'm", "Hello.", "Omar."], key: "Hello. I'm Omar.", modality: "cued", why: { en: "Hello first. Then I'm and the name.", ar: "Hello أولًا، ثم I'm والاسم.", es: "Primero Hello. Después I'm y el nombre." } }),
  I("ITM-SPK-1803", "CRI-PreA1.1-SPK-14-01", "SPK", "magnet_tiles", { stem: { en: "Build the question." }, options: ["name?", "What", "your", "is"], key: "What is your name", modality: "cued", why: { en: "What is your name? Ask this to learn a name.", ar: "What is your name? اسأل هكذا لتعرف الاسم.", es: "What is your name? Pregunta así para saber un nombre." } }),
  I("ITM-SPK-1804", "CRI-PreA1.1-SPK-14-01", "SPK", "open_response", { stem: { en: "Say hello and your name. 20 seconds." }, config: { targets: ["hello", "i'm"], need: 2, min_sentences: 1, seconds: 20, variants: ["Say hello and your name. 20 seconds.", "A new classmate says hello. Say hello and your name. 20 seconds."] }, modality: "spoken", why: { en: "Hello. I'm Ana.", ar: "Hello. I'm Ana.", es: "Hello. I'm Ana." } }),
  I("ITM-SPK-1805", "CRI-PreA1.1-SPK-14-01", "SPK", "read_aloud", { stem: { en: "Say it. Hello and your name." }, key: "Hello. I'm Ana.", modality: "spoken", why: { en: "Hello. I'm Ana.", ar: "Hello. I'm Ana.", es: "Hello. I'm Ana." } }),

  // Atom 18: Two, please (PreA1.2 INT-15-01). Target: number plus thing plus please.
  I("ITM-INT-1901", "CRI-PreA1.2-INT-15-01", "INT", "dialogue_turn", { stem: { en: "Ask for two apples." }, config: { character: "Leo", turns: [{ say: "Hello. What would you like?", keywords: ["two", "apples", "apple", "please", "one"] }], need: 1 }, modality: "spoken", why: { en: "Two apples, please.", ar: "Two apples, please.", es: "Two apples, please." } }),
  I("ITM-INT-1902", "CRI-PreA1.2-INT-15-01", "INT", "tap_order", { stem: { en: "Two apples, please." }, options: ["please.", "Two", "apples,"], key: "Two apples, please.", modality: "cued", why: { en: "The number, the thing, then please.", ar: "الرقم، ثم الشيء، ثم please.", es: "El número, la cosa y después please." } }),
  I("ITM-INT-1903", "CRI-PreA1.2-INT-15-01", "INT", "magnet_tiles", { stem: { en: "Build it." }, options: ["tea,", "One", "please"], key: "One tea please", modality: "cued", why: { en: "One tea, please. One thing, so one.", ar: "One tea, please. شيء واحد، إذن One.", es: "One tea, please. Una cosa, por eso One." } }),
  I("ITM-INT-1904", "CRI-PreA1.2-INT-15-01", "INT", "roleplay", { stem: { en: "Buy two apples. The shop has no apples today." }, config: { character: "Leo", turns: [{ say: "Hello. What would you like?", keywords: ["two", "apples", "apple", "please"] }, { say: "Sorry, no apples today.", keywords: ["ok", "okay", "water", "tea", "two", "one", "please", "thank", "bananas"] }, { say: "Here you are. Two pounds.", keywords: ["thank", "thanks", "thank you", "here", "ok"] }], need: 2 }, modality: "spoken", why: { en: "No apples. Then: two bananas, please. Thank you.", ar: "No apples. إذن: two bananas, please. Thank you.", es: "No apples. Entonces: two bananas, please. Thank you." } }),
  I("ITM-INT-1905", "CRI-PreA1.2-INT-15-01", "INT", "read_aloud", { stem: { en: "Say it. Ask for two apples." }, key: "Two apples, please. Thank you.", modality: "spoken", why: { en: "Two apples, please. Thank you.", ar: "Two apples, please. Thank you.", es: "Two apples, please. Thank you." } }),

  // Atom 19: I'm from Spain (A1.1 GRM-16-01). Target: I'm and you're.
  I("ITM-GRM-2001", "CRI-A1.1-GRM-16-01", "GRM", "shadow", { stem: { en: "Speak along with Ana." }, key: "I'm Ana. I'm from Spain.", modality: "spoken", why: { en: "I'm ANa. I'm from SPAIN.", ar: "I'm ANa. I'm from SPAIN.", es: "I'm ANa. I'm from SPAIN." } }),
  I("ITM-GRM-2002", "CRI-A1.1-GRM-16-01", "GRM", "tap_order", { stem: { en: "I'm from Egypt." }, options: ["from", "I'm", "Egypt."], key: "I'm from Egypt.", modality: "cued", why: { en: "I'm from, then the country.", ar: "I'm from ثم البلد.", es: "I'm from y después el país." } }),
  I("ITM-GRM-2003", "CRI-A1.1-GRM-16-01", "GRM", "error_spot", { stem: { en: "Tap the word that is wrong." }, options: ["You", "am", "from", "Egypt."], key: 1, modality: "recognition", why: { en: "You are from Egypt. Am goes with I only.", ar: "You are from Egypt. أما am فتأتي مع I فقط.", es: "You are from Egypt. Am va solo con I." } }),
  I("ITM-GRM-2004", "CRI-A1.1-GRM-16-01", "GRM", "magnet_tiles", { stem: { en: "Build the question." }, options: ["from?", "Where", "you", "are"], key: "Where are you from", modality: "cued", why: { en: "Where are you from? Are comes before you.", ar: "Where are you from? تأتي are قبل you.", es: "Where are you from? Are va antes de you." } }),
  I("ITM-GRM-2005", "CRI-A1.1-GRM-16-01", "GRM", "open_response", { stem: { en: "Say your name, your country, your city. 20 seconds." }, config: { targets: ["i'm", "from", "in"], need: 2, min_sentences: 2, seconds: 20, variants: ["Say your name, your country, your city. 20 seconds.", "A new classmate asks about you. Say your name, your country and your city. 20 seconds."] }, modality: "spoken", why: { en: "I'm Ana. I'm from Spain. I'm in London.", ar: "I'm Ana. I'm from Spain. I'm in London.", es: "I'm Ana. I'm from Spain. I'm in London." } }),
  I("ITM-GRM-2006", "CRI-A1.1-GRM-16-01", "GRM", "read_aloud", { stem: { en: "Say it. Name, country, city." }, key: "I'm Ana. I'm from Spain. I'm in London.", modality: "spoken", why: { en: "I'm Ana. I'm from Spain. I'm in London.", ar: "I'm Ana. I'm from Spain. I'm in London.", es: "I'm Ana. I'm from Spain. I'm in London." } }),
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
  // ===== A2.1, week two ====================================================
  // `phases` is authored in the lesson order of docs/learning-model.md §1.2:
  // input, noticing, free_use (the learner's first spoken turn), controlled
  // (the scaffolds that repair what the turn showed), free_use (the whole
  // exchange), check (the delayed say-it). AtomRun walks the array in authored
  // order, so the two free_use phases need no code change. The week one atoms
  // above are still in the old order and are LP-30's reorder, not this ticket's.
  {
    atom_id: "ATM-A2-INT-0012", version: 1, criterion_id: "CRI-A2.1-INT-08-01", strand: "INT", sublevel: "A2.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "Monday at ten", ar: "الاثنين في العاشرة", es: "El lunes a las diez", hi: "सोमवार दस बजे", ru: "В понедельник в десять", tr: "Pazartesi saat onda", zh: "星期一十点" },
    target_items: ["ITM-INT-1201", "ITM-INT-1202", "ITM-INT-1203", "ITM-INT-1204", "ITM-INT-1205"],
    prerequisites: ["CRI-A2.1-INT-01-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "Monday at ten", presenter: "Noor, a health centre in London", duration_sec: 50, l1_card: { en: "Asking for an appointment on the phone", ar: "طلب موعد على الهاتف", es: "Pedir una cita por teléfono", hi: "फ़ोन पर अपॉइंटमेंट माँगना", ru: "Как записаться на приём по телефону", tr: "Telefonda randevu istemek", zh: "打电话预约" }, lines: [
        { text: "Tuesday morning. Omar has a bad tooth.", at: 0 },
        { text: "Hillside Health Centre. How can I help?", at: 5 },
        { text: "Could I make an appointment, please?", at: 11, target: true },
        { text: "Of course. Monday at ten?", at: 17 },
        { text: "Monday at ten is fine, thank you.", at: 22, target: true },
        { text: "Could I ... please. The same words as the cafe.", at: 28 },
        { text: "Say it with me. Could I make an appointment, please?", at: 35, target: true },
        { text: "Could I make an appointment, please?", at: 45, target: true },
      ] } },
      { kind: "noticing", highlight: "Could I make an appointment, please?", why: { en: "Could I, then what you want. The same words as the cafe.", ar: "Could I ثم ما تريده. نفس كلمات المقهى.", es: "Could I y luego lo que quieres. Las mismas palabras que en la cafetería.", hi: "Could I, फिर आपको क्या चाहिए। कैफ़े जैसे ही शब्द।", ru: "Could I, затем то, что нужно. Те же слова, что в кафе.", tr: "Could I, sonra istediğin şey. Kafedeki aynı sözler.", zh: "先说 Could I，再说你要什么。和咖啡馆一样。" } },
      { kind: "free_use", items: ["ITM-INT-1201"] },
      { kind: "controlled", items: ["ITM-INT-1202", "ITM-INT-1203"] },
      { kind: "free_use", items: ["ITM-INT-1204"] },
      { kind: "check", items: ["ITM-INT-1205"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-GRM-0013", version: 1, criterion_id: "CRI-A2.1-GRM-09-01", strand: "GRM", sublevel: "A2.1", type: "word_tutorial", variant: "standard", language_use: false, status: "published",
    title: { en: "Earlier or later?", ar: "أبكر أم لاحقًا؟", es: "¿Más temprano o más tarde?", hi: "पहले या बाद में?", ru: "Раньше или позже?", tr: "Daha erken mi, daha geç mi?", zh: "早一点还是晚一点？" },
    target_items: ["ITM-GRM-1301", "ITM-GRM-1302", "ITM-GRM-1303", "ITM-GRM-1304", "ITM-GRM-1305", "ITM-GRM-1306"],
    prerequisites: ["CRI-A2.1-INT-08-01"],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "earlier", emoji: "🕗", meaning: { en: "Before the time they said.", ar: "قبل الوقت الذي قالوه.", es: "Antes de la hora que dijeron.", hi: "बताए समय से पहले।", ru: "Раньше названного времени.", tr: "Söyledikleri saatten önce.", zh: "比他们说的时间更早。" }, examples: ["Is there anything earlier?", "An earlier train, please.", "Nine o'clock is earlier than ten."] },
        { word: "later", emoji: "🕙", meaning: { en: "After the time they said.", ar: "بعد الوقت الذي قالوه.", es: "Después de la hora que dijeron.", hi: "बताए समय के बाद।", ru: "Позже названного времени.", tr: "Söyledikleri saatten sonra.", zh: "比他们说的时间更晚。" }, examples: ["Could we make it later?", "A later appointment, please.", "Tuesday is later than Monday."] },
        { word: "quicker", emoji: "⚡", meaning: { en: "It takes less time.", ar: "يأخذ وقتًا أقل.", es: "Tarda menos tiempo.", hi: "कम समय लेता है।", ru: "Занимает меньше времени.", tr: "Daha az zaman alır.", zh: "花的时间更少。" }, examples: ["The train is quicker than the bus.", "A quicker way to the station.", "Walking is quicker today."] },
        { word: "cheaper", emoji: "💷", meaning: { en: "It costs less money.", ar: "يكلف نقودًا أقل.", es: "Cuesta menos dinero.", hi: "कम पैसे लगते हैं।", ru: "Стоит меньше денег.", tr: "Daha az para tutar.", zh: "花的钱更少。" }, examples: ["The bus is cheaper than the taxi.", "A cheaper ticket, please.", "Tea is cheaper than coffee here."] },
        { word: "nearer", emoji: "📍", meaning: { en: "It is a shorter way.", ar: "الطريق إليه أقصر.", es: "Está más cerca.", hi: "रास्ता छोटा है।", ru: "Это ближе.", tr: "Daha yakın.", zh: "路更近。" }, examples: ["The health centre is nearer than the hospital.", "Is there a nearer stop?", "My flat is nearer the shop."] },
      ] } },
      { kind: "noticing", highlight: "cheaper than", why: { en: "Add er to the short word. Than comes before the second thing.", ar: "أضف er إلى الكلمة القصيرة. و than قبل الشيء الثاني.", es: "Añade er a la palabra corta. Than va antes de la segunda cosa.", hi: "छोटे शब्द में er जोड़ें। दूसरी चीज़ से पहले than।", ru: "К короткому слову добавьте er. Than перед вторым предметом.", tr: "Kısa kelimeye er ekle. Than ikinci şeyden önce gelir.", zh: "短词加 er。第二样东西前面用 than。" } },
      { kind: "free_use", items: ["ITM-GRM-1301"] },
      { kind: "controlled", items: ["ITM-GRM-1302", "ITM-GRM-1303", "ITM-GRM-1304"] },
      { kind: "free_use", items: ["ITM-GRM-1305"] },
      { kind: "check", items: ["ITM-GRM-1306"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-SPK-0014", version: 1, criterion_id: "CRI-A2.1-SPK-10-01", strand: "SPK", sublevel: "A2.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "Which way?", ar: "من أي طريق؟", es: "¿Por dónde?", hi: "किस रास्ते से?", ru: "Куда идти?", tr: "Hangi yoldan?", zh: "怎么走？" },
    target_items: ["ITM-SPK-1401", "ITM-SPK-1402", "ITM-SPK-1403", "ITM-SPK-1404", "ITM-SPK-1405"],
    prerequisites: ["CRI-A2.1-INT-08-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "Which way?", presenter: "Omar, north London", duration_sec: 50, l1_card: { en: "Asking the way, and checking you heard it", ar: "السؤال عن الطريق والتأكد أنك سمعته", es: "Preguntar el camino y comprobar que lo has oído", hi: "रास्ता पूछना और सुनी बात जाँचना", ru: "Спросить дорогу и проверить, что услышали", tr: "Yol sormak ve duyduğunu kontrol etmek", zh: "问路并确认听到的" }, lines: [
        { text: "Ten to ten. Omar cannot find the health centre.", at: 0 },
        { text: "Excuse me, how do I get to the health centre?", at: 6, target: true },
        { text: "Go straight on and take the second left.", at: 13 },
        { text: "The second left. Thank you.", at: 20, target: true },
        { text: "Say the directions back. Then you know you heard them.", at: 26 },
        { text: "Say it with me. How do I get to the health centre?", at: 34, target: true },
        { text: "Excuse me, how do I get to the health centre?", at: 45, target: true },
      ] } },
      { kind: "noticing", highlight: "how do I get to", why: { en: "Excuse me first. Then how do I get to and the place.", ar: "Excuse me أولًا، ثم how do I get to والمكان.", es: "Primero Excuse me. Luego how do I get to y el lugar.", hi: "पहले Excuse me। फिर how do I get to और जगह।", ru: "Сначала Excuse me. Потом how do I get to и место.", tr: "Önce Excuse me. Sonra how do I get to ve yer.", zh: "先说 Excuse me，再说 how do I get to 和地点。" } },
      { kind: "free_use", items: ["ITM-SPK-1401"] },
      { kind: "controlled", items: ["ITM-SPK-1402", "ITM-SPK-1403"] },
      { kind: "free_use", items: ["ITM-SPK-1404"] },
      { kind: "check", items: ["ITM-SPK-1405"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-LST-0015", version: 1, criterion_id: "CRI-A2.1-LST-11-01", strand: "LST", sublevel: "A2.1", type: "video", variant: "standard", language_use: false, status: "published",
    title: { en: "Thursday at half past six", ar: "الخميس في السادسة والنصف", es: "El jueves a las seis y media", hi: "गुरुवार साढ़े छह बजे", ru: "В четверг в половине седьмого", tr: "Perşembe altı buçukta", zh: "星期四六点半" },
    target_items: ["ITM-LST-1501", "ITM-LST-1502", "ITM-LST-1503", "ITM-LST-1504", "ITM-LST-1505", "ITM-LST-1506"],
    prerequisites: ["CRI-A2.1-LST-03-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "Thursday at half past six", presenter: "Noor, a health centre in London", duration_sec: 45, l1_card: { en: "Catching the day and the time in a message", ar: "التقاط اليوم والوقت في رسالة", es: "Captar el día y la hora en un mensaje", hi: "संदेश में दिन और समय पकड़ना", ru: "Уловить день и время в сообщении", tr: "Mesajdaki günü ve saati yakalamak", zh: "听出留言里的日子和时间" }, lines: [
        { text: "A voice message. Omar listens twice.", at: 0 },
        { text: "Your appointment is on Thursday at half past six.", at: 5, target: true },
        { text: "On Thursday. Not Tuesday.", at: 12, target: true },
        { text: "At half past six. Six thirty.", at: 17, target: true },
        { text: "The day after on. The time after at.", at: 23 },
        { text: "Say it with me. On Thursday at half past six.", at: 30, target: true },
        { text: "On Thursday at half past six.", at: 40, target: true },
      ] } },
      { kind: "noticing", highlight: "on Thursday at half past six", why: { en: "The day comes after on. The time comes after at.", ar: "اليوم بعد on. والوقت بعد at.", es: "El día va después de on. La hora después de at.", hi: "on के बाद दिन। at के बाद समय।", ru: "После on день. После at время.", tr: "on'dan sonra gün. at'ten sonra saat.", zh: "on 后面是日子，at 后面是时间。" } },
      { kind: "free_use", items: ["ITM-LST-1501"] },
      { kind: "controlled", items: ["ITM-LST-1502", "ITM-LST-1503", "ITM-LST-1504"] },
      { kind: "free_use", items: ["ITM-LST-1505"] },
      { kind: "check", items: ["ITM-LST-1506"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-WRT-0016", version: 1, criterion_id: "CRI-A2.1-WRT-12-01", strand: "WRT", sublevel: "A2.1", type: "word_tutorial", variant: "standard", language_use: true, status: "published",
    title: { en: "Sorry, I can't come", ar: "آسف، لا أستطيع الحضور", es: "Lo siento, no puedo ir", hi: "माफ़ कीजिए, मैं नहीं आ सकता", ru: "Извините, я не смогу прийти", tr: "Üzgünüm, gelemiyorum", zh: "抱歉，我来不了" },
    target_items: ["ITM-WRT-1601", "ITM-WRT-1602", "ITM-WRT-1603", "ITM-WRT-1604", "ITM-WRT-1605", "ITM-WRT-1606"],
    prerequisites: ["CRI-A2.1-WRT-05-01"],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "I'm sorry", emoji: "🙏", meaning: { en: "Say this first when you change a plan.", ar: "قل هذا أولًا عندما تغيّر خطة.", es: "Di esto primero cuando cambias un plan.", hi: "योजना बदलते समय यह पहले कहें।", ru: "Скажите это первым, меняя план.", tr: "Bir planı değiştirirken önce bunu söyle.", zh: "改计划时先说这句。" }, examples: ["I'm sorry, I can't come.", "I'm sorry, I'm late.", "I'm sorry about Monday."] },
        { word: "I can't come at ten", emoji: "🕙", meaning: { en: "You are not free at that time.", ar: "أنت غير متفرغ في ذلك الوقت.", es: "No estás libre a esa hora.", hi: "उस समय आप खाली नहीं हैं।", ru: "В это время вы не свободны.", tr: "O saatte müsait değilsin.", zh: "那个时间你没空。" }, examples: ["I can't come at ten.", "I can't come on Monday.", "I can't come before six."] },
        { word: "because I'm at work", emoji: "💼", meaning: { en: "Give the reason with because.", ar: "اذكر السبب باستخدام because.", es: "Da el motivo con because.", hi: "because से कारण बताएँ।", ru: "Назовите причину через because.", tr: "Nedeni because ile söyle.", zh: "用 because 说原因。" }, examples: ["I can't come because I'm at work.", "I'm late because the bus was slow.", "No coffee because I'm at work."] },
        { word: "Could we make it later?", emoji: "📅", meaning: { en: "Ask for a new time.", ar: "اطلب وقتًا جديدًا.", es: "Pide una hora nueva.", hi: "नया समय माँगें।", ru: "Попросите новое время.", tr: "Yeni bir saat iste.", zh: "请求换个时间。" }, examples: ["Could we make it later?", "Could we make it Tuesday?", "Could we make it half past six?"] },
      ] } },
      { kind: "noticing", highlight: "because", why: { en: "Sorry first, then the reason with because, then the new time.", ar: "الاعتذار أولًا، ثم السبب مع because، ثم الوقت الجديد.", es: "Primero la disculpa, luego el motivo con because, luego la hora nueva.", hi: "पहले माफ़ी, फिर because से कारण, फिर नया समय।", ru: "Сначала извинение, потом причина с because, потом новое время.", tr: "Önce özür, sonra because ile neden, sonra yeni saat.", zh: "先道歉，再用 because 说原因，最后说新时间。" } },
      { kind: "free_use", items: ["ITM-WRT-1601"] },
      { kind: "controlled", items: ["ITM-WRT-1602", "ITM-WRT-1603", "ITM-WRT-1604"] },
      { kind: "free_use", items: ["ITM-WRT-1605"] },
      { kind: "check", items: ["ITM-WRT-1606"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A2-MED-0017", version: 1, criterion_id: "CRI-A2.1-MED-13-01", strand: "MED", sublevel: "A2.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "Pass it on", ar: "انقل الرسالة", es: "Pásalo", hi: "आगे बताओ", ru: "Передай другому", tr: "Başkasına aktar", zh: "转告他" },
    target_items: ["ITM-MED-1701", "ITM-MED-1702", "ITM-MED-1703", "ITM-MED-1704", "ITM-MED-1705"],
    prerequisites: ["CRI-A2.1-MED-06-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "Pass it on", presenter: "Sami, a flat share in London", duration_sec: 45, l1_card: { en: "Telling a friend when and where to go", ar: "إخبار صديق بموعد الذهاب ومكانه", es: "Decir a un amigo cuándo y dónde ir", hi: "दोस्त को बताना कब और कहाँ जाना है", ru: "Сказать другу, когда и куда идти", tr: "Bir arkadaşa ne zaman ve nereye gideceğini söylemek", zh: "告诉朋友什么时候去哪里" }, lines: [
        { text: "Sami has an appointment card. He cannot read it.", at: 0 },
        { text: "Your appointment is on Thursday.", at: 5, target: true },
        { text: "At half past six.", at: 10, target: true },
        { text: "At the health centre.", at: 14, target: true },
        { text: "Three things: the day, the time, the place.", at: 19 },
        { text: "Say it with me. On Thursday at half past six, at the health centre.", at: 26, target: true },
        { text: "On ... at ... at the ...", at: 38, target: true },
      ] } },
      { kind: "noticing", highlight: "the day, the time, the place", why: { en: "Three facts. Say all three and your friend cannot go wrong.", ar: "ثلاث معلومات. قلها كلها فلا يخطئ صديقك.", es: "Tres datos. Dilos los tres y tu amigo no se equivoca.", hi: "तीन बातें। तीनों कहें तो दोस्त ग़लती नहीं करेगा।", ru: "Три факта. Назовите все три, и друг не ошибётся.", tr: "Üç bilgi. Üçünü de söyle, arkadaşın şaşırmaz.", zh: "三件事。都说出来，朋友就不会弄错。" } },
      { kind: "free_use", items: ["ITM-MED-1701"] },
      { kind: "controlled", items: ["ITM-MED-1702", "ITM-MED-1703"] },
      { kind: "free_use", items: ["ITM-MED-1704"] },
      { kind: "check", items: ["ITM-MED-1705"], delayed: true },
    ],
  },
  // ===== Pre-A1 to A1.1 starter slice =====================================
  {
    atom_id: "ATM-PA1-SPK-0018", version: 1, criterion_id: "CRI-PreA1.1-SPK-14-01", strand: "SPK", sublevel: "PreA1.1", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "Hello, I'm Ana", ar: "مرحبًا، أنا آنا", es: "Hola, soy Ana", hi: "नमस्ते, मैं आना हूँ", ru: "Здравствуйте, я Ана", tr: "Merhaba, ben Ana", zh: "你好，我是 Ana" },
    target_items: ["ITM-SPK-1801", "ITM-SPK-1802", "ITM-SPK-1803", "ITM-SPK-1804", "ITM-SPK-1805"],
    prerequisites: [],
    phases: [
      { kind: "input", media: { kind: "video", title: "Hello, I'm Ana", presenter: "Ana, a new class in London", duration_sec: 35, l1_card: { en: "Saying hello and giving your name", ar: "قول مرحبًا وذكر اسمك", es: "Saludar y decir tu nombre", hi: "नमस्ते कहना और नाम बताना", ru: "Поздороваться и назвать имя", tr: "Merhaba demek ve adını söylemek", zh: "打招呼并说出名字" }, lines: [
        { text: "A new class. Monday morning.", at: 0 },
        { text: "Hello. I'm Ana.", at: 4, target: true },
        { text: "Hello. I'm Omar.", at: 9, target: true },
        { text: "What is your name?", at: 14, target: true },
        { text: "I'm Ana. I'm Omar. Your name goes after I'm.", at: 19 },
        { text: "Say it with me. Hello. I'm Ana.", at: 26, target: true },
        { text: "Hello. I'm ...", at: 32, target: true },
      ] } },
      { kind: "noticing", highlight: "I'm", why: { en: "I'm and then your name. Two words, and they know you.", ar: "I'm ثم اسمك. كلمتان، وصاروا يعرفونك.", es: "I'm y después tu nombre. Dos palabras y ya te conocen.", hi: "I'm और फिर आपका नाम। दो शब्द, और वे आपको जान गए।", ru: "I'm и ваше имя. Два слова, и вас знают.", tr: "I'm ve adın. İki kelime, artık seni tanıyorlar.", zh: "I'm 加你的名字。两个词，他们就认识你了。" } },
      { kind: "free_use", items: ["ITM-SPK-1801"] },
      { kind: "controlled", items: ["ITM-SPK-1802", "ITM-SPK-1803"] },
      { kind: "free_use", items: ["ITM-SPK-1804"] },
      { kind: "check", items: ["ITM-SPK-1805"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-PA1-INT-0019", version: 1, criterion_id: "CRI-PreA1.2-INT-15-01", strand: "INT", sublevel: "PreA1.2", type: "video", variant: "standard", language_use: true, status: "published",
    title: { en: "Two, please", ar: "اثنان، من فضلك", es: "Dos, por favor", hi: "दो, कृपया", ru: "Два, пожалуйста", tr: "İki, lütfen", zh: "两个，谢谢" },
    target_items: ["ITM-INT-1901", "ITM-INT-1902", "ITM-INT-1903", "ITM-INT-1904", "ITM-INT-1905"],
    prerequisites: ["CRI-PreA1.1-SPK-14-01"],
    phases: [
      { kind: "input", media: { kind: "video", title: "Two, please", presenter: "Leo, a small shop", duration_sec: 35, l1_card: { en: "Asking for one thing in a shop", ar: "طلب شيء واحد في المتجر", es: "Pedir una cosa en una tienda", hi: "दुकान में एक चीज़ माँगना", ru: "Попросить одну вещь в магазине", tr: "Dükkanda bir şey istemek", zh: "在商店要一样东西" }, lines: [
        { text: "A small shop. Ana wants apples.", at: 0 },
        { text: "Two apples, please.", at: 5, target: true },
        { text: "Here you are.", at: 10 },
        { text: "Thank you.", at: 13, target: true },
        { text: "One. Two. Three. The number, the thing, then please.", at: 17 },
        { text: "Say it with me. Two apples, please.", at: 24, target: true },
        { text: "Two apples, please. Thank you.", at: 31, target: true },
      ] } },
      { kind: "noticing", highlight: "please", why: { en: "Please at the end. Two words and you have what you need.", ar: "please في النهاية. كلمتان وتحصل على ما تريد.", es: "Please al final. Dos palabras y tienes lo que necesitas.", hi: "अंत में please। दो शब्द और काम हो गया।", ru: "Please в конце. Два слова, и у вас есть нужное.", tr: "Sonda please. İki kelime ve istediğini alırsın.", zh: "please 放在最后。两个词就能买到东西。" } },
      { kind: "free_use", items: ["ITM-INT-1901"] },
      { kind: "controlled", items: ["ITM-INT-1902", "ITM-INT-1903"] },
      { kind: "free_use", items: ["ITM-INT-1904"] },
      { kind: "check", items: ["ITM-INT-1905"], delayed: true },
    ],
  },
  {
    atom_id: "ATM-A1-GRM-0020", version: 1, criterion_id: "CRI-A1.1-GRM-16-01", strand: "GRM", sublevel: "A1.1", type: "word_tutorial", variant: "standard", language_use: false, status: "published",
    title: { en: "I'm from Spain", ar: "أنا من إسبانيا", es: "Soy de España", hi: "मैं स्पेन से हूँ", ru: "Я из Испании", tr: "İspanya'danım", zh: "我来自西班牙" },
    target_items: ["ITM-GRM-2001", "ITM-GRM-2002", "ITM-GRM-2003", "ITM-GRM-2004", "ITM-GRM-2005", "ITM-GRM-2006"],
    prerequisites: ["CRI-PreA1.2-INT-15-01"],
    phases: [
      { kind: "input", media: { kind: "word_tutorial", cards: [
        { word: "I'm", emoji: "🙋", meaning: { en: "I am. Say it about you.", ar: "I am. قلها عن نفسك.", es: "I am. Dilo de ti.", hi: "I am। अपने बारे में कहें।", ru: "I am. Говорите о себе.", tr: "I am. Kendin için söyle.", zh: "I am。说你自己。" }, examples: ["I'm Ana.", "I'm from Spain.", "I'm in London."] },
        { word: "you're", emoji: "👉", meaning: { en: "You are. Say it about one person.", ar: "You are. قلها عن شخص واحد.", es: "You are. Dilo de otra persona.", hi: "You are। दूसरे व्यक्ति के बारे में कहें।", ru: "You are. Говорите о другом человеке.", tr: "You are. Bir kişi için söyle.", zh: "You are。说另一个人。" }, examples: ["You're Omar.", "You're from Egypt.", "You're in my class."] },
        { word: "from", emoji: "🌍", meaning: { en: "The country you come from.", ar: "البلد الذي أتيت منه.", es: "El país del que vienes.", hi: "वह देश जहाँ से आप हैं।", ru: "Страна, откуда вы.", tr: "Geldiğin ülke.", zh: "你来自的国家。" }, examples: ["I'm from Spain.", "I'm from Egypt.", "Where are you from?"] },
        { word: "in", emoji: "📍", meaning: { en: "The city you are in now.", ar: "المدينة التي أنت فيها الآن.", es: "La ciudad en la que estás ahora.", hi: "वह शहर जहाँ आप अब हैं।", ru: "Город, где вы сейчас.", tr: "Şu an bulunduğun şehir.", zh: "你现在所在的城市。" }, examples: ["I'm in London.", "You're in London.", "I'm in the shop."] },
      ] } },
      { kind: "noticing", highlight: "I'm from", why: { en: "I'm for you. You're for the other person.", ar: "I'm لك. و you're للشخص الآخر.", es: "I'm para ti. You're para la otra persona.", hi: "I'm आपके लिए। You're दूसरे के लिए।", ru: "I'm о себе. You're о другом.", tr: "I'm sen için. You're diğer kişi için.", zh: "I'm 说自己，you're 说对方。" } },
      { kind: "free_use", items: ["ITM-GRM-2001"] },
      { kind: "controlled", items: ["ITM-GRM-2002", "ITM-GRM-2003", "ITM-GRM-2004"] },
      { kind: "free_use", items: ["ITM-GRM-2005"] },
      { kind: "check", items: ["ITM-GRM-2006"], delayed: true },
    ],
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
  {
    atom_id: "STO-A2-0004", version: 1, criterion_id: "CRI-A2.1-INT-08-01", strand: "RDG", sublevel: "A2.1", type: "story", variant: "standard", language_use: true, status: "published",
    title: { en: "The second left", ar: "الثاني على اليسار", es: "La segunda a la izquierda", hi: "दूसरा बाएँ", ru: "Второй поворот налево", tr: "İkinci sol", zh: "第二个左转" },
    target_items: [], prerequisites: [], phases: [],
    story: { coverage: 0.98, text: "Omar has a bad tooth. He phones the health centre. \"Could I make an appointment, please?\" \"Monday at ten?\" \"Monday at ten is fine, thank you.\" On Monday, Omar cannot find the health centre. \"Excuse me, how do I get to the health centre?\" \"Go straight on and take the second left.\" \"The second left. Thank you.\" Omar is there at five to ten. The bus was cheaper than the taxi, and it was quicker." },
  },
  {
    atom_id: "STO-PA1-0005", version: 1, criterion_id: "CRI-PreA1.2-INT-15-01", strand: "RDG", sublevel: "PreA1.2", type: "story", variant: "standard", language_use: true, status: "published",
    title: { en: "Ana and Omar", ar: "آنا وعمر", es: "Ana y Omar", hi: "आना और ओमर", ru: "Ана и Омар", tr: "Ana ve Omar", zh: "Ana 和 Omar" },
    target_items: [], prerequisites: [], phases: [],
    story: { coverage: 0.98, text: "Hello. I'm Ana. I'm from Spain. I'm in London. I'm in a shop. \"Two apples, please.\" \"Here you are.\" \"Thank you.\" Omar is in the shop. \"Hello. I'm Omar.\" \"Hello. I'm Ana. I'm from Spain.\" \"I'm from Egypt.\"" },
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

  // Week two, atom 11: Monday at ten. Making an arrangement by phone is
  // Telephone and online conversation A2; "make an appointment" is A2 in the
  // English Vocabulary Profile and is taught as a fixed chunk.
  "ITM-INT-1201": { level: "A2.1", descriptor: "Telephone and online conversation A2: can make a simple arrangement on the phone" },
  "ITM-INT-1202": { level: "A2.1", descriptor: "General linguistic range A2: modal request carrying a fixed A2 chunk" },
  "ITM-INT-1203": { level: "A2.1", descriptor: "Sociolinguistic appropriateness A2: can perform basic functions politely" },
  "ITM-INT-1204": { level: "A2.1", descriptor: "Telephone and online conversation A2: makes an arrangement and takes a changed time" },
  "ITM-INT-1205": { level: "A2.1", descriptor: "Phonological control A2: says the whole request and the agreed time aloud" },

  // Atom 12: Earlier or later? Comparative with er and than is Core Inventory A2.
  "ITM-GRM-1301": { level: "A2.1", descriptor: "Grammatical accuracy A2: comparative er plus than on real prices" },
  "ITM-GRM-1302": { level: "A2.1", descriptor: "Grammatical accuracy A2: comparative plus than in one sentence" },
  "ITM-GRM-1303": { level: "A2.1", descriptor: "Grammatical accuracy A2: notices more with a short adjective" },
  "ITM-GRM-1304": { level: "A2.1", descriptor: "Transactions A2: asks for an earlier time with a comparative" },
  "ITM-GRM-1305": { level: "A2.1", descriptor: "Sustained monologue, describing experience A2: compares two options" },
  "ITM-GRM-1306": { level: "A2.1", descriptor: "Grammatical accuracy A2: two comparatives joined with but" },

  // Atom 13: Which way? Asking for and following directions is Transactions A2.
  "ITM-SPK-1401": { level: "A2.1", descriptor: "Transactions to obtain goods and services A2: can ask for and follow simple directions" },
  "ITM-SPK-1402": { level: "A2.1", descriptor: "General linguistic range A2: question with do plus get to plus a place" },
  "ITM-SPK-1403": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: writes down directions heard once" },
  "ITM-SPK-1404": { level: "A2.1", descriptor: "Transactions A2: asks the way and says the directions back to confirm" },
  "ITM-SPK-1405": { level: "A2.1", descriptor: "Phonological control A2: says the whole question aloud" },

  // Atom 14: Thursday at half past six. Day plus clock time in a short message.
  "ITM-LST-1501": { level: "A2.1", descriptor: "Understanding a native speaker interlocutor A2: catches a day and a time and says them back" },
  "ITM-LST-1502": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: writes down a day and a clock time" },
  "ITM-LST-1503": { level: "A2.1", descriptor: "Understanding announcements and instructions A2: catches the day in a short message" },
  "ITM-LST-1504": { level: "A2.2", descriptor: "Understanding announcements A2: minutes to the hour, quarter to five as 4.45" },
  "ITM-LST-1505": { level: "A2.1", descriptor: "Understanding a native speaker interlocutor A2: asks for repetition, then confirms" },
  "ITM-LST-1506": { level: "A2.1", descriptor: "Phonological control A2: says the day and the time aloud in one sentence" },

  // Atom 15: Sorry, I can't come. Correspondence A2; the first spoken turn and
  // the word-order repair are A1.2, which is the right load for a first attempt.
  "ITM-WRT-1601": { level: "A1.2", descriptor: "Phonological control A1: repeats a model apology intelligibly" },
  "ITM-WRT-1602": { level: "A2.1", descriptor: "Correspondence A2: asks for a new time politely" },
  "ITM-WRT-1603": { level: "A1.2", descriptor: "Grammatical accuracy A1 to A2: can't before the verb" },
  "ITM-WRT-1604": { level: "A2.1", descriptor: "Grammatical accuracy A2: because links the reason to the sentence" },
  "ITM-WRT-1605": { level: "A2.1", descriptor: "Correspondence A2: can write short simple notes and messages on matters of immediate need" },
  "ITM-WRT-1606": { level: "A2.1", descriptor: "Phonological control A2: sorry, reason and new time in one turn" },

  // Atom 16: Pass it on. Mediation of a short written card.
  "ITM-MED-1701": { level: "A2.1", descriptor: "Relaying specific information in speech A2: gives the day from a written card" },
  "ITM-MED-1702": { level: "A2.1", descriptor: "Reading for orientation A2: reads 18.30 as half past six" },
  "ITM-MED-1703": { level: "A2.2", descriptor: "Reading for orientation A2: decides the card does not carry the information" },
  "ITM-MED-1704": { level: "A2.1", descriptor: "Relaying specific information in speech A2: can relay the key points of a short simple text" },
  "ITM-MED-1705": { level: "A2.1", descriptor: "Relaying specific information in speech A2: day, time and place in one sentence" },

  // Starter atom 17: Hello, I'm Ana. Greetings and own name are Pre-A1
  // Conversation; the memorised question is the one stretch in the atom.
  "ITM-SPK-1801": { level: "PreA1.1", descriptor: "Conversation Pre-A1: can use basic greetings and introduce themselves" },
  "ITM-SPK-1802": { level: "PreA1.1", descriptor: "Grammatical accuracy Pre-A1: I'm plus a name" },
  "ITM-SPK-1803": { level: "PreA1.2", descriptor: "Conversation Pre-A1: asks a memorised question about personal details" },
  "ITM-SPK-1804": { level: "PreA1.1", descriptor: "Conversation Pre-A1: greets and gives their name unprompted" },
  "ITM-SPK-1805": { level: "PreA1.1", descriptor: "Phonological control Pre-A1: says a memorised greeting intelligibly" },

  // Starter atom 18: Two, please. Asking people for things is Pre-A1
  // Transactions; the repair turn reaches to A1.1 and does not gate the pass.
  "ITM-INT-1901": { level: "PreA1.2", descriptor: "Transactions to obtain goods and services Pre-A1: can ask people for things" },
  "ITM-INT-1902": { level: "PreA1.1", descriptor: "Vocabulary range Pre-A1: number plus noun plus please" },
  "ITM-INT-1903": { level: "PreA1.2", descriptor: "Grammatical accuracy Pre-A1: one plus a singular noun" },
  "ITM-INT-1904": { level: "A1.1", descriptor: "Transactions A1: changes the order when the thing is not there. need is 2 of 3, so the repair turn is a reach, not the gate" },
  "ITM-INT-1905": { level: "PreA1.2", descriptor: "Phonological control Pre-A1: says the whole request and thank you aloud" },

  // Starter atom 19: I'm from Spain. Present of be with I and you is Core
  // Inventory A1; the shadow turn recycles Pre-A1 language on purpose.
  "ITM-GRM-2001": { level: "PreA1.2", descriptor: "Phonological control Pre-A1 to A1: repeats a two-sentence model" },
  "ITM-GRM-2002": { level: "A1.1", descriptor: "Grammatical accuracy A1: I'm plus from plus country" },
  "ITM-GRM-2003": { level: "A1.1", descriptor: "Grammatical accuracy A1: are with you, am with I" },
  "ITM-GRM-2004": { level: "A1.1", descriptor: "Grammatical accuracy A1: question with are before you" },
  "ITM-GRM-2005": { level: "A1.1", descriptor: "Describing experience A1: name, country and city in connected phrases" },
  "ITM-GRM-2006": { level: "A1.1", descriptor: "Phonological control A1: three connected I sentences" },

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

/**
 * Which atoms may be served to a learner at `level`.
 *
 * Content now spans Pre-A1.1 to A2.1, and `scoreNewAtoms` (engine.ts) filters
 * candidates by criterion state and prerequisites only, with no level filter.
 * An unseen atom with no prerequisites scores near the top, so without this an
 * A2.1 learner with a strand deficit can be served "Hello, I'm Ana". The rule:
 * at or below the learner's sub-level, and no more than one band (two
 * sub-levels) below it, which is the consolidation window the Companion Volume
 * implies and the shape the first A2.1 week already has with its A1.2 atoms.
 *
 * Not wired in yet: the one-line change is in engine.ts, which this ticket does
 * not own. Raised as a flag on LEA-43.
 */
export function atomsForLevel(level: SubLevel, atoms: Atom[] = LEARNING_ATOMS): Atom[] {
  const target = SUBLEVELS.indexOf(level);
  return atoms.filter((a) => {
    const d = target - SUBLEVELS.indexOf(a.sublevel);
    return d >= 0 && d <= 2;
  });
}

export const STRAND_LABEL: Record<Strand, string> = {
  GRM: "Grammar", RDG: "Reading", WRT: "Writing", LST: "Listening", SPK: "Speaking", MED: "Mediation", INT: "Interaction",
};
