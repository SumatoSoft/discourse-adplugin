import { withPluginApi } from 'discourse/lib/plugin-api';
import PageTracker from 'discourse/lib/page-tracker';
import loadScript from 'discourse/lib/load-script';

var _loaded = false,
    _promise = null,
    ad_width = '',
    ad_height = '',
    ad_mobile_width = 320,
    ad_mobile_height = 50,
    currentUser = Discourse.User.current(),
    publisher_id = Discourse.SiteSettings.adsense_publisher_code,
    mobile_width = 320,
    mobile_height = 50;

const mobileView = Discourse.Site.currentProp('mobileView');

function splitWidthInt(value) {
  var str = value.substring(0, 3);
  return str.trim();
}

function splitHeightInt(value) {
  var str = value.substring(4, 7);
  return str.trim();
}

function loadAdsense() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  var adsenseSrc = (('https:' === document.location.protocol) ? 'https:' : 'http:') + '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  _promise = loadScript(adsenseSrc, { scriptTag: true }).then(function() {
    _loaded = true;
  });

  return _promise;
}

var data = {
  "topic-list-top" : {},
  "topic-above-post-stream" : {},
  "topic-above-suggested" : {},
  "post-bottom" : {},
  "topic-bottom" : {}
};

if (Discourse.SiteSettings.adsense_publisher_code) {
  if (!mobileView && Discourse.SiteSettings.adsense_topic_list_top_code) {
    data["topic-list-top"]["ad_code"] = Discourse.SiteSettings.adsense_topic_list_top_code;
    data["topic-list-top"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
    data["topic-list-top"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_list_top_code) {
    data["topic-list-top"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_list_top_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_topic_above_post_stream_code) {
    data["topic-above-post-stream"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_post_stream_code;
    data["topic-above-post-stream"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
    data["topic-above-post-stream"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_code) {
    data["topic-above-post-stream"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_topic_above_suggested_code) {
    data["topic-above-suggested"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_suggested_code;
    data["topic-above-suggested"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
    data["topic-above-suggested"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_above_suggested_code) {
    data["topic-above-suggested"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_above_suggested_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_post_bottom_code) {
    data["post-bottom"]["ad_code"] = Discourse.SiteSettings.adsense_post_bottom_code;
    data["post-bottom"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
    data["post-bottom"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_post_bottom_code) {
    data["post-bottom"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_post_bottom_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_topic_bottom_code) {
    data["topic-bottom"]["ad_code"] = Discourse.SiteSettings.adsense_topic_bottom_code;
    data["topic-bottom"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_bottom_ad_sizes));
    data["topic-bottom"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_bottom_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_bottom_code) {
    data["topic-bottom"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_bottom_code;
  }
}

export default Ember.Component.extend({
  classNames: ['google-adsense'],
  loadedGoogletag: false,

  publisher_id: publisher_id,
  ad_width: ad_width,
  ad_height: ad_height,
  ad_mobile_width: ad_mobile_width,
  ad_mobile_height: ad_mobile_height,

  mobile_width: mobile_width,
  mobile_height: mobile_height,

  init() {
    this.set('ad_width', data[this.placement]["ad_width"] );
    this.set('ad_height', data[this.placement]["ad_height"] );
    this.set('ad_code', data[this.placement]["ad_code"] );
    this.set('ad_mobile_code', data[this.placement]["ad_mobile_code"] );
    this._super();
  },

  _triggerAds() {
    loadAdsense().then(function() {
      const adsbygoogle = window.adsbygoogle || [];

      try {
        adsbygoogle.push({}); // ask AdSense to fill one ad unit
      } catch (ex) {}
    });
  },

  didInsertElement() {
    this._super();

    if (!this.get('showAd')) { return; }

    Ember.run.scheduleOnce('afterRender', this, this._triggerAds);
  },

  adWrapperStyle: function() {
    return `width: ${this.get('ad_width')}px; height: ${this.get('ad_height')}px;`.htmlSafe();
  }.property('ad_width', 'ad_height'),

  adInsStyle: function() {
    return `display: inline-block; ${this.get('adWrapperStyle')}`.htmlSafe();
  }.property('adWrapperStyle'),

  adWrapperStyleMobile: function() {
    return `width: ${this.get('ad_mobile_width')}px; height: ${this.get('ad_mobile_height')}px;`.htmlSafe();
  }.property('ad_mobile_width', 'ad_mobile_height'),

  adTitleStyleMobile: function() {
    return `width: ${this.get('ad_mobile_width')}px;`.htmlSafe();
  }.property('ad_mobile_width'),

  adInsStyleMobile: function() {
    return `display: inline-block; ${this.get('adWrapperStyleMobile')}`.htmlSafe();
  }.property('adWrapperStyleMobile'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.adsense_through_trust_level));
  }.property('trust_level'),

  showAd: function() {
    return Discourse.SiteSettings.adsense_publisher_code && this.get('checkTrustLevels');
  }.property('checkTrustLevels')
});
