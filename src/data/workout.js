// Programme Full Body A/B/C — rotation 6j/7
// Chaque muscle stimulé 2-3x/semaine (optimal pour mémoire musculaire + hypertrophie)
// Sources: Jeff Nippard High Frequency Full Body, recherches sur synthèse protéique

export const PROGRAM_START = new Date('2026-06-12T00:00:00');
export const PROGRAM_END   = new Date('2026-07-26T00:00:00');

// Lun=A, Mar=B, Mer=C, Jeu=A, Ven=B, Sam=C, Dim=Repos
export const DAY_TYPES = ['FullA', 'FullB', 'FullC', 'FullA', 'FullB', 'FullC', 'Repos'];

export const WORKOUT_TYPES = {
  FullA: {
    label: 'Full Body A',
    emoji: '🔴',
    color: '#e74c3c',
    tagline: 'Force & Composés',
    muscles: 'Tout le corps · Charge lourde · 4-8 reps',
    exercises: [
      {
        id: 'squat',
        name: 'Squat barre',
        sets: 4, repsMin: 5, repsMax: 7,
        compound: true, restSeconds: 180,
        muscle: 'Quadriceps · Fessiers',
        tips: 'Pieds largeur épaules, descente cuisses parallèles, genoux dans l\'axe des orteils. Respire fort, gainage maximal.',
        alternatives: [
          { name: 'Goblet squat', muscle: 'Quadriceps' },
          { name: 'Hack squat machine', muscle: 'Quadriceps' },
          { name: 'Squat bulgare', muscle: 'Quadriceps · Fessiers' },
        ],
      },
      {
        id: 'bench_press',
        name: 'Développé couché barre',
        sets: 4, repsMin: 5, repsMax: 7,
        compound: true, restSeconds: 180,
        muscle: 'Pectoraux · Triceps · Deltoïdes ant.',
        tips: 'Coudes à 45°, omoplates rétractées et déprimées, descente contrôlée jusqu\'au bas de la poitrine.',
        alternatives: [
          { name: 'Développé haltères plat', muscle: 'Pectoraux' },
          { name: 'Développé machine', muscle: 'Pectoraux' },
          { name: 'Pompes lestées', muscle: 'Pectoraux' },
        ],
      },
      {
        id: 'barbell_row',
        name: 'Rowing barre pronation',
        sets: 4, repsMin: 5, repsMax: 7,
        compound: true, restSeconds: 150,
        muscle: 'Grand dorsal · Trapèzes · Biceps',
        tips: 'Dos plat à 45°, tirer le coude vers la hanche (pas l\'épaule), barre effleure l\'abdomen.',
        alternatives: [
          { name: 'Rowing haltère un bras', muscle: 'Grand dorsal' },
          { name: 'Rowing machine assise', muscle: 'Dos moyen' },
          { name: 'Chest-supported row', muscle: 'Dos moyen' },
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
          { name: 'Hip thrust barre', muscle: 'Fessiers' },
          { name: 'Glute bridge sol', muscle: 'Fessiers' },
          { name: 'Kick-back câble', muscle: 'Fessiers' },
        ],
      },
      {
        id: 'ohp_a',
        name: 'Développé militaire barre',
        sets: 3, repsMin: 6, repsMax: 8,
        compound: true, restSeconds: 150,
        muscle: 'Deltoïdes · Trapèzes · Triceps',
        tips: 'Debout, gainage maximal, pas de cambrure, barre part du bas du menton.',
        alternatives: [
          { name: 'Développé militaire haltères', muscle: 'Épaules' },
          { name: 'Développé machine épaules', muscle: 'Épaules' },
          { name: 'Pike push-up', muscle: 'Épaules' },
        ],
      },
      {
        id: 'curl_bar_a',
        name: 'Curl barre EZ',
        sets: 3, repsMin: 8, repsMax: 10,
        restSeconds: 60,
        muscle: 'Biceps brachial · Brachial',
        tips: 'Coudes fixes collés au corps, supination complète en haut, descente lente 3 secondes.',
        alternatives: [
          { name: 'Curl haltères alternés', muscle: 'Biceps' },
          { name: 'Curl câble bas', muscle: 'Biceps' },
          { name: 'Curl incliné haltères', muscle: 'Biceps long' },
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
        sets: 4, repsMin: 10, repsMax: 12,
        compound: true, restSeconds: 150,
        muscle: 'Quadriceps · Fessiers · Ischio',
        tips: 'Pieds à mi-hauteur de la plaque, amplitude max sans décoller le bas du dos, ne pas verrouiller les genoux.',
        alternatives: [
          { name: 'Squat à la Smith', muscle: 'Quadriceps' },
          { name: 'Fentes avant barre', muscle: 'Quadriceps · Fessiers' },
          { name: 'Step-up avec haltères', muscle: 'Quadriceps' },
        ],
      },
      {
        id: 'incline_press_b',
        name: 'Développé incliné haltères',
        sets: 4, repsMin: 10, repsMax: 12,
        restSeconds: 120,
        muscle: 'Pectoraux supérieurs · Deltoïdes ant.',
        tips: 'Angle 30-45°, descente contrôlée, coudes légèrement en dessous de l\'horizontale, pousser vers le haut et légèrement vers l\'intérieur.',
        alternatives: [
          { name: 'Développé incliné barre', muscle: 'Pecs supérieurs' },
          { name: 'Câble incliné croisé', muscle: 'Pecs supérieurs' },
          { name: 'Pompes en élévation', muscle: 'Pecs supérieurs' },
        ],
      },
      {
        id: 'pulldown_b',
        name: 'Lat pulldown prise large',
        sets: 4, repsMin: 8, repsMax: 10,
        compound: true, restSeconds: 120,
        muscle: 'Grand dorsal · Rhomboïdes · Biceps',
        tips: 'Tirer les coudes vers les hanches (pas les mains), se pencher légèrement en arrière, contraction maximale en bas.',
        alternatives: [
          { name: 'Tractions pronation', muscle: 'Grand dorsal' },
          { name: 'Tractions supination', muscle: 'Grand dorsal + Biceps' },
          { name: 'Tirage poulie haute prise serrée', muscle: 'Grand dorsal' },
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
          { name: 'Good morning', muscle: 'Ischio-jambiers' },
          { name: 'Leg curl couché', muscle: 'Ischio-jambiers' },
          { name: 'Nordic curl', muscle: 'Ischio-jambiers' },
        ],
      },
      {
        id: 'lateral_b',
        name: 'Élévations latérales câble',
        sets: 3, repsMin: 12, repsMax: 15,
        restSeconds: 60,
        muscle: 'Deltoïdes latéraux',
        tips: 'Câble au niveau du genou, bras légèrement fléchi, lever jusqu\'à l\'horizontale, pouce légèrement vers le bas.',
        alternatives: [
          { name: 'Élévations haltères', muscle: 'Deltoïdes' },
          { name: 'Élévations machine', muscle: 'Deltoïdes' },
          { name: 'Élévations à un bras bande', muscle: 'Deltoïdes' },
        ],
      },
      {
        id: 'hammer_b',
        name: 'Curl marteau + Triceps poulie',
        sets: 3, repsMin: 12, repsMax: 12,
        restSeconds: 60,
        muscle: 'Brachial · Triceps',
        tips: 'Superset : curl marteau immédiatement suivi de triceps corde à la poulie. Repos seulement entre supersets.',
        alternatives: [
          { name: 'Curl Zottman', muscle: 'Brachial + Avant-bras' },
          { name: 'Extension crâne EZ', muscle: 'Triceps' },
          { name: 'Kickback haltères', muscle: 'Triceps' },
        ],
      },
      {
        id: 'calf_b',
        name: 'Mollets debout machine',
        sets: 4, repsMin: 12, repsMax: 15,
        restSeconds: 60,
        muscle: 'Gastrocnémiens · Soléaires',
        tips: 'Amplitude complète, pause 1s en bas (étirement), montée explosive, contraction 1s en haut.',
        alternatives: [
          { name: 'Mollets debout haltères', muscle: 'Mollets' },
          { name: 'Mollets leg press', muscle: 'Gastrocnémiens' },
          { name: 'Mollets assis machine', muscle: 'Soléaires' },
        ],
      },
    ],
  },

  FullC: {
    label: 'Full Body C',
    emoji: '🟢',
    color: '#27ae60',
    tagline: 'Isolation & Finition',
    muscles: 'Tout le corps · Isolation · 12-15 reps',
    exercises: [
      {
        id: 'lunges_c',
        name: 'Fentes haltères marchées',
        sets: 3, repsMin: 10, repsMax: 10,
        restSeconds: 90,
        muscle: 'Quadriceps · Fessiers · Ischio',
        tips: '10 reps par jambe, grand pas, genou arrière effleure le sol, buste droit. Excellent pour point faible jambes.',
        alternatives: [
          { name: 'Fentes arrière', muscle: 'Fessiers + Quadriceps' },
          { name: 'Split squat bulgare', muscle: 'Quadriceps + Fessiers' },
          { name: 'Fentes latérales', muscle: 'Adducteurs + Quadriceps' },
        ],
      },
      {
        id: 'dips_c',
        name: 'Dips',
        sets: 3, repsMin: 8, repsMax: 15,
        restSeconds: 90,
        muscle: 'Pectoraux inférieurs · Triceps · Épaules',
        tips: 'Pencher légèrement vers l\'avant pour cibler les pecs. Si trop facile : lester avec un sac ; si trop dur : machine assistée.',
        alternatives: [
          { name: 'Dips banc', muscle: 'Triceps' },
          { name: 'Pompes diamant', muscle: 'Triceps' },
          { name: 'Extension crâne', muscle: 'Triceps' },
        ],
      },
      {
        id: 'cable_row_c',
        name: 'Tirage horizontal câble prise serrée',
        sets: 3, repsMin: 12, repsMax: 12,
        restSeconds: 90,
        muscle: 'Dos moyen · Rhomboïdes · Biceps',
        tips: 'Poitrine haute, ne pas arrondir le dos, tirer jusqu\'à l\'abdomen, coudes proches du corps, contraction 1s.',
        alternatives: [
          { name: 'Rowing machine prise neutre', muscle: 'Dos moyen' },
          { name: 'Face pull corde', muscle: 'Deltoïdes postérieurs' },
          { name: 'Rowing haltère un bras', muscle: 'Grand dorsal' },
        ],
      },
      {
        id: 'leg_curl_c',
        name: 'Leg curl couché machine',
        sets: 3, repsMin: 12, repsMax: 12,
        restSeconds: 60,
        muscle: 'Ischio-jambiers',
        tips: 'Hanches plaquées au banc, contraction complète à 90°, descente contrôlée 3 secondes. Orteils pointés pour isoler davantage.',
        alternatives: [
          { name: 'Leg curl assis', muscle: 'Ischio-jambiers' },
          { name: 'Nordic curl', muscle: 'Ischio-jambiers excentrique' },
          { name: 'Curl ischio élastique', muscle: 'Ischio-jambiers' },
        ],
      },
      {
        id: 'leg_ext_c',
        name: 'Extensions quadriceps',
        sets: 3, repsMin: 15, repsMax: 15,
        restSeconds: 60,
        muscle: 'Quadriceps (isolation)',
        tips: 'Extension complète, pause 1s en haut, descente lente 3s. Orteils vers l\'intérieur pour le vaste externe.',
        alternatives: [
          { name: 'Sissy squat', muscle: 'Quadriceps' },
          { name: 'Terminal knee extension', muscle: 'Quadriceps bas' },
          { name: 'Wall sit', muscle: 'Quadriceps isométrique' },
        ],
      },
      {
        id: 'arnold_c',
        name: 'Développé Arnold',
        sets: 3, repsMin: 10, repsMax: 12,
        restSeconds: 90,
        muscle: 'Deltoïdes (3 faisceaux) · Trapèzes',
        tips: 'Partir paume face à soi, rotation pendant la montée jusqu\'à paume vers l\'avant en haut. Travaille tout le deltoïde.',
        alternatives: [
          { name: 'Développé militaire haltères', muscle: 'Deltoïdes' },
          { name: 'Upright row', muscle: 'Deltoïdes + Trapèzes' },
          { name: 'Élévations frontales', muscle: 'Deltoïdes antérieurs' },
        ],
      },
      {
        id: 'facepull_c',
        name: 'Face pull corde',
        sets: 3, repsMin: 15, repsMax: 15,
        restSeconds: 60,
        muscle: 'Deltoïdes postérieurs · Trapèzes · Coiffe des rotateurs',
        tips: 'Corde à hauteur des yeux, tirer vers le visage en écartant les mains, paumes vers le haut à l\'arrivée. Essentiel pour la santé des épaules.',
        alternatives: [
          { name: 'Oiseau haltères', muscle: 'Deltoïdes postérieurs' },
          { name: 'Band pull-apart', muscle: 'Deltoïdes postérieurs' },
          { name: 'Oiseau machine pec deck', muscle: 'Deltoïdes postérieurs' },
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
  { id: 'creatine', name: 'Créatine',       emoji: '⚡', time: 'Matin', dose: '5g' },
  { id: 'omega3',   name: 'Oméga 3-6-9',   emoji: '🐟', time: 'Midi',  dose: '2 caps' },
  { id: 'zinc_mag', name: 'Zinc/Magnésium', emoji: '🔩', time: 'Soir',  dose: '1 cap' },
  { id: 'vitd3',    name: 'Vitamine D3',    emoji: '☀️', time: 'Matin', dose: '1 cap' },
];

export const MASS_GAINER_TOTAL_DOSES = 25;
