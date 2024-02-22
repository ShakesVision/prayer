"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2948],{2948:(v,h,s)=>{s.r(h),s.d(h,{ion_loading:()=>x});var p=s(1528),t=s(2992),m=s(9637),u=s(6384),b=s(3464),l=s(3816),y=s(5256),a=s(8523),n=s(388);s(4829),s(2784);const g=i=>{const o=(0,n.c)(),e=(0,n.c)(),r=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity",.01,"var(--backdrop-opacity)").beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),r.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.01,transform:"scale(1.1)"},{offset:1,opacity:1,transform:"scale(1)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,r])},c=i=>{const o=(0,n.c)(),e=(0,n.c)(),r=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity","var(--backdrop-opacity)",0),r.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.99,transform:"scale(1)"},{offset:1,opacity:0,transform:"scale(0.9)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,r])},w=i=>{const o=(0,n.c)(),e=(0,n.c)(),r=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity",.01,"var(--backdrop-opacity)").beforeStyles({"pointer-events":"none"}).afterClearStyles(["pointer-events"]),r.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.01,transform:"scale(1.1)"},{offset:1,opacity:1,transform:"scale(1)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,r])},E=i=>{const o=(0,n.c)(),e=(0,n.c)(),r=(0,n.c)();return e.addElement(i.querySelector("ion-backdrop")).fromTo("opacity","var(--backdrop-opacity)",0),r.addElement(i.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.99,transform:"scale(1)"},{offset:1,opacity:0,transform:"scale(0.9)"}]),o.addElement(i).easing("ease-in-out").duration(200).addAnimation([e,r])},x=class{constructor(i){(0,t.r)(this,i),this.didPresent=(0,t.d)(this,"ionLoadingDidPresent",7),this.willPresent=(0,t.d)(this,"ionLoadingWillPresent",7),this.willDismiss=(0,t.d)(this,"ionLoadingWillDismiss",7),this.didDismiss=(0,t.d)(this,"ionLoadingDidDismiss",7),this.didPresentShorthand=(0,t.d)(this,"didPresent",7),this.willPresentShorthand=(0,t.d)(this,"willPresent",7),this.willDismissShorthand=(0,t.d)(this,"willDismiss",7),this.didDismissShorthand=(0,t.d)(this,"didDismiss",7),this.delegateController=(0,l.d)(this),this.lockController=(0,b.c)(),this.triggerController=(0,l.e)(),this.customHTMLEnabled=a.c.get("innerHTMLTemplatesEnabled",m.E),this.presented=!1,this.onBackdropTap=()=>{this.dismiss(void 0,l.B)},this.overlayIndex=void 0,this.delegate=void 0,this.hasController=!1,this.keyboardClose=!0,this.enterAnimation=void 0,this.leaveAnimation=void 0,this.message=void 0,this.cssClass=void 0,this.duration=0,this.backdropDismiss=!1,this.showBackdrop=!0,this.spinner=void 0,this.translucent=!1,this.animated=!0,this.htmlAttributes=void 0,this.isOpen=!1,this.trigger=void 0}onIsOpenChange(i,o){!0===i&&!1===o?this.present():!1===i&&!0===o&&this.dismiss()}triggerChanged(){const{trigger:i,el:o,triggerController:e}=this;i&&e.addClickListener(o,i)}connectedCallback(){(0,l.j)(this.el),this.triggerChanged()}componentWillLoad(){if(void 0===this.spinner){const i=(0,a.b)(this);this.spinner=a.c.get("loadingSpinner",a.c.get("spinner","ios"===i?"lines":"crescent"))}(0,l.k)(this.el)}componentDidLoad(){!0===this.isOpen&&(0,u.r)(()=>this.present()),this.triggerChanged()}disconnectedCallback(){this.triggerController.removeClickListener()}present(){var i=this;return(0,p.c)(function*(){const o=yield i.lockController.lock();yield i.delegateController.attachViewToDom(),yield(0,l.f)(i,"loadingEnter",g,w),i.duration>0&&(i.durationTimeout=setTimeout(()=>i.dismiss(),i.duration+10)),o()})()}dismiss(i,o){var e=this;return(0,p.c)(function*(){const r=yield e.lockController.lock();e.durationTimeout&&clearTimeout(e.durationTimeout);const f=yield(0,l.g)(e,i,o,"loadingLeave",c,E);return f&&e.delegateController.removeViewFromDom(),r(),f})()}onDidDismiss(){return(0,l.h)(this.el,"ionLoadingDidDismiss")}onWillDismiss(){return(0,l.h)(this.el,"ionLoadingWillDismiss")}renderLoadingMessage(i){const{customHTMLEnabled:o,message:e}=this;return o?(0,t.h)("div",{class:"loading-content",id:i,innerHTML:(0,m.a)(e)}):(0,t.h)("div",{class:"loading-content",id:i},e)}render(){const{message:i,spinner:o,htmlAttributes:e,overlayIndex:r}=this,f=(0,a.b)(this),k=`loading-${r}-msg`;return(0,t.h)(t.H,Object.assign({key:"95123f54ba1db5e59563d79db075315b43ed20f7",role:"dialog","aria-modal":"true","aria-labelledby":void 0!==i?k:null,tabindex:"-1"},e,{style:{zIndex:`${4e4+this.overlayIndex}`},onIonBackdropTap:this.onBackdropTap,class:Object.assign(Object.assign({},(0,y.g)(this.cssClass)),{[f]:!0,"overlay-hidden":!0,"loading-translucent":this.translucent})}),(0,t.h)("ion-backdrop",{key:"e113bf123eaad38f2dafce8ea5d2ebef409d0c0f",visible:this.showBackdrop,tappable:this.backdropDismiss}),(0,t.h)("div",{key:"1268c9480854383c7883a79d597350540ade93c2",tabindex:"0"}),(0,t.h)("div",{key:"e86fc71504ebd578117dea2232d9740a087d1249",class:"loading-wrapper ion-overlay-wrapper"},o&&(0,t.h)("div",{class:"loading-spinner"},(0,t.h)("ion-spinner",{name:o,"aria-hidden":"true"})),void 0!==i&&this.renderLoadingMessage(k)),(0,t.h)("div",{key:"3b91e2492e06aa65ebe77ed2b6ffb9d2f84bdd9c",tabindex:"0"}))}get el(){return(0,t.f)(this)}static get watchers(){return{isOpen:["onIsOpenChange"],trigger:["triggerChanged"]}}};x.style={ios:".sc-ion-loading-ios-h{--min-width:auto;--width:auto;--min-height:auto;--height:auto;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;font-family:var(--ion-font-family, inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-loading-ios-h{display:none}.loading-wrapper.sc-ion-loading-ios{display:-ms-flexbox;display:flex;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);opacity:0;z-index:10}ion-spinner.sc-ion-loading-ios{color:var(--spinner-color)}.sc-ion-loading-ios-h{--background:var(--ion-overlay-background-color, var(--ion-color-step-100, #f9f9f9));--max-width:270px;--max-height:90%;--spinner-color:var(--ion-color-step-600, #666666);--backdrop-opacity:var(--ion-backdrop-opacity, 0.3);color:var(--ion-text-color, #000);font-size:0.875rem}.loading-wrapper.sc-ion-loading-ios{border-radius:8px;-webkit-padding-start:34px;padding-inline-start:34px;-webkit-padding-end:34px;padding-inline-end:34px;padding-top:24px;padding-bottom:24px}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.loading-translucent.sc-ion-loading-ios-h .loading-wrapper.sc-ion-loading-ios{background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}}.loading-content.sc-ion-loading-ios{font-weight:bold}.loading-spinner.sc-ion-loading-ios+.loading-content.sc-ion-loading-ios{-webkit-margin-start:16px;margin-inline-start:16px}",md:".sc-ion-loading-md-h{--min-width:auto;--width:auto;--min-height:auto;--height:auto;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;outline:none;font-family:var(--ion-font-family, inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-loading-md-h{display:none}.loading-wrapper.sc-ion-loading-md{display:-ms-flexbox;display:flex;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);opacity:0;z-index:10}ion-spinner.sc-ion-loading-md{color:var(--spinner-color)}.sc-ion-loading-md-h{--background:var(--ion-color-step-50, #f2f2f2);--max-width:280px;--max-height:90%;--spinner-color:var(--ion-color-primary, #3880ff);--backdrop-opacity:var(--ion-backdrop-opacity, 0.32);color:var(--ion-color-step-850, #262626);font-size:0.875rem}.loading-wrapper.sc-ion-loading-md{border-radius:2px;-webkit-padding-start:24px;padding-inline-start:24px;-webkit-padding-end:24px;padding-inline-end:24px;padding-top:24px;padding-bottom:24px;-webkit-box-shadow:0 16px 20px rgba(0, 0, 0, 0.4);box-shadow:0 16px 20px rgba(0, 0, 0, 0.4)}.loading-spinner.sc-ion-loading-md+.loading-content.sc-ion-loading-md{-webkit-margin-start:16px;margin-inline-start:16px}"}},5256:(v,h,s)=>{s.d(h,{c:()=>m,g:()=>b,h:()=>t,o:()=>y});var p=s(1528);const t=(a,n)=>null!==n.closest(a),m=(a,n)=>"string"==typeof a&&a.length>0?Object.assign({"ion-color":!0,[`ion-color-${a}`]:!0},n):n,b=a=>{const n={};return(a=>void 0!==a?(Array.isArray(a)?a:a.split(" ")).filter(d=>null!=d).map(d=>d.trim()).filter(d=>""!==d):[])(a).forEach(d=>n[d]=!0),n},l=/^[a-z][a-z0-9+\-.]*:/,y=function(){var a=(0,p.c)(function*(n,d,_,g){if(null!=n&&"#"!==n[0]&&!l.test(n)){const c=document.querySelector("ion-router");if(c)return null!=d&&d.preventDefault(),c.push(n,_,g)}return!1});return function(d,_,g,c){return a.apply(this,arguments)}}()}}]);