import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService, Offer } from '../../services/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  private api = inject(ApiService);

  etape = signal(1);
  totalEtapes = 10;
  animating = signal(false);

  energie = signal('');
  besoin = signal('');
  codePostal = signal('');
  consommation = signal('');
  logement = signal('');
  surface = signal('');
  personnes = signal(1);
  chauffage = signal('');
  eauChaude = signal('');
  cuisine = signal('');
  prenom = signal('');
  email = signal('');
  telephone = signal('');
  cgv = signal(false);

  soumis = signal(false);
  chargement = signal(false);
  erreur = signal('');
  resultatsElec = signal<Offer[]>([]);
  resultatsGaz = signal<Offer[]>([]);
  consommationElec = signal(0);
  consommationGaz = signal(0);

  suivant() {
    this.animating.set(true);
    setTimeout(() => {
      this.etape.set(this.etape() + 1);
      this.animating.set(false);
    }, 300);
  }

  retour() {
    this.animating.set(true);
    setTimeout(() => {
      this.etape.set(this.etape() - 1);
      this.animating.set(false);
    }, 300);
  }

  select(champ: string, valeur: string) {
    if (champ === 'energie') { this.energie.set(valeur); setTimeout(() => this.suivant(), 400); }
    if (champ === 'besoin') { this.besoin.set(valeur); setTimeout(() => this.suivant(), 400); }
    if (champ === 'consommation') { this.consommation.set(valeur); setTimeout(() => this.suivant(), 400); }
    if (champ === 'logement') { this.logement.set(valeur); }
    if (champ === 'chauffage') { this.chauffage.set(valeur); setTimeout(() => this.suivant(), 400); }
    if (champ === 'eauChaude') { this.eauChaude.set(valeur); setTimeout(() => this.suivant(), 400); }
    if (champ === 'cuisine') { this.cuisine.set(valeur); setTimeout(() => this.suivant(), 400); }
  }

  incrementer() { this.personnes.set(this.personnes() + 1); }
  decrementer() { if (this.personnes() > 1) this.personnes.set(this.personnes() - 1); }
  progression() { return (this.etape() / this.totalEtapes) * 100; }

  private estimerKwh(type: 'electricity' | 'gas'): number {
    const surf = parseFloat(this.surface()) || 70;
    const pers = this.personnes();
    if (type === 'electricity') {
      let kwh = pers * 500 + surf * 20;
      if (this.chauffage() === 'electricite') kwh += surf * 100;
      if (this.eauChaude() === 'electricite') kwh += 1200;
      if (this.cuisine() === 'electricite') kwh += 400;
      return Math.round(kwh);
    } else {
      let kwh = 0;
      if (this.chauffage() === 'gaz') kwh += surf * 100;
      if (this.eauChaude() === 'gaz') kwh += 1200;
      if (this.cuisine() === 'gaz' || this.cuisine() === 'gaz-bouteille') kwh += 400;
      return Math.round(kwh) || 8000;
    }
  }

  soumettre() {
    this.soumis.set(true);
    this.chargement.set(true);
    this.erreur.set('');

    const energie = this.energie();
    const doElec = energie === 'electricite' || energie === 'les deux';
    const doGaz = energie === 'gaz' || energie === 'les deux';

    const kwhElec = doElec ? this.estimerKwh('electricity') : 0;
    const kwhGaz = doGaz ? this.estimerKwh('gas') : 0;
    this.consommationElec.set(kwhElec);
    this.consommationGaz.set(kwhGaz);

    const elec$ = doElec
      ? this.api.compare({ consumption_kwh: kwhElec, energy_type: 'electricity' }).pipe(catchError(() => of(null)))
      : of(null);

    const gaz$ = doGaz
      ? this.api.compare({ consumption_kwh: kwhGaz, energy_type: 'gas' }).pipe(catchError(() => of(null)))
      : of(null);

    forkJoin([elec$, gaz$]).subscribe(([elecRes, gazRes]) => {
      this.chargement.set(false);
      if (elecRes === null && gazRes === null) {
        this.erreur.set('Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 3000.');
        return;
      }
      this.resultatsElec.set(elecRes?.results ?? []);
      this.resultatsGaz.set(gazRes?.results ?? []);
    });
  }

  recommencer() {
    this.soumis.set(false);
    this.etape.set(1);
    this.resultatsElec.set([]);
    this.resultatsGaz.set([]);
    this.erreur.set('');
  }
}
