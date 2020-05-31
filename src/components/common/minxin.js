import {
  getStyle
} from '../../config/mUtils'

export const loadMore = {
  directives: {
    'load-more': {
      inserted: (el, binding) => {
        el.addEventListener('click', () => {
          alert("scroll");
        })
      }
    }
  },
  // data() {
  //   return {
  //     height: 0,
  //     setTop: 0,
  //   }
  // },
  // methods: {
  //   touchstart() {
  //     height = heightEl.clientHeight;
  //     setTop = el.offsetTop;
  //     paddingBottom = getStyle(el, 'paddingBottom');
  //     marginBottom = getStyle(el, 'marginBottom');
  //   },
  //   touchmove() {

  //   },
  //   touchend() {

  //   },
  //   scroll() {

  //   },
  //   loadMore() {

  //   }
  // },
};
