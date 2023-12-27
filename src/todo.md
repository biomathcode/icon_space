
- [ ] svg to jsx

### Good UI Elements To have
- [X] Create a table/ Grid view with react-table 
- [X] Add Support for indexing
- [X] Add Support for filtering
- [X] Bottom Bar
- [X] Confirm Dialog
- [X] Buttons 
- [X] Icon Buttons - Delete, 
- [X] Folder feature
- [X] Svg Viewer
- [X] Drag and Drop to add to collection
- [X] Copy to Clipboard 
- [X] Svg code viewer;
- [X] Setup database
- [X] Download as svg, png
- [X] Truncate Text
- [X] Fix Sort  
- [X] Icons drag and drop to folders
- [X] Folder selection state 
- [X] Folder selected will be in persistent state
- [ ] Create Responsive grid : https://travishorn.com/responsive-grid-in-2-minutes-with-css-grid-layout-4842a41420fe



- [ ] Update copy as with svelte, vue, jxs, svg,png,
- [ ] Input Elements
- [ ] We can use react-table pin row option to create a group export option
- [ ] Support for zip download : https://medium.com/@florian.bloechinger/creating-zip-files-in-rust-made-easy-with-the-zip-library-cff572906678

### Info Element
- [ ] Shortcut Buttons
- [ ] Callout
- [ ] CloseAble Info
- [ ] Add Notification System
- [ ] Create a Size slider
- [ ] useMediaQuery to update the Grid Column

- [ ] Add Svg version history 
- [ ] Implement folder drag and drop

- [ ] Add React flow 
- [ ] Building an svg animate state
- [ ] Build timeline for the svg animate
- [ ] Svg Canvas Editor



### Resources: 

https://www.toools.design/free-open-source-icon-libraries

https://hackernoon.com/how-i-cloned-a-simple-vscode-using-tauri-and-reactjs

use 

svg-fill
get-svg-colors
https://github.com/svg/svgo

Lucide.dev
svg2jsx

https://github.com/damianstasik/svg-to-vue

https://github.com/marc2332/tauri-terminal

https://microsoft.github.io/monaco-editor/typedoc/index.html

https://github.com/salimbeni1/svg-animator

https://github.com/daybrush/scenejs-timeline/tree/master/packages/react-scenejs-timeline


https://github.com/LitoMore/simple-icons-figma

https://github.com/canva-sdks/canva-apps-sdk-starter-kit

https://github.com/gregberge/svgr

@iconify/tools

## SVG animation with States - like click , hover, press

example: https://codepen.io/mikemjharris/post/svg-toggling


```html
<animateTransform attributeType="xml"
    attributeName="transform"
    type="rotate"
    from="360 24.69 35.778"
    to="0 24.69 35.778"
    dur="2s"
    begin="team.mouseover" 
    end="team.mouseout"
    repeatCount="indefinite"
/>
```

- it's better to use css to animate as SMIL is deprecated 

https://css-tricks.com/smil-is-dead-long-live-smil-a-guide-to-alternatives-to-smil-features/



## Resources on Animated Icons Library

https://useanimations.com/#explore

https://motionarray.com/

https://getloaf.io/


## Some Ideas

- Color picker in editor, iterate over strings, if string is Color format, add a span box which would have a background of the  color, Onclick span should open a color picker, on changing the color, string should update
- Update number picker
- Deg picker for rotation


## Design Color Palette




-- Tags Colors --
Light Gray | TC: #373530 | BG: -
Gray | TC: #787774 | BG: #F1F1EF
Brown | TC: #976D57 | BG: #F3EEEE
Orange | TC: #CC772F | BG: #F8ECDF
Yellow | TC: #C29243 | BG: #FAF3DD
Green | TC: #548064 | BG: #EEF3ED
Blue | TC: #477DA5 | BG: #E9F3F7
Purple | TC: #A48BBE | BG: #F6F3F8
Pink | TC: #B35588 | BG: #F9F2F5
Red | TC: #C4554D | BG: #FAECEC