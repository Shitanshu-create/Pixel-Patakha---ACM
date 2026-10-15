// 8x8 or 12x12 or 16x16 pixel sprite definitions mapped to palette color tokens
// . = transparent
// Y = Arcade Yellow (#FFE229)
// C = Electric Cyan (#00D9FF)
// B = Pixel Blue (#087BFF)
// P = Voxel Purple (#6338F5)
// K = Pixel Pink (#FF1493)
// W = Cloud White (#F4F7FF)
// D = Deep Navy (#07152B)
// G = Success Green (#48E08A)
// R = Error Red (#FF5364)

export const COLOR_MAP = {
  Y: 'var(--color-arcade-yellow)',
  C: 'var(--color-electric-cyan)',
  B: 'var(--color-pixel-blue)',
  P: 'var(--color-voxel-purple)',
  K: 'var(--color-pixel-pink)',
  W: 'var(--color-cloud-white)',
  D: 'var(--color-deep-navy)',
  G: 'var(--color-success-green)',
  R: 'var(--color-error-red)',
};

export const SPRITES = {
  coin: [
    '..YYYY..',
    '.YYYYYY.',
    'YYWWYYYY',
    'YYWWYYYY',
    'YYYYYYYY',
    'YYYYYYYY',
    '.YYYYYY.',
    '..YYYY..',
  ],

  heart: [
    '.KK..KK.',
    'KKKKKKKK',
    'KKWWKKKK',
    'KKKKKKKK',
    'KKKKKKKK',
    '.KKKKKK.',
    '..KKKK..',
    '...KK...',
  ],

  star: [
    '...WW...',
    '...YY...',
    '.YYYYYY.',
    '..YYYY..',
    '.YYYYYY.',
    'YY....YY',
    'Y......Y',
    '........',
  ],

  invader: [
    '..C....C..',
    '...C..C...',
    '..CCCCCC..',
    '.CC.CC.CC.',
    'CCCCCCCCCC',
    'C.CCCCCC.C',
    'C.C....C.C',
    '...CC..CC...',
  ],

  robot: [
    '....WW....',
    '...CCCC...',
    '..C.CC.C..',
    '..CCCCCC..',
    '..CYCCYC..',
    '..CCCCCC..',
    '...DDDD...',
    '..CCCCCC..',
    '.C.CCCC.C.',
    '.C.CCCC.C.',
    '...CC.CC...',
    '...CC.CC...',
  ],

  hero: [
    '...KKKK...',
    '..KKKKKK..',
    '..WWDWWW..',
    '..WWWWWW..',
    '...WWWW...',
    '..BBBBBB..',
    '.BBBYYBBB.',
    '.BBBYYBBB.',
    '..BBBBBB..',
    '...DD.DD...',
    '...DD.DD...',
    '...YY.YY...',
  ],

  diamond: [
    '...YY...',
    '..CCCC..',
    '.CCCCCC.',
    'CCCCCCCC',
    'CCCCCCCC',
    '.PPPPPP.',
    '..PPPP..',
    '...KK...',
  ],

  flag: [
    'YYY.....',
    'YYYYY...',
    'YYYYYY..',
    'YYYYY...',
    'YYY.....',
    'WW......',
    'WW......',
    'WW......',
  ],

  blackHole: [
    '....PPPP....',
    '..PP....PP..',
    '.P..BBBB..P.',
    'P..B....B..P',
    'P.B..DD..B.P',
    'P.B..DD..B.P',
    'P..B....B..P',
    '.P..BBBB..P.',
    '..PP....PP..',
    '....PPPP....',
  ],
};

export default SPRITES;
