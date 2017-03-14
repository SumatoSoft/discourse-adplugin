export default Ember.Helper.extend({
    compute(params) {
        let index = params[0] + 1;
        let nth_topic_code = parseInt(params[1]);
        if (nth_topic_code && nth_topic_code > 0) {
            return (index % nth_topic_code) === 0;
        } else {
            return false;
        }
    }
});
