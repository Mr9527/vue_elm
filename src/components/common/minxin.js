import {
  getStyle
} from '../../config/mUtils'

export const loadMore = {
  directives: {
    'load-more': {
      inserted: (el, binding) => {
        let windowHeight = window.screen.height;
        let height;
        let setTop;
        let paddingBottom;
        let marginBottom;
        let requestFram;
        let oldScrollTop;
        let scrollEl;
        let heightEl;
        let scrollType = el.attributes.type && el.attributes.type.value;
        let scrollReduce = 2;
        if (scrollType == 2) {
          scrollEl = el;
          heightEl = el.children[0];
        } else {
          scrollEl = document.body;
          heightEl = el;
        }

        el.addEventListener('touchstart', () => {

        }, false)

        el.addEventListener('touchmove', () => {
          loadMore();
        }, false)

        el.addEventListener('touchend', () => {
          oldScrollTop = scrollEl.scrollTop;
          moveEnd();
        }, false)
        el.addEventListener('scroll', () => {
          loadMore();
        })
        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if (scrollEl.scrollTop != oldScrollTop) {
              oldScrollTop = scrollEl.scrollTop;
              moveEnd()
            } else {
              cancelAnimationFrame(requestFram);
              height = heightEl.clientHeight;
              loadMore();
            }
          })
        }

        const loadMore = () => {
          if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
            binding.value();
          }
        }
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
