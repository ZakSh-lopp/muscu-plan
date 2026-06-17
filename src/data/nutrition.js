// Plan nutrition — 2300-2500 kcal/jour, ~100g protéines minimum
// 5 repas/jour : Matin, Midi, Goûter, Post-séance, Dîner

export const DAILY_TARGETS = {
  calories: 2400,
  protein: 130,
  carbs: 280,
  fat: 75,
};

export const NUTRITION_PLAN = {
  Lundi: {
    meals: [
      {
        id: 'lun_matin',
        name: 'Matin',
        emoji: '🌅',
        items: ['4 œufs brouillés', '2 tranches pain complet', 'Banane', 'Café noir'],
        kcal: 520, protein: 28, carbs: 55, fat: 18,
      },
      {
        id: 'lun_midi',
        name: 'Midi',
        emoji: '☀️',
        items: ['150g poulet grillé', '150g riz blanc cuit', 'Salade verte + huile olive', 'Orange'],
        kcal: 580, protein: 42, carbs: 65, fat: 14,
      },
      {
        id: 'lun_gouter',
        name: 'Goûter',
        emoji: '🍎',
        items: ['200g fromage blanc 0%', '30g noix', 'Pomme'],
        kcal: 370, protein: 22, carbs: 28, fat: 18,
      },
      {
        id: 'lun_postseance',
        name: 'Post-séance',
        emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'lun_diner',
        name: 'Dîner',
        emoji: '🌙',
        items: ['150g saumon', '200g patate douce', 'Brocolis vapeur', 'Yaourt nature'],
        kcal: 520, protein: 38, carbs: 52, fat: 16,
      },
    ],
    totalKcal: 2520, totalProtein: 158,
  },

  Mardi: {
    meals: [
      {
        id: 'mar_matin', name: 'Matin', emoji: '🌅',
        items: ['Flocons avoine 80g', 'Lait demi-écrémé 300ml', 'Whey 30g', '1 banane'],
        kcal: 560, protein: 35, carbs: 72, fat: 10,
      },
      {
        id: 'mar_midi', name: 'Midi', emoji: '☀️',
        items: ['150g dinde', '150g pâtes complètes cuites', 'Courgettes sautées', 'Kiwi'],
        kcal: 570, protein: 40, carbs: 68, fat: 12,
      },
      {
        id: 'mar_gouter', name: 'Goûter', emoji: '🍎',
        items: ['3 œufs durs', '2 tranches pain complet', 'Avocat ½'],
        kcal: 390, protein: 22, carbs: 30, fat: 20,
      },
      {
        id: 'mar_postseance', name: 'Post-séance', emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'mar_diner', name: 'Dîner', emoji: '🌙',
        items: ['2 boîtes sardines', 'Riz complet 100g sec', 'Salade tomates/concombre', 'Fromage blanc'],
        kcal: 560, protein: 42, carbs: 58, fat: 15,
      },
    ],
    totalKcal: 2610, totalProtein: 167,
  },

  Mercredi: {
    meals: [
      {
        id: 'mer_matin', name: 'Matin', emoji: '🌅',
        items: ['4 œufs au plat', 'Pain complet 2 tranches', 'Jus orange pressé'],
        kcal: 480, protein: 26, carbs: 48, fat: 20,
      },
      {
        id: 'mer_midi', name: 'Midi', emoji: '☀️',
        items: ['150g bœuf haché 5%', 'Purée pommes de terre maison', 'Haricots verts', 'Pomme'],
        kcal: 590, protein: 38, carbs: 62, fat: 16,
      },
      {
        id: 'mer_gouter', name: 'Goûter', emoji: '🍎',
        items: ['Fromage blanc 200g', 'Amandes 25g', 'Banane'],
        kcal: 380, protein: 20, carbs: 38, fat: 15,
      },
      {
        id: 'mer_postseance', name: 'Post-séance', emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'mer_diner', name: 'Dîner', emoji: '🌙',
        items: ['150g poulet', 'Quinoa 80g sec', 'Épinards sautés ail', 'Yaourt'],
        kcal: 510, protein: 40, carbs: 55, fat: 13,
      },
    ],
    totalKcal: 2490, totalProtein: 152,
  },

  Jeudi: {
    meals: [
      {
        id: 'jeu_matin', name: 'Matin', emoji: '🌅',
        items: ['Flocons avoine 80g', 'Lait 300ml', '2 œufs durs', 'Kiwi x2'],
        kcal: 540, protein: 30, carbs: 65, fat: 14,
      },
      {
        id: 'jeu_midi', name: 'Midi', emoji: '☀️',
        items: ['150g thon au naturel', 'Riz blanc 150g cuit', 'Avocat', 'Tomates'],
        kcal: 560, protein: 40, carbs: 60, fat: 18,
      },
      {
        id: 'jeu_gouter', name: 'Goûter', emoji: '🍎',
        items: ['3 œufs brouillés', '1 tranche pain', 'Noix de cajou 20g'],
        kcal: 370, protein: 22, carbs: 25, fat: 20,
      },
      {
        id: 'jeu_postseance', name: 'Post-séance', emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'jeu_diner', name: 'Dîner', emoji: '🌙',
        items: ['150g saumon', 'Pâtes complètes 100g sec', 'Brocolis vapeur', 'Fromage blanc'],
        kcal: 540, protein: 40, carbs: 58, fat: 15,
      },
    ],
    totalKcal: 2540, totalProtein: 160,
  },

  Vendredi: {
    meals: [
      {
        id: 'ven_matin', name: 'Matin', emoji: '🌅',
        items: ['4 œufs', 'Pain complet', 'Beurre de cacahuète 1 c.s.', 'Banane'],
        kcal: 580, protein: 30, carbs: 58, fat: 22,
      },
      {
        id: 'ven_midi', name: 'Midi', emoji: '☀️',
        items: ['150g dinde', 'Riz 150g cuit', 'Légumes grillés', 'Orange'],
        kcal: 560, protein: 38, carbs: 65, fat: 12,
      },
      {
        id: 'ven_gouter', name: 'Goûter', emoji: '🍎',
        items: ['Fromage blanc 0% 200g', 'Noix 30g', 'Pomme'],
        kcal: 370, protein: 22, carbs: 28, fat: 18,
      },
      {
        id: 'ven_postseance', name: 'Post-séance', emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'ven_diner', name: 'Dîner', emoji: '🌙',
        items: ['2 boîtes sardines', 'Quinoa 80g sec', 'Salade composée', 'Yaourt'],
        kcal: 520, protein: 40, carbs: 52, fat: 16,
      },
    ],
    totalKcal: 2560, totalProtein: 158,
  },

  Samedi: {
    meals: [
      {
        id: 'sam_matin', name: 'Matin', emoji: '🌅',
        items: ['Flocons avoine 100g', 'Lait entier 300ml', 'Whey 30g', 'Fruits rouges 100g'],
        kcal: 610, protein: 38, carbs: 78, fat: 12,
      },
      {
        id: 'sam_midi', name: 'Midi', emoji: '☀️',
        items: ['200g poulet', 'Patates douces 200g', 'Salade verte', 'Fromage 30g'],
        kcal: 620, protein: 46, carbs: 60, fat: 18,
      },
      {
        id: 'sam_gouter', name: 'Goûter', emoji: '🍎',
        items: ['4 œufs durs', 'Avocat', 'Pain complet'],
        kcal: 420, protein: 28, carbs: 30, fat: 22,
      },
      {
        id: 'sam_postseance', name: 'Post-séance', emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'sam_diner', name: 'Dîner', emoji: '🌙',
        items: ['150g saumon', 'Riz blanc 150g cuit', 'Épinards', 'Yaourt nature'],
        kcal: 540, protein: 40, carbs: 55, fat: 16,
      },
    ],
    totalKcal: 2720, totalProtein: 180,
  },

  Dimanche: {
    isRestDay: true,
    meals: [
      {
        id: 'dim_matin', name: 'Matin', emoji: '🌅',
        items: ['Œufs brouillés x3', 'Pain complet', 'Jus d\'orange', 'Fruit de saison'],
        kcal: 480, protein: 24, carbs: 55, fat: 16,
      },
      {
        id: 'dim_midi', name: 'Midi — Repas libre 🎉', emoji: '🎉',
        items: ['Repas libre (flexibilité psychologique)'],
        kcal: 700, protein: 30, carbs: 80, fat: 25,
      },
      {
        id: 'dim_gouter', name: 'Goûter', emoji: '🍎',
        items: ['Fromage blanc', 'Fruits', 'Noix'],
        kcal: 320, protein: 18, carbs: 32, fat: 14,
      },
      {
        id: 'dim_postseance', name: 'Shake Mass Gainer', emoji: '🥤',
        items: ['Demi-dose Mutant Mass (530 kcal)'],
        kcal: 530, protein: 28, carbs: 82, fat: 8,
      },
      {
        id: 'dim_diner', name: 'Dîner', emoji: '🌙',
        items: ['150g poisson blanc', 'Légumes vapeur', 'Riz', 'Yaourt'],
        kcal: 480, protein: 36, carbs: 55, fat: 12,
      },
    ],
    totalKcal: 2510, totalProtein: 136,
  },
};

export const DAYS_ORDER = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
