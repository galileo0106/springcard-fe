import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getServiceUrl, getTimeout } from '@shared/appSettings';
import { IModel } from '@shared/models/Models/imodel.model';
import { IModelGroup } from '@shared/models/Models/imodelgroup.model';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

/**
 * Gestion des modèles d'APDU
 */
@Injectable()
export class ModelsService {
  constructor(private http: HttpClient) {}

  // Retourne tous les modèles tous groupes confondus
  public getModels(): Observable<IModel[]> {
    const route = getServiceUrl('MODELS_URL') + 'models';
    return this.http.get<IModel[]>(route).pipe(timeout(getTimeout()));
  }

  // Retourne un modèle depuis son ID
  public getModel(id: number): Observable<IModel> {
    const route = getServiceUrl('MODELS_URL') + 'models/' + id.toString();
    return this.http.get<IModel>(route).pipe(timeout(getTimeout()));
  }

  // Retourne la liste des groupes
  public getGroups(): Observable<IModelGroup[]> {
    const route = getServiceUrl('MODELS_URL') + 'groups';
    return this.http.get<IModelGroup[]>(route).pipe(timeout(getTimeout()));
  }

  // Retourne un groupe depuis son ID
  public getGroup(id: number): Observable<IModelGroup> {
    const route = getServiceUrl('MODELS_URL') + 'groups/' + id.toString();
    return this.http.get<IModelGroup>(route).pipe(timeout(getTimeout()));
  }

  // Retourne les modèles d'un groupe
  public getModelsFromGroup(groupId: number): Observable<IModel[]> {
    const route = getServiceUrl('MODELS_URL') + 'models/group/' + groupId.toString();
    return this.http.get<IModel[]>(route).pipe(timeout(getTimeout()));
  }
}
