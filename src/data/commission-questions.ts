// Discipline-specific intake questions for the commission brief.
const byDiscipline: Record<string, string[]> = {
  Painter: ['Where will the work hang, and how is the light?', 'Any colours or palette from the space to work with?'],
  Muralist: ['Is the wall indoors or outdoors, and what is the surface?', 'Is there scaffolding or ladder access?'],
  Musician: ['What is the occasion or use (event, film, advert)?', 'How long should the piece be, and do you need stems?'],
  Producer: ['Which genre or reference tracks are you after?', 'Will you supply vocals or need a session singer?'],
  Photographer: ['How many people or products, and at which location?', 'How many edited images do you need, and by when?'],
  Designer: ['What will this be used on (print, web, signage)?', 'Do you have existing brand guidelines?'],
};
export function questionsFor(disciplines: string[]): string[] {
  const qs = disciplines.flatMap((d) => byDiscipline[d] ?? []);
  return [...new Set(qs)].slice(0, 4).concat(qs.length ? [] : ['Where and how will the finished work be used?']);
}
