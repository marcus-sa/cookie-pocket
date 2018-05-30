var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component, Prop, Element, State, Event, Method } from '@stencil/core';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import { defaultTranslations } from './translations';
let CookiePocket = CookiePocket_1 = class CookiePocket {
    constructor() {
        this.logo = 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fd4z6dx8qrln4r.cloudfront.net%2Fimage-5694689a934b5-default.png&f=1';
        this.force = false;
        //@Prop() categories: string[];
        this.i18n = defaultTranslations;
        this.activeCookieDetailPane = 'necessary';
        this.active = true;
        this.showDetails = false;
        this.currentTab = 'overview';
        this.levels = {
            preferences: true,
            statistics: true,
            marketing: true,
        };
        this.canUseCookies = !(navigator.doNotTrack === 'yes' ||
            !navigator.cookieEnabled);
        this.complianceOptions = {
            expires: 182.5,
            path: window.location.hostname,
        };
        this.hide = () => this.active = false;
        this.show = () => this.active = true;
        this.onCompliance = (e) => {
            this.emitCompliance(this.levels);
            Cookies.set(CookiePocket_1.name, {
                consent: true,
                levels: this.levels
            }, this.complianceOptions); // expires in 6 months
            e.preventDefault();
            this.hide();
        };
        this.handleShowDetails = (e) => {
            this.showDetails = !this.showDetails;
            // reset current tab to overview
            this.currentTab = 'overview';
            e.preventDefault();
        };
        this.changeCurrentTab = (tab) => {
            return (e) => {
                this.currentTab = tab;
                e.preventDefault();
            };
        };
        this.chooseCookieDetailPane = (type) => {
            return (e) => {
                this.activeCookieDetailPane = type;
                e.preventDefault();
            };
        };
        this.selectLevel = (level) => {
            return (e) => {
                e.preventDefault();
                this.levels[level] = !this.levels[level];
                console.log(level, this.levels[level]);
            };
        };
        this.createDisplayStyle = (bool) => ({ display: bool ? 'block' : 'none' });
    }
    getStoredCookies() {
        return Cookies.getJSON(CookiePocket_1.name) || {};
    }
    getStorage() {
        if (this.canUseCookies) {
            return this.getStoredCookies();
        }
        /*const compliance = localStorage.getItem('cookie-pocket-compliance');
        return { compliance, levels: {} };*/
    }
    componentWillLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = this.getStorage();
            if (cookies.consent && !this.force) {
                this.emitCompliance(cookies.levels);
                return this.hide();
            }
            //const external = await fetch(`https://cookie-pocket.herokuapp.com/${this.key}`);
        });
    }
    emitCompliance(levels) {
        this.cookiePocketEl.onCompliance && this.cookiePocketEl.onCompliance(levels);
        this.compliance.emit(levels);
    }
    componentDidLoad() {
        this.cookiePocketEl.onReady && this.cookiePocketEl.onReady();
        this.ready.emit();
    }
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
            h("div", { class: "body" },
                h("div", { class: "powered-by" },
                    h("img", { class: "logo", src: this.logo })),
                h("div", { class: "content" },
                    h("h2", { class: "title" }, "Flex Medias hjemmeside bruger cookies"),
                    h("p", { class: "text" }, "Vi bruger cookies til at tilpasse vores indhold og annoncer, til at vise dig funktioner til sociale medier og til at analysere vores trafik. Vi deler ogs\u00E5 oplysninger om din brug af vores website med vores partnere inden for sociale medier, annonceringspartnere og analysepartnere. Vores partnere kan kombinere disse data med andre oplysninger, du har givet dem, eller som de har indsamlet fra din brug af deres tjenester. Du samtykker til vores cookies, hvis du forts\u00E6tter med at anvende vores hjemmeside.")),
                h("div", { class: "buttons" },
                    h("a", { class: "button details" }, this.i18n.details.show)),
                h("div", { class: "level-wrapper" },
                    h("div", { class: "button-accept-wrapper" },
                        h("a", { class: "button-accept", onClick: this.onCompliance }, this.i18n.acceptLabel)),
                    h("div", { class: "level-buttons" },
                        h("div", { class: "table" },
                            h("div", { class: "row" },
                                h("div", { class: "select-pane" },
                                    h("div", { class: "button-wrapper" },
                                        h("input", { disabled: true, checked: true, type: "checkbox", id: "--cookiepocket-necessary", class: "button necessary disabled" }),
                                        h("label", { htmlFor: "--cookiepocket-necessary" }, this.i18n.categories.necessary)),
                                    panes.map(pane => (h("div", { class: "button-wrapper" },
                                        h("input", { checked: this.levels[pane], onChange: this.selectLevel(pane), type: "checkbox", id: pane, class: "button" }),
                                        h("label", { htmlFor: pane }, this.i18n.categories[pane]))))),
                                h("div", { class: "details-wrapper" },
                                    h("a", { class: detailsButtonClass, onClick: this.handleShowDetails }, detailsButtonText))))))),
            h("div", { class: "details", style: detailsBodyStyle },
                h("div", { class: "body" },
                    h("div", { class: "content-tabs" },
                        h("a", { class: detailsOverviewButtonClass, onClick: this.changeCurrentTab('overview') }, this.i18n.cookieDeclaration),
                        h("a", { class: detailsAboutButtonClass, onClick: this.changeCurrentTab('about') }, this.i18n.aboutLabel)),
                    h("div", { class: "details-content" },
                        h("div", { class: "overview", style: detailsOverviewStyle },
                            h("div", { class: "container" },
                                h("div", { class: "types" }, typeCategories.map(type => {
                                    const typeItemClass = classNames('type-item', {
                                        selected: this.activeCookieDetailPane === type
                                    });
                                    return (h("a", { class: typeItemClass, onClick: this.chooseCookieDetailPane(type) },
                                        h("label", null, "\u00A0"),
                                        this.i18n.categories[type],
                                        " (amount)"));
                                })),
                                h("div", { class: "type-details" }, typeCategories.map(type => {
                                    return (h("div", { style: { display: this.activeCookieDetailPane === type ? 'block' : 'none' } },
                                        h("p", null, type),
                                        h("div", { class: "container" },
                                            h("table", { class: "content-type-table" },
                                                h("thead", null,
                                                    h("tr", null,
                                                        h("td", null, "Navn"),
                                                        h("td", null, "Udbyder"),
                                                        h("td", null, "Form\u00E5l"),
                                                        h("td", null, "Udl\u00F8b"),
                                                        h("td", null, "Type"))),
                                                h("tbody", null,
                                                    h("tr", null,
                                                        h("td", { title: "some name" }, type),
                                                        h("td", { title: "some name" }, type),
                                                        h("td", { title: "some name" }, type),
                                                        h("td", { title: "some name" }, type),
                                                        h("td", { title: "some name" }, type)))))));
                                })))),
                        h("div", { class: "about", style: detailsAboutStyle })),
                    h("div", { class: "footer" })))
        ] : null;
    }
};
__decorate([
    Prop()
], CookiePocket.prototype, "logo", void 0);
__decorate([
    Prop()
], CookiePocket.prototype, "key", void 0);
__decorate([
    Prop()
], CookiePocket.prototype, "force", void 0);
__decorate([
    Prop({ mutable: true })
], CookiePocket.prototype, "i18n", void 0);
__decorate([
    Element()
], CookiePocket.prototype, "cookiePocketEl", void 0);
__decorate([
    State()
], CookiePocket.prototype, "activeCookieDetailPane", void 0);
__decorate([
    State()
], CookiePocket.prototype, "active", void 0);
__decorate([
    State()
], CookiePocket.prototype, "showDetails", void 0);
__decorate([
    State()
], CookiePocket.prototype, "currentTab", void 0);
__decorate([
    State()
], CookiePocket.prototype, "levels", void 0);
__decorate([
    Event()
], CookiePocket.prototype, "ready", void 0);
__decorate([
    Event()
], CookiePocket.prototype, "compliance", void 0);
__decorate([
    Method()
], CookiePocket.prototype, "hide", void 0);
__decorate([
    Method()
], CookiePocket.prototype, "show", void 0);
CookiePocket = CookiePocket_1 = __decorate([
    Component({
        tag: 'cookie-pocket',
        styleUrl: 'cookie-pocket.scss',
        shadow: true
    })
], CookiePocket);
export { CookiePocket };
var CookiePocket_1;
