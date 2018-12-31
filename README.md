# SPLoader.js
A JQuery plug-in for creating UI components in SharePoint 2013+ pages without using any server-side or JavaScript code.

## How to use?
1- Upload SPLoader.js to your site and add references for JQuery and SPLoader.js
```
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="/Style Library/JS/spLoader.js"></script>
```

2- Create your HTML Component
```
<div sp-element="" sp-web-url="/" sp-list-title="Pages" sp-item-count="5" sp-order-field="ArticleStartDate" sp-order="desc">
  <div sp-repeat>
    <a sp-bind="FileRef,href">
      <img sp-bind="PublishingRollupImage,src;Title,title">
      <p sp-bind="Title,html"></p>
      <p sp-bind="ArticleStartDate,html"></p>
    </a>
  </div>
</div>
```

3- Add the html to your page; maybe through Content Editor Webpart!

Thats is! good luck..

## spLoader.js html properties:
```
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
```
## How it works?
spLoader.js finds all elements with the attribute ```sp-element``` and extracts all the information needed to retrieve the data, then, it uses JSOM (JavaScript Object Model) to query for the data, after that, it maps all fields from the results to the corresponding elements in the repeat template (the element with attribute ```sp-repeat```).
