import PropTypes from '../_util/vue-types'
import { getComponentFromProp } from '../_util/props-util'

export default {
  name: 'AListItemMeta',
  props: {
    prefixCls: PropTypes.string.def('ant-list'),
    title: PropTypes.string,
    description: PropTypes.string,
  },
  render () {
    const { prefixCls, title, description, ...others } = this.$props

    const classString = {
      [`${prefixCls}-item-meta`]: true,
    }

    const titleDom = title || getComponentFromProp(this, 'title')
    const descriptionDom =
      description || getComponentFromProp(this, 'description')
    const avatar = getComponentFromProp(this, 'avatar')

    const content = (
      <div class={`${prefixCls}-item-meta-content`}>
        {titleDom && <h4 class={`${prefixCls}-item-meta-title`}>{titleDom}</h4>}
        {descriptionDom && (
          <div class={`${prefixCls}-item-meta-description`}>
            {descriptionDom}
          </div>
        )}
      </div>
    )

    return (
      <div {...others} className={classString}>
        {avatar && <div class={`${prefixCls}-item-meta-avatar`}>{avatar}</div>}
        {(titleDom || descriptionDom) && content}
      </div>
    )
  },
}
