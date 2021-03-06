define(['Backbone.Form','underscore'], function(Form, _){
"use strict";
    var editors = Form.editors;
    var Text = editors.Text;
    var reFilter = /^\/|\/$/g;
    var FilterText = editors.FilterText = Text.extend({
        events:_.extend({},Text.prototype.events, {'keypress':'onKeyPress'}),
        onKeyPress:function(){
            var self = this,
                    delayedDetermineChange = function() {
                      setTimeout(function() {
                        self.determineChange();
                      }, 0);
                    };

                //Allow backspace
                if (event.charCode === 0) {
                  delayedDetermineChange();
                  return;
                }

                //Get the whole new value so that we can prevent things like double decimals points etc.
                var newVal = this.$el.val() + String.fromCharCode(event.charCode);

                var numeric = this.filter.test(newVal);

                if (numeric) {
                  delayedDetermineChange();
                }
                else {
                  event.preventDefault();
                }
        },
        initialize:function(options){
           Text.prototype.initialize.call(this, options);
           if (!(options.schema && options.schema.filter)){
               throw "Required attribute 'filter' is missing";
           }
           if (_.isString(options.schema.filter)){
               var f = options.schema.filter.replace(reFilter, '')
               if (f == '*') f = '.*'
               this.filter = new RegExp(f);
           }else{
               this.filter = options.schema.filter;
           }


        }
    });
    return FilterText;

})