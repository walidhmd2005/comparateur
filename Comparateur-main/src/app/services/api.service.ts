import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Offer {
  id: number;
  provider_name: string;
  offer_name: string;
  energy_type: string;
  subscription_price: number;
  price_per_kwh: number;
  green_energy: boolean;
  contract_duration: number;
  annual_cost: number;
  rank: number;
}

export interface CompareRequest {
  consumption_kwh: number;
  energy_type: 'electricity' | 'gas';
  green_only?: boolean;
  sort_by?: 'annual_cost' | 'price_per_kwh' | 'subscription_price';
  order?: 'asc' | 'desc';
}

export interface CompareResponse {
  simulation_id: number;
  consumption_kwh: number;
  energy_type: string;
  results: Offer[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  compare(data: CompareRequest) {
    return this.http.post<CompareResponse>(`${this.base}/compare`, data);
  }
}
