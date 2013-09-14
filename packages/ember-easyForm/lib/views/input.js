Ember.EasyForm.Input = Ember.EasyForm.BaseView.extend({
  init: function() {
    this._super();
    this.classNameBindings.push('showError:' + this.getWrapperConfig('fieldErrorClass'));
    this.classNames.push(this.getWrapperConfig('inputClass'));
    Ember.defineProperty(this, 'showError', Ember.computed.and('canShowValidationError', 'context.errors.' + this.property + '.firstObject'));
    if (!this.isBlock) {
      if (this.getWrapperConfig('wrapControls')) {
        this.set('templateName', 'easyForm/wrapped_input');
      } else {
        this.set('templateName', 'easyForm/input');
      }
    }
  },
  setupValidationDependencies: function() {
    var keys = this.get('context._dependentValidationKeys'), key;
    if (keys) {
      for(key in keys) {
        if (keys[key].contains(this.property)) {
          this._keysForValidationDependencies.pushObject(key);
        }
      }
    }
  }.on('init'),
  _keysForValidationDependencies: Ember.A(),
  dependentValidationKeyCanTrigger: false,
  tagName: 'div',
  classNames: ['string'],
  didInsertElement: function() {
    this.set('label-field-'+this.elementId+'.for', this.get('input-field-'+this.elementId+'.elementId'));
  },
  concatenatedProperties: ['inputOptions', 'bindableInputOptions'],
  inputOptions: ['as', 'inputConfig', 'collection', 'optionValuePath', 'optionLabelPath', 'selection', 'value'],
  bindableInputOptions: ['placeholder', 'prompt'],
  controlsWrapperClass: function() {
    return this.getWrapperConfig('controlsWrapperClass');
  }.property(),
  inputOptionsValues: function() {
    var options = {}, i, value, key, keyBinding, inputOptions = this.inputOptions, bindableInputOptions = this.bindableInputOptions;
    for (i = 0; i < inputOptions.length; i++) {
      key = inputOptions[i];
      value = this.get(key);
      if (value) {
        if (typeof(value) === 'boolean') {
          value = key;
        }
        options[key] = value;
      }
    }
    for (i = 0; i < bindableInputOptions.length; i++) {
      key = bindableInputOptions[i];
      keyBinding = key + 'Binding';
      if (this.get(key) || this.get(keyBinding)) {
        options[keyBinding] = 'view.' + key;
      }
    }
    return options;
  }.property(),
  focusOut: function() {
    this.set('hasFocusedOut', true);
    this.showValidationError();
  },
  showValidationError: function() {
    if (this.get('hasFocusedOut')) {
      if (Ember.isEmpty(this.get('context.errors.' + this.property))) {
        this.set('canShowValidationError', false);
      } else {
        this.set('canShowValidationError', true);
      }
    }
  },
  input: function() {
    this._keysForValidationDependencies.forEach(function(key) {
     this.get('parentView.childViews').forEach(function(view) {
       if (view.property === key) {
         view.showValidationError();
       }
     }, this);
    }, this);
  }
});
