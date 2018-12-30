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
    <a sp-field="FileRef,href">
      <img sp-field="PublishingRollupImage,src">
      <p sp-field="Title,html"></p>
      <p sp-field="ArticleStartDate,html"></p>
    </a>
  </div>
</div>
```

3- Add the html to your page; maybe through Content Editor Webpart!

Thats is! good luck..

## spLoader.js html properties:
```
sp-element = no value needed > used on the root element of the component to be loaded on page load
sp-list-title = "list or library title"
sp-web-url = "server relative web url"
sp-filter-field = "Boolean field internal name" > used if you want to filter items by a yes/no field like: IsActive
sp-item-count = "10" > query limit
sp-onload = callback to call after the component is loaded
sp-repeat = no value needed > used on the element that should be repeated for each item in the results
sp-field = "field internal and attribute name to map the value" eg: <span sp-field="FileRef,src"></span> OR <span sp-field="FileRef,html"></span> to map to inner html
sp-order = "desc" | "asc"
sp-order-field = "Field Internal Name"
```
## How it works?
spLoader.js finds all elements with the attribute ```sp-element``` and extracts all the information needed to retrieve the data, then, it uses JSOM (JavaScript Object Model) to query for the data, after that, it maps all fields from the results to the corresponding elements in the repeat template (the element with attribute ```sp-repeat```).
