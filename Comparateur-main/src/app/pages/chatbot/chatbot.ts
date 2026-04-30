import { Component, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';

interface Message {
  role: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;
  private api = inject(ApiService);

  messages = signal<Message[]>([
    {
      role: 'bot',
      text: "Bonjour ! 👋 Je suis votre assistant énergie. Je peux vous aider à trouver la meilleure offre de gaz et d'électricité. Indiquez-moi votre type d'énergie et votre consommation annuelle en kWh.",
      time: this.getTime(),
    },
  ]);

  suggestions = [
    'Comparer les offres électricité',
    'Trouver une offre gaz moins chère',
    'Quelle est la meilleure offre du moment ?',
    'Estimer ma consommation',
  ];

  input = signal('');
  loading = signal(false);

  getTime() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  useSuggestion(text: string) {
    this.input.set(text);
    this.envoyer();
  }

  async envoyer() {
    const text = this.input().trim();
    if (!text) return;

    this.messages.update(msgs => [...msgs, { role: 'user', text, time: this.getTime() }]);
    this.input.set('');
    this.loading.set(true);

    const reponse = await this.genererReponse(text);
    this.messages.update(msgs => [...msgs, { role: 'bot', text: reponse, time: this.getTime() }]);
    this.loading.set(false);
  }

  private async genererReponse(question: string): Promise<string> {
    const q = question.toLowerCase();

    const isElec = q.includes('électricité') || q.includes('electricite') || q.includes('élec') || q.includes('elec');
    const isGaz = q.includes('gaz');
    const isCompare = q.includes('comparer') || q.includes('offre') || q.includes('meilleure') || q.includes('moins cher');
    const isEstimer = q.includes('estimer') || q.includes('consommation');

    const kwhMatch = question.match(/\b(\d{3,5})\b/);
    const kwh = kwhMatch ? parseInt(kwhMatch[1]) : null;

    if (kwh && kwh >= 100 && (isElec || isGaz || isCompare)) {
      const energyType = isGaz && !isElec ? 'gas' : 'electricity';
      try {
        const res = await firstValueFrom(this.api.compare({ consumption_kwh: kwh, energy_type: energyType }));
        if (!res.results || res.results.length === 0) {
          return "Aucune offre disponible pour le moment. La base de données est en cours de mise à jour.";
        }
        const top = res.results.slice(0, 3);
        const label = energyType === 'gas' ? 'gaz' : 'électricité';
        let msg = `Voici les 3 meilleures offres ${label} pour ${kwh} kWh/an :\n\n`;
        top.forEach((o, i) => {
          msg += `${i + 1}. ${o.provider_name} — ${o.offer_name}\n`;
          msg += `   Coût annuel : ~${Math.round(o.annual_cost)} €/an\n`;
          msg += `   Abonnement : ${o.subscription_price.toFixed(2)} €/an | ${o.price_per_kwh.toFixed(4)} €/kWh\n`;
          if (o.green_energy) msg += `   ♻️ Offre verte\n`;
          msg += '\n';
        });
        msg += "Souhaitez-vous affiner la recherche ou comparer une autre énergie ?";
        return msg;
      } catch {
        return "Je n'ai pas pu récupérer les offres. Vérifiez que le backend est bien démarré sur le port 3000.";
      }
    }

    if (isElec && !kwh) {
      return "Pour comparer les offres d'électricité, indiquez-moi votre consommation annuelle en kWh (visible sur votre facture). Exemple : \"Je consomme 3 500 kWh en électricité\"";
    }
    if (isGaz && !kwh) {
      return "Pour comparer les offres de gaz, indiquez-moi votre consommation annuelle en kWh. Exemple : \"J'utilise 8 000 kWh de gaz par an\"";
    }
    if (isEstimer) {
      return "Pour estimer votre consommation selon votre logement, utilisez le formulaire de comparaison dans la page \"Comparer\". Il vous guidera en quelques étapes.";
    }
    if (isCompare) {
      return "Quelle énergie souhaitez-vous comparer : électricité ou gaz ? Et quelle est votre consommation annuelle en kWh ?";
    }

    return "Je peux comparer les offres d'électricité et de gaz. Précisez le type d'énergie et votre consommation annuelle en kWh pour obtenir un comparatif personnalisé.";
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyer();
    }
  }
}
