import { Component, Prop, Element, State, EventEmitter, Event, Method } from '@stencil/core';
import { Modal } from 'carbon-components';
import Cookies from 'js-cookie';
import classNames from 'classnames';

import { CurrentTab, CookiePocketElement, CookieLevels, CookiePocketCookies, ComplianceOptions } from './types';
import { defaultTranslations } from './translations';
import { I18n } from './i18n.interface';

@Component({
  tag: 'cookie-pocket',
  styleUrl: 'cookie-pocket.scss',
  shadow: true
})
export class CookiePocket {

  @Prop() readonly logo: string = 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fd4z6dx8qrln4r.cloudfront.net%2Fimage-5694689a934b5-default.png&f=1';
  @Prop() readonly key: string;
  @Prop() readonly force: boolean = false;
  //@Prop() categories: string[];
  @Prop({ mutable: true }) i18n: I18n = defaultTranslations;

  @Element() cookiePocketEl: CookiePocketElement;
  //private dataTableInstance: DataTable;
  private modalInstance: Modal;

  @State() activeCookieDetailPane: string = 'necessary';
  @State() active: boolean = true;
  @State() showDetails: boolean = false;
  @State() currentTab: CurrentTab = 'overview';
  @State() levels: CookieLevels = {
    preferences: true,
    statistics: true,
    marketing: true,
  };

  @Event() readonly ready: EventEmitter;
  @Event() readonly complete: EventEmitter;

  private readonly canUseCookies: boolean = !(
    navigator.doNotTrack === 'yes' ||
    !navigator.cookieEnabled
  );

  private readonly complianceOptions: ComplianceOptions = {
    expires: 182.5,
    path: window.location.hostname,
  };

  @Method()
  public hide() {
    this.active = false;

    this.modalInstance && this.modalInstance.hide();
  }

  @Method()
  public show = () => this.active = true;

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
      this.emitComplete(cookies.levels);
      return this.hide();
    }

    //const external = await fetch(`https://cookie-pocket.herokuapp.com/${this.key}`);
  }

  private emitComplete(levels: CookieLevels) {
    this.cookiePocketEl.onComplete && this.cookiePocketEl.onComplete(levels);
    this.complete.emit(levels);
  }

  private getElement = (selector: string): HTMLElement => this.cookiePocketEl.shadowRoot.querySelector(selector);

  /*private getDataTable() {
    if (!this.dataTableInstance) {
      const dataTableElement = this.getElement('[data-table-v2]');

      this.dataTableInstance = DataTable.create(dataTableElement);
    }
  }*/

  private getModal() {
    if (!this.modalInstance) {
      const modalElement = this.getElement('[data-modal]');

      this.modalInstance = Modal.create(modalElement);
    }

    return this.modalInstance;
  }

  componentDidLoad() {
    this.cookiePocketEl.onReady && this.cookiePocketEl.onReady();

    this.ready.emit();

    if (this.active || this.force) {
      this.getModal().show();
      //this.getDataTable();
    }
  }

  private onCompliance = (e) => {
    this.emitComplete(this.levels);

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

    return this.active ? (
      <div data-modal class="bx--modal" tabindex="-1">
        <div style={{ width: '100vw !important', maxWidth: '100% !important' }}  class="bx--modal-container">
          <div class="bx--modal-header">
            <p class="bx--modal-header__label bx--type-delta">Optional label</p>
            <p class="bx--modal-header__heading bx--type-beta">Modal heading</p>
            <button class="bx--modal-close" type="button" data-modal-close aria-label="close modal">
              <svg class="bx--modal-close__icon" width="10" height="10" viewBox="0 0 10 10"
                   xmlns="http://www.w3.org/2000/svg">
                <title>Close Modal</title>
                <path
                  d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z"
                  fill-rule="nonzero"
                />
              </svg>
            </button>
          </div>

          <div class="bx--modal-content">
            <div class="bx--data-table-v2-container" data-table-v2>
              <h4 class="bx--data-table-v2-header">Table title</h4>
              <section class="bx--table-toolbar">
                <div class="bx--batch-actions" aria-label="Table Action Bar">
                  <div class="bx--action-list">
                    <button class="bx--btn bx--btn--sm bx--btn--ghost" type="button">
                      Ghost
                      <svg class="bx--btn__icon" width="16" height="16" viewBox="0 0 16 16"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7H4v2h3v3h2V9h3V7H9V4H7v3zm1 9A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" fill-rule="evenodd"/>
                      </svg>
                    </button>

                    <button class="bx--btn bx--btn--sm bx--btn--ghost" type="button">
                      Ghost
                      <svg class="bx--btn__icon" width="16" height="16" viewBox="0 0 16 16"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7H4v2h3v3h2V9h3V7H9V4H7v3zm1 9A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" fill-rule="evenodd"/>
                      </svg>
                    </button>

                    <button class="bx--btn bx--btn--sm bx--btn--ghost" type="button">
                      Ghost
                      <svg class="bx--btn__icon" width="16" height="16" viewBox="0 0 16 16"
                           xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 7H4v2h3v3h2V9h3V7H9V4H7v3zm1 9A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                  <div class="bx--batch-summary">
                    <p class="bx--batch-summary__para">
                      <span data-items-selected>3</span> items selected</p>
                    <button data-event="action-bar-cancel" class="bx--batch-summary__cancel">Cancel</button>
                  </div>
                </div>

                <div class="bx--toolbar-search-container">
                  <div data-search class="bx--search bx--search--sm" role="search">
                    <svg class="bx--search-magnifier" width="16" height="16" viewBox="0 0 16 16">
                      <path
                        d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm4.936-1.27l4.563 4.557-.707.708-4.563-4.558a6.5 6.5 0 1 1 .707-.707z"
                        fill-rule="nonzero"/>
                    </svg>
                    <label id="search-input-label-1" class="bx--label" htmlFor="search__input-2">Search</label>
                    <input class="bx--search-input" type="text" id="search__input-2" role="search" placeholder="Search" aria-labelledby="search-input-label-1" />
                      <button class="bx--search-close bx--search-close--hidden" title="Clear search
        input" aria-label="Clear search input">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8 6.586L5.879 4.464 4.464 5.88 6.586 8l-2.122 2.121 1.415 1.415L8 9.414l2.121 2.122 1.415-1.415L9.414 8l2.122-2.121-1.415-1.415L8 6.586zM8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"
                            fill-rule="evenodd"/>
                        </svg>
                      </button>
                  </div>
                </div>

                <div class="bx--toolbar-content">
                  <button class="bx--toolbar-action">
                    <svg class="bx--toolbar-action__icon" fill-rule="evenodd" height="16" name="download" role="img"
                         viewBox="0 0 14 16" width="14"
                         aria-label="Download" alt="Download">
                      <title>Download</title>
                      <path d="M7.506 11.03l4.137-4.376.727.687-5.363 5.672-5.367-5.67.726-.687 4.14 4.374V0h1v11.03z" />
                      <path d="M13 15v-2h1v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-2h1v2h12z" />
                    </svg>
                  </button>

                  <button class="bx--toolbar-action">
                    <svg class="bx--toolbar-action__icon" fill-rule="evenodd" height="16" name="edit" role="img"
                         viewBox="0 0 16 16" width="16"
                         aria-label="Edit" alt="Edit">
                      <title>Edit</title>
                      <path d="M7.926 3.38L1.002 9.72V12h2.304l6.926-6.316L7.926 3.38zm.738-.675l2.308 2.304 1.451-1.324-2.308-2.309-1.451 1.329zM.002 9.28L9.439.639a1 1 0 0 1 1.383.03l2.309 2.309a1 1 0 0 1-.034 1.446L3.694 13H.002V9.28zM0 16.013v-1h16v1z" />
                    </svg>
                  </button>

                  <button class="bx--toolbar-action">
                    <svg class="bx--toolbar-action__icon" fill-rule="evenodd" height="16" name="settings" role="img"
                         viewBox="0 0 15 16" width="15"
                         aria-label="Settings" alt="Settings">
                      <title>Settings</title>
                      <path d="M7.53 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                      <path d="M6.268 2.636l-.313.093c-.662.198-1.28.52-1.822.946l-.255.2-1.427-.754-1.214 1.735 1.186 1.073-.104.31a5.493 5.493 0 0 0-.198 2.759l.05.274L1 10.33l1.214 1.734 1.06-.56.262.275a5.5 5.5 0 0 0 2.42 1.491l.312.093L6.472 15H8.59l.204-1.636.313-.093a5.494 5.494 0 0 0 2.21-1.28l.26-.248 1.09.576 1.214-1.734-1.08-.977.071-.29a5.514 5.514 0 0 0-.073-2.905l-.091-.302 1.15-1.041-1.214-1.734-1.3.687-.257-.22a5.487 5.487 0 0 0-1.98-1.074l-.313-.093L8.59 1H6.472l-.204 1.636zM5.48.876A1 1 0 0 1 6.472 0H8.59a1 1 0 0 1 .992.876l.124.997a6.486 6.486 0 0 1 1.761.954l.71-.375a1 1 0 0 1 1.286.31l1.215 1.734a1 1 0 0 1-.149 1.316l-.688.622a6.514 6.514 0 0 1 .067 2.828l.644.581a1 1 0 0 1 .148 1.316l-1.214 1.734a1 1 0 0 1-1.287.31l-.464-.245c-.6.508-1.286.905-2.029 1.169l-.124.997A1 1 0 0 1 8.59 16H6.472a1 1 0 0 1-.992-.876l-.125-.997a6.499 6.499 0 0 1-2.274-1.389l-.399.211a1 1 0 0 1-1.287-.31L.181 10.904A1 1 0 0 1 .329 9.59l.764-.69a6.553 6.553 0 0 1 .18-2.662l-.707-.64a1 1 0 0 1-.148-1.315l1.214-1.734a1 1 0 0 1 1.287-.31l.86.454a6.482 6.482 0 0 1 1.576-.819L5.48.876z" />
                    </svg>
                  </button>

                  <button class="bx--btn bx--btn--sm bx--btn--primary">Add new</button>
                </div>
              </section>

              <table class="bx--data-table-v2 bx--data-table-v2--zebra">
                <thead>
                <tr>
                  <th>
                    <input data-event="select-all" id="bx--checkbox-20" class="bx--checkbox" type="checkbox"
                           value="green" name="checkbox-20" />
                      <label htmlFor="bx--checkbox-20" class="bx--checkbox-label" aria-label="Label name"></label>
                  </th>
                  <th>
                    <button class="bx--table-sort-v2" data-event="sort">
                      <span class="bx--table-header-label">Name</span>
                      <svg class="bx--table-sort-v2__icon" width="10" height="5" viewBox="0 0 10 5">
                        <path d="M0 0l5 4.998L10 0z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button class="bx--table-sort-v2" data-event="sort">
                      <span>Provider</span>
                      <svg class="bx--table-sort-v2__icon" width="10" height="5" viewBox="0 0 10 5">
                        <path d="M0 0l5 4.998L10 0z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button class="bx--table-sort-v2" data-event="sort">
                      <span>Purpose</span>
                      <svg class="bx--table-sort-v2__icon" width="10" height="5" viewBox="0 0 10 5">
                        <path d="M0 0l5 4.998L10 0z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button class="bx--table-sort-v2" data-event="sort">
                      <span>Expiry</span>
                      <svg class="bx--table-sort-v2__icon" width="10" height="5" viewBox="0 0 10 5">
                        <path d="M0 0l5 4.998L10 0z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button class="bx--table-sort-v2" data-event="sort">
                      <span>Attached Groups</span>
                      <svg class="bx--table-sort-v2__icon" width="10" height="5" viewBox="0 0 10 5">
                        <path d="M0 0l5 4.998L10 0z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button class="bx--table-sort-v2" data-event="sort">
                      <span>Type</span>
                      <svg class="bx--table-sort-v2__icon" width="10" height="5" viewBox="0 0 10 5">
                        <path d="M0 0l5 4.998L10 0z" fill-rule="evenodd"/>
                      </svg>
                    </button>
                  </th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                    <input data-event="select" id="bx--checkbox-13" class="bx--checkbox" type="checkbox" value="green" name="checkbox-13" />
                      <label htmlFor="bx--checkbox-13" class="bx--checkbox-label" aria-label="Label name"></label>
                  </td>
                  <td>Load Balancer 1</td>
                  <td>HTTP</td>
                  <td>80</td>
                  <td>Round Robin</td>
                  <td>Maureen's VM Groups</td>
                  <td>Active</td>
                  <td class="bx--table-overflow">
                    <div data-overflow-menu tabindex="0" aria-label="Overflow menu description" class="bx--overflow-menu">
                      <svg class="bx--overflow-menu__icon" width="3" height="15" viewBox="0 0 3 15">
                        <g fill-rule="evenodd">
                          <circle cx="1.5" cy="1.5" r="1.5"/>
                          <circle cx="1.5" cy="7.5" r="1.5"/>
                          <circle cx="1.5" cy="13.5" r="1.5"/>
                        </g>
                      </svg>
                      <ul class="bx--overflow-menu-options bx--overflow-menu--flip">
                        <li class="bx--overflow-menu-options__option">
                          <button class="bx--overflow-menu-options__btn">Stop app</button>
                        </li>
                        <li class="bx--overflow-menu-options__option">
                          <button class="bx--overflow-menu-options__btn">Restart app</button>
                        </li>
                        <li class="bx--overflow-menu-options__option">
                          <button class="bx--overflow-menu-options__btn">Rename app</button>
                        </li>
                        <li class="bx--overflow-menu-options__option">
                          <button class="bx--overflow-menu-options__btn">Edit routes and access, use title when
                          </button>
                        </li>
                        <li class="bx--overflow-menu-options__option bx--overflow-menu-options__option--danger">
                          <button class="bx--overflow-menu-options__btn">Delete app</button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bx--modal-footer">
            <button class="bx--btn bx--btn--secondary" type="button" data-modal-close>Secondary button</button>
            <button class="bx--btn bx--btn--primary" type="button" data-modal-primary-focus>Primary button</button>
          </div>
        </div>
      </div>
    ) : null;
  }
}
