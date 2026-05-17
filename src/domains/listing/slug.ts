import slugify from 'slugify';
import { nanoid } from 'nanoid';

export function generateSlug(title: string, city: string, state: string): string {
  const base = slugify(`${title} ${city} ${state}`, {
    lower: true, strict: true, locale: 'pt',
  });
  const id = nanoid(6);
  return `${base}-${id}`;
}
