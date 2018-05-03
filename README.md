
# react-3d-router
React + Three.js + React Router for creating interactive websites.

This package will use Three.js to render a 3d object as a background. You can specify camera position for each section of your page and it will animate the transition.

[DEMO](https://joja.agency)

## Basic usage

Use it as a component:
```
<React3dRouter
  object3d={object3d}
  components={components}
/>
```


You need to specify all your components (pages or slides, whatever will be rendered on top) in the following format:
```
const Components = {
  Home: {
    component: Home, //the component to render
    coords: {
      cam: {x: 100,y: 60, z: 7}, //camera position
    },
    time: 900, //animation transition time
    path: "/", //uri
    children: ["Home1", "Home2", "Home3"] //multiple components form a slideshow
  }
  ```



### 3d object
Convert your own 3d object (.obj format) to suitable .json format via command line:

```
node node_modules/react-3d-router/src/utils/obj2three.js model.obj
```