/*
sp-element = no value needed, used on the root element of the component to be processed
sp-list-title = "list title"
sp-web-url = "/web"
sp-filter-field = "Boolean field internal name"
sp-item-count = "10"
sp-onload = callback to call after the component is loaded
sp-repeat = no value needed, used on the element that should be repeated for each item in the results
sp-bind = "a binding is a pair of field,attribute. you can chain bindings like this 'FieldName1,attr1;FieldName2,attr2;FieldName3,attr3'" eg: <img sp-bind="FileRef,src;Name,title" />. you can use attribute: html to map to inner html
sp-order = "desc" | "asc"
sp-order-field = "Field Internal Name"
*/

(function () {		
	window.spLoader = {
		components: [],
		loadingComponents: 0,
		componentsLoaded: 0,
		componentsFailed: 0,
		setBodyAsLoaded: function () {
			console.log(spLoader.componentsLoaded
				+ '/'
				+ (spLoader.componentsLoaded + spLoader.componentsFailed)
				+ ' Components loaded, '
				+ spLoader.componentsFailed
				+ '/'
				+ (spLoader.componentsLoaded + spLoader.componentsFailed)
				+ ' components failed');
		},
		addLoadingComponent: function () {
			spLoader.loadingComponents++;
		},
		componentLoaded: function () {
			spLoader.loadingComponents--;
			spLoader.componentsLoaded++;
			if (spLoader.loadingComponents === 0) {
				spLoader.setBodyAsLoaded();
			}
		},
		componentFailed: function () {
			spLoader.loadingComponents--;
			spLoader.componentsFailed++;
			if (spLoader.loadingComponents === 0) {
				spLoader.setBodyAsLoaded();
			}
		},
		DataService: {
			getAllItems: function (webUrl, listTitle, fieldInternalNamesCSV, filterBooleanFieldInternalName, rowLimit, orderFieldInternalName, order, successCallback, failCallback) {
				//Get context
				var _context;
				if (webUrl) {
					_context = new SP.ClientContext(webUrl);
				}
				else {
					_context = new SP.ClientContext.get_current();
				}

				//Select List
				var list = _context.get_web().get_lists().getByTitle(listTitle);

				//Build Query
				var queryFilter = filterBooleanFieldInternalName ? "<Where><Eq><FieldRef Name='" + filterBooleanFieldInternalName + "'/><Value Type='Boolean'>1</Value></Eq></Where>" : "";
				var orderByFilter = "<OrderBy><FieldRef Name='" + orderFieldInternalName + "' Ascending='" + (order === "desc" ? "FALSE" : "TRUE") + "' /></OrderBy >";
				var rowLimitFilter = "<RowLimit>" + rowLimit + "</RowLimit>";
				var caml = "<View><Query>" + queryFilter + orderByFilter + "</Query>" + rowLimitFilter + "</View>";
				var query = new SP.CamlQuery();
				query.set_viewXml(caml);

				//Batch request
				var listItems = list.getItems(query);
				var results = _context.loadQuery(listItems, 'Include(' + fieldInternalNamesCSV + ')');

				//Execute above batch
				_context.executeQueryAsync(
					function () {
						successCallback(results);
					},
					function (sender, args) {
						failCallback(sender, args);
					});
				return caml;
			}
		},
		initSPLoader: function(callback){
			String.prototype.replaceAll = function (search, replacement) {
				var target = this;
				search = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				return target.replace(new RegExp(search, 'g'), replacement);
			}
			String.prototype.toStringValue = function () {
				if (this.indexOf("<img") === 0) {
					return $(this.toString()).attr("src");
				}
				return this;
			}
			//Change date format here
			Date.prototype.toStringValue = function () {
				var dd = this.getDate();
				var yyyy = this.getFullYear();
				
				//var locale = "en-us"
				//var longMonth = this.toLocaleString(locale, { month: "long" });
				//return dd + ' ' + longMonth + ' ' + yyyy
				
				//var locale = "en-us"
				//var shortMonth = this.toLocaleString(locale, { month: "short" });
				//return dd + ' ' + shortMonth + ' ' + yyyy

				var mm = this.getMonth() + 1;
				return dd + '/' + mm + '/' + yyyy
			}
			SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
				SP.FieldUrlValue.prototype.toStringValue = function () {
					return this.get_url();
				};
				callback();
			})
		},
		load: function (elem) {
			try {
				spLoader.addLoadingComponent();

				var info = {};
				spLoader.components[spLoader.components.length] = info;

				info.element = elem;
				info.repeatElement = $(elem).find("[sp-repeat]")[0];
				info.webUrl = $(elem).attr('sp-web-url');
				info.listTitle = $(elem).attr('sp-list-title');
				info.filterFieldInternalName = $(elem).attr('sp-filter-field');
				info.rowLimit = $(elem).attr('sp-item-count');
				info.order = $(elem).attr('sp-order');
				info.orderField = $(elem).attr('sp-order-field');

				info.fieldInternalNamesCSV = '';
				info.includedFields = [];
				info.includedFieldsElements = [];

				if (info.orderField === undefined) {
					info.orderField = "ID";
				}

				$(info.repeatElement).find("[sp-bind]").each(function () {
					var bindings = $(this).attr("sp-bind").split(';');
					for(i = 0; i < bindings.length; i++){
						var fieldName = bindings[i].split(',')[0];
						
						if(info.includedFields.indexOf(fieldName) === -1)
							info.includedFields[info.includedFields.length] = fieldName;
						
						if(i === 0 && info.includedFieldsElements.indexOf(this) === -1)
							info.includedFieldsElements[info.includedFieldsElements.length] = this;
					}
				});

				info.fieldInternalNamesCSV = info.includedFields.join(", ");

				info.query = spLoader.DataService.getAllItems(info.webUrl, info.listTitle, info.fieldInternalNamesCSV, info.filterFieldInternalName, info.rowLimit, info.orderField, info.order, function (results) {
					info.results = results;
					if (results && results.length > 0) {

						var repeatElementTemplate = info.repeatElement.outerHTML

						for (i = 0; i < results.length; i++) {

							var newRepeatElement = $(repeatElementTemplate);
							
							//Fill Attributes
							for (j = 0; j < info.includedFieldsElements.length; j++) {
								var spBindValue = $(info.includedFieldsElements[j]).attr("sp-bind");
								var bindings = spBindValue.split(';');
								for(k = 0; k < bindings.length; k++){
									var attrFieldName = bindings[k].split(',')[0];
									var attributeName = bindings[k].split(',')[1];
									var value = results[i].get_item(attrFieldName);
									var currentElement = $(newRepeatElement).find('[sp-bind="' + spBindValue + '"]');
									if (value) {
										if(attributeName === 'html'){
											currentElement.html(value.toStringValue());
										}
										else{
											var currentValue = currentElement.attr(attributeName);
											if(currentValue && attributeName === 'class'){
												currentElement.attr(attributeName, value.toStringValue() + " " + currentValue);
											}
											else{
												currentElement.attr(attributeName, value.toStringValue());
											}
										}
									}
								}
							}
							$(newRepeatElement).insertBefore(info.repeatElement);
						}
						
						//Run Events
						try {
							var callback = $(info.element).attr("sp-onload");

							var onload = eval(callback)
							if (typeof onload == 'function') {
								onload(info);
							}
						} catch (e) {
							console.log("unable to run sp-onload event for components[" + (spLoader.components.length - 1) + "]");
						}
					}
					$(info.repeatElement).remove();
					$(info.element)
						.removeAttr("sp-element")
						.removeAttr("sp-list-title")
						.removeAttr("sp-web-url")
						.removeAttr("sp-filter-field")
						.removeAttr("sp-item-count")
						.removeAttr("sp-onload")
						.removeAttr("sp-order-field")
						.removeAttr("sp-order")
						.attr("sp-loaded", "");
					$(info.element).find("*")
						.removeAttr("sp-repeat")
						.removeAttr("sp-bind")

					spLoader.componentLoaded();

				}, function (sender, args) {
					info.error =
						{
							sender: sender,
							args: args
						};

					spLoader.componentFailed();
					console.log(info.error.args.get_message());
				})
			} catch (e) {
				spLoader.componentFailed();
				console.log("components: " + e.message);
			}
		},
		initAll: function(){
			$("[sp-element]").each(function(){
				spLoader.load(this);
			});
		}
	};
	
	$(document).ready(function(){
		spLoader.initSPLoader(spLoader.initAll);
	});
})();
