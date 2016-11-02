/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.indent_widget) === 'undefined') extensions.indent_widget = {
	version: '1.0'
};

(function() {
	
	var $		 	= require("ko/dom"),
		notify		= require("notify/notify"),
		self		= this;
	
	
	window.removeEventListener('current_view_changed', this.addWidget);
	window.removeEventListener('focus', this.addWidget);
	window.removeEventListener('view_opened', this.checkIndentSettings);
	
	this.addPanel = function(){
		var view 				= $(require("ko/views").current().get()),
		koDoc 					= require('ko/views').current().koDoc, 
		IndentPanel				= $("<statusbarpanel id='indent_widget' />"),
		menu 					= $('<menupopup id="statusbar-indent-menupopup"/>'),
		toggleViewWhiteSpace	= $('<menuitem label="Toggle View Whitespace" oncommand="extensions.indent_widget.toggleViewWhiteSpace();" />'),
		openFilePreferences		= $('<menuitem label="Open File Preferences" oncommand="extensions.indent_widget.openFilePreferences();" />'),
		beautify				= extensions.beautifyjs;
		
		view.findAnonymous("anonid", "statusbar-encoding").after(IndentPanel);
		
		if (beautify !== undefined) {
			var lang = koDoc.language;
			
			switch (lang) {
				case 'HTML':
				case 'HTML5':
					beautifyHMTL	= $('<menuitem label="Reformat HTML using Beautify js" oncommand="extensions.beautifyjs.beautify_HTML();" />');
					menu.append(beautifyHMTL);
					break;
				case 'CSS':
				case 'SCSS':
				case 'Less':
					beautifyCSS	= $('<menuitem label="Reformat CSS using Beautify js" oncommand="extensions.beautifyjs.beautify_CSS();" />');
					menu.append(beautifyCSS);
					break;
				case 'JavaScript':
				case 'Node.js':
					beautifyJS	= $('<menuitem label="Reformat JavaScript using Beautify js" oncommand="extensions.beautifyjs.beautify_JS();" />');
					menu.append(beautifyJS);
					break;
			}
			
		}
		
		menu.append(toggleViewWhiteSpace);
		menu.append(openFilePreferences);
		
		var panel	 = view.find('#indent_widget');
		
		panel.append('<toolbarbutton class="statusbar-label" id="statusbar-indent-label" flex="1" orient="horizontal" type="menu" persist="buttonstyle" buttonstyle="text" label="" />');
		
		var button = $('#indent_widget > #statusbar-indent-label');
		
		button.append(menu);
		
	}
	
	this.addWidget = function(){ 
		var view 	= require('ko/views').current(),
			koDoc 	= view.koDoc, 
			currV	= require("ko/views").current().get(),
			panel	 = $(currV).find('#indent_widget'),
			button 	= $(currV).find('#statusbar-indent-label'),
			label = '';
			
		if (view.length === 0){
			return;
		}
		
		if (panel.length === 0){
			self.addPanel();
			button 	= $(currV).find('#statusbar-indent-label');
		}
		
		var useTabs = koDoc.useTabs,
			tabWidth = koDoc.tabWidth,
			indentWidth = koDoc.indentWidth;
		
		if (useTabs) {
			label = 'Tabs (' + tabWidth + ')';
		} else {
			label = 'Spaces ' + indentWidth;
		}
		
		button.attr('label', label);
	};
	
	this.checkIndentSettings = function() {
		var view 	= require('ko/views').current(),
			koDoc 	= view.koDoc;
			
		if (view.length === 0){
			return;
		}
		
		var useTabs = koDoc.useTabs,
			tabWidth = koDoc.tabWidth,
			indentWidth = koDoc.indentWidth,
			language = koDoc.language,
			globPrefs = ko.prefs,
			prefix = 'languages/' + language,
			globalUseTabs = globPrefs.hasBooleanPref(prefix + '/useTabs') ? globPrefs.getBoolean(prefix + '/useTabs') : globPrefs.getBoolean('useTabs'),
			globalTabWidth = globPrefs.hasLongPref(prefix + '/tabWidth') ? globPrefs.getLong(prefix + '/tabWidth') : globPrefs.getLong('tabWidth'),
			globalIndentWidth = globPrefs.hasLongPref(prefix + '/indentWidth') ? globPrefs.getLong(prefix + '/indentWidth') : globPrefs.getLong('indentWidth');
			
		if (globalUseTabs !== useTabs || globalIndentWidth !== indentWidth || globalTabWidth !== tabWidth) {
			notify.send(
				'File indent settings mismatch global configuration',
				'tools'
			);
		}
	}
	
	this.toggleViewWhiteSpace = function(){
		ko.views.manager.currentView.setFocus();
		ko.commands.doCommand('cmd_viewWhitespace');
	}
	
	this.openFilePreferences = function() {
		ko.views.manager.currentView.setFocus();
		ko.commands.doCommand('cmd_editPrefsCurrent');
	}


	window.addEventListener('current_view_changed', this.addWidget);
	window.addEventListener('focus', this.addWidget);
	window.addEventListener('view_opened', this.checkIndentSettings);

}).apply(extensions.indent_widget);

