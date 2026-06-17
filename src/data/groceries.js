// Plan de courses — 12 juin au 26 juillet 2026
// Passages tous les 3 jours, alternance A / B
// Budget : Passage A = 32-38€ / Passage B = 28-34€

export const GROCERY_PASSAGES = {
  A: {
    label: 'Passage A',
    budget: '32-38€',
    sections: [
      {
        name: 'Protéines',
        emoji: '🥩',
        items: [
          { id: 'A_poulet', name: 'Blanc de poulet', qty: '500g', price: 4.50 },
          { id: 'A_dinde', name: 'Escalope de dinde', qty: '400g', price: 4.20 },
          { id: 'A_thon', name: 'Thon au naturel', qty: '4 boîtes', price: 4.80 },
          { id: 'A_oeufs', name: 'Œufs', qty: 'x12', price: 3.20 },
          { id: 'A_sardines', name: 'Sardines à l\'huile d\'olive', qty: '3 boîtes', price: 3.00 },
          { id: 'A_saumon', name: 'Filet de saumon', qty: '300g', price: 6.50 },
        ],
      },
      {
        name: 'Glucides',
        emoji: '🌾',
        items: [
          { id: 'A_riz', name: 'Riz blanc', qty: '1kg', price: 2.50 },
          { id: 'A_pates', name: 'Pâtes complètes', qty: '1kg', price: 2.20 },
          { id: 'A_pain', name: 'Pain complet', qty: '2 paquets', price: 3.00 },
          { id: 'A_avoine', name: 'Flocons d\'avoine', qty: '500g', price: 2.00 },
          { id: 'A_patate_douce', name: 'Patates douces', qty: '1kg', price: 2.50 },
        ],
      },
      {
        name: 'Laitiers',
        emoji: '🥛',
        items: [
          { id: 'A_fb', name: 'Fromage blanc 0%', qty: '4x100g', price: 2.80 },
          { id: 'A_yaourt', name: 'Yaourts nature', qty: 'x8', price: 2.20 },
          { id: 'A_lait', name: 'Lait demi-écrémé', qty: '2L', price: 2.00 },
        ],
      },
      {
        name: 'Fruits & Légumes',
        emoji: '🥦',
        items: [
          { id: 'A_bananes', name: 'Bananes', qty: '1kg', price: 1.80 },
          { id: 'A_pommes', name: 'Pommes', qty: '1kg', price: 2.00 },
          { id: 'A_oranges', name: 'Oranges', qty: '1kg', price: 1.80 },
          { id: 'A_brocolis', name: 'Brocolis', qty: '500g', price: 1.80 },
          { id: 'A_epinards', name: 'Épinards frais', qty: '400g', price: 2.00 },
          { id: 'A_courgettes', name: 'Courgettes', qty: '2 pièces', price: 1.20 },
          { id: 'A_tomates', name: 'Tomates', qty: '500g', price: 1.50 },
          { id: 'A_avocats', name: 'Avocats', qty: 'x3', price: 2.50 },
        ],
      },
      {
        name: 'Condiments & Divers',
        emoji: '🫙',
        items: [
          { id: 'A_huile', name: 'Huile d\'olive', qty: '500ml', price: 4.50 },
          { id: 'A_noix', name: 'Noix mélangées', qty: '200g', price: 3.50 },
        ],
      },
    ],
  },

  B: {
    label: 'Passage B',
    budget: '28-34€',
    sections: [
      {
        name: 'Protéines',
        emoji: '🥩',
        items: [
          { id: 'B_poulet', name: 'Blanc de poulet', qty: '400g', price: 3.80 },
          { id: 'B_boeuf', name: 'Bœuf haché 5%', qty: '300g', price: 4.20 },
          { id: 'B_thon', name: 'Thon au naturel', qty: '3 boîtes', price: 3.60 },
          { id: 'B_oeufs', name: 'Œufs', qty: 'x12', price: 3.20 },
          { id: 'B_sardines', name: 'Sardines', qty: '2 boîtes', price: 2.00 },
        ],
      },
      {
        name: 'Glucides',
        emoji: '🌾',
        items: [
          { id: 'B_riz', name: 'Riz blanc', qty: '1kg', price: 2.50 },
          { id: 'B_quinoa', name: 'Quinoa', qty: '500g', price: 3.00 },
          { id: 'B_pain', name: 'Pain complet', qty: '1 paquet', price: 1.50 },
          { id: 'B_avoine', name: 'Flocons d\'avoine', qty: '500g', price: 2.00 },
        ],
      },
      {
        name: 'Laitiers',
        emoji: '🥛',
        items: [
          { id: 'B_fb', name: 'Fromage blanc 0%', qty: '4x100g', price: 2.80 },
          { id: 'B_yaourt', name: 'Yaourts nature', qty: 'x6', price: 1.80 },
          { id: 'B_lait', name: 'Lait demi-écrémé', qty: '1L', price: 1.10 },
        ],
      },
      {
        name: 'Fruits & Légumes',
        emoji: '🥦',
        items: [
          { id: 'B_bananes', name: 'Bananes', qty: '1kg', price: 1.80 },
          { id: 'B_kiwis', name: 'Kiwis', qty: 'x6', price: 2.00 },
          { id: 'B_brocolis', name: 'Brocolis', qty: '500g', price: 1.80 },
          { id: 'B_haricots', name: 'Haricots verts', qty: '500g', price: 1.50 },
          { id: 'B_salade', name: 'Salade verte', qty: '1 sachet', price: 1.20 },
          { id: 'B_concombre', name: 'Concombre', qty: '1 pièce', price: 0.80 },
        ],
      },
      {
        name: 'Stock',
        emoji: '🫙',
        items: [
          { id: 'B_noix_cajou', name: 'Noix de cajou', qty: '150g', price: 3.00 },
          { id: 'B_pb', name: 'Beurre de cacahuète', qty: '340g', price: 3.50 },
        ],
      },
    ],
  },
};

// Calendrier des passages — 12 juin au 26 juillet, tous les 3 jours
export function getShoppingCalendar() {
  const start = new Date('2026-06-12');
  const end = new Date('2026-07-26');
  const passages = [];
  let current = new Date(start);
  let passageType = 'A';
  let index = 1;

  while (current <= end) {
    passages.push({
      index,
      date: current.toISOString().split('T')[0],
      type: passageType,
      label: `Passage ${index} — ${GROCERY_PASSAGES[passageType].label}`,
    });
    current = new Date(current);
    current.setDate(current.getDate() + 3);
    passageType = passageType === 'A' ? 'B' : 'A';
    index++;
  }

  return passages;
}
