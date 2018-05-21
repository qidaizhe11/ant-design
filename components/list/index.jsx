import PropTypes from '../_util/vue-types'
import BaseMixin from '../_util/BaseMixin'
import {
  filterEmpty,
  initDefaultProps,
  getComponentFromProp,
} from '../_util/props-util'

import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'

import Pagination from '../pagination'

export const ColumnCount = PropTypes.oneOf([1, 2, 3, 4, 6, 8, 12, 24])

export const ColumnType = PropTypes.oneOf([
  'gutter',
  'column',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
])

export const ListGridType = {
  gutter: PropTypes.number,
  column: ColumnCount,
  xs: ColumnCount,
  sm: ColumnCount,
  md: ColumnCount,
  lg: ColumnCount,
  xl: ColumnCount,
  xxl: ColumnCount,
}

export const ListProps = {
  prefixCls: PropTypes.string,
  bordered: PropTypes.string,
  dataSource: PropTypes.any,
  grid: PropTypes.any,
  itemLayout: PropTypes.string,
  loading: PropTypes.bool,
  loadMore: PropTypes.string,
  pagination: PropTypes.any,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  split: PropTypes.bool,
  header: PropTypes.string,
  footer: PropTypes.string,
  locale: PropTypes.object,
}

export default {
  name: 'AList',
  provide () {
    return {
      grid: this.grid,
    }
  },
  mixins: [BaseMixin],
  props: initDefaultProps(ListProps, {
    dataSource: [],
    prefixCls: 'ant-list',
    bordered: false,
    split: true,
    loading: false,
    pagination: false,
  }),

  data () {
    return {
      paginationCurrent: 1,
    }
  },

  comupted: {
    defaultPaginationProps () {
      return {
        current: 1,
        pageSize: 10,
        onChange: (page, pageSize) => {
          const { pagination } = this.$props
          this.setState({
            paginationCurrent: page,
          })
          if (pagination && pagination.onChange) {
            pagination.onChange(page, pageSize)
          }
        },
        total: 0,
      }
    },
  },

  methods: {
    isSomethingAfterLastItem () {
      const { loadMore, pagination, footer } = this.$props
      return !!(loadMore || pagination || footer)
    },

    renderEmpty (contextLocale) {
      const locale = {
        ...contextLocale,
        ...this.locale,
      }

      return (
        <div class={`${this.prefixCls}-empty-text`}>{locale.emptyText}</div>
      )
    },
  },

  render () {
    const { paginationCurrent, $slots } = this
    const {
      bordered,
      split,
      itemLayout,
      loadMore,
      pagination,
      prefixCls,
      grid,
      dataSource,
      size,
      header,
      footer,
      loading,
      locale,
      ...rest
    } = this.$props
    const children = filterEmpty($slots.default)

    let loadingProp = loading
    if (typeof loadingProp === 'boolean') {
      loadingProp = {
        spinning: loadingProp,
      }
    }
    const isLoading = loadingProp && loadingProp.spinning

    // large => lg
    // small => sm
    let sizeCls = ''
    switch (size) {
      case 'large':
        sizeCls = 'lg'
        break
      case 'small':
        sizeCls = 'sm'
        break
      default:
        break
    }

    const classString = {
      [prefixCls]: true,
      [`${prefixCls}-vertical`]: itemLayout === 'vertical',
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-split`]: split,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-loading`]: isLoading,
      [`${prefixCls}-grid`]: grid,
      [`${prefixCls}-something-after-last-item`]: this.isSomethingAfterLastItem(),
    }

    const paginationProps = {
      ...this.defaultPaginationProps,
      total: dataSource.length,
      current: paginationCurrent,
      ...pagination,
    }
    const largestPage = Math.ceil(
      paginationProps.total / paginationProps.pageSize
    )
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage
    }

    const paginationContent = pagination ? (
      <div className={`${prefixCls}-pagination`}>
        <Pagination
          {...paginationProps}
          onChange={this.defaultPaginationProps.onChange}
        />
      </div>
    ) : null

    let splitDataSource = [...dataSource]
    if (pagination) {
      if (
        dataSource.length >
        (paginationProps.current - 1) * paginationProps.pageSize
      ) {
        splitDataSource = [...dataSource].splice(
          (paginationProps.current - 1) * paginationProps.pageSize,
          paginationProps.pageSize
        )
      }
    }

    let childrenContent
    childrenContent = isLoading && <div style={{ minHeight: 53 }} />
    if (splitDataSource.length > 0) {
    } else if (!children && !isLoading) {
      childrenContent = (
        <LocaleReceiver
          componentName='Table'
          defaultLocale={defaultLocale.Table}
        >
          {this.renderEmpty}
        </LocaleReceiver>
      )
    }

    const headerDom = header || getComponentFromProp(this, 'header')
    const footerDom = footer || getComponentFromProp(this, 'footer')
    const loadMoreDom = loadMore || getComponentFromProp(this, 'loadMore')

    return (
      <div class={classString} {...rest}>
        {headerDom && <div class={`${prefixCls}-header`}>{headerDom}</div>}
        {children}
        {footerDom && <div className={`${prefixCls}-footer`}>{footerDom}</div>}
        {loadMoreDom}
      </div>
    )
  },
}
