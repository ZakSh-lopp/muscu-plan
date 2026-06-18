// Programme Full Body A/B/C — 4 jours/semaine
// Lun=A, Mar=B, Mer=Repos, Jeu=C, Ven=A, Sam=Repos, Dim=Repos
// Volume réduit pour meilleure récupération + progression durable

export const PROGRAM_START = new Date('2026-06-12T00:00:00');
export const PROGRAM_END   = new Date('2026-07-26T00:00:00');

export const DAY_TYPES = ['FullA', 'FullB', 'Repos', 'FullC', 'FullA', 'Repos', 'Repos'];

export const WORKOUT_TYPES = {
  FullA: {
    label: 'Full Body A',
    emoji: '🔴',
    color: '#e74c3c',
    tagline: 'Force & Composés',
    muscles: 'Tout le corps · Charge lourde · 5-8 reps',
    exercises: [
      {
        id: 'squat',
        name: 'Squat barre',
        sets: 3, repsMin: 5, repsMax: 7,
        compound: true, restSeconds: 180,
        muscle: 'Quadriceps · Fessiers',
        tips: 'Pieds largeur épaules, descente cuisses parallèles, genoux dans l\'axe des orteils. Respire fort, gainage maximal.',
        alternatives: [
          { name: 'Goblet squat', muscle: 'Quadriceps', tips: 'Haltère tenu verticalement contre la poitrine, pieds largeur épaules, descente profonde en gardant le dos droit.' },
          { name: 'Hack squat machine', muscle: 'Quadriceps', tips: 'Pieds à largeur épaules sur la plaque, descente lente jusqu\'à 90°, ne pas verrouiller les genoux en haut.' },
          { name: 'Squat bulgare', muscle: 'Quadriceps · Fessiers', tips: 'Pied arrière surélevé sur le banc, descente verticale du genou avant, buste légèrement penché en avant.' },
          { name: 'Squat à la Smith', muscle: 'Quadriceps', tips: 'Pieds légèrement avancés par rapport à la barre, descente contrôlée, gainage du dos actif.' },
          { name: 'Fentes avant barre', muscle: 'Quadriceps · Fessiers', tips: 'Grand pas en avant, genou avant à 90° sans dépasser la pointe du pied, buste droit.' },
        ],
      },
      {
        id: 'bench_press',
        name: 'Développé couché barre',
        sets: 3, repsMin: 5, repsMax: 7,
        compound: true, restSeconds: 150,
        muscle: 'Pectoraux · Triceps · Deltoïdes ant.',
        tips: 'Coudes à 45°, omoplates rétractées et déprimées, descente contrôlée jusqu\'au bas de la poitrine.',
        alternatives: [
          { name: 'Développé haltères plat', muscle: 'Pectoraux', tips: 'Haltères en dehors des pecs, coudes à 45°, descente profonde pour maximiser l\'étirement.' },
          { name: 'Développé machine', muscle: 'Pectoraux', tips: 'Siège ajusté pour que les poignées soient à hauteur de poitrine, poussée vers l\'avant et légèrement vers le haut.' },
          { name: 'Développé incliné haltères', muscle: 'Pecs supérieurs', tips: 'Angle 30-45°, descente contrôlée avec étirement en bas, pousser vers le haut et l\'intérieur.' },
          { name: 'Pompes lestées', muscle: 'Pectoraux', tips: 'Corps aligné tête-talon, coudes à 45°, descente poitrine près du sol, gainage strict.' },
          { name: 'Câble croisé', muscle: 'Pectoraux', tips: 'Bras légèrement fléchis, mouvement en arc de cercle, serrer les pecs en fin de mouvement.' },
        ],
      },
      {
        id: 'barbell_row',
        name: 'Rowing barre pronation',
        sets: 3, repsMin: 6, repsMax: 8,
        compound: true, restSeconds: 120,
        muscle: 'Grand dorsal · Trapèzes · Biceps',
        tips: 'Dos plat à 45°, tirer le coude vers la hanche (pas l\'épaule), barre effleure l\'abdomen.',
        alternatives: [
          { name: 'Rowing haltère un bras', muscle: 'Grand dorsal', tips: 'Main et genou opposés sur le banc, tirer le coude vers le plafond, dos parallèle au sol.' },
          { name: 'Rowing machine assise', muscle: 'Dos moyen', tips: 'Poitrine contre l\'appui, tirer les coudes en arrière en serrant les omoplates en fin de mouvement.' },
          { name: 'Chest-supported row', muscle: 'Dos moyen', tips: 'Poitrine sur le banc incliné, bras pendants au départ, tirer les coudes en arrière et en haut.' },
          { name: 'Tractions pronation', muscle: 'Grand dorsal', tips: 'Prise large, démarrer avec les épaules engagées (pas creux), tirer la poitrine vers la barre.' },
          { name: 'Tirage poulie haute prise serrée', muscle: 'Grand dorsal', tips: 'Prise supination rapprochée, tirer vers le bas de la poitrine, coudes vers les hanches.' },
        ],
      },
      {
        id: 'ohp_a',
        name: 'Développé militaire haltères',
        sets: 3, repsMin: 8, repsMax: 10,
        compound: true, restSeconds: 120,
        muscle: 'Deltoïdes · Trapèzes · Triceps',
        tips: 'Assis ou debout, haltères à hauteur d\'épaule, poussée verticale, coudes vers l\'avant (pas sur les côtés).',
        alternatives: [
          { name: 'Développé militaire barre', muscle: 'Épaules', tips: 'Prise légèrement plus large que les épaules, barre passe devant le menton, gainage strict.' },
          { name: 'Développé machine épaules', muscle: 'Épaules', tips: 'Siège ajusté, coudes à 90° au départ, extension complète sans verrouiller les coudes.' },
          { name: 'Pike push-up', muscle: 'Épaules', tips: 'Hanches en l\'air en V inversé, descente verticale de la tête vers le sol, pousser en extension.' },
          { name: 'Développé Arnold', muscle: 'Deltoïdes (3 faisceaux)' },
        ],
      },
      {
        id: 'hip_thrust',
        name: 'Hip thrust haltères',
        sets: 3, repsMin: 10, repsMax: 12,
        restSeconds: 90,
        muscle: 'Fessiers · Ischio-jambiers',
        tips: 'Épaules sur le banc, haltères sur les hanches, extension complète en haut, serrer fort les fessiers.',
        alternatives: [
          { name: 'Hip thrust barre', muscle: 'Fessiers', tips: 'Barre sur les hanches avec pad de protection, extension complète, serrer les fessiers fort en haut.' },
          { name: 'Glute bridge sol', muscle: 'Fessiers', tips: 'Dos au sol, pieds à plat, pousser les hanches vers le haut en serrant les fessiers en iso 2 secondes.' },
          { name: 'Kick-back câble', muscle: 'Fessiers' },
          { name: 'Step-up avec haltères', muscle: 'Fessiers · Quadriceps' },
        ],
      },
      {
        id: 'curl_bar_a',
        name: 'Curl barre EZ',
        sets: 2, repsMin: 10, repsMax: 12,
        restSeconds: 60,
        muscle: 'Biceps brachial · Brachial',
        tips: 'Coudes fixes collés au corps, supination complète en haut, descente lente 3 secondes.',
        alternatives: [
          { name: 'Curl haltères alternés', muscle: 'Biceps', tips: 'Un bras à la fois, supination complète en haut, descente lente et contrôlée de l\'autre côté.' },
          { name: 'Curl câble bas', muscle: 'Biceps', tips: 'Tension constante grâce au câble, coudes fixes, contraction maximale en haut.' },
          { name: 'Curl incliné haltères', muscle: 'Biceps long' },
          { name: 'Curl marteau', muscle: 'Brachial' },
        ],
      },
    ],
  },

  FullB: {
    label: 'Full Body B',
    emoji: '🔵',
    color: '#3498db',
    tagline: 'Hypertrophie & Volume',
    muscles: 'Tout le corps · Charge modérée · 8-12 reps',
    exercises: [
      {
        id: 'leg_press_b',
        name: 'Leg press',
        sets: 3, repsMin: 10, repsMax: 12,
        compound: true, restSeconds: 120,
        muscle: 'Quadriceps · Fessiers · Ischio',
        tips: 'Pieds à mi-hauteur de la plaque, amplitude max sans décoller le bas du dos, ne pas verrouiller les genoux.',
        alternatives: [
          { name: 'Squat bulgare', muscle: 'Quadriceps · Fessiers' },
          { name: 'Fentes avant barre', muscle: 'Quadriceps · Fessiers' },
          { name: 'Step-up avec haltères', muscle: 'Quadriceps' },
          { name: 'Goblet squat', muscle: 'Quadriceps' },
        ],
      },
      {
        id: 'incline_press_b',
        name: 'Développé incliné haltères',
        sets: 3, repsMin: 10, repsMax: 12,
        restSeconds: 90,
        muscle: 'Pectoraux supérieurs · Deltoïdes ant.',
        tips: 'Angle 30-45°, descente contrôlée, coudes légèrement en dessous de l\'horizontale, pousser vers le haut et légèrement vers l\'intérieur.',
        alternatives: [
          { name: 'Développé incliné barre', muscle: 'Pecs supérieurs', tips: 'Angle 30°, descente barre au haut de la poitrine, coudes à 45° par rapport au corps.' },
          { name: 'Câble incliné croisé', muscle: 'Pecs supérieurs', tips: 'Poulies basses, monter en arc de cercle vers le sternum, contraction maximale en haut.' },
          { name: 'Développé machine', muscle: 'Pectoraux' },
          { name: 'Pompes en élévation', muscle: 'Pecs supérieurs' },
        ],
      },
      {
        id: 'pulldown_b',
        name: 'Lat pulldown prise large',
        sets: 3, repsMin: 10, repsMax: 12,
        compound: true, restSeconds: 90,
        muscle: 'Grand dorsal · Rhomboïdes · Biceps',
        tips: 'Tirer les coudes vers les hanches (pas les mains), se pencher légèrement en arrière, contraction maximale en bas.',
        alternatives: [
          { name: 'Tractions pronation', muscle: 'Grand dorsal' },
          { name: 'Tractions supination', muscle: 'Grand dorsal + Biceps', tips: 'Prise sous-main à largeur épaules, tirer la poitrine vers la barre, descente contrôlée.' },
          { name: 'Tirage poulie haute prise serrée', muscle: 'Grand dorsal' },
          { name: 'Rowing haltère un bras', muscle: 'Grand dorsal' },
        ],
      },
      {
        id: 'rdl_b',
        name: 'Romanian deadlift haltères',
        sets: 3, repsMin: 10, repsMax: 12,
        compound: true, restSeconds: 120,
        muscle: 'Ischio-jambiers · Fessiers · Érecteurs',
        tips: 'Dos plat, haltères glissent le long des cuisses, descend jusqu\'à sentir l\'étirement dans les ischio, hanches en arrière.',
        alternatives: [
          { name: 'Good morning', muscle: 'Ischio-jambiers', tips: 'Barre sur le haut du dos, hanches en arrière, dos plat, descente jusqu\'à sentir l\'étirement dans les ischio.' },
          { name: 'Leg curl couché', muscle: 'Ischio-jambiers', tips: 'Orteils vers le sol (rotation interne), contraction maximale en haut, descente lente 3 secondes.' },
          { name: 'Nordic curl', muscle: 'Ischio-jambiers' },
          { name: 'Glute bridge sol', muscle: 'Fessiers · Ischio' },
        ],
      },
      {
        id: 'lateral_b',
        name: 'Élévations latérales haltères',
        sets: 3, repsMin: 12, repsMax: 15,
        restSeconds: 60,
        muscle: 'Deltoïdes latéraux',
        tips: 'Bras légèrement fléchi, lever jusqu\'à l\'horizontale, pouce légèrement vers le bas, montée contrôlée.',
        alternatives: [
          { name: 'Élévations câble', muscle: 'Deltoïdes', tips: 'Câble à hauteur des hanches, bras légèrement fléchi, lever jusqu\'à l\'horizontale en arc de cercle.' },
          { name: 'Élévations machine', muscle: 'Deltoïdes', tips: 'Coudes calés sur les appuis, lever jusqu\'à l\'horizontale, descente contrôlée en 3 secondes.' },
          { name: 'Élévations à un bras bande', muscle: 'Deltoïdes' },
          { name: 'Upright row haltères', muscle: 'Deltoïdes + Trapèzes' },
        ],
      },
      {
        id: 'triceps_b',
        name: 'Extension triceps poulie corde',
        sets: 2, repsMin: 12, repsMax: 15,
        restSeconds: 60,
        muscle: 'Triceps',
        tips: 'Coudes fixés près du corps, extension complète, écarter la corde vers le bas à l\'arrivée pour maximiser la contraction.',
        alternatives: [
          { name: 'Kickback haltères', muscle: 'Triceps' },
          { name: 'Extension crâne EZ', muscle: 'Triceps' },
          { name: 'Dips banc', muscle: 'Triceps' },
          { name: 'Pompes diamant', muscle: 'Triceps' },
        ],
      },
    ],
  },

  FullC: {
    label: 'Full Body C',
    emoji: '🟢',
    color: '#27ae60',
    tagline: 'Isolation & Finition',
    muscles: 'Tout le corps · Isolation · 10-15 reps',
    exercises: [
      {
        id: 'lunges_c',
        name: 'Fentes haltères marchées',
        sets: 3, repsMin: 10, repsMax: 12,
        restSeconds: 90,
        muscle: 'Quadriceps · Fessiers · Ischio',
        tips: '10-12 reps par jambe, grand pas, genou arrière effleure le sol, buste droit.',
        alternatives: [
          { name: 'Fentes arrière', muscle: 'Fessiers + Quadriceps' },
          { name: 'Split squat bulgare', muscle: 'Quadriceps + Fessiers' },
          { name: 'Fentes latérales', muscle: 'Adducteurs + Quadriceps' },
          { name: 'Step-up avec haltères', muscle: 'Quadriceps · Fessiers' },
        ],
      },
      {
        id: 'dips_c',
        name: 'Dips',
        sets: 3, repsMin: 8, repsMax: 12,
        restSeconds: 90,
        muscle: 'Pectoraux inférieurs · Triceps · Épaules',
        tips: 'Pencher légèrement vers l\'avant pour cibler les pecs. Si trop facile : lester ; si trop dur : machine assistée ou dips banc.',
        alternatives: [
          { name: 'Dips banc', muscle: 'Triceps' },
          { name: 'Pompes diamant', muscle: 'Triceps' },
          { name: 'Extension crâne', muscle: 'Triceps' },
          { name: 'Développé couché barre', muscle: 'Pectoraux' },
        ],
      },
      {
        id: 'cable_row_c',
        name: 'Tirage horizontal câble',
        sets: 3, repsMin: 12, repsMax: 15,
        restSeconds: 75,
        muscle: 'Dos moyen · Rhomboïdes · Biceps',
        tips: 'Poitrine haute, ne pas arrondir le dos, tirer jusqu\'à l\'abdomen, coudes proches du corps, contraction 1s.',
        alternatives: [
          { name: 'Rowing machine prise neutre', muscle: 'Dos moyen' },
          { name: 'Face pull corde', muscle: 'Deltoïdes postérieurs' },
          { name: 'Chest-supported row', muscle: 'Dos moyen' },
          { name: 'Rowing haltère un bras', muscle: 'Grand dorsal' },
        ],
      },
      {
        id: 'leg_curl_c',
        name: 'Leg curl couché machine',
        sets: 3, repsMin: 12, repsMax: 15,
        restSeconds: 60,
        muscle: 'Ischio-jambiers',
        tips: 'Hanches plaquées au banc, contraction complète à 90°, descente contrôlée 3 secondes.',
        alternatives: [
          { name: 'Leg curl assis', muscle: 'Ischio-jambiers' },
          { name: 'Nordic curl', muscle: 'Ischio-jambiers excentrique' },
          { name: 'Curl ischio élastique', muscle: 'Ischio-jambiers' },
          { name: 'Good morning', muscle: 'Ischio-jambiers' },
        ],
      },
      {
        id: 'leg_ext_c',
        name: 'Extensions quadriceps',
        sets: 2, repsMin: 15, repsMax: 20,
        restSeconds: 60,
        muscle: 'Quadriceps (isolation)',
        tips: 'Extension complète, pause 1s en haut, descente lente 3s.',
        alternatives: [
          { name: 'Sissy squat', muscle: 'Quadriceps' },
          { name: 'Wall sit', muscle: 'Quadriceps isométrique' },
          { name: 'Terminal knee extension', muscle: 'Quadriceps bas' },
        ],
      },
      {
        id: 'facepull_c',
        name: 'Face pull corde',
        sets: 2, repsMin: 15, repsMax: 20,
        restSeconds: 60,
        muscle: 'Deltoïdes postérieurs · Trapèzes · Coiffe des rotateurs',
        tips: 'Corde à hauteur des yeux, tirer vers le visage en écartant les mains, paumes vers le haut. Essentiel pour la santé des épaules.',
        alternatives: [
          { name: 'Oiseau haltères', muscle: 'Deltoïdes postérieurs' },
          { name: 'Band pull-apart', muscle: 'Deltoïdes postérieurs' },
          { name: 'Oiseau machine pec deck', muscle: 'Deltoïdes postérieurs' },
          { name: 'Élévations latérales haltères', muscle: 'Deltoïdes' },
        ],
      },
    ],
  },

  Repos: {
    label: 'Repos',
    emoji: '😴',
    color: '#95a5a6',
    tagline: 'Récupération',
    muscles: 'La récupération fait partie de la progression',
    exercises: [],
  },
};

export const SUPPLEMENTS = [
  { id: 'creatine',   name: 'Créatine',       emoji: '⚡', times: ['Matin'],               dose: '5g' },
  { id: 'omega3_1',   name: 'Oméga 3 Matin',  emoji: '🐟', times: ['Matin'],               dose: '1 cap' },
  { id: 'omega3_2',   name: 'Oméga 3 Midi',   emoji: '🐟', times: ['Midi'],                dose: '1 cap' },
  { id: 'omega3_3',   name: 'Oméga 3 Soir',   emoji: '🐟', times: ['Soir'],   dose: '1 cap' },
  { id: 'zinc_mag',   name: 'Zinc/Magnésium', emoji: '🔩', times: ['Soir'],   dose: '1 cap' },
  { id: 'vitd3',      name: 'Vitamine D3',    emoji: '☀️', times: ['Matin'],  dose: '1 cap' },
];

export const MASS_GAINER_TOTAL_DOSES = 30;
