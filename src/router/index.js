import Vue from 'vue'
import Router from 'vue-router'

import ObjectGroup from '@/components/ObjectGroup'
import OfferGroup from '@/components/OfferGroup'
import RunOffer from '@/components/RunOffer'
import Evaluate from '@/components/Evaluate'
import Login from '@/components/Login'
import ManageAccount from '@/components/ManageAccount'
import ManageUser from '@/components/ManageUser'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'ObjectGroup',
      component: ObjectGroup,
      props: true,
    },
    {
      path: '/ObjectGroup',
      name: 'ObjectGroup',
      component: ObjectGroup,
      props: true,
    },
    {
      path: '/OfferGroup',
      name: 'OfferGroup',
      component: OfferGroup,
      props: true,
    },
    {
      path: '/RunOffer',
      name: 'RunOffer',
      component: RunOffer
    },
    {
      path: '/Evaluate',
      name: 'Evaluate',
      component: Evaluate,
    },
    {
      path: '/ManageAccount',
      name: 'ManageAccount',
      component: ManageAccount
    },
    {
      path: '/ManageUser',
      name: 'ManageUser',
      component: ManageUser
    }
  ]
})
