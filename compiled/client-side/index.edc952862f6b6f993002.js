window["onboarding-mfe_index"]=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="https://ragu-framework.github.io/ragu-cli//compiled/client-side/",n(n.s=5)}([function(e,t){e.exports=function(e){return e&&e.__esModule?e:{default:e}}},function(e,t){e.exports=function(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}},function(e,t){e.exports=window.React},function(e,t){e.exports=window.styled},function(e,t,n){var r=n(8);function o(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return o=function(){return e},e}e.exports=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==r(e)&&"function"!=typeof e)return{default:e};var t=o();if(t&&t.has(e))return t.get(e);var n={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(n,a,l):n[a]=e[a]}return n.default=e,t&&t.set(e,n),n}},function(e,t,n){"use strict";var r=n(6),o=n(18);e.exports.default=(o.default||o)(r.default||r)},function(e,t,n){"use strict";var r=n(0);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o,i=r(n(1)),a=r(n(2)),l=r(n(7)),u=(0,n(3).createGlobalStyle)(o||(o=(0,i.default)(["\n  body {\n    padding: 0;\n    margin: 0;\n    background: linear-gradient(122deg, rgba(191,38,94,1) 0%, rgba(255,171,64,1) 100%);\n    background-repeat: no-repeat;\n    background-attachment: fixed;\n  }\n"]))),f=function(e){var t=e.env,n=e.children;return"dev"===t?a.default.createElement("div",null,a.default.createElement(u,null),a.default.createElement("link",{href:"https://fonts.googleapis.com/css2?family=Lato:wght@100;300&family=Poppins:wght@300;500&display=swap&family=Source+Code+Pro:wght@1;300",rel:"stylesheet"}),n):n};t.default=function(e){var t=e.env;return a.default.createElement(f,{env:t},a.default.createElement(l.default,null))}},function(e,t,n){"use strict";var r=n(4),o=n(0);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=o(n(9)),a=r(n(2)),l=n(15),u=n(16),f=o(n(17)),d=function(){var e=(0,a.useState)(1),t=(0,i.default)(e,2),n=t[0],r=t[1];return(0,a.useEffect)((function(){3!==n&&(console.log("schedu",n),setTimeout((function(){return r(n+1)}),150))}),[n]),a.default.createElement(l.CardGrid,null,a.default.createElement(l.Card,{step:1,visible:n>=1,title:"Create Micro-Frontends with a simple CLI",description:"Instead of complex configurations you can just export your micro-frontend with “ragu-cli”."},a.default.createElement(u.Codeblock,null,"$ npx ragu-cli run my-component-name.js",a.default.createElement("br",null),a.default.createElement("br",null),"Welcome to 🔪 RaguServer",a.default.createElement("br",null),"The application is running at http://localhost:3100")),a.default.createElement(l.Card,{step:2,visible:n>=2,title:"Your favorite framework as Micro-frontend",image:f.default,description:"You can just export a function that renders your component and you have a micro-frontend!"},a.default.createElement(u.Codeblock,null,"# my-hello-micro-frontend.jsx",a.default.createElement("br",null),a.default.createElement("br",null),"export default (props) =>",a.default.createElement("br",null),"  ","<Hello name={props.name} />;")),a.default.createElement(l.Card,{step:3,visible:n>=3,title:"Using a micro-frontend is like use an iframe",description:"Properties are passed to micro-frontends as query parameters. It reduces the encapsulation between micro-frontends."},a.default.createElement(u.Codeblock,null,"<ragu-framework",a.default.createElement("br",null),"  ",'src="http://my-micro-frontend-host/my-microfrontend?name=World" />')))};t.default=d},function(e,t){function n(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?e.exports=n=function(e){return typeof e}:e.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(t)}e.exports=n},function(e,t,n){var r=n(10),o=n(11),i=n(12),a=n(14);e.exports=function(e,t){return r(e)||o(e,t)||i(e,t)||a()}},function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==l.return||l.return()}finally{if(o)throw i}}return n}}},function(e,t,n){var r=n(13);e.exports=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}},function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t,n){"use strict";var r=n(0),o=n(4);Object.defineProperty(t,"__esModule",{value:!0}),t.CardGrid=t.Card=void 0;var i,a,l,u,f,d,c,s,p,m,y=r(n(1)),b=o(n(3)),g=r(n(2)),v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:60;return(0,b.keyframes)(i||(i=(0,y.default)(["\n  from {\n    width: 0;\n    opacity: 1;\n  }\n\n  to {\n    opacity: 1;\n    width: ","%;\n  }\n"])),e)},h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:60;return(0,b.keyframes)(a||(a=(0,y.default)(["\n  from {\n    opacity: 1;\n    width: 0;\n    margin-left: 100%;\n  }\n\n  to {\n    opacity: 1;\n    margin-left: ","%;\n    width: ","%;\n  }\n"])),100-e,e)},x=(0,b.keyframes)(l||(l=(0,y.default)(["\n  0% { opacity:0; }\n  25% { opacity:0; }\n  100% { opacity:1; }\n"]))),w=b.default.div(u||(u=(0,y.default)(["\n  display: flex;\n  align-items: center;\n"]))),E=b.default.div(f||(f=(0,y.default)(["\n  font-family: Poppins, sans-serif;\n  font-style: normal;\n  font-weight: bold;\n  font-size: 1.125rem;\n  line-height: 27px;\n"]))),j=b.default.span(d||(d=(0,y.default)(["\n  font-family: Poppins, sans-serif;\n  font-weight: bold;\n  width: 40px;\n  height: 40px;\n  min-width: 40px;\n  display: block;\n  line-height: 40px;\n  text-align: center;\n  border-radius: 40px;\n  background: #BF265E;\n  color: white;\n  font-size: 0.75rem;\n  margin-right: 1.25rem;\n"]))),O=b.default.section(c||(c=(0,y.default)(["\n  position: relative;\n  font-family: Poppins, sans-serif;\n  font-size: .875rem;\n  font-weight: 300;\n  box-sizing: border-box;\n  background: white;\n  padding: 4rem;\n  display: flex;\n  align-items: center;\n  min-height: 350px;\n  opacity: 0;\n  overflow: hidden;\n\n  &.visible {\n    animation: 0.75s ease 0s normal forwards 1 ",";\n    \n    @media (max-width: 1024px) {\n      animation: 0.75s ease 0s normal forwards 1 ",";\n\n      > * {\n        max-width: 100%;\n      }\n    }  \n  }\n  margin-left: ",";\n  border-radius: ",";\n  flex-direction: ",";\n  \n  > * {\n    max-width: 80%;\n    opacity: 0;\n    animation: 1.5s ease 0s normal forwards 1 ",";\n  }\n"])),(function(e){return"left"===e.direction?v():h()}),(function(e){return"left"===e.direction?v(90):h(90)}),(function(e){return"left"===e.direction?"0":"40%"}),(function(e){return"left"===e.direction?"0 200px 200px 0":"200px 0 0 200px"}),(function(e){return"left"===e.direction?"row-reverse":"row"}),x),k=b.default.div(s||(s=(0,y.default)(["\n  display: grid;\n  grid-gap: 1rem;\n\n  p {\n    margin: 0;\n  }\n"]))),P=b.default.img(p||(p=(0,y.default)(["\n  position: absolute;\n  right: -5%;\n  width: 20%;\n  top: 50%;\n\n  transform: translate(-50%, -50%);\n  \n  @media (max-width: 750px) {\n    right: 6%;\n    top: 40%;\n    width: 10%;\n  }\n"])));t.Card=function(e){var t=e.step,n=e.title,r=e.image,o=e.children,i=e.description,a=e.visible;return g.default.createElement(O,{direction:t%2==0?"right":"left",className:a?"visible":""},g.default.createElement(k,null,r&&g.default.createElement(P,{src:r,alt:n}),g.default.createElement(w,null,g.default.createElement(j,null,t),g.default.createElement(E,null,n)),o,g.default.createElement("p",null,i)))};var S=b.default.div(m||(m=(0,y.default)(["\n  display: grid;\n  grid-gap: 4rem;\n"])));t.CardGrid=S},function(e,t,n){"use strict";var r=n(0);Object.defineProperty(t,"__esModule",{value:!0}),t.Codeblock=void 0;var o,i=r(n(1)),a=r(n(3)).default.div(o||(o=(0,i.default)(["\n  box-sizing: border-box;\n  background: #2C3332;\n  border-radius: 20px;\n  padding: 1rem;\n  color: white;\n  width: 100%;\n  overflow: auto;\n  font-family: 'Source Code Pro', monospace;\n  white-space: nowrap;\n"])));t.Codeblock=a},function(e,t){e.exports="https://ragu-framework.github.io/ragu-cli//compiled/client-side/f118d34e6971f24dc93c944818189e74.png"},function(e,t,n){var r=n(19);e.exports=e=>({hydrate:function(t,n,o){r.hydrate(e(n,o),t)},render:function(t,n,o){r.render(e(n,o),t)},disconnect:function(e){r.unmountComponentAtNode(e)}})},function(e,t){e.exports=window.ReactDOM}]);