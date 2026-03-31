import client from './client';
import { HealthifyResponse, ParsedRecipe } from '../types';

export const parseRecipe = (title: string | null, text: string): Promise<ParsedRecipe> =>
  client.post<ParsedRecipe>('/recipes/parse', { title, text }).then(r => r.data);

export const healthify = (
  recipe: ParsedRecipe,
  sliderIntensity: number,
  mode: 'COOKING' | 'BAKING',
): Promise<HealthifyResponse> =>
  client.post<HealthifyResponse>('/recipes/healthify', { recipe, sliderIntensity, mode }).then(r => r.data);

export const saveRecipe = (
  recipeId: number,
  healthifyResponse: HealthifyResponse,
  sliderIntensity: number,
  mode: 'COOKING' | 'BAKING',
): Promise<void> =>
  client.post('/recipes/saved', { recipeId, healthifyResponse, sliderIntensity, mode });

export const getSavedRecipes = (): Promise<any[]> =>
  client.get('/recipes/saved').then(r => r.data);
