// Modèle des réponses envoyées par le backoffice quand on n'attend pas une réponse avec des données "particulières"
export interface IJsonResponse {
  Result: string;
  Message?: string;
}
