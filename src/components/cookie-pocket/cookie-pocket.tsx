import { Component, Prop, Element, State, EventEmitter, Event, Method } from '@stencil/core';
import Cookies from 'js-cookie';
import classNames from 'classnames';

import { CurrentTab, CookiePocketElement, CookieLevels, CookiePocketCookies } from './types';
import { defaultTranslations } from './translations';
import { I18n } from './i18n.interface';

@Component({
  tag: 'cookie-pocket',
  styleUrl: 'cookie-pocket.scss',
  shadow: true
})
export class CookiePocket {

  @Prop() logo: string = 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fd4z6dx8qrln4r.cloudfront.net%2Fimage-5694689a934b5-default.png&f=1';
  @Prop() key: string;
  @Prop() force: boolean = false;
  //@Prop() categories: string[];
  @Prop({ mutable: true }) i18n: I18n = defaultTranslations;

  @Element() cookiePocketEl: CookiePocketElement;

  @State() activeCookieDetailPane: string = 'necessary';
  @State() active: boolean = true;
  @State() showDetails: boolean = false;
  @State() currentTab: CurrentTab = 'overview';
  @State() levels: CookieLevels = {
    preferences: true,
    statistics: true,
    marketing: true,
  };

  @Event() ready: EventEmitter;
  @Event() compliance: EventEmitter;

  private readonly canUseCookies: boolean = !(
    navigator.doNotTrack === 'yes' ||
    !navigator.cookieEnabled
  );

  private readonly complianceOptions = {
    expires: 182.5,
    path: window.location.hostname,
  };

  @Method()
  hide = () => this.active = false;

  @Method()
  show = () => this.active = true;

  private getStoredCookies() {
    return Cookies.getJSON(CookiePocket.name) || {} as CookiePocketCookies;
  }

  private getStorage(): CookiePocketCookies {
    if (this.canUseCookies) {
      return this.getStoredCookies();
    }

    /*const compliance = localStorage.getItem('cookie-pocket-compliance');
    return { compliance, levels: {} };*/
  }

  async componentWillLoad() {
    const cookies = this.getStorage();

    if (cookies.consent && !this.force) {
      this.emitCompliance(cookies.levels);
      return this.hide();
    }

    //const external = await fetch(`https://cookie-pocket.herokuapp.com/${this.key}`);
  }

  private emitCompliance(levels: CookieLevels) {
    this.cookiePocketEl.onCompliance && this.cookiePocketEl.onCompliance(levels);
    this.compliance.emit(levels);
  }

  componentDidLoad() {
    this.cookiePocketEl.onReady && this.cookiePocketEl.onReady();

    this.ready.emit();
  }

  private onCompliance = (e) => {
    this.emitCompliance(this.levels);

    Cookies.set(CookiePocket.name, {
      consent: true,
      levels: this.levels
    }, this.complianceOptions); // expires in 6 months

    e.preventDefault();
    this.hide();
  };

  private handleShowDetails = (e) => {
    this.showDetails = !this.showDetails;
    // reset current tab to overview
    this.currentTab = 'overview';

    e.preventDefault();
  };

  private changeCurrentTab = (tab: CurrentTab) => {
    return (e) => {
      this.currentTab = tab;

      e.preventDefault();
    };
  };

  private chooseCookieDetailPane = (type: string) => {
    return (e) => {
      this.activeCookieDetailPane = type;

      e.preventDefault();
    };
  };

  private selectLevel = (level: string) => {
    return (e) => {
      e.preventDefault();
      this.levels[level] = !this.levels[level];
      console.log(level, this.levels[level]);
    };
  };

  private createDisplayStyle = (bool) => ({ display: bool ? 'block': 'none' });

  render() {
    const isCurrentTabOverview = this.currentTab === 'overview';

    const detailsButtonClass = classNames('details-button', { expanded: this.showDetails });
    const detailsBodyStyle = this.createDisplayStyle(this.showDetails);

    const detailsOverviewButtonClass = classNames('tab-item', { selected: isCurrentTabOverview });
    const detailsOverviewStyle = this.createDisplayStyle(isCurrentTabOverview);

    const detailsAboutButtonClass = classNames('tab-item', { selected: !isCurrentTabOverview });
    const detailsAboutStyle = this.createDisplayStyle(!isCurrentTabOverview);

    const detailsButtonText = !this.showDetails
      ? this.i18n.details.show
      : this.i18n.details.hide;

    const typeCategories = ['necessary', 'preferences', 'statistics', 'advertising', 'unclassified'];
    const panes = ['preferences', 'statistics', 'marketing'];

    return this.active ? [
      <div class="body">
        <div class="powered-by">
          <img class="logo" src={this.logo} />
        </div>
        <div class="content">
          <h2 class="title">Flex Medias hjemmeside bruger cookies</h2>
          <p class="text">
            Vi bruger cookies til at tilpasse vores indhold og annoncer, til at vise dig funktioner til sociale medier
            og til at analysere vores trafik. Vi deler også oplysninger om din brug af vores website med vores partnere
            inden for sociale medier, annonceringspartnere og analysepartnere. Vores partnere kan kombinere disse data
            med andre oplysninger, du har givet dem, eller som de har indsamlet fra din brug af deres tjenester. Du
            samtykker til vores cookies, hvis du fortsætter med at anvende vores hjemmeside.
          </p>
        </div>
        <div class="buttons">
          {/*<a class="button decline">Kun nødvendige cookies</a>
          <a class="button accept">Tillad alle cookies</a>*/}
          <a class="button details">{this.i18n.details.show}</a>
        </div>
        <div class="level-wrapper">
          <div class="button-accept-wrapper">
            <a class="button-accept" onClick={this.onCompliance}>{this.i18n.acceptLabel}</a>
          </div>
          <div class="level-buttons">
            <div class="table">
              <div class="row">
                <div class="select-pane">
                  <div class="button-wrapper">
                    <input disabled checked type="checkbox" id="--cookiepocket-necessary" class="button necessary disabled" />
                    <label htmlFor="--cookiepocket-necessary">{this.i18n.categories.necessary}</label>
                  </div>
                  {panes.map(pane => (
                    <div class="button-wrapper">
                      <input checked={this.levels[pane]} onChange={this.selectLevel(pane)} type="checkbox" id={pane} class="button"/>
                      <label htmlFor={pane}>{this.i18n.categories[pane]}</label>
                    </div>
                  ))}
                </div>
                <div class="details-wrapper">
                  <a class={detailsButtonClass} onClick={this.handleShowDetails}>{detailsButtonText}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      <div class="details" style={detailsBodyStyle}>
        <div class="body">
          <div class="content-tabs">
            <a class={detailsOverviewButtonClass} onClick={this.changeCurrentTab('overview')}>{this.i18n.cookieDeclaration}</a>
            <a class={detailsAboutButtonClass} onClick={this.changeCurrentTab('about')}>{this.i18n.aboutLabel}</a>
          </div>
          <div class="details-content">
            <div class="overview" style={detailsOverviewStyle}>
              <div class="container">
                <div class="types">
                  {typeCategories.map(type => {
                    const typeItemClass = classNames('type-item', {
                      selected: this.activeCookieDetailPane === type
                    });

                    return (
                      <a class={typeItemClass} onClick={this.chooseCookieDetailPane(type)}>
                        <label>&nbsp;</label>
                        {this.i18n.categories[type]} (amount)
                      </a>
                    );
                  })}
                </div>
                <div class="type-details">
                  {typeCategories.map(type => {
                    return (
                      <div style={{display: this.activeCookieDetailPane === type ? 'block' : 'none' }}>
                        <p>{type}</p>
                        <div class="container">
                          <table class="content-type-table">
                            <thead>
                              <tr>
                                <td>Navn</td>
                                <td>Udbyder</td>
                                <td>Formål</td>
                                <td>Udløb</td>
                                <td>Type</td>
                              </tr>
                            </thead>
                              <tbody>
                                <tr>
                                  <td title="some name">{type}</td>
                                  <td title="some name">{type}</td>
                                  <td title="some name">{type}</td>
                                  <td title="some name">{type}</td>
                                  <td title="some name">{type}</td>
                                </tr>
                              </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div class="about" style={detailsAboutStyle}>
            </div>
          </div>
          <div class="footer">

          </div>
        </div>
      </div>
    ] : null;
  }
}
