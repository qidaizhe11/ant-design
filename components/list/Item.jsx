import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import {
  filterEmpty,
  initDefaultProps,
  getComponentFromProp,
} from '../_util/props-util'

import { Col } from '../grid'
import { ListGridType, ColumnType } from './index'
import Meta from './Meta'

export const ListItemProps = {
  prefixCls: PropTypes.string,
  extra: PropTypes.string,
  actions: PropTypes.array,
  grid: ListGridType,
}

function getGrid (grid, t) {
  return grid[t] && Math.floor(24 / grid[t])
}

const GridColumns = ['', 1, 2, 3, 4, 6, 8, 12, 24]

export default {
  name: 'AListItem',
  props: initDefaultProps(ListItemProps, {
    prefixCls: 'ant-list',
  }),
  Meta: Meta,
  inject: {
    grid: { default: {}},
  },

  render () {
    const { grid } = this
    const { prefixCls, actions, extra, ...others } = this.$props
    const classString = {
      [`${prefixCls}-item`]: true,
    }

    const metaContent = []
    const otherContent = []
  },
}
