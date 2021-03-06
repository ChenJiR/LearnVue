import Vue from 'vue'
import Router from 'vue-router'
import Frame from '@/components/Frame/Frame'
import { getIFramePath, getIFrameUrl } from '@/utils/iframe'
import store from '@/store'
import MenuData from '@/menu/MenuData'
import MenuRouter from '@/menu/MenuRouter'

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: '首页',
    component: Frame,
    children: MenuRouter
  }
];

store.commit('setNavTree',MenuData);

addIFrameUrl(MenuData);

const router = new Router({routes});

router.beforeEach((to, from, next) => {
  handleIFrameUrl(to.path);
  next();
});

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path;
  let length = store.state.iframe.iframeUrls.length;
  for(let i=0; i<length; i++) {
    let iframe = store.state.iframe.iframeUrls[i];
    if(path != null && path.endsWith(iframe.path)) {
      url = iframe.url;
      store.commit('setIFrameUrl', url);
      break
    }
  }
}

function addIFrameUrl(menuList){
  let temp = [];
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    }
    else if (menuList[i].url && menuList[i].iframe_url && /\S/.test(menuList[i].url)){
      store.commit('addIFrameUrl', {'path': menuList[i].url, 'url': menuList[i].iframe_url})
    }
    if (temp.length >= 1) {
      addIFrameUrl(temp)
    }
  }
}

export default router

