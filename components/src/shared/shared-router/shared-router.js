const { Shared } = await Util.require('shared/shared.js'),
  { Router } = await Util.require('services/router.js');

class SharedRouter extends Shared {
  tag;
  current = '';
  lastLocation = '';
  title;
  description;
  keywords;
  titleOg;
  descriptionOg;
  urlOg;

  afterShared() {
    this.title = document.querySelector('title');
    this.titleOg = document.querySelector('meta[property="og:title"]');
    this.description = document.querySelector('meta[name="description"]');
    this.descriptionOg = document.querySelector('meta[property="og:description"]');
    this.keywords = document.querySelector('meta[name="keywords"]');
    this.urlOg = document.querySelector('meta[property="og:url"]');

    this.$.navigation = this.$.navigation || {};
    Object.keys(this.$.navigation).forEach(route => {
      Router.fixRoute(this.$.navigation, route);
    });

    document.addEventListener('route', _ => {
      this.redirect();
    });

    window.addEventListener('popstate', _ => {
      document.dispatchEvent(Router.events.getRoute());
    });

    window.addEventListener('beforeunload', e => {
      e = e || window.event;
      const message = 'Changed data wasn\'t saved, are you sure you want to leave?';

      // For IE and Firefox prior to version 4
      if (e && Router.unsaved) {
        e.returnValue = message;
      }

      // For Safari
      if (Router.unsaved) {
        return message;
      }
    });
  }

  afterRender() {
    this.redirect();
  }

  redirect() {
    this.lastLocation = location.href + '';
    const user = __bm.root.config?.user,
      tag = Router.getTag(this.$.navigation, user),
      eventItem = { tag, user },
      tagName = tag.component;

    if (tag.error === 401) {
      this.$output?.unauthorizedAccess?.emit(eventItem);
    } else {
      this.$output?.authorizedAccess?.emit(eventItem);
    }

    if (this.current === document.location.pathname) {
      if (document.location.hash.length > 0) {
        document.querySelector(document.location.hash)?.scrollIntoView();
      }
      return;
    }

    this.$self.get.spinner?.classList.remove('hidden');

    if (this.tag) {
      this.tag.remove();
    }

    this.current = document.location.pathname;
    this.tag = document.createElement(tagName);

    this.appendChild(this.tag);
    this.setMetaTags(tag);

    this.tag.addEventListener('firstrendered', _ => {
      this.$self.get.spinner.classList.add('hidden');
      if (document.location.hash.length > 0) {
        this.tag.addEventListener('loadfinished', _ => {
          document.querySelector(document.location.hash)?.scrollIntoView();
        });
      } else {
        setTimeout(_ => window.scrollTo(0, 0), 0);
      }
    });
    this.searchForNotDownloaded(this);
  }

  setMetaTags(tag) {
    if (tag.meta?.title) {
      if (this.title) {
        this.title.innerHTML = tag.meta?.title;
      }
      if (this.titleOg) {
        this.titleOg.content = tag.meta?.title;
      }
    }

    if (tag.meta?.description) {
      if (this.description) {
        this.description.content = tag.meta.description;
      }
      if (this.descriptionOg) {
        this.descriptionOg.content = tag.meta.description;
      }
    }

    if (tag.meta?.keywords) {
      this.keywords.content = tag.meta.keywords;
    }

    if (this.urlOg) {
      this.urlOg.content = location.origin + location.pathname;
    }
  }
}
export { SharedRouter as default };
