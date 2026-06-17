// Mapping exercice → yuhonas/free-exercise-db (Unlicense)
// URL: raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{id}/{n}.jpg

const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export function getExerciseFrames(exerciseId) {
  const dbId = EXERCISE_MAP[exerciseId];
  if (!dbId) return [];
  return [`${BASE}/${dbId}/0.jpg`, `${BASE}/${dbId}/1.jpg`];
}

export function getAltFrames(altName) {
  const dbId = ALT_MAP[altName];
  if (!dbId) return [];
  return [`${BASE}/${dbId}/0.jpg`, `${BASE}/${dbId}/1.jpg`];
}

// ── Exercices principaux ──────────────────────────────────────
const EXERCISE_MAP = {
  squat:           'Barbell_Full_Squat',
  bench_press:     'Barbell_Bench_Press_-_Medium_Grip',
  barbell_row:     'Bent_Over_Barbell_Row',
  hip_thrust:      'Barbell_Hip_Thrust',
  ohp_a:           'Standing_Military_Press',
  curl_bar_a:      'EZ-Bar_Curl',
  leg_press_b:     'Leg_Press',
  incline_press_b: 'Incline_Dumbbell_Press',
  pulldown_b:      'Wide-Grip_Lat_Pulldown',
  rdl_b:           'Romanian_Deadlift',
  lateral_b:       'Cable_Seated_Lateral_Raise',
  hammer_b:        'Hammer_Curls',
  calf_b:          'Standing_Calf_Raises',
  lunges_c:        'Dumbbell_Lunges',
  dips_c:          'Dips_-_Chest_Version',
  cable_row_c:     'Seated_Cable_Rows',
  leg_curl_c:      'Lying_Leg_Curls',
  leg_ext_c:       'Leg_Extensions',
  arnold_c:        'Arnold_Dumbbell_Press',
  facepull_c:      'Face_Pull',
};

// ── Alternatives ──────────────────────────────────────────────
const ALT_MAP = {
  // FullA — Squat
  'Goblet squat':                    'Goblet_Squat',
  'Hack squat machine':              'Barbell_Hack_Squat',
  'Squat bulgare':                   'Dumbbell_Rear_Lunge',
  // FullA — Bench
  'Développé haltères plat':         'Decline_Dumbbell_Bench_Press',
  'Développé machine':               'Leverage_Chest_Press',
  'Pompes lestées':                  'Close-Grip_Push-Up_off_of_a_Dumbbell',
  // FullA — Barbell row
  'Rowing haltère un bras':          'Bent_Over_Two-Dumbbell_Row',
  'Rowing machine assise':           'Seated_Cable_Rows',
  'Chest-supported row':             'Lying_T-Bar_Row',
  // FullA — Hip thrust
  'Hip thrust barre':                'Barbell_Hip_Thrust',
  'Glute bridge sol':                'Barbell_Glute_Bridge',
  'Kick-back câble':                 'Cable_Glute_Kickback',
  // FullA — OHP
  'Développé militaire haltères':    'Dumbbell_One-Arm_Shoulder_Press',
  'Développé machine épaules':       'Machine_Shoulder_Military_Press',
  'Pike push-up':                    'Dumbbell_One-Arm_Shoulder_Press',
  // FullA — Curl
  'Curl haltères alternés':          'Alternate_Hammer_Curl',
  'Curl câble bas':                  'Cable_Hammer_Curls_-_Rope_Attachment',
  'Curl incliné haltères':           'Alternate_Incline_Dumbbell_Curl',
  // FullB — Leg press alts
  'Squat à la Smith':                'Smith_Machine_Pistol_Squat',
  'Fentes avant barre':              'Barbell_Lunge',
  'Step-up avec haltères':           'Dumbbell_Step_Ups',
  // FullB — Incline press alts
  'Développé incliné barre':         'Barbell_Incline_Bench_Press_-_Medium_Grip',
  'Câble incliné croisé':            'Cable_Incline_Pushdown',
  'Pompes en élévation':             'Close-Grip_Push-Up_off_of_a_Dumbbell',
  // FullB — Pulldown alts
  'Tractions pronation':             'Pullups',
  'Tractions supination':            'Chin-Up',
  'Tirage poulie haute prise serrée':'Close-Grip_Front_Lat_Pulldown',
  // FullB — RDL alts
  'Good morning':                    'Band_Good_Morning',
  'Leg curl couché':                 'Lying_Leg_Curls',
  'Nordic curl':                     'Lying_Leg_Curls',
  // FullB — Lateral alts
  'Élévations haltères':             'Side_Laterals_to_Front_Raise',
  'Élévations machine':              'Cable_Seated_Lateral_Raise',
  'Élévations à un bras bande':      'Lateral_Raise_-_With_Bands',
  // FullB — Hammer/Triceps alts
  'Curl Zottman':                    'Alternate_Hammer_Curl',
  'Extension crâne EZ':              'Band_Skull_Crusher',
  'Kickback haltères':               'Dumbbell_Tricep_Kickback',
  'Curl marteau + Triceps poulie':   'Reverse_Grip_Triceps_Pushdown',
  // FullB — Calf alts
  'Mollets debout haltères':         'Standing_Calf_Raises',
  'Mollets leg press':               'Calf_Press_On_The_Leg_Press_Machine',
  'Mollets assis machine':           'Barbell_Seated_Calf_Raise',
  'Mollets debout machine':          'Rocking_Standing_Calf_Raise',
  // FullC — Lunges alts
  'Fentes arrière':                  'Dumbbell_Rear_Lunge',
  'Split squat bulgare':             'Split_Squat_with_Dumbbells',
  'Fentes latérales':                'Dumbbell_Lunges',
  // FullC — Dips alts
  'Dips banc':                       'Bench_Dips',
  'Pompes diamant':                  'Close-Grip_Push-Up_off_of_a_Dumbbell',
  'Extension crâne':                 'Band_Skull_Crusher',
  // FullC — Cable row alts
  'Rowing machine prise neutre':     'Seated_Cable_Rows',
  'Face pull corde':                 'Face_Pull',
  // FullC — Leg curl alts
  'Leg curl assis':                  'Seated_Leg_Curl',
  'Curl ischio élastique':           'Seated_Band_Hamstring_Curl',
  // FullC — Leg ext alts
  'Sissy squat':                     'Single-Leg_Leg_Extension',
  'Terminal knee extension':         'Leg_Extensions',
  'Wall sit':                        'Leg_Extensions',
  // FullC — Arnold alts
  'Upright row':                     'Upright_Barbell_Row',
  'Élévations frontales':            'Front_Raise_and_Pull',
  // FullC — Face pull alts
  'Oiseau haltères':                 'Reverse_Flyes',
  'Band pull-apart':                 'Band_Pull_Apart',
  'Oiseau machine pec deck':         'Reverse_Flyes',
};
