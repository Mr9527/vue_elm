import {
  getStyle
} from '../../config/mUtils'

export const loadMore = {
  directives: {
    'load-more': {
      bind: (el, binding) => {
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
          height = el;
        }
        el.addEventListener('touchstart', () => {
          height = heightEl.clientHeight;
          if (scrollType == 2) {
            height = height
          }
          setTop = el.offsetTOp;
          paddingBottom = getStyle(el, 'paddingBottom');
          marginBottom = getStyle(el, 'marginBottom');
        }, false);
        el.addEventListener('touchmove', () => {
          loadMore()
        }, false);
        el.addEventListener('touchend', () => {
          moveEnd()
        }, false);
        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if (scrollEl.scrollType != oldScrollTop) {
              oldScrollTop = scrollEl.scrollType;
              moveEnd();
            } else {
              cancelAnimationFrame(requestFram);
              height = heightEl.clientHeight;
              loadMore()
            }
          })
        }
        const loadMore = () => {
          if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
            binding.value();
          }
        }
      },
      inserted: (el) => {

      },
      update: () => {

      },
      unbind: () => {

      },
      componentUpdated: (el, binding, vnode, oldVnode) => {
        //  自定义的钩子函数都会传入以上几个参数
        // el > 指令所绑定的元素,可以用来直接操作 DOM
        // bidning 
        //      - name: 指令名称,不含 -v 前缀
        //      - value : 指令绑定的值,如果是表达式则是运算过后的值
        //      - oldValue : 只在 update 和  componentUpdated 中可用
        //      - expression : 字符串形式的指令表达式   v-xx="a+a" 中的 a+a
        //      - arg:传给指令的参数
        //      - modifiers 包含修饰符的对象
        // vnode  vue 中生成的虚拟节点
        // oldVnode 上个虚拟节点      
      }
    }
  }
}

