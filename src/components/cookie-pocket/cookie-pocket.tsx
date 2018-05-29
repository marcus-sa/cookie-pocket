import { Method, Component, Prop, Element, State, EventEmitter, Event, Watch } from '@stencil/core';

import { CurrentTab, CookiePocketElement } from './types';
import { defaultTranslations } from './translations';
import { I18n } from './i18n.interface';

@Component({
  tag: 'cookie-pocket',
  styleUrl: 'cookie-pocket.scss',
  shadow: true
})
export class CookiePocket {

  @Prop() logo: string = 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fd4z6dx8qrln4r.cloudfront.net%2Fimage-5694689a934b5-default.png&f=1';
  @Prop({ mutable: true }) i18n: I18n = defaultTranslations;

  @Element() cookiePocketEl: CookiePocketElement;

  @State() value: string = 'some shit';
  @State() active: boolean = false;
  @State() showDetails: boolean = false;
  @State() currentTab: CurrentTab = 'declaration';
  @Prop() categories: string[];

  @Event() ready: EventEmitter;
  @Event() compliance: EventEmitter;

  @Watch('i18n')
  watchI18nProp(i18n: I18n | string) {
    if (typeof i18n === 'string') {
      i18n = JSON.parse(i18n) as I18n;
    }

    this.i18n = { ...this.i18n, ...i18n };
  }


  componentDidLoad() {
    this.cookiePocketEl.onReady && this.cookiePocketEl.onReady(this);

    this.ready.emit();
  }

  onCompliance = (e) => {
    this.cookiePocketEl.onCompliance && this.cookiePocketEl.onCompliance(this.value);

    this.compliance.emit(this.value);
    e.preventDefault();
  };

  @Method()
  hide() {
    this.active = false;
  }

  @Method()
  show() {
    this.active = true;
  }

  render() {
    return [
      <div class="body">
        <div class="powered-by">
          <img class="logo" src={this.logo} />
        </div>
        <div class="content">
          <h2 class="title">Flex Medias hjemmeside bruger cookies</h2>
          <p class="text">
            Vi bruger cookies til at tilpasse vores indhold og annoncer, til at vise dig funktioner til sociale medier og til at analysere vores trafik. Vi deler også oplysninger om din brug af vores website med vores partnere inden for sociale medier, annonceringspartnere og analysepartnere. Vores partnere kan kombinere disse data med andre oplysninger, du har givet dem, eller som de har indsamlet fra din brug af deres tjenester. Du samtykker til vores cookies, hvis du fortsætter med at anvende vores hjemmeside.
          </p>
        </div>
        <div class="buttons">
          <a class="button decline">Kun nødvendige cookies</a>
          <a class="button accept">Tillad alle cookies</a>
          <a class="button details">{this.i18n.details.show}</a>
        </div>
        <div class="level-wrapper">
          <div class="button-accept-wrapper">
            <a class="button-accept">{this.i18n.acceptLabel}</a>
          </div>
          <div class="level-buttons">
            <div class="table">
              <div class="row">
                <div class="select-pane">
                  <div class="button-wrapper">
                    <input type="checkbox" id="necessary" class="button necessary disabled" disabled />
                    <label htmlFor="necessary">{this.i18n.categories.necessary}</label>
                  </div>
                  <div class="button-wrapper">
                    <input type="checkbox" id="preferences" class="button" />
                    <label htmlFor="preferences">{this.i18n.categories.preferences}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      <div class="details">

      </div>
    ];
  }
}
