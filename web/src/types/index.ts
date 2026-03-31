export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface SubstitutedIngredient {
  original: Ingredient;
  substitute: Ingredient;
  why: string;
}

export interface ParsedRecipe {
  recipeId: number;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface HealthifyResponse {
  title: string;
  substitutedIngredients: SubstitutedIngredient[];
  originalInstructions: string[];
  rewrittenInstructions: string[];
  safetyNotes: string[];
  mode: 'COOKING' | 'BAKING';
}

export interface AuthResponse {
  token: string;
  email: string;
}
