import { Method, Component, Prop, Element, State, EventEmitter, Event } from '@stencil/core';
import { defaultTranslations } from './translations';
import { I18n } from './i18n.interface';
import { CurrentTab, CookiePocketElement } from './types';

@Component({
  tag: 'cookie-pocket',
  styleUrl: 'cookie-pocket.css',
  //shadow: true
})
export class CookiePocket {

  @Prop({ mutable: true }) i18n: I18n = defaultTranslations;

  @Element() cookiePocketEl: CookiePocketElement;

  @State() value: string = 'some shit';
  @State() active: boolean = false;
  @State() showDetails: boolean = false;
  @State() currentTab: CurrentTab = 'declaration';
  @Prop() categories: string[];

  @Event() ready: EventEmitter;
  @Event() compliance: EventEmitter;

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
    return (
      <div>
        <h1>{this.i18n.cookieDeclaration}</h1>
        <button onClick={this.onCompliance}>{this.i18n.acceptLabel}</button>
      </div>
    );
  }
}
