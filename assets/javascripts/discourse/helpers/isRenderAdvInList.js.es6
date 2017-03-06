export default Ember.Helper.extend({
    compute(params) {
        let index = params[0] + 1;
        let adsense_nth_post_code = parseInt(params[1]);
        if (adsense_nth_post_code && adsense_nth_post_code > 0) {
            return (index % adsense_nth_post_code) === 0;
        } else {
            return false;
        }
    }
});
