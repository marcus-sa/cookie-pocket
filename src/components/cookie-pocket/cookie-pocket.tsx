import { Component, Prop, State, Element, Event, EventEmitter } from '@stencil/core';

import { I18n } from './i18n.interface';
import { defaultTranslations } from './translations';

@Component({
  tag: 'cookie-pocket',
  styleUrl: 'cookie-pocket.css',
  shadow: true
})
export class CookiePocket {

  @Element() cookiePocketEl: HTMLElement;

  @Event() confirmed: EventEmitter;

  @State() showDetails: boolean = false;
  @State() tab: "declaration" | "about" = 'declaration';

  @Prop() translations: I18n = defaultTranslations;
  @Prop() options;

  render() {
    return (
      <div>
        Hello, World! I'm {this.first} {this.last}
      </div>
    );
  }
}
