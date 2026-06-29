/* ============================================================
   roi.seoryon.com — SEO ROI / value calculator.
   100% client-side. No backend, no API, no network request for the
   calculation, no data stored or transmitted. The only persisted
   state is the chosen language (localStorage), like score/inspect.

   Languages: EN (default, source) · DE (informal "du") · FR (vouvoiement).
   DE/FR are natively localized, not literal translations. Brand and
   technical terms (SEOryon, Ahrefs, ChatGPT, SEO, GEO) are kept as-is.

   Honesty:
   - Agency cost range is a conservative €1,000–€5,000/mo, cited to
     Ahrefs' public survey of 439 companies (avg ~$2,917/mo).
   - SEOryon anchored at "from €39/mo" (Starter floor) so it can't go stale.
   - Savings computed against the LOW end of the agency range (never overstated).
   - All outputs are rounded and labelled estimates.
   ============================================================ */
(() => {
  "use strict";

  /* ---------- Fixed, cited figures (see honesty note above) ---------- */
  const AGENCY_LOW = 1000;   // €/mo — conservative low end
  const AGENCY_HIGH = 5000;  // €/mo
  const SEORYON_PRICE = 39;  // €/mo — Starter floor, "from €39"
  const AHREFS_URL = "https://ahrefs.com/blog/seo-pricing/";

  /* ---------- Per-business-type starting assumptions (editable) ----------
     These are conservative, rounded STARTING placeholders the user edits —
     never claims about their business (see the "starting assumptions" note
     and the result disclaimer). No fabricated per-industry stats: figures are
     deliberately round and sane, biased low when uncertain. "other" is a safe
     neutral generic. value = € per customer/order, conv = % visitor→customer. */
  const BIZ_DEFAULTS = {
    local:        { value: 300,  conv: 3 },
    ecom:         { value: 70,   conv: 2 },
    saas:         { value: 600,  conv: 2 },
    b2b:          { value: 2000, conv: 2.5 },
    agency:       { value: 2500, conv: 2.5 },
    professional: { value: 1500, conv: 3 },
    home:         { value: 400,  conv: 3.5 },
    health:       { value: 500,  conv: 3 },
    restaurant:   { value: 40,   conv: 3.5 },
    realestate:   { value: 4000, conv: 1.5 },
    education:    { value: 300,  conv: 2.5 },
    fitness:      { value: 150,  conv: 3 },
    automotive:   { value: 350,  conv: 3 },
    other:        { value: 250,  conv: 2 },
  };

  /* ============================ I18N ============================ */
  const I18N = {
    en: {
      meta_title: "Free SEO ROI calculator · What is SEO worth to your business? · SEOryon",
      meta_desc: "Free SEO ROI / value calculator — see the visitors you need to hit a revenue goal, what that search traffic is worth, and an honest SEO-agency-vs-SEOryon cost comparison with payback. Runs entirely in your browser. By SEOryon.",

      nav_how: "How it works",
      nav_faq: "FAQ",
      cta_trial: "Start free trial →",

      hero_pill: "Runs in your browser · No signup · Free",
      hero_h1: 'What is SEO actually worth to <span class="brand-text">your business?</span>',
      hero_sub: "Enter a few numbers and see the money story: how many visitors you need to hit a revenue goal, what that search traffic is worth, and what an agency would charge to get it — versus SEOryon. Plain estimates, no jargon.",
      hero_img_alt: "Preview of the SEOryon SEO ROI calculator — visitors needed per month, what that search traffic is worth per month and per year, and the agency-vs-SEOryon cost comparison.",

      inp_legend: "Your numbers",
      biz_label: "Business type",
      biz_local: "Local service business",
      biz_ecom: "E-commerce / online store",
      biz_saas: "SaaS / software",
      biz_b2b: "B2B services",
      biz_agency: "Agency / consulting",
      biz_professional: "Professional services (legal, finance, accounting)",
      biz_home: "Home services (plumbing, electrical, HVAC)",
      biz_health: "Health / medical / dental",
      biz_restaurant: "Restaurant / hospitality",
      biz_realestate: "Real estate",
      biz_education: "Education / courses / coaching",
      biz_fitness: "Fitness / wellness",
      biz_automotive: "Automotive",
      biz_other: "Something else",
      biz_help: "Sets sensible starting numbers below. Edit anything to match your business.",
      value_label: "Average customer value (€)",
      value_help: "What one customer or order is worth — a one-time sale, or roughly the first-year value for subscriptions.",
      conv_label: "Conversion rate (%)",
      conv_help: "The share of visitors who become customers. A typical starting point is 1–3%. Edit to your own.",
      mode_label: "What do you want to work out?",
      mode_goal: "Set a revenue goal",
      mode_traffic: "Use my current traffic",
      goal_label: "Extra revenue you want from SEO, per month (€)",
      goal_help: "Your target — how much more revenue per month you'd like search to bring in.",
      traffic_label: "Your current monthly visitors from search",
      traffic_help: "Roughly how many people land on your site from Google or AI search each month today.",
      assumptions_note: "These are starting assumptions, not your real figures — edit them so the estimate fits your business.",
      calc_privacy: "This calculator runs entirely in your browser. Your numbers are never sent to a server, stored, or shared.",

      how_h2: "How it works",
      how1_h3: "You enter a few numbers",
      how1_p: "Your business type, what a customer is worth, your conversion rate, and either a revenue goal or your current traffic. Sensible defaults are pre-filled.",
      how2_h3: "We do the math, live",
      how2_p: "Simple, transparent arithmetic — visitors needed, what that traffic is worth per month and per year, and the payback. No black box, no data leaves your browser.",
      how3_h3: "You see the real comparison",
      how3_p: "What an SEO agency typically charges to deliver that growth — with a cited industry range — versus what SEOryon costs, and how fast it pays for itself.",

      method_kicker: "HOW WE ESTIMATE",
      method_h2: "Honest math, shown in the open.",
      method_lead: "No magic, no inflated promises. Every number on this page comes from the figures you enter and the two simple formulas below. They're estimates to help you think — your real results depend on your market, competition, and execution.",
      method_c1_h: "Visitors you need",
      method_c1_p: "Customers needed = revenue goal ÷ value per customer. Visitors needed = customers ÷ conversion rate. That's the whole formula — the same one a media buyer would use.",
      method_c2_h: "What traffic is worth",
      method_c2_p: "Visitors × conversion rate × value per customer = revenue. We show it per month and per year so the number feels real, then round it so it never pretends to be precise.",
      method_c3_h: "The agency range is cited",
      method_c3_p: "We don't invent a scary number. The comparison uses a conservative industry range backed by a public survey of 439 companies, linked right in the result.",
      method_c4_h: "Defaults are just starting points",
      method_c4_p: "Conversion rate and customer value are pre-filled with typical figures so you get a result fast — but they're yours to change, and the math updates the instant you do.",

      upsell_h2: 'The number is the gap. <span class="brand-text">SEOryon is how you close it.</span>',
      upsell_p: "This calculator shows you what the traffic is worth. SEOryon is the engine that earns it — it reads real search and AI-citation signals, decides what to publish, writes the articles that rank, and tracks where you're cited across Google, ChatGPT, Perplexity and Gemini. Agency-scale output, a fraction of agency cost.",
      upsell_cta: "Start your 3-day free trial →",
      upsell_fine: "3-day free trial · 3 published articles · 1 in-depth LLM/GEO audit · Cancel in two clicks.",
      stat1_label: "Per month to start — vs €1,000+ for an agency",
      stat2_label: "Ranking articles created for clients",
      stat3_label: "ChatGPT mentions secured for clients",

      faq_h2: "Questions, answered",
      faq1_q: "How does the calculator work out the numbers?",
      faq1_a: "Pure arithmetic from what you type. Customers needed = your revenue goal ÷ value per customer. Visitors needed = customers ÷ your conversion rate. Traffic value = visitors × conversion rate × value per customer. There are no hidden assumptions and no data sent anywhere — it all runs in your browser.",
      faq2_q: "Where does the SEO-agency cost range come from?",
      faq2_a: "From Ahrefs' public survey of 439 companies on SEO pricing: SEO costs about $2,917 per month on average, with agencies averaging about $3,209 per month. We show a conservative €1,000–€5,000/month range and link the source right in the result. We'd rather use a real, cited figure than invent a scary one.",
      faq3_q: "Are these numbers a guarantee?",
      faq3_a: "No — they're estimates to help you think about the opportunity. Real results depend on your market, your competition, how good your content is, and how consistently you publish. We round every figure so it never pretends to be more precise than it is.",
      faq4_q: "What conversion rate should I use?",
      faq4_a: "If you know your real rate, use it. If not, the default by business type (1–3%) is a reasonable starting point — local service sites often convert higher, broad e-commerce lower. It's a starting assumption you edit, not a claim about your site.",
      faq5_q: "Is it really free, with no signup?",
      faq5_a: "Yes. No account, no email, no card. The calculator is a static page — the only thing it remembers is your language choice, stored locally in your browser. Nothing else is collected or transmitted.",
      faq6_q: "How is SEOryon cheaper than an agency?",
      faq6_a: "SEOryon runs the whole research-to-publish loop with a single agent instead of a team of people on a retainer — it finds what's worth writing, writes it, checks the facts, and tracks results. You get agency-scale output for a fraction of the cost, and you approve every article. Plans start at €39/month.",

      footer_score: "Free AI-search score",
      footer_inspect: "Inspect any page",
      footer_note: "A free SEO ROI calculator by SEOryon — your organic growth engine. All figures are estimates that run entirely in your browser; nothing is sent to a server.",

      /* ---- runtime result strings ---- */
      need_value: "Enter your average customer value to see your estimate.",
      need_conv: "Enter a conversion rate above 0 to see your estimate.",
      need_goal: "Enter the monthly revenue you want from SEO to see your estimate.",
      need_visitors: "Enter your current monthly search visitors to see your estimate.",

      resA_kicker: "To hit your goal, you need",
      resA_unit: "visitors / month from search",
      resA_sentence: "That's what it takes to earn about <strong>{revenue}/month</strong> — roughly {customers} new customers — at a {conv} conversion rate and {value} per customer.",
      worth_title: "What that traffic is worth",
      worth_month: "Revenue / month",
      worth_year: "Revenue / year",

      resB_kicker: "Your search traffic today is worth",
      resB_unit: "/ month from search",
      resB_sentence: "About {visitors} visitors a month at a {conv} conversion rate become roughly {customers} customers — worth about <strong>{month}/month</strong>, or {year} a year.",
      resB_growth_title: "What more SEO would add",
      g50: "+50% more search traffic",
      g100: "Double your search traffic",
      g200: "Triple your search traffic",
      resB_gap_sentence: "Double your search traffic and you'd add about <strong>{gap}/month</strong> — that's the kind of gap SEO closes.",

      per_mo: "/mo",
      cmp_title: "Agency vs. SEOryon",
      cmp_agency_party: "Typical SEO agency",
      cmp_agency_price: "{low}–{high}/mo",
      cmp_seoryon_party: "SEOryon",
      cmp_seoryon_price: "from {price}/mo",
      cmp_saving_label: "saved every month — versus the low end of an agency retainer",
      cmp_payback: "At {value} per customer, SEOryon pays for itself after {payback}.",
      pay_one: "a single new customer a month",
      pay_many: "about {k} new customers a month",
      cmp_citation: "Agency range based on Ahrefs' survey of 439 companies: SEO costs ~$2,917/mo on average, agencies ~$3,209/mo.",
      cmp_cite_link: "View the data →",

      res_disclaimer: "These are estimates based on the numbers you entered — real results depend on your market, competition, and execution.",
      res_cta: "SEOryon gets you this traffic — start your 3-day free trial →",
      res_cta_fine: "3-day free trial · 3 published articles · 1 in-depth LLM/GEO audit · cancel in two clicks.",
    },

    /* ============================ DE (informal "du") ============================ */
    de: {
      meta_title: "Kostenloser SEO-ROI-Rechner · Was ist SEO für dein Unternehmen wert? · SEOryon",
      meta_desc: "Kostenloser SEO-ROI- / Wert-Rechner — sieh, wie viele Besucher du für ein Umsatzziel brauchst, was dieser Such-Traffic wert ist und ein ehrlicher Kostenvergleich SEO-Agentur vs. SEOryon mit Amortisation. Läuft komplett im Browser. Von SEOryon.",

      nav_how: "So funktioniert’s",
      nav_faq: "FAQ",
      cta_trial: "Kostenlos testen →",

      hero_pill: "Läuft im Browser · Ohne Anmeldung · Kostenlos",
      hero_h1: 'Was ist SEO wirklich für <span class="brand-text">dein Unternehmen</span> wert?',
      hero_sub: "Gib ein paar Zahlen ein und sieh die Rechnung in Euro: wie viele Besucher du für ein Umsatzziel brauchst, was dieser Such-Traffic wert ist und was eine Agentur dafür verlangen würde — im Vergleich zu SEOryon. Klare Schätzungen, kein Fachchinesisch.",
      hero_img_alt: "Vorschau des SEOryon SEO-ROI-Rechners — nötige Besucher pro Monat, was dieser Such-Traffic pro Monat und Jahr wert ist, und der Kostenvergleich Agentur vs. SEOryon.",

      inp_legend: "Deine Zahlen",
      biz_label: "Art des Unternehmens",
      biz_local: "Lokales Dienstleistungsunternehmen",
      biz_ecom: "E-Commerce / Onlineshop",
      biz_saas: "SaaS / Software",
      biz_b2b: "B2B-Dienstleistungen",
      biz_agency: "Agentur / Beratung",
      biz_professional: "Freiberufliche Dienste (Recht, Finanzen, Steuer)",
      biz_home: "Handwerk / Haustechnik (Sanitär, Elektrik, Heizung)",
      biz_health: "Gesundheit / Medizin / Zahnmedizin",
      biz_restaurant: "Gastronomie / Hotellerie",
      biz_realestate: "Immobilien",
      biz_education: "Bildung / Kurse / Coaching",
      biz_fitness: "Fitness / Wellness",
      biz_automotive: "Automobil / Kfz",
      biz_other: "Etwas anderes",
      biz_help: "Setzt unten sinnvolle Startwerte. Ändere alles, damit es zu deinem Unternehmen passt.",
      value_label: "Durchschnittlicher Kundenwert (€)",
      value_help: "Was ein Kunde oder eine Bestellung wert ist — ein einmaliger Verkauf oder grob der Wert im ersten Jahr bei Abos.",
      conv_label: "Conversion-Rate (%)",
      conv_help: "Der Anteil der Besucher, die zu Kunden werden. Ein typischer Startwert liegt bei 1–3 %. Passe ihn an deinen an.",
      mode_label: "Was möchtest du berechnen?",
      mode_goal: "Umsatzziel festlegen",
      mode_traffic: "Aktuellen Traffic nutzen",
      goal_label: "Zusätzlicher Umsatz, den du pro Monat aus SEO willst (€)",
      goal_help: "Dein Ziel — wie viel Mehrumsatz pro Monat die Suche dir bringen soll.",
      traffic_label: "Deine aktuellen monatlichen Besucher aus der Suche",
      traffic_help: "Ungefähr, wie viele Menschen heute pro Monat über Google oder die KI-Suche auf deine Seite kommen.",
      assumptions_note: "Das sind Startannahmen, nicht deine echten Zahlen — ändere sie, damit die Schätzung zu deinem Unternehmen passt.",
      calc_privacy: "Dieser Rechner läuft komplett in deinem Browser. Deine Zahlen werden nie an einen Server gesendet, gespeichert oder geteilt.",

      how_h2: "So funktioniert’s",
      how1_h3: "Du gibst ein paar Zahlen ein",
      how1_p: "Deine Branche, was ein Kunde wert ist, deine Conversion-Rate und entweder ein Umsatzziel oder deinen aktuellen Traffic. Sinnvolle Standardwerte sind vorausgefüllt.",
      how2_h3: "Wir rechnen live",
      how2_p: "Einfache, transparente Mathematik — nötige Besucher, was dieser Traffic pro Monat und pro Jahr wert ist und die Amortisation. Keine Blackbox, keine Daten verlassen deinen Browser.",
      how3_h3: "Du siehst den echten Vergleich",
      how3_p: "Was eine SEO-Agentur für dieses Wachstum üblicherweise verlangt — mit einer belegten Branchenspanne — gegenüber den Kosten von SEOryon und wie schnell es sich rechnet.",

      method_kicker: "WIE WIR SCHÄTZEN",
      method_h2: "Ehrliche Mathematik, offen gezeigt.",
      method_lead: "Keine Magie, keine aufgeblähten Versprechen. Jede Zahl auf dieser Seite stammt aus deinen Eingaben und den zwei einfachen Formeln unten. Es sind Schätzungen zum Mitdenken — deine echten Ergebnisse hängen von Markt, Wettbewerb und Umsetzung ab.",
      method_c1_h: "Besucher, die du brauchst",
      method_c1_p: "Benötigte Kunden = Umsatzziel ÷ Wert pro Kunde. Benötigte Besucher = Kunden ÷ Conversion-Rate. Das ist die ganze Formel — dieselbe, die ein Mediaeinkäufer nutzen würde.",
      method_c2_h: "Was Traffic wert ist",
      method_c2_p: "Besucher × Conversion-Rate × Wert pro Kunde = Umsatz. Wir zeigen ihn pro Monat und pro Jahr, damit die Zahl greifbar wird, und runden sie, damit sie nie eine Scheingenauigkeit vortäuscht.",
      method_c3_h: "Die Agenturspanne ist belegt",
      method_c3_p: "Wir erfinden keine Angstzahl. Der Vergleich nutzt eine konservative Branchenspanne, gestützt auf eine öffentliche Umfrage unter 439 Unternehmen, direkt im Ergebnis verlinkt.",
      method_c4_h: "Standardwerte sind nur Startpunkte",
      method_c4_p: "Conversion-Rate und Kundenwert sind mit typischen Zahlen vorausgefüllt, damit du schnell ein Ergebnis bekommst — du kannst sie aber ändern, und die Rechnung aktualisiert sich sofort.",

      upsell_h2: 'Die Zahl ist die Lücke. <span class="brand-text">SEOryon schließt sie.</span>',
      upsell_p: "Dieser Rechner zeigt dir, was der Traffic wert ist. SEOryon ist die Engine, die ihn erarbeitet — sie liest echte Such- und KI-Zitat-Signale, entscheidet, was zu veröffentlichen ist, schreibt die Artikel, die ranken, und verfolgt, wo du bei Google, ChatGPT, Perplexity und Gemini zitiert wirst. Output auf Agenturniveau, zu einem Bruchteil der Agenturkosten.",
      upsell_cta: "3 Tage kostenlos testen →",
      upsell_fine: "3 Tage kostenlos testen · 3 veröffentlichte Artikel · 1 ausführliches LLM/GEO-Audit · In zwei Klicks kündbar.",
      stat1_label: "Pro Monat zum Start — statt 1.000 €+ für eine Agentur",
      stat2_label: "Rankende Artikel für Kunden erstellt",
      stat3_label: "ChatGPT-Erwähnungen für Kunden gesichert",

      faq_h2: "Antworten auf häufige Fragen",
      faq1_q: "Wie ermittelt der Rechner die Zahlen?",
      faq1_a: "Reine Arithmetik aus deinen Eingaben. Benötigte Kunden = Umsatzziel ÷ Wert pro Kunde. Benötigte Besucher = Kunden ÷ deine Conversion-Rate. Traffic-Wert = Besucher × Conversion-Rate × Wert pro Kunde. Es gibt keine versteckten Annahmen und keine Daten werden irgendwohin gesendet — alles läuft in deinem Browser.",
      faq2_q: "Woher stammt die Kostenspanne für SEO-Agenturen?",
      faq2_a: "Aus der öffentlichen Umfrage von Ahrefs unter 439 Unternehmen zu SEO-Preisen: SEO kostet im Schnitt rund 2.917 $ pro Monat, Agenturen im Schnitt rund 3.209 $ pro Monat. Wir zeigen eine konservative Spanne von 1.000–5.000 €/Monat und verlinken die Quelle direkt im Ergebnis. Lieber eine echte, belegte Zahl als eine erfundene Angstzahl.",
      faq3_q: "Sind diese Zahlen eine Garantie?",
      faq3_a: "Nein — es sind Schätzungen, die dir helfen, über die Chance nachzudenken. Echte Ergebnisse hängen von deinem Markt, deinem Wettbewerb, der Qualität deiner Inhalte und davon ab, wie konsequent du veröffentlichst. Wir runden jede Zahl, damit sie nie genauer wirkt, als sie ist.",
      faq4_q: "Welche Conversion-Rate soll ich nehmen?",
      faq4_a: "Wenn du deine echte Rate kennst, nimm sie. Falls nicht, ist der Standard je nach Branche (1–3 %) ein vernünftiger Startpunkt — lokale Dienstleister konvertieren oft höher, breiter E-Commerce niedriger. Es ist eine Startannahme zum Anpassen, keine Aussage über deine Seite.",
      faq5_q: "Ist es wirklich kostenlos, ohne Anmeldung?",
      faq5_a: "Ja. Kein Konto, keine E-Mail, keine Karte. Der Rechner ist eine statische Seite — das Einzige, was er sich merkt, ist deine Sprachwahl, lokal in deinem Browser gespeichert. Sonst wird nichts erfasst oder übertragen.",
      faq6_q: "Wieso ist SEOryon günstiger als eine Agentur?",
      faq6_a: "SEOryon führt den gesamten Kreislauf von der Recherche bis zur Veröffentlichung mit einem einzigen Agenten aus, statt mit einem Team auf Honorarbasis — er findet, was sich zu schreiben lohnt, schreibt es, prüft die Fakten und verfolgt die Ergebnisse. Du bekommst Output auf Agenturniveau zu einem Bruchteil der Kosten und gibst jeden Artikel frei. Pläne starten bei 39 €/Monat.",

      footer_score: "Kostenloser KI-Such-Score",
      footer_inspect: "Jede Seite prüfen",
      footer_note: "Ein kostenloser SEO-ROI-Rechner von SEOryon — deiner Engine für organisches Wachstum. Alle Zahlen sind Schätzungen, die komplett in deinem Browser laufen; nichts wird an einen Server gesendet.",

      need_value: "Gib deinen durchschnittlichen Kundenwert ein, um die Schätzung zu sehen.",
      need_conv: "Gib eine Conversion-Rate über 0 ein, um die Schätzung zu sehen.",
      need_goal: "Gib den gewünschten monatlichen SEO-Umsatz ein, um die Schätzung zu sehen.",
      need_visitors: "Gib deine aktuellen monatlichen Suchbesucher ein, um die Schätzung zu sehen.",

      resA_kicker: "Für dein Ziel brauchst du",
      resA_unit: "Besucher / Monat aus der Suche",
      resA_sentence: "So viel braucht es, um etwa <strong>{revenue}/Monat</strong> zu verdienen — rund {customers} neue Kunden — bei {conv} Conversion-Rate und {value} pro Kunde.",
      worth_title: "Was dieser Traffic wert ist",
      worth_month: "Umsatz / Monat",
      worth_year: "Umsatz / Jahr",

      resB_kicker: "Dein Such-Traffic ist heute wert",
      resB_unit: "/ Monat aus der Suche",
      resB_sentence: "Rund {visitors} Besucher pro Monat bei {conv} Conversion-Rate werden zu etwa {customers} Kunden — wert etwa <strong>{month}/Monat</strong> oder {year} pro Jahr.",
      resB_growth_title: "Was mehr SEO bringen würde",
      g50: "+50 % mehr Such-Traffic",
      g100: "Such-Traffic verdoppeln",
      g200: "Such-Traffic verdreifachen",
      resB_gap_sentence: "Verdopple deinen Such-Traffic und du legst etwa <strong>{gap}/Monat</strong> drauf — genau die Lücke, die SEO schließt.",

      per_mo: "/Mon.",
      cmp_title: "Agentur vs. SEOryon",
      cmp_agency_party: "Typische SEO-Agentur",
      cmp_agency_price: "{low}–{high}/Mon.",
      cmp_seoryon_party: "SEOryon",
      cmp_seoryon_price: "ab {price}/Mon.",
      cmp_saving_label: "Ersparnis pro Monat — gegenüber dem unteren Ende eines Agenturhonorars",
      cmp_payback: "Bei {value} pro Kunde rechnet sich SEOryon schon nach {payback}.",
      pay_one: "einem einzigen neuen Kunden pro Monat",
      pay_many: "rund {k} neuen Kunden pro Monat",
      cmp_citation: "Agenturspanne nach der Ahrefs-Umfrage unter 439 Unternehmen: SEO kostet im Schnitt ~2.917 $/Mon., Agenturen ~3.209 $/Mon.",
      cmp_cite_link: "Die Daten ansehen →",

      res_disclaimer: "Das sind Schätzungen auf Basis deiner Eingaben — echte Ergebnisse hängen von Markt, Wettbewerb und Umsetzung ab.",
      res_cta: "SEOryon holt dir diesen Traffic — starte deine 3-tägige kostenlose Testphase →",
      res_cta_fine: "3 Tage kostenlos testen · 3 veröffentlichte Artikel · 1 ausführliches LLM/GEO-Audit · in zwei Klicks kündbar.",
    },

    /* ============================ FR (vouvoiement) ============================ */
    fr: {
      meta_title: "Calculateur de ROI SEO gratuit · Que vaut le SEO pour votre entreprise ? · SEOryon",
      meta_desc: "Calculateur de ROI / valeur SEO gratuit — voyez les visiteurs nécessaires pour atteindre un objectif de revenus, ce que vaut ce trafic de recherche, et une comparaison honnête des coûts agence SEO vs SEOryon avec rentabilité. Fonctionne entièrement dans votre navigateur. Par SEOryon.",

      nav_how: "Comment ça marche",
      nav_faq: "FAQ",
      cta_trial: "Essai gratuit →",

      hero_pill: "Tourne dans votre navigateur · Sans inscription · Gratuit",
      hero_h1: 'Que vaut vraiment le SEO pour <span class="brand-text">votre entreprise ?</span>',
      hero_sub: "Saisissez quelques chiffres et voyez l’histoire en euros : combien de visiteurs il vous faut pour atteindre un objectif de revenus, ce que vaut ce trafic de recherche, et ce qu’une agence facturerait pour l’obtenir — face à SEOryon. Des estimations claires, sans jargon.",
      hero_img_alt: "Aperçu du calculateur de ROI SEO de SEOryon — visiteurs nécessaires par mois, valeur de ce trafic de recherche par mois et par an, et comparaison de coûts agence vs SEOryon.",

      inp_legend: "Vos chiffres",
      biz_label: "Type d’entreprise",
      biz_local: "Entreprise de services locaux",
      biz_ecom: "E-commerce / boutique en ligne",
      biz_saas: "SaaS / logiciel",
      biz_b2b: "Services B2B",
      biz_agency: "Agence / conseil",
      biz_professional: "Professions libérales (droit, finance, comptabilité)",
      biz_home: "Services à domicile (plomberie, électricité, CVC)",
      biz_health: "Santé / médical / dentaire",
      biz_restaurant: "Restauration / hôtellerie",
      biz_realestate: "Immobilier",
      biz_education: "Formation / cours / coaching",
      biz_fitness: "Fitness / bien-être",
      biz_automotive: "Automobile",
      biz_other: "Autre chose",
      biz_help: "Définit des valeurs de départ raisonnables ci-dessous. Modifiez tout pour coller à votre entreprise.",
      value_label: "Valeur moyenne d’un client (€)",
      value_help: "Ce que vaut un client ou une commande — une vente unique, ou environ la valeur sur la première année pour les abonnements.",
      conv_label: "Taux de conversion (%)",
      conv_help: "La part de visiteurs qui deviennent clients. Un point de départ typique est de 1 à 3 %. Ajustez au vôtre.",
      mode_label: "Que voulez-vous calculer ?",
      mode_goal: "Définir un objectif de revenus",
      mode_traffic: "Utiliser mon trafic actuel",
      goal_label: "Revenus supplémentaires souhaités du SEO, par mois (€)",
      goal_help: "Votre objectif — combien de revenus en plus par mois vous aimeriez que la recherche apporte.",
      traffic_label: "Vos visiteurs mensuels actuels issus de la recherche",
      traffic_help: "À peu près combien de personnes arrivent sur votre site via Google ou la recherche IA chaque mois aujourd’hui.",
      assumptions_note: "Ce sont des hypothèses de départ, pas vos chiffres réels — modifiez-les pour que l’estimation colle à votre entreprise.",
      calc_privacy: "Ce calculateur fonctionne entièrement dans votre navigateur. Vos chiffres ne sont jamais envoyés à un serveur, stockés ni partagés.",

      how_h2: "Comment ça marche",
      how1_h3: "Vous saisissez quelques chiffres",
      how1_p: "Votre type d’entreprise, ce que vaut un client, votre taux de conversion, et soit un objectif de revenus, soit votre trafic actuel. Des valeurs par défaut sensées sont pré-remplies.",
      how2_h3: "Nous calculons en direct",
      how2_p: "Une arithmétique simple et transparente — visiteurs nécessaires, valeur de ce trafic par mois et par an, et la rentabilité. Aucune boîte noire, aucune donnée ne quitte votre navigateur.",
      how3_h3: "Vous voyez la vraie comparaison",
      how3_p: "Ce qu’une agence SEO facture habituellement pour cette croissance — avec une fourchette sectorielle sourcée — face au coût de SEOryon, et à quelle vitesse il se rentabilise.",

      method_kicker: "COMMENT NOUS ESTIMONS",
      method_h2: "Des calculs honnêtes, à découvert.",
      method_lead: "Pas de magie, pas de promesses gonflées. Chaque chiffre de cette page vient de vos saisies et des deux formules simples ci-dessous. Ce sont des estimations pour réfléchir — vos résultats réels dépendent de votre marché, de la concurrence et de l’exécution.",
      method_c1_h: "Les visiteurs qu’il vous faut",
      method_c1_p: "Clients nécessaires = objectif de revenus ÷ valeur par client. Visiteurs nécessaires = clients ÷ taux de conversion. C’est toute la formule — celle qu’utiliserait un acheteur média.",
      method_c2_h: "Ce que vaut le trafic",
      method_c2_p: "Visiteurs × taux de conversion × valeur par client = revenus. Nous l’affichons par mois et par an pour que le chiffre soit parlant, puis nous l’arrondissons pour qu’il ne prétende jamais être précis.",
      method_c3_h: "La fourchette agence est sourcée",
      method_c3_p: "Nous n’inventons pas un chiffre effrayant. La comparaison utilise une fourchette sectorielle prudente, appuyée sur une enquête publique auprès de 439 entreprises, liée directement dans le résultat.",
      method_c4_h: "Les valeurs par défaut ne sont que des points de départ",
      method_c4_p: "Le taux de conversion et la valeur client sont pré-remplis avec des chiffres typiques pour un résultat rapide — mais ils sont à vous de changer, et le calcul se met à jour dès que vous le faites.",

      upsell_h2: 'Le chiffre, c’est l’écart. <span class="brand-text">SEOryon le comble.</span>',
      upsell_p: "Ce calculateur vous montre ce que vaut le trafic. SEOryon est le moteur qui le gagne — il lit de vrais signaux de recherche et de citation IA, décide quoi publier, rédige les articles qui se positionnent et suit où vous êtes cité sur Google, ChatGPT, Perplexity et Gemini. Une production à l’échelle d’une agence, pour une fraction du coût.",
      upsell_cta: "Démarrer l’essai gratuit de 3 jours →",
      upsell_fine: "Essai gratuit de 3 jours · 3 articles publiés · 1 audit LLM/GEO approfondi · Annulation en deux clics.",
      stat1_label: "Par mois pour démarrer — contre 1 000 €+ pour une agence",
      stat2_label: "Articles bien classés produits pour des clients",
      stat3_label: "Mentions ChatGPT obtenues pour des clients",

      faq_h2: "Vos questions, nos réponses",
      faq1_q: "Comment le calculateur trouve-t-il les chiffres ?",
      faq1_a: "De l’arithmétique pure, à partir de ce que vous saisissez. Clients nécessaires = objectif de revenus ÷ valeur par client. Visiteurs nécessaires = clients ÷ votre taux de conversion. Valeur du trafic = visiteurs × taux de conversion × valeur par client. Aucune hypothèse cachée et aucune donnée envoyée où que ce soit — tout tourne dans votre navigateur.",
      faq2_q: "D’où vient la fourchette de coût d’une agence SEO ?",
      faq2_a: "De l’enquête publique d’Ahrefs auprès de 439 entreprises sur les prix du SEO : le SEO coûte environ 2 917 $ par mois en moyenne, les agences environ 3 209 $ par mois. Nous affichons une fourchette prudente de 1 000–5 000 €/mois et lions la source directement dans le résultat. Nous préférons un chiffre réel et sourcé à un chiffre effrayant inventé.",
      faq3_q: "Ces chiffres sont-ils une garantie ?",
      faq3_a: "Non — ce sont des estimations pour réfléchir à l’opportunité. Les résultats réels dépendent de votre marché, de votre concurrence, de la qualité de vos contenus et de votre régularité de publication. Nous arrondissons chaque chiffre pour qu’il ne paraisse jamais plus précis qu’il ne l’est.",
      faq4_q: "Quel taux de conversion utiliser ?",
      faq4_a: "Si vous connaissez votre taux réel, utilisez-le. Sinon, la valeur par défaut selon le type d’entreprise (1 à 3 %) est un point de départ raisonnable — les sites de services locaux convertissent souvent plus, le e-commerce large moins. C’est une hypothèse de départ à ajuster, pas une affirmation sur votre site.",
      faq5_q: "Est-ce vraiment gratuit, sans inscription ?",
      faq5_a: "Oui. Pas de compte, pas d’e-mail, pas de carte. Le calculateur est une page statique — la seule chose qu’il retient est votre choix de langue, stocké localement dans votre navigateur. Rien d’autre n’est collecté ni transmis.",
      faq6_q: "Pourquoi SEOryon est-il moins cher qu’une agence ?",
      faq6_a: "SEOryon fait tourner toute la boucle, de la recherche à la publication, avec un seul agent au lieu d’une équipe au forfait — il trouve ce qui mérite d’être écrit, le rédige, vérifie les faits et suit les résultats. Vous obtenez une production à l’échelle d’une agence pour une fraction du coût, et vous validez chaque article. Les forfaits démarrent à 39 €/mois.",

      footer_score: "Score recherche IA gratuit",
      footer_inspect: "Analyser une page",
      footer_note: "Un calculateur de ROI SEO gratuit par SEOryon — votre moteur de croissance organique. Tous les chiffres sont des estimations qui tournent entièrement dans votre navigateur ; rien n’est envoyé à un serveur.",

      need_value: "Saisissez la valeur moyenne d’un client pour voir votre estimation.",
      need_conv: "Saisissez un taux de conversion supérieur à 0 pour voir votre estimation.",
      need_goal: "Saisissez les revenus mensuels souhaités du SEO pour voir votre estimation.",
      need_visitors: "Saisissez vos visiteurs de recherche mensuels actuels pour voir votre estimation.",

      resA_kicker: "Pour atteindre votre objectif, il vous faut",
      resA_unit: "visiteurs / mois issus de la recherche",
      resA_sentence: "Voilà ce qu’il faut pour gagner environ <strong>{revenue}/mois</strong> — soit à peu près {customers} nouveaux clients — à un taux de conversion de {conv} et {value} par client.",
      worth_title: "Ce que vaut ce trafic",
      worth_month: "Revenus / mois",
      worth_year: "Revenus / an",

      resB_kicker: "Votre trafic de recherche vaut aujourd’hui",
      resB_unit: "/ mois issus de la recherche",
      resB_sentence: "Environ {visitors} visiteurs par mois à un taux de conversion de {conv} deviennent à peu près {customers} clients — soit environ <strong>{month}/mois</strong>, ou {year} par an.",
      resB_growth_title: "Ce que plus de SEO ajouterait",
      g50: "+50 % de trafic de recherche",
      g100: "Doubler votre trafic de recherche",
      g200: "Tripler votre trafic de recherche",
      resB_gap_sentence: "Doublez votre trafic de recherche et vous ajouteriez environ <strong>{gap}/mois</strong> — c’est le genre d’écart que le SEO comble.",

      per_mo: "/mois",
      cmp_title: "Agence vs SEOryon",
      cmp_agency_party: "Agence SEO classique",
      cmp_agency_price: "{low}–{high}/mois",
      cmp_seoryon_party: "SEOryon",
      cmp_seoryon_price: "dès {price}/mois",
      cmp_saving_label: "économisés chaque mois — face au bas de la fourchette d’un forfait d’agence",
      cmp_payback: "À {value} par client, SEOryon se rentabilise dès {payback}.",
      pay_one: "un seul nouveau client par mois",
      pay_many: "environ {k} nouveaux clients par mois",
      cmp_citation: "Fourchette agence d’après l’enquête d’Ahrefs auprès de 439 entreprises : le SEO coûte ~2 917 $/mois en moyenne, les agences ~3 209 $/mois.",
      cmp_cite_link: "Voir les données →",

      res_disclaimer: "Ce sont des estimations basées sur les chiffres que vous avez saisis — les résultats réels dépendent de votre marché, de la concurrence et de l’exécution.",
      res_cta: "SEOryon vous obtient ce trafic — démarrez votre essai gratuit de 3 jours →",
      res_cta_fine: "Essai gratuit de 3 jours · 3 articles publiés · 1 audit LLM/GEO approfondi · annulation en deux clics.",
    },
  };

  const SUPPORTED = ["en", "de", "fr"];
  const LOCALE = { en: "en-IE", de: "de-DE", fr: "fr-FR" };
  const STORAGE_KEY = "seoryon_lang";
  let currentLang = "en";
  let currentMode = "goal";

  /* ---------- language ---------- */
  const pickInitialLang = () => {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q && SUPPORTED.includes(q.toLowerCase())) return q.toLowerCase();
    } catch (_) { /* ignore */ }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (_) { /* localStorage may be blocked */ }
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : "en";
  };

  const applyLang = (lang) => {
    currentLang = SUPPORTED.includes(lang) ? lang : "en";
    const dict = I18N[currentLang] || I18N.en;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-alt")];
      if (v != null) el.setAttribute("alt", v);
    });

    if (dict.meta_title) document.title = dict.meta_title;
    const md = document.querySelector('meta[name="description"]');
    if (md && dict.meta_desc) md.setAttribute("content", dict.meta_desc);
    document.documentElement.setAttribute("lang", currentLang);

    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-lang") === currentLang);
    });

    try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (_) { /* ignore */ }

    render(); // result strings + number formatting are locale-dependent
  };

  /* ---------- formatting & rounding ---------- */
  const t = (str, vars) =>
    String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));

  const money = (n) => {
    try {
      return new Intl.NumberFormat(LOCALE[currentLang], {
        style: "currency", currency: "EUR", maximumFractionDigits: 0,
      }).format(n);
    } catch (_) { return "€" + Math.round(n); }
  };
  const num = (n) => {
    try {
      return new Intl.NumberFormat(LOCALE[currentLang], { maximumFractionDigits: 0 }).format(n);
    } catch (_) { return String(Math.round(n)); }
  };
  const pct = (v) => {
    let s;
    try { s = new Intl.NumberFormat(LOCALE[currentLang], { maximumFractionDigits: 2 }).format(v); }
    catch (_) { s = String(v); }
    return currentLang === "en" ? s + "%" : s + " %";
  };

  // round to 2 significant figures — kills fake precision ("~3,200" not "3,247.6")
  const approx = (n) => {
    if (!isFinite(n) || n <= 0) return 0;
    const digits = Math.floor(Math.log10(n));
    const f = Math.pow(10, Math.max(0, digits - 1));
    return Math.round(n / f) * f;
  };

  const parseNum = (el) => {
    if (!el) return NaN;
    const v = parseFloat(String(el.value).replace(",", "."));
    return isFinite(v) ? v : NaN;
  };

  /* ---------- elements ---------- */
  const form = document.getElementById("roiForm");
  const bizSel = document.getElementById("bizType");
  const valueIn = document.getElementById("custValue");
  const convIn = document.getElementById("convRate");
  const goalIn = document.getElementById("goalRevenue");
  const visitorsIn = document.getElementById("curVisitors");
  const goalField = document.getElementById("goalField");
  const trafficField = document.getElementById("trafficField");
  const out = document.getElementById("result");

  /* ---------- shared comparison block (the pitch) ---------- */
  const cmpHtml = (dict, value) => {
    const saving = approx(AGENCY_LOW - SEORYON_PRICE);
    const k = Math.max(1, Math.ceil(SEORYON_PRICE / value));
    const payback = k <= 1 ? dict.pay_one : t(dict.pay_many, { k: num(k) });
    return `
      <div class="res-divider"></div>
      <div class="res-block-title">${dict.cmp_title}</div>
      <div class="cmp">
        <div class="cmp-row agency">
          <span class="cmp-party">${dict.cmp_agency_party}</span>
          <span class="cmp-price">${t(dict.cmp_agency_price, { low: money(AGENCY_LOW), high: money(AGENCY_HIGH) })}</span>
        </div>
        <div class="cmp-row seoryon">
          <span class="cmp-party">${dict.cmp_seoryon_party}</span>
          <span class="cmp-price">${t(dict.cmp_seoryon_price, { price: money(SEORYON_PRICE) })}</span>
        </div>
        <div class="cmp-saving">
          <div class="cmp-saving-num">${money(saving)}+</div>
          <div class="cmp-saving-label">${dict.cmp_saving_label}</div>
          <div class="cmp-payback">${t(dict.cmp_payback, { value: money(value), payback: payback })}</div>
        </div>
        <div class="cmp-citation">
          ${dict.cmp_citation}
          <a href="${AHREFS_URL}" target="_blank" rel="noopener nofollow">${dict.cmp_cite_link}</a>
        </div>
      </div>`;
  };

  const ctaHtml = (dict) => `
    <a class="res-cta" href="https://app.seoryon.com/signup?utm_source=roi-calculator&utm_medium=tool&utm_campaign=trial">${dict.res_cta}</a>
    <p class="res-cta-fine">${dict.res_cta_fine}</p>`;

  const emptyHtml = (msg) =>
    `<div class="res-empty"><div class="res-empty-mark">€?</div><p>${msg}</p></div>`;

  /* ---------- render ---------- */
  function render() {
    if (!out) return;
    const dict = I18N[currentLang] || I18N.en;

    const value = parseNum(valueIn);
    const conv = parseNum(convIn);

    // Graceful, never-NaN guards (shared inputs first)
    if (!(value > 0)) { out.innerHTML = emptyHtml(dict.need_value); return; }
    if (!(conv > 0))  { out.innerHTML = emptyHtml(dict.need_conv);  return; }

    const convFrac = conv / 100;

    if (currentMode === "goal") {
      const goal = parseNum(goalIn);
      if (!(goal > 0)) { out.innerHTML = emptyHtml(dict.need_goal); return; }

      const customers = goal / value;            // new customers / month
      const visitors = customers / convFrac;     // visitors / month
      const annual = goal * 12;

      out.innerHTML = `
        <div class="res-kicker">${dict.resA_kicker}</div>
        <div class="res-headline">
          <div class="res-big">${num(approx(visitors))}</div>
          <div class="res-unit">${dict.resA_unit}</div>
        </div>
        <p class="res-sentence">${t(dict.resA_sentence, {
          revenue: money(approx(goal)),
          customers: num(approx(customers)),
          conv: pct(conv),
          value: money(value),
        })}</p>

        <div class="res-divider"></div>
        <div class="res-block-title">${dict.worth_title}</div>
        <div class="worth-grid">
          <div class="worth-item">
            <div class="worth-num">${money(approx(goal))}</div>
            <div class="worth-label">${dict.worth_month}</div>
          </div>
          <div class="worth-item">
            <div class="worth-num">${money(approx(annual))}</div>
            <div class="worth-label">${dict.worth_year}</div>
          </div>
        </div>

        ${cmpHtml(dict, value)}
        <p class="res-disclaimer">${dict.res_disclaimer}</p>
        ${ctaHtml(dict)}`;
    } else {
      const visitors = parseNum(visitorsIn);
      if (!(visitors > 0)) { out.innerHTML = emptyHtml(dict.need_visitors); return; }

      const customers = visitors * convFrac;     // customers / month
      const monthly = customers * value;         // €/month
      const annual = monthly * 12;
      const gap = monthly; // doubling search traffic adds another "monthly"

      const growth = [
        { label: dict.g50,  add: monthly * 0.5 },
        { label: dict.g100, add: monthly * 1.0 },
        { label: dict.g200, add: monthly * 2.0 },
      ].map((g) => `
        <div class="growth-row">
          <span class="g-label">${g.label}</span>
          <span class="g-val">+${money(approx(g.add))}${dict.per_mo}</span>
        </div>`).join("");

      out.innerHTML = `
        <div class="res-kicker">${dict.resB_kicker}</div>
        <div class="res-headline">
          <div class="res-big">${money(approx(monthly))}</div>
          <div class="res-unit">${dict.resB_unit}</div>
        </div>
        <p class="res-sentence">${t(dict.resB_sentence, {
          visitors: num(approx(visitors)),
          conv: pct(conv),
          customers: num(approx(customers)),
          month: money(approx(monthly)),
          year: money(approx(annual)),
        })}</p>

        <div class="res-divider"></div>
        <div class="res-block-title">${dict.resB_growth_title}</div>
        <div class="growth-list">${growth}</div>
        <p class="res-sentence">${t(dict.resB_gap_sentence, { gap: money(approx(gap)) })}</p>

        ${cmpHtml(dict, value)}
        <p class="res-disclaimer">${dict.res_disclaimer}</p>
        ${ctaHtml(dict)}`;
    }
  }

  /* ---------- mode toggle ---------- */
  const setMode = (mode) => {
    currentMode = mode === "traffic" ? "traffic" : "goal";
    document.querySelectorAll(".mode-btn").forEach((b) => {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === currentMode ? "true" : "false");
    });
    if (goalField) goalField.classList.toggle("hidden", currentMode !== "goal");
    if (trafficField) trafficField.classList.toggle("hidden", currentMode !== "traffic");
    render();
  };

  /* ---------- business-type defaults ---------- */
  const applyBizDefaults = (key) => {
    const d = BIZ_DEFAULTS[key] || BIZ_DEFAULTS.other;
    if (valueIn) valueIn.value = d.value;
    if (convIn) convIn.value = d.conv;
    render();
  };

  /* ---------- wiring ---------- */
  if (bizSel) bizSel.addEventListener("change", () => applyBizDefaults(bizSel.value));
  [valueIn, convIn, goalIn, visitorsIn].forEach((el) => {
    if (el) el.addEventListener("input", render);
  });
  document.querySelectorAll(".mode-btn").forEach((b) => {
    b.addEventListener("click", () => setMode(b.getAttribute("data-mode")));
  });
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => applyLang(b.getAttribute("data-lang")));
  });
  if (form) form.addEventListener("submit", (e) => { e.preventDefault(); render(); });

  /* ---------- boot ---------- */
  setMode("goal");
  applyLang(pickInitialLang());
})();
