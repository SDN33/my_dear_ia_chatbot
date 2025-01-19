// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'My Dear Lite',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Poour les tâches simples',
  },
  {
    id: 'gpt-4o',
    label: 'My Dear IA (gpt-4o)',
    apiIdentifier: 'gpt-4o',
    description: 'Pour les tâches complexes',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
